jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    function scrollToTop(target,delay,timeout) {
        setTimeout(function(){
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, delay);
        }, timeout );
    }

    if ( $('.anarkali-product-gallery-main-slider-carousel').length ) {
        var galleryOptionsFull       = $('.anarkali-product-gallery-main-slider-carousel').data('swiper-options');
            galleryOptionsFull["on"] = {
            resize: function(swiper){
                swiper.update();
            }
        };
        var galleryMainFull     = new NTSwiper( '.anarkali-product-gallery-main-slider-carousel', galleryOptionsFull );

        var $oMainImgFull       = $('.anarkali-product-gallery-main-slider-carousel .anarkali-swiper-slide-first img'),
            $oZoomSrc           = $('.anarkali-product-gallery-main-slider-carousel .anarkali-swiper-slide-first').data('src'),
            $oMainSrcFull       = $oMainImgFull.data('src'),
            $oMainSrcSetFull    = $oMainImgFull.data('srcset'),
            $oMainSrcSizesFull  = $oMainImgFull.data('sizes');

        $( document ).on('change','.anarkali-product-summary .variations_form select', function( e ) {
            var $thisFull      = $(this),
                $formFull      = $thisFull.parents('.variations_form'),
                variationsFull = $formFull.data('product_variations'),
                $oZoomImgFull  = $('.anarkali-product-gallery-main-slider-carousel .anarkali-swiper-slide-first img.zoomImg'),
                galleryFull    = $('.anarkali-product-gallery-main-slider-carousel');

            setTimeout( function() {
                var current_id = $formFull.attr('current-image'),
                    full_src,
                    imageFull,
                    timageFull,
                    srcFull,
                    srcsetFull,
                    sizesFull;

                $.map(variationsFull, function(elementOfArray, indexInArray) {
                    if (elementOfArray.image_id == current_id) {
                        imageFull  = elementOfArray.image;
                        full_src   = imageFull.full_src;
                        srcFull    = imageFull.src;
                        srcsetFull = imageFull.srcset;
                        sizesFull  = imageFull.sizes;
                    }
                });

                if ( current_id ) {
                    $oMainImgFull.attr('src',srcFull);
                    $oMainImgFull.attr('data-src',srcFull);
                    $oZoomImgFull.attr('src',full_src);
                    if ( srcsetFull ) {
                        $oMainImgFull.attr('srcset',srcsetFull);
                    }
                    if ( sizesFull ) {
                        $oMainImgFull.attr('sizes',sizesFull);
                    }

                    setTimeout( function() {
                        if ( !$oMainImgFull.hasClass('swiper-slide-active') ) {
                            $('.anarkali-product-gallery-main-slider-carousel .swiper-pagination .swiper-pagination-bullet:first').trigger('click');
                        }
                        $('.anarkali-product-gallery-main-slider-carousel .swiper-slide-active').attr('data-src',srcFull);
                        initZoomFull('reinit',full_src);
                    }, 100, $oMainImgFull,galleryMainFull );

                    if ( anarkali_vars.scrolltop == 'yes' ) {
                        scrollToTop(galleryFull,300,300);
                    }
                }
            }, 50 );

        });

        $( document ).on('click','.anarkali-product-summary .reset_variations', function( e ) {
            var $formFull     = $(this).parents('.variations_form'),
                galleryFull   = $('.anarkali-product-gallery-main-slider-carousel'),
                $oZoomImgFull = $('.anarkali-product-gallery-main-slider-carousel .anarkali-swiper-slide-first img.zoomImg');

            $oMainImgFull.attr('src',$oMainSrcFull);
            $oMainImgFull.attr('data-src',$oMainSrcFull);
            $oZoomImgFull.attr('src',$oZoomSrc);
            if ( $oMainSrcSetFull ) {
                $oMainImgFull.attr('srcset',$oMainSrcSetFull);
            }
            if ( $oMainSrcSizesFull ) {
                $oMainImgFull.attr('sizes',$oMainSrcSizesFull);
            }

            setTimeout( function() {
                if ( !$oMainImgFull.hasClass('swiper-slide-active') ) {
                    $('.anarkali-product-gallery-main-slider-carousel .swiper-pagination .swiper-pagination-bullet:first').trigger('click');
                }
                $('.anarkali-product-gallery-main-slider-carousel .swiper-slide-active').attr('data-src',$oZoomSrc);
                initZoomFull('reinit',$oZoomSrc);
            }, 100, $oMainImgFull,galleryMainFull );

            if ( anarkali_vars.scrolltop == 'yes' ) {
                scrollToTop(galleryFull,400,300);
            }
        });

        initZoomFull('load');

        /**
        * Init zoom.
        */
        function initZoomFull($action,$url) {
            if ( 'function' !== typeof $.fn.zoom && !wc_single_product_params.zoom_enabled ) {
                return false;
            }

            var galleryWidthFull = $('.anarkali-product-gallery-main-slider-carousel .swiper-slide').width(),
                zoomEnabled  = false,
                zoom_options = {
                    touch: false
                };

            if ( 'ontouchstart' in document.documentElement ) {
                zoom_options.on = 'click';
            }

            $('.anarkali-product-gallery-main-slider-carousel .swiper-slide img').each( function( index, target ) {
                var imageFull = $( target );
                var imageIndex = imageFull.parents('.swiper-slide').data('swiper-slide-index');

                if ( imageFull.attr( 'width' ) > galleryWidthFull ) {
                    if ( $action == 'load' ) {

                        zoom_options.url = imageFull.parent().data('src');
                        imageFull.wrap('<span class="anarkali-zoom-wrapper" style="display:inline-block"></span>')
                          .css('display', 'block')
                          .parent()
                          .zoom(zoom_options);
                    } else {
                        imageFull.trigger('zoom.destroy').unwrap();
                        zoom_options.url = imageIndex == 0 ? $url : imageFull.parent().data('src');
                        imageFull.wrap('<span class="anarkali-zoom-wrapper" style="display:inline-block"></span>')
                          .css('display', 'block')
                          .parent()
                          .zoom(zoom_options);
                    }
                }
            });
        }
    }

});
