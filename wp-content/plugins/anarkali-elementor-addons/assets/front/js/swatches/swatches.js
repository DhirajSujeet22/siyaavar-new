'use strict';

window.anarkali = {};

(
function(anarkali, $) {
    anarkali = anarkali || {};

    $.extend(anarkali, {
        Swatches: {
            init: function() {
                var $term = $('.anarkali-term'),
                $active_term = $('.anarkali-term:not(.anarkali-disabled)');

                // load default value
                $term.each(function() {
                    var $this       = $(this),
                        term        = $this.attr('data-term'),
                        attr        = $this.closest('.anarkali-terms').attr('data-attribute'),
                        $select_box = $this.closest('.anarkali-terms').parent().find('select#' + attr),
                        val         = $select_box.val();

                    if ( val != '' && term == val ) {
                        $(this).addClass('anarkali-selected').find('input[type="radio"]').prop('checked', true);
                    }
                });

                $active_term.unbind('click touch').on('click touch', function(e) {
                    var $this       = $(this),
                        term        = $this.attr('data-term'),
                        title       = $this.attr('title'),
                        attr        = $this.closest('.anarkali-terms').attr('data-attribute'),
                        $select_box = $this.closest('.anarkali-terms').parent().find('select#' + attr);

                    if ( $this.hasClass('anarkali-disabled') ) {
                        return false;
                    }

                    if ( !$this.hasClass('anarkali-selected') ) {
                        $select_box.val(term).trigger('change');

                        $this.closest('.anarkali-terms').find('.anarkali-selected').removeClass('anarkali-selected').find('input[type="radio"]').prop('checked', false);

                        $this.addClass('anarkali-selected').find('input[type="radio"]').prop('checked', true);

                        $(document).trigger('anarkali_selected', [attr, term, title]);
                    }

                    e.preventDefault();
                });

                $(document).on('woocommerce_update_variation_values', function(e) {
                    $(e['target']).find('select').each(function() {
                        var $this = $(this);
                        var $terms = $this.parent().parent().find('.anarkali-terms');

                        $terms.find('.anarkali-term').removeClass('anarkali-enabled').addClass('anarkali-disabled');

                        $this.find('option.enabled').each(function() {
                            var val = $(this).val();

                            $terms.find('.anarkali-term[data-term="' + val + '"]').removeClass('anarkali-disabled').addClass('anarkali-enabled');
                        });
                    });
                });

                $(document).on('reset_data', function(e) {
                    $(document).trigger('anarkali_reset');
                    var $this = $(e['target']);

                    $this.find('.anarkali-selected').removeClass('anarkali-selected').find('input[type="radio"]').prop('checked', false);

                    $this.find('select').each(function() {
                        var attr = $(this).attr('id');
                        var title = $(this).find('option:selected').text();
                        var term = $(this).val();

                        if ( term != '' ) {
                            $(this).parent().parent().
                            find('.anarkali-term[data-term="' + term + '"]').
                            addClass('anarkali-selected').find('input[type="radio"]').
                            prop('checked', true);

                            $(document).trigger('anarkali_reset', [attr, term, title]);
                        }
                    });
                });
            }
        }
    });

}).apply(this, [window.anarkali, jQuery]);

