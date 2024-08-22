jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    // quick shop start
    anarkaliQuickShopPopup();

    $(document).on('anarkaliShopInit', function() {
        anarkaliQuickShopPopup();
    });

    $(document.body).on('trigger_quick_shop', function(e,btn) {
        $(btn).trigger('click');
    });

    function anarkaliQuickShopPopup(){

       $( document.body ).on('click', '.anarkali-quick-shop-btn', function(event) {
            event.preventDefault();

            var $this = $(this),
                id    = $this.data('product_id');

            $.magnificPopup.open({
                items           : {
                    src : anarkali_vars.ajax_url + '?product_id=' + id
                },
                mainClass       : 'mfp-anarkali-quickshop anarkali-mfp-slide-bottom',
                removalDelay    : 160,
                overflowY       : 'scroll',
                fixedContentPos : false,
                closeBtnInside  : true,
                tClose          : '',
                closeMarkup     : '<div class="mfp-close anarkali-panel-close-button"></div>',
                tLoading        : '<span class="loading-wrapper"><span class="ajax-loading"></span></span>',
                type            : 'ajax',
                ajax            : {
                    settings : {
                        type : 'GET',
                        data : {
                            action : 'anarkali_ajax_quick_shop'
                        }
                    }
                },
                callbacks       : {
                    beforeOpen  : function() {},
                    open        : function() {
                        $('.mfp-preloader').addClass('loading');
                    },
                    ajaxContentAdded: function() {
                        $('.mfp-preloader').removeClass('loading');

                        var variations_form = $('.anarkali-quickshop-form-wrapper').find('form.cart');
                        var termsWrapper    = $('.anarkali-quickshop-form-wrapper').find('.anarkali-selected-variations-terms-wrapper');

                        variations_form.wc_variation_form();

                        $(variations_form).on('show_variation', function( event, data ){
                            $('.anarkali-quickshop-form-wrapper').find('.anarkali-btn-reset-wrapper,.single_variation_wrap').addClass('active');
                        });

                        $(variations_form).on('hide_variation', function(){
                            $('.anarkali-quickshop-form-wrapper').find('.anarkali-btn-reset-wrapper,.single_variation_wrap').removeClass('active');
                        });

                        if ( $('.grouped_form').length>0 || $(variations_form).length>0 ) {
                            $(document.body).trigger('anarkali_on_qtybtn');
                        }

                        if ( termsWrapper.length > 0 ) {
                            $(variations_form).on('change', function( event, data ){
                                var $this = $(this);
                                var selectedterms = '';
                                $this.find('.anarkali-variations-items select').each(function(){
                                    var title = $(this).parents('.anarkali-variations-items').find('.anarkali-small-title').text();
                                    var val   = $(this).val();
                                    var val2  = $(this).find('option[value="'+val+'"]').html();
                                    if (val) {
                                        selectedterms += '<span class="selected-features">'+title+': '+val2+'</span>';
                                    }
                                });
                                if (selectedterms){
                                    $('.anarkali-selected-variations-terms-wrapper').slideDown().find('.anarkali-selected-variations-terms').html(selectedterms);
                                    $('.anarkali-select-variations-terms-title').slideUp();
                                }
                            });
                            $('.anarkali-quickshop-form-wrapper .anarkali-btn-reset.reset_variations').on('click', function() {
                                $('.anarkali-quickshop-form-wrapper .anarkali-selected-variations-terms-wrapper').slideUp();
                                $('.anarkali-quickshop-form-wrapper .anarkali-select-variations-terms-title').slideDown();
                            });
                        }

                        $('.anarkali-quickshop-form-wrapper form.cart').submit(function(e) {

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

                                    if ( response.error && response.product_url ) {
                                        window.location = response.product_url;
                                        return;
                                    }

                                    var fragments = response.fragments;

                                    $('.anarkali-quickshop-notices-wrapper').html(fragments.notices).slideDown();

                                    // update other areas
                                    $('.minicart-panel').replaceWith(fragments.minicart);
                                    $('.anarkali-cart-count').html(fragments.count);
                                    $('.anarkali-cart-total').html(fragments.total);
                                    $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                                    $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');

                                    $('.anarkali-quickshop-notices-wrapper .close-error').on('click touch', function(e) {
                                        $('.anarkali-quickshop-notices-wrapper').slideUp();
                                    });

                                    $('.anarkali-quickshop-wrapper .anarkali-btn-reset,.anarkali-quickshop-wrapper .plus,.anarkali-quickshop-wrapper .minus').on('click touch', function(event) {
                                        $('.anarkali-quickshop-notices').slideUp();
                                    });

                                    $('.anarkali-quickshop-buttons-wrapper').slideDown().addClass('active');

                                    $('.anarkali-quickshop-buttons-wrapper .anarkali-btn').on('click touch', function(e) {
                                        if ( $(this).hasClass('open-cart-panel') ) {
                                            $('html,body').addClass('anarkali-overlay-open');
                                            $('.anarkali-side-panel .active').removeClass('active');
                                            $('.anarkali-side-panel').addClass('active');
                                            $('.cart-area').addClass('active');
                                        }
                                        $.magnificPopup.close();
                                    });
                                }
                            });
                        });

                        $('body').on('click', '.anarkali-btn-buynow', function() {
                            if ($(this).parents('form.cart').length) {
                                return;
                            }
                            $('form.cart').find('.anarkali-btn-buynow').trigger('click');
                        });
                    },
                    beforeClose : function() {},
                    close : function() {},
                    afterClose : function() {}
                }
            });
        });
    }
    // quick shop end
});
