jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    // AJax single add to cart
    if ( anarkali_vars.product_type === 'woo' ) {

        $(document.body).on('added_to_cart', function(data,fragments, cart_hash, btn){
            $.ajax({
                url        : anarkali_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_ajax_add_to_cart' ),
                data       : data,
                type       : 'POST',
                processData: false,
                contentType: false,
                dataType   : 'json',
                success    : function( response ) {

                    var duration = anarkali_vars.duration;

                    btn.removeClass('loading');

                    var fragments = response.fragments;
                    var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';

                    $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                        $(this).remove();
                    });

                    // update other areas
                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.anarkali-cart-count').html(fragments.count);
                    $('.anarkali-side-panel').attr('data-cart-count',fragments.count);
                    $('.anarkali-cart-total:not(.page-total)').html(fragments.total);

                    if ( $('.anarkali-cart-goal-text').length>0 ) {
                        $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                        $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                        if ( fragments.shipping.value >= 100 ) {
                            $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                        }
                    }

                    $(document.body).trigger('anarkali_update_minicart');

                    if ( anarkali_vars.minicart_open === 'yes' ) {
                        $('html,body').addClass('anarkali-overlay-open');
                        $('.anarkali-side-panel,.panel-content .cart-area').addClass('active');
                    }
                },
                error: function() {
                    $( document.body ).trigger( 'wc_fragments_ajax_error' );
                }
            });
        });
    }

    if ( anarkali_vars.product_ajax != 'no' ) {
        
        $('body').on('submit', '.anarkali-product-summary form.cart', function(e) {

            if ( $(this).hasClass('product-type-external') || $(e.originalEvent.submitter).hasClass('anarkali-btn-buynow') ) {
                return;
            }

            e.preventDefault();

            var form = $(this),
                btn  = form.find('.anarkali-btn.single_add_to_cart_button'),
                val  = form.find('[name=add-to-cart]').val(),
                data = new FormData(form[0]);

            btn.addClass('loading');

            data.append('add-to-cart', val );

            // Ajax action.
            $.ajax({
                url         : anarkali_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_ajax_add_to_cart' ),
                data        : data,
                type        : 'POST',
                processData : false,
                contentType : false,
                dataType    : 'json',
                complete    : function( response ) {

                    btn.removeClass('loading');

                    response = response.responseJSON;
                    var fragments = response.fragments;
                    var duration  = anarkali_vars.duration;
                    var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';

                    if ( fragments.notices.indexOf('woocommerce-error') > -1 ) {

                        btn.addClass('disabled');
                        $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                            $(this).remove();
                        });

                    } else {

                        if ( $('.anarkali-side-panel').length>0 && anarkali_vars.minicart_open === 'yes' ) {
                            if ( !(form.parents('.anarkali-quickshop-wrapper').length>0) ) {
                                $('html,body').addClass('anarkali-overlay-open');
                                $('.panel-header-actions .active,.panel-content .active').removeClass('active');
                                $('.anarkali-side-panel,.panel-content .cart-area').addClass('active');
                                $('.anarkali-header-overlay').addClass('close-cursor');
                            }
                        }

                        if ( $('.anarkali-shop-popup-notices .woocommerce-notices-wrapper').length>0 ) {
                            $('.anarkali-shop-popup-notices .woocommerce-notices-wrapper').remove();
                            $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                                $(this).remove();
                            });
                        } else {
                            $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                                $(this).remove();
                            });
                        }
                    }

                    // update other areas
                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.anarkali-cart-count').html(fragments.count);
                    $('.anarkali-side-panel').data('cart-count',fragments.count);
                    $('.anarkali-cart-total:not(.page-total)').html(fragments.total);

                    if ( $('.anarkali-cart-goal-wrapper').length>0 ) {
                        $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                        $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                        if ( fragments.shipping.value >= 100 ) {
                            $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                        } else {
                            $('.anarkali-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                        }
                    }

                    $(document.body).trigger('added_to_cart');
                    $(document.body).trigger('anarkali_update_minicart');
                    // Redirect to cart option
                    if ( anarkali_vars.cart_redirect === 'yes' ) {
                        window.location = anarkali_vars.cart_url;
                        return;
                    }
                }
            });
        });
    }

    $('body').on('click', '.anarkali-btn-buynow', function() {
        if ($(this).parents('form.cart').length) {
            return;
        }
        $('form.cart').find('.anarkali-btn-buynow').trigger('click');
    });

    // AJax single add to cart
    if ( anarkali_vars.cart_ajax != 'no' && anarkali_vars.ajax_addtocart != 'no' ){
        
        if( $( '.anarkali-cart-count' ).length ) {
            var data = {
                'action': 'load_woo_cart'
            };
            $.post( anarkali_vars.ajax_url, data, function( response ) {
                $('.minicart-panel').replaceWith(response.minicart);
                $('.anarkali-cart-count').html(response.count);
            });
        }
        
        $(document).on('click', '.anarkali_ajax_add_to_cart', function(e){
            e.preventDefault();

            var btn  = $(this),
                pid  = btn.attr( 'data-product_id' ),
                qty  = parseFloat( btn.data('quantity') ),
                data = new FormData();

            data.append('add-to-cart', pid);

            if ( qty > 0 ) {
                data.append('quantity', qty);
            }

            $(this).parent().addClass('added');
            btn.parents('.anarkali-product').addClass('loading');

            var lodingHtml = '<span class="loading-wrapper"><span class="ajax-loading"></span></span>';

            if ( btn.closest('.anarkali-side-panel').length && ( btn.closest('.wishlist-area').length || btn.closest('.compare-area').length ) ) {
                if ( $('.anarkali-side-panel .cart-empty-content').length ) {
                    $('.anarkali-side-panel .cart-empty-content').addClass('loading').append(lodingHtml);
                    $('.anarkali-side-panel [data-name="cart"]').trigger('click');
                } else {
                    $('.anarkali-side-panel [data-name="cart"]').trigger('click');
                    $('.anarkali-side-panel .woocommerce-mini-cart').addClass('loading').append(lodingHtml);
                }
            }
            if ( btn.closest('.anarkali-header-mobile').length && ( btn.closest('.wishlist-area').length || btn.closest('.compare-area').length ) ) {
                if ( $('.anarkali-header-mobile .cart-empty-content').length ) {
                    $('.anarkali-header-mobile .cart-empty-content').addClass('loading').append(lodingHtml);
                    $('.anarkali-header-mobile [data-name="cart"]').trigger('click');
                } else {
                    $('.anarkali-header-mobile [data-name="cart"]').trigger('click');
                    $('.anarkali-header-mobile .woocommerce-mini-cart').addClass('loading').append(lodingHtml);
                }
            }

            // Ajax action.
            $.ajax({
                url         : anarkali_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_ajax_add_to_cart' ),
                data        : data,
                type        : 'POST',
                processData : false,
                contentType : false,
                dataType    : 'json',
                success     : function( response ) {

                    btn.parents('.anarkali-product').removeClass('loading');

                    if ( ! response ) {
                        return;
                    }

                    var fragments = response.fragments;
                    var duration = anarkali_vars.duration;
                    var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';

                    $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                        $(this).remove();
                    });

                    // update other areas
                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.anarkali-cart-count').html(fragments.count);
                    $('.anarkali-side-panel').data('cart-count',fragments.count);
                    $('.anarkali-cart-total:not(.page-total)').html(fragments.total);

                    if ( $('.anarkali-cart-goal-wrapper').length>0 ) {
                        $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                        $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                        if ( fragments.shipping.value >= 100 ) {
                            $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                        } else {
                            $('.anarkali-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                        }
                    }

                    if ( $('.anarkali-side-panel').length>0 && anarkali_vars.minicart_open === 'yes' ) {
                        if ( !(btn.parents('.anarkali-quickshop-wrapper').length>0) ) {
                            $('html,body').addClass('anarkali-overlay-open');
                            $('.panel-header-actions .active,.panel-content .active').removeClass('active');
                            $('.anarkali-side-panel,.panel-content .cart-area').addClass('active');
                            $('.anarkali-header-overlay').addClass('close-cursor');
                        }
                    }

                    $(document.body).trigger('added_to_cart');
                    $(document.body).trigger('anarkali_update_minicart');

                    if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
                        window.location = wc_add_to_cart_params.cart_url;
                        return;
                    }

                    if ( response.error && response.product_url ) {
                        window.location = response.product_url;
                        return;
                    }
                }
            });
        });
    }

    $(document).on('click', '.anarkali_remove_from_cart_button', function(e){
        e.preventDefault();

        var $this = $(this),
            pid   = $this.data('product_id'),
            note  = anarkali_vars.removed,
            cart  = $this.closest('.anarkali-minicart'),
            row   = $this.closest('.anarkali-cart-item'),
            key   = $this.data( 'cart_item_key' ),
            name  = $this.data('name'),
            qty   = $this.data('qty'),
            msg   = qty ? qty+' &times '+name+' '+note : name+' '+note,
            btn   = $('.anarkali_ajax_add_to_cart[data-product_id="'+pid+'"]');

            msg   = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message">'+msg+'</div></div>';

        var duration = anarkali_vars.duration;

        $(msg).appendTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
            $(this).remove();
        });

        cart.addClass('loading');

        row.remove();

        var cartItems = cart.find('.mini-cart-item').length;

        if ( cartItems == 0 ) {
            cart.addClass('no-products');
        }

        $.ajax({
            url      : anarkali_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_remove_from_cart' ),
            type     : 'POST',
            dataType : 'json',
            data     : {
                cart_item_key : key
            },
            success  : function( response ){
                var fragments = response.fragments;

                $('.minicart-panel').replaceWith(fragments.minicart);
                $('.anarkali-cart-count').html(fragments.count);
                $('.anarkali-side-panel').attr('data-cart-count',fragments.count);
                $('.anarkali-cart-total:not(.page-total)').html(fragments.total);

                cart.removeClass('loading no-products');

                if ( $('.anarkali-cart-goal-wrapper').length>0 ) {
                    $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                    $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                    if ( fragments.shipping.value >= 100 ) {
                        $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                    } else {
                        $('.anarkali-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                    }
                }

                $(document.body).trigger( 'removed_from_cart', [ fragments, response.cart_hash, btn ] );
                $(document.body).trigger('anarkali_update_minicart');


				if ( anarkali_vars.is_cart == 'yes' && fragments.count != 0  ) {
					location.reload(); // page reload
				}

                if ( anarkali_vars.is_cart == 'yes' && fragments.count == 0 ) {
                    location.reload(); // page reload
                }

                if ( anarkali_vars.is_checkout == 'yes' && fragments.count == 0 ){
                    location.reload(); // page reload
                }
            },
            error: function() {
                $( document.body ).trigger( 'wc_fragments_ajax_error' );
            }
        });
    });

    $(document).on('updated_wc_div', function() {
        if ( anarkali_vars.is_cart == 'yes' ) {
            $.ajax({
                url: wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'anarkali_ajax_add_to_cart' ),
                type: 'POST',
                data: {
                    action: 'anarkali_ajax_add_to_cart'
                },
                success: function(response) {

                    var fragments = response.fragments;

                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.anarkali-cart-count').html(fragments.count);
                    $('.anarkali-side-panel').data('cart-count',fragments.count);
                    $('.anarkali-cart-total:not(.page-total)').html(fragments.total);

                    if ( $('.anarkali-cart-goal-wrapper').length>0 ) {
                        $('.anarkali-cart-goal-text').html(fragments.shipping.message);
                        $('.anarkali-progress-bar').css('width',fragments.shipping.value+'%');
                        if ( fragments.shipping.value >= 100 ) {
                            $('.anarkali-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                        } else {
                            $('.anarkali-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                        }
                    }
                    $(document.body).trigger('anarkali_update_minicart');
                }
            });
        }
    });

    function checkCartItems() {
        var ids = [];
        $('.cart-area .del-icon').each( function(item){
            var id = $(this).data('id');
            if ( ids.indexOf(id) < 0 ) {
                ids.push(id);
            }
        });

        if ( typeof ids != 'undefined' && ids.length ) {
            for (let i = 0; i < ids.length; i++) {
                $('.anarkali-product[data-id="'+ids[i]+'"]').addClass('cart-added');
                $('.anarkali-product[data-id="'+ids[i]+'"] .anarkali-btn').addClass('added');
            }
        } else {
            $('.anarkali-product').removeClass('cart-added');
            $('.anarkali-product .anarkali-btn').removeClass('added');
        }
    }

    $( document.body ).on( 'added_to_cart removed_from_cart', function( event ) {
        checkCartItems();
    });

});
