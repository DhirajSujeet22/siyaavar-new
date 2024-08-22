jQuery(document).ready(function($) {

    "use strict";

    $(document.body).on('click','.quantity .plus, .quantity .minus', function() {

        var $this   = $(this),
            qty     = $this.closest( '.quantity' ).find( '.qty' ),
            wrapper = $this.closest('.cart-quantity-wrapper'),
            val     = parseFloat( $(qty).val() ),
            max     = parseFloat( $(qty).attr( 'max' ) ),
            min     = parseFloat( $(qty).attr( 'min' ) ),
            step    = parseFloat( $(qty).attr('step') ),
            new_val = 0;

        if ( ! val || val === '' || val === 'NaN' ) {
            val = 0;
        }
        if ( max === '' || max === 'NaN' ) {
            max = '';
        }
        if ( min === '' || min === 'NaN' ) {
            min = 0;
        }
        if ( step === 'any' || step === '' || step === undefined || step === 'NaN' ) {
            step = 1;
        } else {
            step = step;
        }

        // Update values
        if ( $this.is( '.plus' ) ) {
            if ( max && ( max === val || val > max ) ) {
                $(qty).val( max );
                $this.addClass('disabled');
            } else {
                $this.parent().find('.minus').removeClass('disabled');
                new_val = val + step;
                $(qty).val( new_val );
                if ( max && ( max === new_val || new_val > max ) ) {
                    $this.addClass('disabled');
                }
                $(qty).trigger('change');
            }
        } else {
            if ( min && ( min === val || val < min ) ) {
                $(qty).val( min );
                $this.addClass('disabled');
            } else if ( val > 0 ) {
                $this.parent().find('.plus').removeClass('disabled');
                new_val = val - step;
                $(qty).val( new_val );
                if ( min && ( min === new_val || new_val < min ) ) {
                    $this.addClass('disabled');
                }
                $(qty).trigger('change');
            }
        }
        $('.cart-update-button[name="update_cart"]').addClass('active').attr('aria-disabled',false);
        wrapper.addClass('active');
        $('.single_add_to_cart_button.disabled').removeClass('disabled');
        if ( $('.ninetheme-shop-popup-notices .woocommerce-error').length>0 ) {
            $('.ninetheme-shop-popup-notices .woocommerce-error').remove();
        }
    });

    var timeout;

    $(document).on('change input', '.anarkali-minicart .quantity .qty', function() {

        var input = $(this),
            qty   = input.val(),
            id    = input.parents('.woocommerce-mini-cart-item').data('key'),
            name  = input.parents('.woocommerce-mini-cart-item').find( '.cart-name' ).html();

        if ( anarkali_vars.is_cart == 'yes' ) {
            var referer = $('.anarkali-cart-row .anarkali-hidden input[name="_wp_http_referer"]');
        }

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            $.ajax({
                url     : anarkali_vars.ajax_url,
                dataType: 'json',
                method  : 'GET',
                data    : {
                    action  : 'anarkali_quantity_button',
                    id      : id,
                    qty     : qty,
                    is_cart : anarkali_vars.is_cart
                },
                beforeSend  : function(){
                    input.parents('.woocommerce-mini-cart-item').addClass('loading').append('<span class="loading-wrapper"><span class="ajax-loading"></span></span>');
                },
                success : function(data) {

                    if (data && data.fragments) {

                        var fragments = data.fragments;
                        var duration = anarkali_vars._duration;

                        if ( fragments.count != 0 ) {
                            if ( qty == 0 ) {
                                var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message update-message"><span class="update">'+anarkali_vars.updated+'</span> <strong>"'+name+'"</strong> '+anarkali_vars.removed+'</div></div>';
                            } else {
                                var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message update-message"><span class="update">'+anarkali_vars.updated+'</span>'+qty+'&times <strong>"'+name+'"</strong> '+anarkali_vars.added+'</div></div>';
                            }
                        }

                        if ( fragments.count == 0 ) {
                            var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message update-message">'+fragments.update.msg+'</div></div>';
                        }

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

                        $(document.body).trigger('anarkali_update_minicart');

                        if ( anarkali_vars.is_cart == 'yes' && fragments.count != 0  ) {
                            $('.anarkali-cart-row').replaceWith(fragments.update.cart);
                            $('.anarkali-cart-row .anarkali-hidden input[name="_wp_http_referer"]').replaceWith(referer);
                        }

                        if ( $('.cross-sells .anarkali-swiper-slider').length>0 ) {
                            $('.anarkali-swiper-slider').each(function () {
                                const options  = $(this).data('swiper-options');
                                const mySlider = new NTSwiper(this, options );
                            });
                        }

                        if ( anarkali_vars.is_cart == 'yes' && fragments.count == 0  ) {
                            location.reload(); // page reload
                        }

                        $(document.body).trigger('wc_fragment_refresh')
                    }
                },
                error: function() {
                    $( document.body ).trigger( 'wc_fragments_ajax_error' );
                }
            });
        }, 500);
    });

});