(
function(anarkali, $) {

    $(document).on('wc_variation_form', function() {
        if ( typeof anarkali.Swatches !== 'undefined' ) {
            anarkali.Swatches.init();
        }
    });
    $(document.body).on('anarkali_variations_init', function() {
        if ( typeof anarkali.Swatches !== 'undefined' ) {
            anarkali.Swatches.init();
        }
        $('.anarkali-products-wrapper .variations_form').each(function () {
            $(this).wc_variation_form();
        });
    });

    $(document).on('found_variation', function(e, t) {
        if ( $(e['target']).closest('.anarkali-loop-swatches').length ) {
            var $product  = $(e['target']).closest('.anarkali-product'),
                $atc      = $product.find('.add_to_cart_button'),
                $image    = $product.find('.attachment-woocommerce_thumbnail'),
                $price    = $product.find('.price');

            if ( $atc.length ) {
                $atc.removeClass('anarkali-quick-shop-btn').addClass('anarkali_add_to_cart').attr('data-variation_id', t['variation_id']).attr('data-product_sku', t['sku']);

                if ( !t['is_purchasable'] || !t['is_in_stock'] ) {
                    $atc.addClass('disabled wc-variation-is-unavailable');
                } else {
                    $atc.removeClass('disabled wc-variation-is-unavailable');
                }

                $atc.removeClass('added error loading');
            }

            $product.find('a.added_to_cart').remove();

            // add to cart button text
            if ( $atc.length ) {
                $atc.text(anarkali_vars.add_to_cart);
            }

            // product image
            if ( $image.length ) {

                if ( $image.attr('data-src') == undefined ) {
                    $image.attr('data-src', $image.attr('src'));
                }

                if ( $image.attr('data-srcset') == undefined ) {
                    $image.attr('data-srcset', $image.attr('srcset'));
                }

                if ( $image.attr('data-sizes') == undefined ) {
                    $image.attr('data-sizes', $image.attr('sizes'));
                }

                if ( t['image']['src'] != undefined && t['image']['src'] != '' ) {
                    $image.attr('src', t['image']['src']);
                }

                if ( t['image']['srcset'] != undefined && t['image']['srcset'] != '' ) {
                    $image.attr('srcset', t['image']['srcset']);
                } else {
                    $image.attr('srcset', '');
                }

                if ( t['image']['sizes'] != undefined && t['image']['sizes'] != '' ) {
                    $image.attr('sizes', t['image']['sizes']);
                } else {
                    $image.attr('sizes', '');
                }
            }

            // product price
            if ( $price.length ) {
                if ( $price.attr('data-price') == undefined ) {
                    $price.attr('data-price', $price.html());
                }

                if ( t['price_html'] ) {
                    $price.html( t['price_html'] );
                }
            }

            $(document).trigger('anarkali_archive_found_variation', [t]);
        }
    });

    $(document).on('reset_data', function(e) {
        if ( $(e['target']).closest('.anarkali-loop-swatches').length ) {
            var $product  = $(e['target']).closest('.anarkali-product'),
                $atc      = $product.find('.add_to_cart_button'),
                $image    = $product.find('.attachment-woocommerce_thumbnail'),
                $price    = $product.find('.price');

            if ( $atc.length ) {
                $atc.removeClass('anarkali_add_to_cart disabled wc-variation-is-unavailable').attr('data-variation_id', '0').attr('data-product_sku', '');
                    $atc.removeClass('added error loading');
                }

                $product.find('a.added_to_cart').remove();

                // add to cart button text
                if ( $atc.length ) {
                    $atc.text(anarkali_vars.select_options);
                }

                // product image
                if ( $image.length ) {
                    $image.attr('src', $image.attr('data-src'));
                    $image.attr('srcset', $image.attr('data-srcset'));
                    $image.attr('sizes', $image.attr('data-sizes'));
                }

                // product price
                if ( $price.length ) {
                    $price.html($price.attr('data-price'));
                }

                $(document).trigger('anarkali_archive_reset_data');
            }
        });

        $(document).on('click touch', '.anarkali_add_to_cart', function(e) {
            e.preventDefault();
            var btn        = $(this);
            var $product   = btn.closest('.anarkali-product');
            var attributes = {};

            $product.addClass('loading');
            btn.removeClass('added error').addClass('loading');

            if ($product.length) {
                $product.find('a.added_to_cart').remove();

                $product.find('[name^="attribute"]').each(function() {
                    attributes[$(this).attr('data-attribute_name')] = $(this).val();
                });

                var data = {
                    action       : 'anarkali_swatches_add_to_cart',
                    nonce        : anarkali_vars.security,
                    product_id   : btn.attr('data-product_id'),
                    variation_id : btn.attr('data-variation_id'),
                    quantity     : btn.attr('data-quantity'),
                    attributes   : JSON.stringify(attributes),
                };

                $.post(anarkali_vars.ajax_url, data, function(response) {
                    
                    $product.removeClass('loading');
                    btn.removeClass('spinner loading').addClass('added');
                    
                    var fragments = response.fragments;
                    var duration = anarkali_vars.duration;
                    
                    if ( fragments.hasOwnProperty('add') ) {
                        
                        var pname = fragments.add.title;
                        var pqty  = fragments.add.qty;
                        var pattr = fragments.add.variation;
                        var attr  = '';
                        
                        for (var attributeName in pattr) {
                            if (pattr.hasOwnProperty(attributeName)) {
                                var attributeValue = attributes[attributeName];
                                attr += ' '+attributeValue+', ';
                            }
                        }
                        var msg = pqty+' x <strong>'+pname+'</strong> '+attr+' '+anarkali_vars.added;
                        
                        var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message">'+msg+'</div></div>';
                        
                        $(appended).prependTo('.anarkali-shop-popup-notices').delay(duration).fadeOut(300, function(){
                            $(this).remove();
                        });
                    }
                    
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
                    if (response) {
                        //$this.removeClass('loading').addClass('added');
                        //$(document.body).trigger('added_to_cart').trigger('wc_fragment_refresh');
                    } else {
                        //$this.removeClass('loading').addClass('error');
                    }
                });
            }
        });

    }
).apply(this, [window.anarkali, jQuery]);
