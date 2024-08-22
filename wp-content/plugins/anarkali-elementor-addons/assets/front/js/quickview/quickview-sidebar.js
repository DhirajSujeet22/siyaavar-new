jQuery(document).ready( function($) {
    
    $('<div class="anarkali-quickview-sidebar anarkali-scrollbar spinner"></div>').appendTo('body');
    
    $(document.body).on('click touch', '.anarkali-quickview-btn', function(event) {
        event.preventDefault();
        
        var $this   = $(this),
            id      = $this.data('id'),
            quickId = $('.anarkali-quickview-sidebar').attr('data-id');
            data    = {
                cache      : false,
                action     : 'anarkali_quickview',
                product_id : id,
                beforeSend : function() {
                    $('html,body').addClass('quick-open anarkali-overlay-open');
                    if ( $('.anarkali-quickview-sidebar').hasClass('loaded') ) {
                        $('.anarkali-quickview-sidebar').attr('data-id',id).removeClass('spinner').addClass('active loading');
                    } else {
                        $('.anarkali-quickview-sidebar').attr('data-id',id).addClass('active loading');
                    }
                }
            };
        
        if ( quickId == id ) {
            
            $('html,body').addClass('quick-open anarkali-overlay-open');
            $('.anarkali-quickview-sidebar').addClass('active');
            
        } else {

            $.post(anarkali_vars.ajax_url, data, function(response) {
                
                $('.anarkali-quickview-sidebar').html(response).removeClass('loading image-loading').addClass('loaded');
                
                var variations_form = $('.anarkali-quickview-sidebar').find('form.variations_form');
                var termsWrapper    = $('.anarkali-quickview-sidebar').find('.anarkali-selected-variations-terms-wrapper');
                
                variations_form.wc_variation_form();
                
                $(variations_form).on('show_variation', function( event, data ){
                    $('.anarkali-quickview-sidebar').find('.anarkali-btn-reset-wrapper,.single_variation_wrap').addClass('active');
                });
                
                $(variations_form).on('hide_variation', function(){
                    $('.anarkali-quickview-sidebar').find('.anarkali-btn-reset-wrapper,.single_variation_wrap').removeClass('active');
                    $('.anarkali-quickview-sidebar .anarkali-selected-variations-terms').html('');
                });
    
                if ( $('.anarkali-quickview-sidebar .grouped_form').length>0 || $(variations_form).length>0 ) {
                    $(document.body).trigger('anarkali_on_qtybtn');
                }
                
                if ( $('.anarkali-quickview-sidebar .anarkali-selected-variations-terms-wrapper').length > 0 ) {
                    $(variations_form).on('change', function() {
                        var $this = $(this);
                        var selectedterms = '';
                        $this.find('.anarkali-variations-items select').each(function(){
                            var title = $(this).parents('.anarkali-variations-items').find('.anarkali-small-title').text();
                            var val   = $(this).val();
                            if (val) {
                                selectedterms += '<span class="selected-features"><span class="selected-label">'+title+': </span><span class="selected-value">'+val+'</span></span>';
                            }
                        });
                        if (selectedterms){
                            termsWrapper.slideDown().find('.anarkali-selected-variations-terms').html(selectedterms);
                        }
                    });
                }
                
                $('.anarkali-variations .anarkali-small-title').sameSize(true);
                
                $('.anarkali-quickview-sidebar form.cart').submit(function(e) {
                    
                    if ( $(e.originalEvent.submitter).hasClass('anarkali-btn-buynow') ) {
                        return;
                    }
                    
                    e.preventDefault();
                    
                    var form = $(this),
                        btn  = form.find('.anarkali-btn.single_add_to_cart_button'),
                        data = new FormData(form[0]),
                        val  = form.find('[name=add-to-cart]').val();
                        
                    data.append('add-to-cart',val);
                    
                    btn.addClass('loading');
                    
                    $.ajax({
                        url         : anarkali_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_ajax_add_to_cart' ),
                        data        : data,
                        type        : 'POST',
                        processData : false,
                        contentType : false,
                        dataType    : 'json',
                        success     : function( response ) {
                            
                            btn.removeClass('loading');
                            
                            if ( ! response ) {
                                return;
                            }
                            
                            var fragments = response.fragments;
                            
                            var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';
                            
                            $(appended).appendTo('.anarkali-shop-popup-notices').delay(5000).fadeOut(300, function(){
                                $(this).remove();
                            });
                            
                            // update other areas
                            $('.minicart-panel').replaceWith(fragments.minicart);
                            $('.anarkali-cart-count').html(fragments.count);
                            $('.anarkali-cart-total').html(fragments.total);
                            
                            if ( $('.anarkali-cart-goal-text').length>0 ) {
                                $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                                $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                                if ( fragments.shipping.value >= 100 ) {
                                    $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                                } else {
                                    $('.anarkali-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                                }
                            }
                            
                            $('.anarkali-quickview-sidebar .close-error').on('click touch', function(e) {
                                $(this).parent().remove();
                            });
                            
                            $('.anarkali-quickview-sidebar .anarkali-btn-reset,.anarkali-quickview-sidebar .plus,.anarkali-quickview-sidebar .minus').on('click touch', function(event) {
                                $('.anarkali-quickview-notices').slideUp();
                            });
                            
                            if ( response.error && response.product_url ) {
                                window.location = response.product_url;
                                return;
                            }
                        }
                    });
                });
                
                $('body').on('click', '.anarkali-btn-buynow', function() {
                    if ( $(this).parents('form.cart').length ) {
                        return;
                    }
                    //$('form.cart').find('.anarkali-btn-buynow').trigger('click');
                });
                
                if ( $('.quick-main img').length > 1) {
                    
                    $('.quick-main .swiper-slide img').each( function(){
                        var src = $(this).attr('src');
                        $('<div class="swiper-slide"><img src="'+src+'"/></div>').appendTo('.quick-thumbs .swiper-wrapper');
                    });
                    
                    var galleryThumbs = new NTSwiper('.quick-thumbs', {
                        loop                  : false,
                        speed                 : 1000,
                        spaceBetween          : 10,
                        slidesPerView         : 5,
                        autoHeight            : false,
                        watchSlidesVisibility : true,
                        grabCursor            : true,
                        navigation            : {
                            nextEl: '.quick-main .swiper-button-next',
                            prevEl: '.quick-main .swiper-button-prev'
                        }
                    });
                    
                    var galleryTop = new NTSwiper('.quick-main', {
                        loop         : false,
                        speed        : 1000,
                        slidesPerView: 1,
                        spaceBetween : 0,
                        observer     : true,
                        rewind       : true,
                        grabCursor   : true,
                        autoHeight   : true,
                        navigation   : {
                            nextEl: '.quick-main .swiper-button-next',
                            prevEl: '.quick-main .swiper-button-prev'
                        },
                        thumbs       : {
                            swiper: galleryThumbs
                        }
                    });
                }
                
            });
        }
    });
});