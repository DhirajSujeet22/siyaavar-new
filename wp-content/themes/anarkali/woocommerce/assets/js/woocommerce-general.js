(function(window, document, $) {

"use strict";

jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';
    var doc         = $(document),
        win         = $(window),
        body        = $('body'),
        winw        = $(window).outerWidth(),
        scrollOffset = $('.anarkali-header-default').height();

    if ( $('body').hasClass('admin-bar') ) {
        scrollOffset = scrollOffset + 32;
    }

    var scrollToTopSidebar = function() {
        var shopP = 30;

        if ( $('body').hasClass('admin-bar') ) {
            shopP = 32;
        }

        $('html, body').stop().animate({
            scrollTop: $('.shop-area').offset().top - shopP
        }, 400);
    };

    if ( $(".password-protected").length ) {
        var heightFooter = $(".password-protected .anarkali-elementor-footer").height();
        $(".password-protected .form_password").css('height','calc(100vh - '+heightFooter+'px)');
    }

    var galleryHeight = $(".gallery-col").height();
    var summaryHeight = $(".summary-col .anarkali-product-summary-inner").height();
    if ( galleryHeight > summaryHeight ) {
        $(".summary-col").addClass('anarkali-sticky');
    }
    if ( summaryHeight > galleryHeight ) {
        $(".gallery-col").addClass('anarkali-sticky');
    }

    $(document.body).on('click','.anarkali-open-fixed-sidebar', function () {
        $('body').addClass('anarkali-overlay-open');
        $('.nt-sidebar').addClass('active');
    });

    $(document.body).on('click','.anarkali-close-sidebar', function () {
        $('body').removeClass('anarkali-overlay-open');
        $('.nt-sidebar').removeClass('active');
    });

    $(document.body).on('click','.anarkali-toggle-hidden-sidebar', function (e) {
        $('.anarkali-toggle-hidden-sidebar').toggleClass('active');
        $('.nt-sidebar').toggleClass('active').slideToggle();
        setTimeout(function(){
            scrollToTopSidebar();
        }, 100 );
    });

    $(document.body).on('click','.subDropdown', function (e) {
        if ( $(this).hasClass('active') ) {
            $(this).removeClass('active minus').addClass("plus");
            $(this).next('.children').slideUp('slow');
        } else {
            $(this).removeClass('plus').addClass("active minus");
            $(this).next('.children').slideDown('slow');
        }
    });

    $(document.body).on('click','.anarkali-shop-popup-notices .close-error', function() {
        $('.anarkali-shop-popup-notices').removeClass('active');
    });

    // cart shipping form show-hide
    $(document.body).on('click','.anarkali-shipping-calculator-button', function (e) {
        var cartTotals = $('.anarkali-cart-totals'),
            form       = $('.shipping-calculator-form');

        if ( cartTotals.hasClass('active')) {
            cartTotals.removeClass('active');
            form.slideUp('slow');
        } else {
            cartTotals.addClass('active');
            form.slideDown('slow');
            setTimeout(function(){
                $('html, body').stop().animate({
                    scrollTop: cartTotals.offset().top - scrollOffset
                }, 400);
            }, 300 );
        }
    });

    $(document.body).on('click','.anarkali-product .reset', function() {
        var $this = $(this),
            imgs = $this.parents( '.anarkali-product' ).find('.swiper-slide .product-link');

        imgs.each(function(){
            var $this  = $(this);
            var img    = $this.find('img');
            var imgsrc = $this.data('img');
            setTimeout(function() {
                img.attr('src', imgsrc );
            }, 500);
        });
    });


    $(document.body).on('click','.anarkali-product .anarkali-term', function( event ) {
        var $this = $( this ),
            parent = $this.closest( '.anarkali-product' );
        $this.closest( '.anarkali-product' ).addClass('added-term');
        parent.find( '.anarkali-btn' ).append('<span class="loading-wrapper"><span class="ajax-loading"></span></span>');
    });

    $(document.body).on('click','.anarkali-product .reset_variations', function( event ) {
        var $this = $( this );
        $this.closest( '.anarkali-product' ).removeClass('added-term');
    });

    // product tabs
    $(document.body).on('click','.anarkali-product-tab-title-item', function() {
        var id = $(this).data('id');
        $('.anarkali-product-tabs-wrapper div[data-id="'+id+'"]').addClass('active');
        $('.anarkali-product-tabs-wrapper div:not([data-id="'+id+'"])').removeClass('active');
    });

    // product summary accordion tabs
    $(document.body).on('click','.cr-qna-link', function() {
        var name  = 'accordion';
        var offset  = 32;
        if ($('.anarkali-product-tabs-wrapper').length) {
            name  = 'tabs';
            offset = 0;
        }
        var target = $('.anarkali-product-'+name+'-wrapper').position();

        $('html,body').stop().animate({
            scrollTop: target.top + offset
        }, 1500);
        if ( $('[data-id="accordion-cr_qna"]').parent().hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="accordion-cr_qna"]').trigger('click');
            }, 700);
        }
        if ( $('[data-id="tab-cr_qna"]').hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="tab-cr_qna"]').trigger('click');
            }, 700);
        }
    });

    $(document.body).on('click','.anarkali-product-summary .woocommerce-review-link', function() {
        var target = $('.nt-woo-single #reviews').position();
        if ($('.anarkali-product-tabs-wrapper').length) {
            target = $('.nt-woo-single .anarkali-product-tabs-wrapper').position();
        }
        $('html,body').stop().animate({
            scrollTop: target.top
        }, 1500);

        if ( $('[data-id="tab-reviews"]').hasClass('active') ) {
            return;
        } else {
            setTimeout(function(){
                $('[data-id="tab-reviews"]').trigger('click');
            }, 700);
        }
    });

    // product summary accordion tabs
    $(document.body).on('click','.anarkali-accordion-header', function() {
        var accordionItem   = $(this),
            accordionParent = accordionItem.parent(),
            accordionHeight = accordionItem.outerHeight(),
            headerHeight    = $('body').hasClass('admin-bar') ? 32 : 0,
            totalHeight     = accordionHeight + headerHeight;

        accordionParent.toggleClass('active');
        accordionItem.next('.anarkali-accordion-body').slideToggle();
        accordionParent.siblings().removeClass('active').find('.anarkali-accordion-body').slideUp();
    });

    // product summary accordion tabs
    $(document.body).on('click','.nt-sidebar-widget-toggle', function() {
        var $this = $(this);
        $this.toggleClass('active');
        $this.parents('.nt-sidebar-inner-widget').toggleClass('anarkali-widget-show anarkali-widget-hide');
        $this.parent().next().slideToggle('fast');

        if ( $('.nt-sidebar-inner-wrapper .anarkali-widget-show').length ) {
            $this.parents('.nt-sidebar-inner-wrapper').removeClass('all-closed');
        } else {
            $this.parents('.nt-sidebar-inner-wrapper').addClass('all-closed');
        }
    });

    if ( $('.anarkali-selected-variations-terms-wrapper').length > 0 ) {
        $('form.variations_form').on('change', function( event, data ){
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
        $('.anarkali-btn-reset.reset_variations').on('click', function() {
            $('.anarkali-selected-variations-terms-wrapper').slideUp();
            $('.anarkali-select-variations-terms-title').slideDown();
        });
    }

    $('[data-label-color]').each( function() {
        var $this = $(this);
        var $color = $this.data('label-color');
        $this.css( {'background-color': $color,'border-color': $color } );
    });

    $('.nt-sidebar ul.product-categories li.cat-parent> ul.children').each( function (e) {
        $(this).before('<span class="subDropdown"></span>');
        $(this).slideUp();
    });

    anarkaliWcProductCats();
    function anarkaliWcProductCats() {
        $('.widget_anarkali_product_categories ul.children input[checked]').closest('li.cat-parent').addClass("current-cat");
    }

    if ( window.innerWidth < 1024 ) {
        var columnSize = $('.anarkali-shop-hidden-top-sidebar').data('column');
        $('.anarkali-shop-hidden-top-sidebar').removeClass('d-none active').removeAttr('style');
        $('.anarkali-toggle-hidden-sidebar').removeClass('active');
        $('.anarkali-shop-hidden-top-sidebar:not(.d-none) .nt-sidebar-inner').removeClass(columnSize).addClass('anarkali-scrollbar');
    }

    $(window).on('resize', function(){
        var columnSize = $('.anarkali-shop-hidden-top-sidebar').data('column');
        if ( window.innerWidth >= 1024 ) {
            if ( $('body').hasClass('anarkali-overlay-open') ) {
                $('body').removeClass('anarkali-overlay-open');
                $('.anarkali-shop-hidden-top-sidebar').removeClass('active');
            }
            $('.anarkali-shop-hidden-top-sidebar').addClass('d-none');
            $('.anarkali-shop-hidden-top-sidebar .nt-sidebar-inner').addClass(columnSize);
        }
        if ( window.innerWidth < 1024 ) {
            $('.anarkali-shop-hidden-top-sidebar').removeClass('d-none active').removeAttr('style');
            $('.anarkali-toggle-hidden-sidebar').removeClass('active');
            $('.anarkali-shop-hidden-top-sidebar:not(.d-none) .nt-sidebar-inner').removeClass(columnSize).addClass('anarkali-scrollbar');
        }
    });

    if ( window.innerWidth < 1024 && $(".anarkali-bottom-mobile-nav").length ) {
        $("body").addClass('has-bottom-fixed-menu');
    }

    if ( $(".anarkali-product-video-button").length ) {
        $(".anarkali-product-video-button").magnificPopup({
            type: 'iframe'
        });
    }

    if ( $(".anarkali-product-stock-progressbar").length ) {
        var percent = $(".anarkali-product-stock-progressbar").data('stock-percent');
        $(".anarkali-product-stock-progressbar").css('width',percent);
    }


    if ( typeof anarkali.Swatches !== 'undefined' ) {
        $('.products-wrapper .variations_form').each(function () {
            $(this).wc_variation_form();
        });
    }

    shopCatsSlider();

    $(document).on('anarkaliShopInit', function() {
        shopCatsSlider();
        anarkaliWcProductCats();
    });

    function shopCatsSlider() {

        var product_cats = $('.shop-area .slick-slide.product-category');

        if ( product_cats.length ) {
            product_cats.each(function (i, el) {
                $(this).appendTo('.shop-slider-categories .slick-slider');
            });
            var myContainer = $('.shop-slider-categories');
            var mySlick = $('.slick-slider', myContainer);
            mySlick.not('.slick-initialized').slick({
                autoplay      : false,
                slidesToShow  : 6,
                speed         : 500,
                focusOnSelect : true,
                infinite      : false,
                prevArrow     : '.slide-prev-cats',
                nextArrow     : '.slide-next-cats',
                responsive    : [
                    {
                        breakpoint: 576,
                        settings  : {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 768,
                        settings  : {
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 992,
                        settings  : {
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings  : {
                            slidesToShow: 6
                        }
                    }
                ]
            });
        }
    }

    var viewingItem = $('.anarkali-product-view'),
        data        = viewingItem.data('product-view'),
        countView   = viewingItem.find('.anarkali-view-count'),
        current     = 0,
        change_counter;

    function singleProductFakeView() {

        if ( viewingItem.length ) {
            var min    = data.min,
                max    = data.max,
                delay  = data.delay,
                change = data.change,
                id     = data.id;

            if ( !viewingItem.hasClass( 'inited' ) ) {
                if ( typeof change !== 'undefined' && change ) {
                    clearInterval( change );
                }

                current = $.cookie( 'anarkali_cpv_' + id );

                if ( typeof current === 'undefined' || !current ) {
                    current = Math.floor(Math.random() * max) + min;
                }

                viewingItem.addClass('inited');

                $.cookie('anarkali_cpv_' + id, current, { expires: 1 / 24, path: '/'} );

                countView.html( current );
            }

            change_counter = setInterval( function() {
                current    = parseInt( countView.text() );

                if ( !current ) {
                    current = min;
                }

                var pm = Math.floor( Math.random() * 2 );
                var others = Math.floor( Math.random() * change + 1 );
                current = ( pm < 1 && current > others ) ? current - others : current + others;
                $.cookie('anarkali_cpv_' + id, current, { expires: 1 / 24, path: '/'} );

                countView.html( current );

            }, delay);
        }
    }
    singleProductFakeView();

    $( document.body ).on( 'added_to_cart removed_from_cart updated_cart_totals', function() {
        $(document.body).trigger("update_checkout");
        $(".anarkali-product-bottom-popup-cart").removeClass('active');
    });

    if ( $('.woocommerce-error').length ) {
        $('.anarkali-is-required').each(function () {
            if ( typeof anarkali_vars !== 'undefined' && anarkali_vars ) {
                var message = anarkali_vars.required;
                $( this ).addClass('anarkali-invalid').find( '.anarkali-form-message' ).html(message);
            }
        });
    }

    var singleCartPos   = $('.anarkali-product-summary .single_add_to_cart_button').offset();
    var singleCartTop   = $('.anarkali-product-summary .single_add_to_cart_button').length && $(".anarkali-product-bottom-popup-cart").length ? singleCartPos.top : 0;
    var singleDocHeight = $(document).height() - 25;

    $(window).on("scroll", function () {

        if ( $(".anarkali-product-bottom-popup-cart").length && $(".anarkali-product-summary .single_add_to_cart_button").length ) {

            if ( $(window).scrollTop() > singleCartTop ) {
                $(".anarkali-product-bottom-popup-cart").addClass('active');
                $("body").addClass('bottom-popup-cart-active');
            } else {
                $(".anarkali-product-bottom-popup-cart").removeClass('active');
                $("body").removeClass('bottom-popup-cart-active');
            }
            if($(window).scrollTop() + $(window).height() > singleDocHeight ) {
                $(".anarkali-product-bottom-popup-cart").addClass('relative');
            } else {
                $(".anarkali-product-bottom-popup-cart").removeClass('relative');
            }
        }
    });

    if ( typeof anarkali_vars !== 'undefined' && anarkali_vars ) {
        var colors = anarkali_vars.swatches;

        $('.woocommerce-widget-layered-nav-list li a').each(function () {
            var $this = $(this);
            var title = $this.html();
            for (var i in colors) {
                if ( title == i ) {
                    var is_white = colors[i] == '#fff' || colors[i] == '#ffffff' ? ' is_white' : '';
                    var color = '<span class="anarkali-swatches-widget-color-item'+is_white+'" style="background-color: '+colors[i]+';"></span>';
                    $this.prepend(color);
                }
            }
        });
    }

    $(document).on('click touch','.anarkali-woocommerce-cart-form .product-remove', function(event) {
        $(this).addClass('loading');
    });

    $(document.body).on('anarkali_update_minicart', function(){
        minicartUpdateHeight();
    });

    minicartUpdateHeight();
    function minicartUpdateHeight(){

        var footerH = $('.minicart-panel .header-cart-footer').outerHeight();
        var headerH = $('.panel-header-wrapper').outerHeight();
        var cartH   = $('.anarkali-side-panel .cart-content').outerHeight();
        var maxH    = parseFloat(footerH+headerH) + 125;
        var panelH  = $('.anarkali-side-panel').outerHeight();

        if ( panelH < (cartH+headerH+50) ) {
            $('.minicart-panel .anarkali-perfect-scrollbar').addClass('overflowed').css('max-height','calc(100vh - '+maxH+'px)');
            $('.anarkali-header-mobile-content .anarkali-perfect-scrollbar').css('max-height','calc(100vh - '+(maxH-50)+'px)');
        } else {
            $('.minicart-panel .anarkali-perfect-scrollbar').removeClass('overflowed');
        }
    }

    /***** compare button fix *****/

    if ( typeof woosc_vars != 'undefined' ) {
        $('.top-action-btn.open-compare-popup').addClass('open-compare-btn');
    }
    if ( $('#woosc-area').length> 0) {
        var woosc = $('#woosc-area').data('count');
        $('.anarkali-compare-count').html(woosc);
        $('.woosc-bar-item').each(function () {
            var $id = $(this).attr('data-id');
            $('.woosc-btn-icon-only[data-id="'+$id+'"]').addClass('woosc-added added');
        });
    }

    $(document.body).on('woosc_change_count', function(){
        var woosc_count = $('#woosc-area').attr('data-count');
        $('.anarkali-compare-count').html(woosc_count);
    });

    if ( typeof yith_woocompare != 'undefined' ) {
        function yith_add_query_arg(key, value)
        {
            key = escape(key); value = escape(value);

            var s = document.location.search;
            var kvp = key+"="+value;

            var r = new RegExp("(&|\\?)"+key+"=[^\&]*");

            s = s.replace(r,"$1"+kvp);

            if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};

            //again, do what you will here
            return s;
        }
        $('.top-action-btn.open-compare-popup').on('click', function(e){
            e.preventDefault();
            $('body').trigger('yith_woocompare_open_popup',{ response: yith_add_query_arg('action', yith_woocompare.actionview) + '&iframe=true' });
        });

        $('body').on('yith_woocompare_product_removed yith_woocompare_open_popup', function(){
            var list  = $.cookie('yith_woocompare_list').split(',');
            var str   = list.toString().replace( '[', '' ).replace( ']', '' );
            var arr   = str.split(',');
            var count = arr.length;
            $('.anarkali-compare-count').html(count);
        });
    }
    /***** compare button fix *****/

    /***** fly cart *****/
    if ( $("#anarkali-sticky-cart-toggle").length > 0 ) {
        var flyCart   = $("#anarkali-sticky-cart-toggle");
        var cartCount = $("#anarkali-sticky-cart-toggle .anarkali-wc-count").text();
        var duration  = parseFloat(flyCart.data('duration'));

        if ( cartCount != 0 ) {
            flyCart.addClass('active');
        }

        $(document.body).on('added_to_cart removed_from_cart updated_cart_totals', function(){
            var cartCount = $("#anarkali-sticky-cart-toggle .anarkali-wc-count").text();
            if ( cartCount != 0 ) {
                flyCart.addClass('active');
            } else {
                flyCart.removeClass('active');
            }
        });

        $(document).on('click', '.add_to_cart_button.product_type_simple', function() {
            if ( $(this).closest('.add_to_cart_inline').length ) {
                return;
            }
            if ( $(this).closest('.anarkali-quickview-wrapper').length ) {
                var src    = $(this).closest('.anarkali-quickview-wrapper').find('.swiper-wrapper .swiper-slide:first-child img').attr('src'),
                    pos    = $(this).closest('.anarkali-quickview-wrapper').find('.swiper-wrapper .swiper-slide:first-child img').offset(),
                    width  = $(this).closest('.anarkali-quickview-wrapper').find('.swiper-wrapper .swiper-slide:first-child img').width(),
                    endPos = flyCart.offset();
            } else {
                var src    = $(this).closest('.anarkali-loop-product').find('.product-link img:first-child').attr('src'),
                    pos    = $(this).closest('.anarkali-loop-product').find('.product-link img:first-child').offset(),
                    width  = $(this).closest('.anarkali-loop-product').find('.product-link img:first-child').width(),
                    endPos = flyCart.offset();
            }

            $('body').append('<div id="anarkali-cart-fly"><img src="' + src + '"></div>');

            $('#anarkali-cart-fly').css({
                'top'   : pos.top + 'px',
                'left'  : pos.left + 'px',
                'width' : width + 'px',
            }).animate({
                opacity : 1,
                top     : endPos.top,
                left    : endPos.left,
                'width' : '60px',
                'height': 'auto',
            }, duration, 'linear', function() {
                var $this = $(this);
                flyCart.addClass('added');
                $this.fadeOut(1000);
                $(this).detach();
            });
        });

        flyCart.on('click', function() {
            $('html,body').addClass('anarkali-overlay-open');
            $('.anarkali-side-panel .panel-header-btn[data-name="cart"]').trigger('click');
            $('.anarkali-side-panel').addClass('active');
        });
    }
    /***** fly cart *****/


    // product list type masonry for mobile
    function masonryInit(winw) {
        var masonry = $('.anarkali-product-list');
        if ( masonry.length && winw <= 1200 ) {
            //set the container that Masonry will be inside of in a var
            var container = document.querySelector('.anarkali-products.anarkali-product-list');
            //create empty var msnry
            var msnry;
            // initialize Masonry after all images have loaded
            imagesLoaded( container, function() {
               msnry = new Masonry( container, {
                   itemSelector: '.anarkali-product-list>div.product'
               });
            });
        }
    }

    // product summary accordion tabs
    $(document.body).on('anarkali_masonry_init', function() {
        masonryInit(winw);
    });

    win.resize( function() {
        winw = $(window).outerWidth();
        masonryInit(winw);
    });

    if ($.support.pjax) {
        $(document).on('click', '.elementor-section .ajax-paginate .anarkali-woocommerce-pagination a', function(event) {
            var id = $(this).closest('.elementor-section').data('id');
            $(this).closest('.ajax-paginate').addClass('loading');
            $.pjax.click(event, {
                container: '[data-id="'+id+'"]',
                renderCallback: function(context, html, afterRender) {
                    var data = $(html).find('[data-id="'+id+'"]');
                    $(context).replaceWith(data);
                }
            });
        });
    }
    
    
    /* load more button pagination */
    if ($.support.pjax && $('.shop-loop-wrapper.pagination-loadmore').length>0) {
        
        var links_loadmore = '.shop-loop-wrapper.pagination-loadmore .shop-loadmore-wrapper a:not(.nomore)';
        var loadmoreClass  = 'anarkali-btn anarkali-btn-primary anarkali-solid anarkali-radius anarkali-btn-medium anarkali-load-more';
        var pageLink       = $('.anarkali-woocommerce-pagination.loadmore .page-numbers.current').parent().next().find('a');
        var pageLinkCloned = pageLink.clone();
        var pageLinkWapper = pageLink.closest('.shop-loop-wrapper').data('id');
        var maxPage        = $('.anarkali-woocommerce-pagination.loadmore .page-numbers.current');
        
        pageLinkCloned.text(anarkali_vars.load_title).addClass(loadmoreClass).attr('rel','nofollow noreferrer').appendTo('.shop-loop-wrapper[data-id="'+pageLinkWapper+'"] .shop-loadmore-wrapper');
        
        $(document).on('click',links_loadmore, function(event) {
            
            var $this   = $(this);
            var wrapper = $this.closest('.shop-loop-wrapper');
            var el      = wrapper.find('.anarkali-products');
            var elPag   = wrapper.find('.anarkali-woocommerce-pagination');
            var maxPag  = wrapper.find('.anarkali-woocommerce-pagination').data('max');
            var curPag  = wrapper.find('.anarkali-woocommerce-pagination').data('current');
            var elBtn   = wrapper.find('.shop-loadmore-wrapper a');
            var id      = wrapper.data('id');
            var pushurl = wrapper.data('pushurl');
            var title   = anarkali_vars.load_title;
            var loading = anarkali_vars.loading_title;
            var nomore  = anarkali_vars.nomore;
            
            if( maxPag == curPag ) {
                elBtn.addClass('nomore').attr('href','javascript:void(0)').text(nomore);
                return;
            }
            
            $this.addClass('loading').text(loading);
            
            if ( wrapper.hasClass('replace') ) {
                wrapper.addClass('loading');
            }
            
            $.pjax.click(event, {
                container      : '.shop-loop-wrapper[data-id="'+id+'"]',
                timeout        : 5000,
                push           : pushurl,
                renderCallback : function(context, html, afterRender) {
                    
                    wrapper.removeClass('loading');
                    
                    $(html).find('.product-category').remove();
                    var maxPag  = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-woocommerce-pagination').data('max');
                    var curPag  = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-woocommerce-pagination').data('current');
                    var product = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-loop-product');
                    var data    = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-products').html();
                    var data2   = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] >.woocommerce');
                    var pagin   = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-woocommerce-pagination');
                    var btnHref = $(html).find('.shop-loop-wrapper[data-id="'+id+'"] .anarkali-woocommerce-pagination .page-numbers.current').parent().next().find('a').attr('href');
                    
                    if (product.length>0) {
                        
                        elBtn.attr('href',btnHref).text(title).removeClass('loading');
                        
                        if ( wrapper.hasClass('replace') ) {
                            wrapper.find('>.woocommerce').replaceWith(data2);
                        } else {
                            el.append(data);
                            elPag.replaceWith(pagin);
                        }
                        
                        if ( parseFloat(maxPag) == parseFloat(curPag) ) {
                            elBtn.addClass('nomore').attr('href','javascript:void(0)').text(nomore);
                        }
                    }
                    
                    $(document.body).trigger('anarkali_quick_shop');
                    $('body').trigger('anarkali_quick_init');
                    $(document.body).trigger('anarkali_variations_init');
                    $(document.body).trigger('productHover');
                }
            });
        });
    }
    
    /* load more with pagination */
    if ($.support.pjax && $('.shop-loop-wrapper .anarkali-woocommerce-pagination.default').length>0) {
        
        var links_pagination = '.shop-loop-wrapper .anarkali-woocommerce-pagination.default a';
        $(document).on('click', links_pagination, function(event) {
            
            var $this   = $(this);
            var wapper  = $this.closest('.shop-loop-wrapper');
            var id      = wapper.data('id');
            
            wapper.addClass('loading');
            
            $.pjax.click(event, {
                container      : '.shop-loop-wrapper[data-id="'+id+'"]',
                push           : false,
                timeout        : 50000,
                maxCacheLength : false,
                renderCallback : function(context, html, afterRender) {
                    
                    $(html).find('.product-category').remove();
                    var data = $(html).find('.shop-loop-wrapper[data-id="'+id+'"]');
                    
                    wapper.replaceWith(data).removeClass('loading');
                    
                    $(document.body).trigger('anarkali_quick_shop');
                    $('body').trigger('anarkali_quick_init');
                    $(document.body).trigger('anarkali_variations_init');
                    $(document.body).trigger('productHover');
                }
            });
        });
    }
    
    /* load more with tab-menu and pagination */
    if ($.support.pjax && $('.anarkali-tab-wrapper').length>0) {
        
        var links_tabs_two = '.anarkali-tab-wrapper .anarkali-tab-menu:not(.custom-links) a,.anarkali-tab-wrapper .anarkali-woocommerce-pagination a';
        $(document).on('click', links_tabs_two, function(event) {
            
            var $this   = $(this);
            var wapper  = $this.closest('.anarkali-tab-wrapper');
            var id      = wapper.data('id');
            var el      = wapper.find('.anarkali-tab-products');
            var name    = $this.parents('.anarkali-woocommerce-pagination').length ? $this.parents('.anarkali-woocommerce-pagination').data('name') : $this.data('name');
            var swiperHeight = el.find('.anarkali-swiper-container').data('height');
            
            el.addClass('loading');
            wapper.find('.anarkali-tab-header .active').removeClass('active');
            $this.addClass('active');
            
            $.pjax.click(event, {
                container      : '.anarkali-tab-wrapper[data-id="'+id+'"]',
                push           : false,
                renderCallback : function(context, html, afterRender) {
                    var data,product,pagin;
                    $(html).find('.product-category').remove();
                    if ( $(html).find('.anarkali-tab-wrapper[data-id="'+id+'"]').length>0 ) {
                        data    = $(html).find('.anarkali-tab-wrapper[data-id="'+id+'"] .anarkali-products');
                        product = $(html).find('.anarkali-tab-wrapper[data-id="'+id+'"] .anarkali-loop-product');
                        pagin   = $(html).find('.anarkali-tab-wrapper[data-id="'+id+'"] .anarkali-woocommerce-pagination');
                    } else {
                        data    = $(html).find('.anarkali-products');
                        product = $(html).find('.anarkali-loop-product');
                        pagin   = $(html).find('.anarkali-woocommerce-pagination');
                    }
                    
                    if (product.length>0) {
                        
                        if ( wapper.hasClass('layout-slider') ) {
                            var options       = wapper.data('swiper-options');
                            var swiperWrapper = '<div class="anarkali-swiper-wrapper swiper-wrapper"></div>';
                            var sliderNav     = '<div class="anarkali-swiper-prev slide-prev-'+id+'"></div><div class="anarkali-swiper-next slide-next-'+id+'"></div>';
                            $(data).addClass('anarkali-swiper-container swiper-container').find('.anarkali-loop-product').addClass('swiper-slide').wrapAll(swiperWrapper);
                            
                            el.html(data).removeClass('loading');
                            if (wapper.hasClass('has-pagination')) {
                                el.append(pagin);
                            }
                            
                            $(sliderNav).appendTo('.anarkali-tab-wrapper[data-id="'+id+'"] .anarkali-swiper-container');
                            options.autoHeight = false;
                            const mySlider     = new NTSwiper('.anarkali-tab-wrapper[data-id="'+id+'"] .anarkali-swiper-container',options);
                            var swiperHeight   = wapper.find('.anarkali-swiper-wrapper').height();
                            wapper.find('.anarkali-swiper-'+id).attr('data-height',swiperHeight);
                            
                        } else {
                            
                            el.html(data).removeClass('loading');
                            wapper.find('.anarkali-woocommerce-pagination').remove();
                            if (wapper.hasClass('has-pagination')) {
                                el.append(pagin);
                            }
                        }
                        wapper.find('.anarkali-tab-header a[data-name="'+name+'"]').addClass('active').siblings().removeClass('active');
                        
                        $(document.body).trigger('anarkali_quick_shop');
                        $('body').trigger('anarkali_quick_init');
                        $(document.body).trigger('anarkali_variations_init');
                    } else {
                        el.removeClass('loading');
                    }
                }
            });
        });
        
        
        /* mobile tab menu filter trigger */
        
        $(document).on('click', '.fast-filters-trigger', function(event) {
            event.preventDefault();
            var $this  = $(this);
            
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                $this.next().removeClass('active');
            } else {
                $this.addClass('active');
                $this.next().addClass('active');
            }
        });
    }
    
    /* load more with tab-menu and pagination */
    
    if ($.support.pjax && $('.anarkali-tab-taxonomy').length>0) {
        
        var links_tax = '.anarkali-tab-taxonomy .anarkali-woocommerce-pagination a,.anarkali-tab-taxonomy .anarkali-taxonomy-list a';
        $(document.body).on('click', links_tax, function(event) {
            
            var $this     = $(this);
            var wapper    = $this.closest('.anarkali-tab-taxonomy');
            var id        = wapper.data('id');
            var el        = wapper.find('.products-col-wrapper');
            var height    = el.find('.anarkali-swiper-container').data('height');
            var taxId     = $this.data('tax');
            var pageHref  = $this.attr('href');
            var current   = parseFloat($this.parents('.anarkali-woocommerce-pagination').data('current'));
            var pageRegex = /\/page\/(\d+)/;
            var match     = pageHref.match(pageRegex);
            
			$('html, body').stop().animate({
				scrollTop: $(el).offset().top - 100
			}, 800);
			
            if ( match && parseInt(match[1]) == 1 ) {
                event.preventDefault();
                el.find('.anarkali-swiper-container,.anarkali-woocommerce-pagination').removeClass('active');
                $this.parents('.slider-wrapper').find('.anarkali-swiper-container:first-child').addClass('active');
                $this.parents('.slider-wrapper').find('.anarkali-swiper-container.active').next('.anarkali-woocommerce-pagination').addClass('active');
                return false;
            } else {
                if ( $this.is('a.page-numbers') && el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').length>0 ) {
                    event.preventDefault();
                    el.find('.anarkali-swiper-container,.anarkali-woocommerce-pagination').removeClass('active');
                    el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').addClass('active');
                    el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').next('.anarkali-woocommerce-pagination').addClass('active');
                    return false;
                }
            }
            
            if ( $this.is('.taxonomy-link') && el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').length>0 ) {
                event.preventDefault();
                $this.parent().siblings().removeClass('active');
                $this.parent().addClass('active');
                el.find('.active').removeClass('active');
                el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').addClass('active');
                el.find('.anarkali-swiper-container[data-href="'+pageHref+'"]').next('.anarkali-woocommerce-pagination').addClass('active');
                return false;
            }
            
            el.addClass('loading');
            wapper.find('.anarkali-taxonomy-list .active').removeClass('active');
            $this.parent().addClass('active');
            
            $.pjax.click(event, {
                container      : '.anarkali-tab-taxonomy[data-id="'+id+'"]',
                push           : false,
                renderCallback : function(context, html, afterRender) {
                    
                    var data,products,pagin;
                    
                    $(html).find('.product-category').remove();
                    
                    products = $(html).find('.anarkali-products');
                    pagin    = $(html).find('.anarkali-woocommerce-pagination');
                    var options    = wapper.data('swiper-options');
					
                    if ( $this.is('a.page-numbers') ) {
                        
                        $(products).find('.anarkali-loop-product').addClass('swiper-slide').wrapAll('<div class="anarkali-swiper-wrapper swiper-wrapper"></div>');
                        $(products).removeClass('anarkali-products products row').addClass('anarkali-swiper-container swiper-container nav-vertical-centered loaded active new-added');
                        $(products).attr('data-href',pageHref).attr('data-tax',taxId).wrap('<div class="slider-wrapper" data-tax="'+taxId+'"></div>');
                        products.addClass('loaded active new-added').appendTo($this.parents('.slider-wrapper'));
                        
                        pagin.addClass('loaded active new-added').appendTo($this.parents('.slider-wrapper'));
                        
                        el.removeClass('loading');
                        
                        
                        const mySlider = new NTSwiper('.anarkali-tab-taxonomy[data-id="'+id+'"] .anarkali-swiper-container.new-added',options);
                        
                        el.find('.anarkali-swiper-container:not(.new-added),.anarkali-woocommerce-pagination:not(.new-added)').removeClass('active');
                        el.find('.new-added').removeClass('new-added');
                        
                        $(document.body).trigger('anarkali_quick_shop');
                        $('body').trigger('anarkali_quick_init');
                        $(document.body).trigger('anarkali_variations_init');
                        
                    } else {
                        
                        $('<div class="slider-wrapper" data-tax="'+taxId+'"></div>').appendTo(el);
                        $(products).find('.anarkali-loop-product').addClass('swiper-slide').wrapAll('<div class="anarkali-swiper-wrapper swiper-wrapper"></div>');
                        $(products).removeClass('anarkali-products products row').addClass('anarkali-swiper-container swiper-container nav-vertical-centered loaded active new-added');
                        $(products).attr('data-href',$this.attr('href')).appendTo('.slider-wrapper[data-tax="'+taxId+'"]');
                        products.addClass('loaded active new-added');
                        
                        pagin.addClass('loaded active new-added').appendTo('.slider-wrapper[data-tax="'+taxId+'"]');
                        
                        el.removeClass('loading');
                        
                        const mySlider = new NTSwiper('.anarkali-tab-taxonomy[data-id="'+id+'"] .anarkali-swiper-container.new-added',options);
                        
                        el.find('.anarkali-swiper-container:not(.new-added),.anarkali-woocommerce-pagination:not(.new-added)').removeClass('active');
                        el.find('.new-added').removeClass('new-added');
                        
                        $(document.body).trigger('anarkali_quick_shop');
                        $('body').trigger('anarkali_quick_init');
                        $(document.body).trigger('anarkali_variations_init');
                    }
                }
            });
        });
        
        /* mobile tab menu filter trigger */
        
        $(document).on('click', '.fast-filters-trigger', function(event) {
            event.preventDefault();
            var $this  = $(this);
            
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                $this.next().removeClass('active');
            } else {
                $this.addClass('active');
                $this.next().addClass('active');
            }
        });
    }
    /*
    $('.layout-slider .taxonomy-item').hover(
        function() {
            var $this       = $(this);
            var id          = $this.data('id');
            var wrapper     = $this.parents('.layout-slider');
            var desc        = wrapper.find('.taxonomy-details[data-id="'+id+'"]');
            var dwidth      = desc.width();
            var dheight     = desc.height();
            var width       = $this.width();
            var height      = $this.height();
            var pos         = $this.offset();
            var posTop      = pos.top;
            var posLeft     = pos.left;
            desc.addClass('active');
            desc.css({
                "top"  : (posTop+height) -5,
                "left" : (posLeft+width) - (dwidth+35) //(posLeft + width) - (width / 2)
            });
        },
        function() {
            var $this       = $(this);
            var id          = $this.data('id');
            var wrapper     = $this.parents('.layout-slider');
            var desc        = wrapper.find('.taxonomy-details[data-id="'+id+'"]');
            desc.removeClass('active');
        }
    );
    */

});

})(window, document, jQuery);
