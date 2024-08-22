/*-----------------------------------------------------------------------------------

    Theme Name: Anarkali
    Description: WordPress Theme
    Author: Ninetheme
    Author URI: https://ninetheme.com/
    Version: 1.0

-----------------------------------------------------------------------------------*/

(function(window, document, $) {

    "use strict";

    $.fn.sameSize = function( width, max ) {
        var prop = width ? 'width' : 'height',
        size = Math.max.apply( null, $.map( this, function( elem ) {
            return $( elem )[ prop ]();
        })),
        max = size < max ? size : max;
        return this[ prop ]( max || size );
    };

    function anarkaliSlider(el) {

        var self         = $( el ),
            myPSlider    = self,
            myData       = self.data( 'slider-settings' ),
            myInvisible  = self.find( '.elementor-invisible' ),
            mySlide      = self.find( '.elementor-top-section' ),
            myWrapper    = self.find( '.swiper-wrapper.anarkali-template-slider-wrapper' ),
            myPage       = self.find( '[data-elementor-type="section"]' ),
            myElSecId    = myPage.data('data-elementor-id'),
            myPageClass  = myPage.attr( 'class' ),
            myParallaxSlider,
            myVideoMuteYoutube,
            myVideoMuteVimeo,
            myVideoHtml,
            windowWidth  = window.innerWidth;

        var checkVideo = function() {
            if ( self.hasClass('video-unmute') ) {
                myVideoMuteYoutube = 'mute=0';
                myVideoMuteVimeo   = 'muted=0';
                myVideoHtml        = 'muted';
            } else {
                myVideoMuteYoutube = 'mute=1';
                myVideoMuteVimeo   = 'muted=1';
            }

            mySlide.each( function () {
                var $this = $( this );
                $this.addClass( 'swiper-slide onepage-slide-item' ).prependTo( myWrapper );

                $this.find( 'div[data-settings]').each(function () {
                    var $thiss = $( this );
                    var $anim = $thiss.data('settings');

                    if ( typeof $anim._animation != 'undefined' ) {
                       $thiss.removeClass( 'elementor-invisible' );
                    }
                });

                var htmlVideo,
                    video          = $this.data('anarkali-bg-video'),
                    provider       = video ? video.provider : '',
                    videoId        = video ? video.video_id : '',
                    videoContainer = $this.find('.elementor-background-video-container'),
                    videoEl        = $this.find('.elementor-widget-video'),
                    videoElCont    = videoEl.find('.elementor-video'),
                    vSettings      = videoEl.data('settings'),
                    videoType      = vSettings ? vSettings.video_type : '',
                    videoUrl       = vSettings ? vSettings.youtube_url : '';

                if ( typeof videoEl != 'undefined' ) {
                    if ( 'vimeo' == videoType ) {
                        var videoIDParts = videoUrl.match(/^(?:https?:\/\/)?(?:www|player\.)?(?:vimeo\.com\/)?(?:video\/|external\/)?(\d+)([^.?&#"'>]?)/);
                        htmlVideo = '<iframe class="elementor-background-embed-video vimeo-video" title="vimeo Video Player" src="https://player.vimeo.com/video/'+videoIDParts[1]+'?autoplay=1&loop=1&autopause=0&'+self.myVideoMuteVimeo+'" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" data-ready="true" width="640" height="360"></iframe>';
                    }
                    if ( 'youtube' == videoType ) {
                        var videoIDParts = videoUrl.match(/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?vi?=|(?:embed|v|vi|user)\/))([^?&"'>]+)/);
                            htmlVideo    = '<iframe class="elementor-background-embed-video youtube-video" title="youtube Video Player" src="https://www.youtube.com/embed/'+videoIDParts[1]+'?controls=0&rel=0&autoplay=1&playsinline=1&enablejsapi=1&version=3&playerapiid=ytplayer&'+self.myVideoMuteYoutube+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" width="640" height="360"></iframe>';
                    }
                    if ( 'hosted' == videoType ) {
                        videoEl.find('video:first-child').remove();
                        htmlVideo = '<video class="elementor-background-video-hosted elementor-html5-video video-hosted" autoplay '+self.myVideoHtml+' playsinline loop src="'+video.video_id+'"></video>';
                    }
                    videoElCont.prepend( htmlVideo );
                }

                if ( typeof videoId != 'undefined') {
                    videoContainer.find('div.elementor-background-video-embed').remove();
                    if ( 'vimeo' == provider ) {
                        htmlVideo = '<iframe class="elementor-background-embed-video vimeo-video" title="vimeo Video Player" src="https://player.vimeo.com/video/'+video.video_id+'?autoplay=1&loop=1&autopause=0&'+self.myVideoMuteVimeo+'" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" data-ready="true" width="640" height="360"></iframe>';
                    }
                    if ( 'youtube' == provider ) {
                        htmlVideo = '<iframe class="elementor-background-embed-video youtube-video" title="youtube Video Player" src="https://www.youtube.com/embed/'+video.video_id+'?controls=0&rel=0&autoplay=1&playsinline=1&enablejsapi=1&version=3&playerapiid=ytplayer&'+self.myVideoMuteYoutube+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" width="640" height="360"></iframe>';
                    }
                    if ( 'hosted' == provider ) {
                        videoContainer.find('video:first-child').remove();
                        htmlVideo = '<video class="elementor-background-video-hosted elementor-html5-video video-hosted" autoplay '+self.myVideoHtml+' playsinline loop src="'+video.video_id+'"></video>';
                    }
                    videoContainer.prepend( htmlVideo );
                }
            });
        };

        var createSlider = function() {

            self.addClass( myPageClass );

            checkVideo();

            myPage.remove();

            myData["on"] = {
                init: function (swiper) {

                    setTimeout(function(){
                        self.find( '.swiper-slide:not(:first-child)' ).each(function () {

                            var iframe = $( this ).find('iframe');
                            var vid = $( this ).find('.video-hosted');
                            if ( iframe.size() && iframe.hasClass('youtube-video') ) {
                                iframe[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                            }
                            if ( iframe.size() && iframe.hasClass('vimeo-video') ) {
                                iframe[0].contentWindow.postMessage('{"method":"pause"}', '*');
                            }
                            if ( vid.size() ) {
                                vid.get(0).pause();
                            }
                        });
                    }, 2000);
                },
                transitionEnd : function ( swiper ) {
                    var  active = swiper.realIndex;
                    $( '.swiper-slide:not([data-swiper-slide-index="'+active+'"])' ).find( 'div[data-settings]' ).each(function () {
                        var $this    = $( this ),
                            animData = $this.data('settings'),
                            anim     = animData._animation;
                        if ( 'undefined' === typeof animData._animation ) {
                            anim = animData.animation;
                        }

                        $this.addClass( 'elementor-invisible' ).removeClass( 'animated ' + anim );

                    });
                },
                slideChange : function ( swiper ) {
                    var  active = swiper.realIndex;

                    $( '.swiper-slide[data-swiper-slide-index="'+active+'"]' ).find( 'div[data-settings]' ).each(function () {
                        var $this    = $( this ),
                            animData = $this.data( 'settings' ),
                            anim     = animData._animation,
                            delay    = animData._animation_delay;
                        if ( 'undefined' === typeof animData._animation ) {
                            anim = animData.animation;
                        }
                        setTimeout(function() {
                            $this.addClass( 'animated ' + anim ).removeClass( 'elementor-invisible' );
                        }, delay, $this);

                    });

                    $( '.swiper-slide:not(.swiper-slide-active)' ).each(function () {

                        var iframe = $( this ).find('iframe');
                        var vid    = $( this ).find('.video-hosted');
                        if ( iframe.size() && iframe.hasClass('youtube-video') ) {
                            iframe[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                        }
                        if ( iframe.size() && iframe.hasClass('vimeo-video') ) {
                            iframe[0].contentWindow.postMessage('{"method":"pause"}', '*');
                        }
                        if ( vid.size() ) {
                            vid.get(0).pause();
                        }

                    });

                    $( '.swiper-slide-active' ).each(function () {

                        var iframe2 = $( this ).find('iframe');
                        var vid     = $( this ).find('.video-hosted');
                        if ( iframe2.size() && iframe2.hasClass('youtube-video') ) {
                            iframe2[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                        }
                        if ( iframe2.size() && iframe2.hasClass('vimeo-video') ) {
                            iframe2[0].contentWindow.postMessage('{"method":"play"}', '*');
                        }
                        if ( vid.size() ) {
                            vid.get(0).play();
                        }
                    });

                },
                resize : function (swiper) {
                    swiper.update();
                }
            };
            myParallaxSlider = new NTSwiper( el, myData );

        };

        createSlider();
    }

    var doc         = $(document),
        win         = $(window),
        body        = $('body'),
        winw        = $(window).outerWidth(),
        megasubmenu = $('.elementor-top-section .anarkali-header-top-menu-area li.menu-item-mega-parent > ul.submenu');

    function bodyResize(winw) {
        if ( winw <= 1024 ) {
            body.removeClass('nt-desktop').addClass('nt-mobile');
        } else {
            body.removeClass('nt-mobile').addClass('nt-desktop');
        }
    }

    function sideMainHeader() {
        $('.anarkali-main-sidebar-header .dropdown-btn').on('click',function(e){
            e.preventDefault();
            var $this    = $(this),
                $parent  = $this.parent().parent(),
                $submenu = $this.parent().next();

            if ( $parent.hasClass('anarkali-active') ) {
                $parent.removeClass('anarkali-active');
                $submenu.slideUp();
            } else {
                $parent.siblings('.anarkali-active').removeClass('anarkali-active').find('.submenu').slideUp();
                $parent.addClass('anarkali-active');
                $submenu.slideDown();
            }
        });

        $('.anarkali-mobile-menu-trigger').on('click',function(e){
            e.preventDefault();
            var $this = $(this);

            if ( $this.hasClass('anarkali-active') ) {
                $('html,body').removeClass('anarkali-overlay-open sidebar-menu-active');
                $this.removeClass('anarkali-active');
                $('.anarkali-main-sidebar-header').removeClass('anarkali-active');
            } else {
                $('html,body').addClass('anarkali-overlay-open sidebar-menu-active');
                $this.addClass('anarkali-active');
                $('.anarkali-main-sidebar-header').addClass('anarkali-active');
            }
        });

        $('.anarkali-mobile-menu-close-trigger').on('click',function(e){
            $('html,body').removeClass('anarkali-overlay-open sidebar-menu-active');
            $('.anarkali-mobile-menu-trigger,.anarkali-main-sidebar-header').removeClass('anarkali-active');
        });
    }

    function topMainHeader() {
        megasubmenu.each( function() {
            var cont     = $( this ),
                wrap     = cont.closest( '.navigation' ),
                wrapoff  = wrap.offset(),
                wrapleft = wrapoff.left,
                parentw  = cont.closest( '.elementor-top-section' ).outerWidth();

            if ( winw > 1024 ) {
                cont.css({
                    'left':'-'+ ( wrapleft ) +'px',
                    'width': parentw+'px',
                });
            } else {
                cont.removeAttr('style');
            }
        });
    }

    function topMainHeaderResize(winw) {
        if ( winw <= 1024 ) {
            megasubmenu.each( function() {
                var cont = $( this );
                cont.removeAttr('style');
            });
        } else {
            megasubmenu.each( function() {
                var cont     = $( this ),
                    wrap     = cont.closest( '.navigation' ),
                    wrapoff  = wrap.offset(),
                    wrapleft = wrapoff.left,
                    parentw  = cont.closest('.elementor-top-section').outerWidth();
                cont.css({
                    'left':'-'+ ( wrapleft ) +'px',
                    'width': parentw+'px',
                });
            });
        }
    }

    function mobileSlidingMenu() {

        $('.anarkali-header-mobile-slide-menu').slidingMenu({
            className : "anarkali-header-mobile-slide-menu",
            transitionDuration : 250,
            dataJSON : false,
            initHref : false,
            backLabel: 'Back'
        });

        $('.anarkali-header-lang-slide-menu').slidingMenu({
            className : "anarkali-header-lang-slide-menu",
            transitionDuration : 250,
            dataJSON : false,
            initHref : false,
            backLabel: 'Back'
        });

        $('.sliding-menu .menu-item-has-children>.sliding-menu__nav').each( function() {
            var $this = $( this ),
                id = $this.data( 'id' ),
                parentTitle = $this.text(),
                parents = $this.parents( '.sliding-menu' ),
                subBack = parents.find( '.sliding-menu__panel[data-id="'+id+'"] .sliding-menu__back' );
            subBack.text(parentTitle);
        });

        $('.sliding-menu__panel:not(.shortcode_panel)').each( function() {
            $( '<li class="sliding-menu-inner"><ul></ul></li>' ).appendTo($(this ));
        });
        $('.sliding-menu__panel .menu-item').each( function() {
            $( this ).appendTo($( this ).parents('.sliding-menu__panel').find('.sliding-menu-inner>ul'));
        });
        $('.sliding-menu').each( function() {
            var height = $( this ).find('.sliding-menu__panel-root').outerHeight();
            $( this ).css('height',height);
        });
    }

    $('.anarkali-main-sidebar-header .top-action-btn:not([data-name="search-popup"],[data-account-action="account"],.no-panel)').on('click',function(e){
        var $this = $(this),
            $name = $this.data('name');

        $('html,body').addClass('anarkali-overlay-open');
        $('.top-action-btn:not([data-name="'+$name+'"],.panel-header-btn').removeClass('active');
        $('.anarkali-side-panel .panel-content-item:not([data-name="'+$name+'"]), .panel-header-btn:not([data-name="'+$name+'"])').removeClass('active');
        $('.anarkali-side-panel,.anarkali-side-panel [data-name="'+$name+'"], .panel-header-btn[data-name="'+$name+'"]').addClass('active');
    });

    $('.anarkali-header-mobile-sidebar .top-action-btn:not(.no-panel), .anarkali-header-mobile-top-actions .top-action-btn:not(.no-panel)').on('click',function(e){
        var $this = $(this),
            $name = $this.data('name');

        $('html,body').addClass('anarkali-overlay-open');
        $('.top-action-btn:not([data-name="'+$name+'"],.panel-header-btn').removeClass('active');
        $('.anarkali-header-mobile-content .panel-content-item:not([data-name="'+$name+'"]),.anarkali-header-mobile-content .panel-header-btn:not([data-name="'+$name+'"])').removeClass('active');
        $('.anarkali-header-mobile-content,.anarkali-header-mobile-content [data-name="'+$name+'"],.anarkali-header-mobile-content .panel-header-btn[data-name="'+$name+'"]').addClass('active');
    });

    $('.anarkali-header-default .header-top-buttons .top-action-btn:not([data-name="search-popup"],[data-account-action="account"],.no-panel), .anarkali-header-mobile-top-actions .top-action-btn:not([data-name="search-popup"],[data-account-action="account"],.no-panel)').on('click',function(e){
        var $this = $(this),
            $name = $this.data('name');

        $('html,body').addClass('anarkali-overlay-open');
        $('.top-action-btn:not([data-name="'+$name+'"],.panel-header-btn').removeClass('active');
        $('.anarkali-side-panel .panel-content-item:not([data-name="'+$name+'"]),.panel-header-btn:not([data-name="'+$name+'"])').removeClass('active');
        $('.anarkali-side-panel,.anarkali-side-panel [data-name="'+$name+'"],.panel-header-btn[data-name="'+$name+'"]').addClass('active');
    });

    $('[data-name="search-popup"], .popup-search, a[href="#anarkali-popup-search"],.anarkali-mobile-search-trigger').on('click',function(e){
        $('html,body').addClass('anarkali-overlay-open');
        $('.anarkali-popup-search-panel').addClass('active');
        $('.top-action-btn:not([data-name="search"]),.panel-header-btn').removeClass('active');
        $('.anarkali-side-panel .panel-content-item,.panel-header-btn').removeClass('active');
    });

    $('.anarkali-bottom-mobile-nav [data-name="search-cats"]').on('click',function(e){
        $('html,body').addClass('anarkali-overlay-open');
        $('.anarkali-header-mobile').addClass('active');
        $('.anarkali-header-mobile .action-content:not([data-target-name="search-cats"])').removeClass('active');
        $('.anarkali-header-mobile .action-content[data-target-name="search-cats"]').addClass('active');
        $('.anarkali-header-mobile .top-action-btn').removeClass('active');
        $('.anarkali-header-mobile [data-name="search-cats"]').addClass('active');
    });

    $('[data-account-action="account"]').on('click',function(e){
        $('html,body').addClass('anarkali-overlay-open');
        $('.account-area-form-wrapper .active').removeClass('active');
        $('.anarkali-header-mobile, .anarkali-header-mobile .account-area, .anarkali-header-mobile-content .login-form-content').addClass('active');
        $('.top-action-btn[data-name="account"]').trigger('click');
    });

    $('.cart-bottom-popup-trigger').on('click',function(e){
        $('.top-action-btn[data-name="cart"]').trigger('click');
    });

    $('.anarkali-open-popup').on('click',function(e){
        $('html,body').removeClass('anarkali-overlay-open');
        $('.anarkali-header-mobile, .anarkali-side-panel .panel-content-item,.panel-header-btn').removeClass('active');
    });

    $('.has-default-header-type-trans .anarkali-header-default .navigation.primary-menu').hover(
        function(){
            $('.anarkali-header-default').addClass('trans-hover');
        },
        function(){
            $('.anarkali-header-default').removeClass('trans-hover');
        }
    );

    function mobileHeaderActions() {
        $('.top-action-btn[data-name]').each( function(){
            var $this = $(this),
                $name = $this.data('name');

            $this.on('click',function(e){
                var $thiss = $(this);
                $('.top-action-btn:not([data-name="'+$name+'"]').removeClass('active');

                $('[data-target-name]').removeClass('active');
                if ( $thiss.hasClass('active') ) {
                    $thiss.removeClass('active');
                    $('.anarkali-header-slide-menu,.search-area-top').addClass('active');
                    $('[data-target-name="'+$name+'"]').removeClass('active');
                } else {
                    $thiss.addClass('active');
                    $('.anarkali-header-slide-menu,.search-area-top').removeClass('active');
                    $('[data-target-name="'+$name+'"]').addClass('active');
                }
                if ( !($('[data-target-name="'+$name+'"]').length) ) {
                    $('.search-area-top,.anarkali-header-slide-menu').addClass('active');
                }
                if ( $('.anarkali-header-mobile-content div[data-name="checkout"]').hasClass('active') ) {
                    $('.anarkali-header-mobile-content div[data-name="checkout"]').removeClass('active');
                }
                e.preventDefault();
            });
        });

        $('.mobile-toggle').on('click',function(e){

            $('.anarkali-header-mobile-content .active, .sidebar-top-action .active, .anarkali-side-panel').removeClass('active');
            $('.search-area-top').addClass('active');
            $('.account-area .login-form-content').addClass('active');
            if ( $('.anarkali-header-mobile').hasClass('active') ) {
                $('html,body').removeClass('anarkali-overlay-open');
                $('.anarkali-header-mobile').removeClass('active');
            } else {
                $('html,body').addClass('anarkali-overlay-open');
                $('.anarkali-header-mobile,.menu-area').addClass('active');
            }
            e.preventDefault();
        });

        $('.account-area .signin-title').on('click',function(){
            $('.form-action-btn').removeClass('active');
            $(this).addClass('active');
            $('.account-area .register-form-content').removeClass('active');
            $('.account-area .login-form-content').addClass('active');
        });
        $('.account-area .register-title').on('click',function(){
            $('.form-action-btn').removeClass('active');
            $(this).addClass('active');
            $('.account-area .login-form-content').removeClass('active');
            $('.account-area .register-form-content').addClass('active');
        });
        if ( $('.account-area.action-content .account-area-social-form-wrapper').length ) {
            $('.account-area-form-wrapper').css('min-height', $('.account-area-form-wrapper .woocommerce-form-login').height()+50);
        }
    }
    $(document.body).on('click touch', '.anarkali-panel-close,.anarkali-header-overlay', function(event) {
        $('.anarkali-main-sidebar-header, .anarkali-mobile-menu-trigger').removeClass('anarkali-active');
        $('html,body').removeClass('anarkali-overlay-open');
        $('.anarkali-header-mobile, .anarkali-side-panel, .anarkali-popup-search-panel, .nt-sidebar').removeClass('active');
        $('.anarkali-header-mobile-content .active, .anarkali-header-mobile-sidebar-bottom, .sidebar-top-action .active').removeClass('active');
        $('.anarkali-header-slide-menu').addClass('active');
        $('.anarkali-shop-popup-notices').removeClass('active');
        $('.anarkali-shop-popup-notices').removeClass('anarkali-notices-has-error');
        $('.anarkali-quickview-sidebar').removeClass('active');
    });

    $('.panel-header-btn').on('click',function(){
        var $this = $(this),
            $name = $this.data('name');
        if ( !$this.hasClass( 'active' ) ) {
            $('.panel-header-btn,.panel-content-item').removeClass('active');
            $this.addClass('active');
            $('.panel-content-item[data-name="'+$name+'"]').addClass('active');
        }
    });

    $(".anarkali-header-top-menu-area .menu-item-has-children").hover(
        function(){
            $(this).addClass('on-hover');
        },
        function(){
            $(this).removeClass('on-hover');
        }
    );

    function mobileHeaderResize(winw) {
        if ( winw >= 490 ) {
            if ( $('.top-action-btn.share').hasClass('active') ) {
                $('.top-action-btn.share,.anarkali-header-mobile-content').removeClass('active');
            }
        }
        if ( winw > 992 ) {
            $('html,body').removeClass('anarkali-overlay-open');
            $('.anarkali-header-mobile').removeClass('active');
            $('.anarkali-popup-search-panel').removeClass('active');
        }
    }

    /*=============================================
    Mobile Menu
    =============================================*/
    //SubMenu Dropdown Toggle
    if ( $('.header-widget').length ) {
        $('.header-widget.header-style-two').parents('.elementor-top-section').addClass('big-index has-header-style-two');
    }

    // set height for header spacer
    function headerSpacerHeight(winw) {
        if ( $('.anarkali-header-default').length ) {
            var height;
            if ( winw > 992 ) {
                height = $('.anarkali-header-default').height();
            } else {
                height = $('.anarkali-header-mobile-top').height();
            }
            $('.header-spacer').css('height', height );
        }
    }

    function anarkaliHeaderCatMenu() {
        $('.anarkali-vertical-menu-wrapper').each(function () {
            const $this = $(this);
            const menu = $this.find('.anarkali-vertical-menu');
            const toggle = $this.find('.anarkali-vertical-menu-toggle');
            const more = $this.find('.anarkali-more-item-open');
            const morecats = $this.find('.anarkali-more-categories');
            /*=============================================
            Toggle Active
            =============================================*/
            $(toggle).on('click', function () {
                $(menu).slideToggle(500);
                return false;
            });
            $(more).slideUp();
            $(morecats).on('click', function () {
                $(this).toggleClass('show');
                $(more).slideToggle();
            });
        });
    }

    /*=============================================
    Menu sticky & Scroll to top
    =============================================*/
    function scrollToTopBtnClick() {
        if ( $(".scroll-to-target").length ) {
            $( ".scroll-to-target" ).on("click", function () {
                var target = $(this).attr("data-target");
                // animate
                $("html, body").animate({scrollTop: $(target).offset().top},1000);
                return false;
            });
        }
    }

    if ( $(".scroll-to-target").length ) {
        $( ".scroll-to-target" ).on("click", function () {
            var target = $(this).attr("data-target");
            // animate
            $("html, body").animate({scrollTop: $(target).offset().top},1000);
            return false;
        });
    }

    /*=============================================
    Menu sticky & Scroll to top
    =============================================*/
    function scrollToTopBtnHide() {
        var offset = 100;
        if ( $(".scroll-to-target").length ) {
            if ( $(window).scrollTop() > offset ) {
                $(".scroll-to-top").fadeIn(500);
            } else if ( $(".scroll-to-top").scrollTop() <= offset ) {
                $(".scroll-to-top").fadeOut(500);
            }
        }
    }

    /*=============================================
    Data Background
    =============================================*/
    $("[data-background]").each(function () {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });

    /* anarkaliSwiperSlider */
    function anarkaliSwiperSlider() {
        $('.anarkali-swiper-slider').each(function () {
            var container  = $(this);
            const options  = $(this).data('swiper-options');
            const mySlider = new NTSwiper(this, options );
            $(this).hover(function() {
                if ( options.autoplay == true ) {
                    mySlider.autoplay.stop();
                }
            }, function() {
                if ( options.autoplay == true ) {
                    mySlider.autoplay.start();
                }
            });
            mySlider.on('transitionEnd', function () {
                var animIn = $(container).find('.swiper-slide').data('anim-in');
                var active = $(container).find('.swiper-slide-active');
                var inactive = $(container).find('.swiper-slide:not(.swiper-slide-active)');

                if( typeof animIn != 'undefined' ) {
                    inactive.find('.has-animation').each(function(e){
                        $(this).removeClass('animated '+animIn);
                    });
                    active.find('.has-animation').each(function(e){
                        $(this).addClass('animated '+animIn);
                    });
                }
            });
        });
    }

    /* anarkaliSlickSlider */
    function anarkaliSlickSlider() {
        $('.anarkali-slick-slider').each(function () {
            $(this).not('.slick-initialized').slick();
        });
    }

    /* anarkaliSimpleParallax */
    function anarkaliSimpleParallax() {
        $('.thumparallax').each(function () {
            const options = JSON.parse(this.dataset.parallaxOptions);
            let mySlider = new simpleParallax($(this), options);
        });
    }

    /* anarkaliUiTooltip */
    function anarkaliUiToolTip() {
        $('[data-tooltip-options]').each(function () {
            const options = JSON.parse(this.dataset.tooltipOptions);
            $(this).tooltip(options);
        });
    }

    function anarkaliLightbox() {
        var myLightboxes = $('[data-anarkali-lightbox]');
        if (myLightboxes.length) {
            myLightboxes.each(function(i, el) {
                var myLightbox = $(el);
                var myData = myLightbox.data('anarkaliLightbox');
                var myOptions = {};
                if (!myData || !myData.type) {
                    return true; // next iteration
                }
                if (myData.type === 'gallery') {
                    if (!myData.selector) {
                        return true; // next iteration
                    }
                    myOptions = {
                        delegate: myData.selector,
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    };
                }
                if (myData.type === 'image') {
                    myOptions = {
                        type: 'image'
                    };
                }
                if (myData.type === 'iframe') {
                    myOptions = {
                        type: 'iframe'
                    };
                }
                if (myData.type === 'inline') {
                    myOptions = {
                        type: 'inline',
                    };
                }
                if (myData.type === 'modal') {
                    myOptions = {
                        type: 'inline',
                        modal: false
                    };
                }
                if (myData.type === 'ajax') {
                    myOptions = {
                        type: 'ajax',
                        overflowY: 'scroll'
                    };
                }
                myLightbox.magnificPopup(myOptions);
            });
        }
    }

    function anarkaliUITooltip() {
        var myTooltips = $('[data-anarkali-ui-tooltip]');
        if (myTooltips.length) {
            myTooltips.each(function(i, el) {
                var myTooltip = $(el);
                var myData = myTooltip.data('anarkaliUiTooltip');
                if (!myData) {
                    return true; // next iteration
                }
                var myPosition = {};
                var myClasses = {
                    'ui-tooltip': 'ui-corner-all ui-widget-shadow'
                };
                var myClass = myData.class.length ? myData.class : '';
                if (myData.position === 'top') {
                    myPosition.my = 'center bottom-15';
                    myPosition.at = 'center top';
                    myClasses = {
                        'ui-tooltip': 'ui-corner-all ui-widget-shadow is-top'
                    };
                }
                if (myData.position === 'left') {
                    myPosition.my = 'right-20 center';
                    myPosition.at = 'left center';
                    myClasses = {
                        'ui-tooltip': 'ui-corner-all ui-widget-shadow is-left'
                    };
                }
                if (myData.position === 'right') {
                    myPosition.my = 'left+20 center';
                    myPosition.at = 'right center';
                    myClasses = {
                        'ui-tooltip': 'ui-corner-all ui-widget-shadow is-right'
                    };
                }
                if (myData.position === 'bottom') {
                    myPosition.my = 'center top+15';
                    myPosition.at = 'center bottom';
                    myClasses = {
                        'ui-tooltip': 'ui-corner-all ui-widget-shadow is-bottom'
                    };
                }
                myTooltip.tooltip({
                    classes: myClasses,
                    position: myPosition,
                    items: myTooltip,
                    tooltipClass: myClass,
                    content: function() {
                        return myData.content;
                    }
                });
            });
        }
    }

    // vegasSlider Preview function
    function anarkaliVegasSlider() {

        $(".home-slider-vegas-wrapper").each(function (i, el) {
            var myEl       = jQuery(el),
                myVegasId  = myEl.find('.nt-home-slider-vegas').attr('id'),
                myVegas    = $( '#' + myVegasId ),
                myPrev     = myEl.find('.vegas-control-prev'),
                myNext     = myEl.find('.vegas-control-next'),
                mySettings = myEl.find('.nt-home-slider-vegas').data('slider-settings'),
                myContent  = myEl.find('.nt-vegas-slide-content'),
                myCounter  = myEl.find('.nt-vegas-slide-counter'),
                myTitle    = myEl.find('.slider_title'),
                myDesc     = myEl.find('.slider_desc'),
                myBtn      = myEl.find('.btn'),
                myCounter  = myEl.find('.nt-vegas-slide-counter');

            myEl.parents('.elementor-widget-agrikon-vegas-slider').removeClass('elementor-invisible');

            if( mySettings.slides.length ) {
                var slides = mySettings.slides,
                    anim   = mySettings.animation ? mySettings.animation : 'kenburns',
                    trans  = mySettings.transition ? mySettings.transition : 'slideLeft',
                    delay  = mySettings.delay ? mySettings.delay : 7000,
                    dur    = mySettings.duration ? mySettings.duration : 2000,
                    autoply= mySettings.autoplay,
                    shuf   = 'yes' == mySettings.shuffle ? true : false,
                    timer  = 'yes' == mySettings.timer ? true : false,
                    over   = 'none' != mySettings.overlay ? true : false;

                myVegas.vegas({
                    autoplay: autoply,
                    delay: delay,
                    timer: timer,
                    shuffle: shuf,
                    animation: anim,
                    transition: trans,
                    transitionDuration: dur,
                    overlay: over,
                    slides: mySettings.slides,
                    init: function (globalSettings) {
                        myContent.eq(0).addClass('active');
                        myTitle.eq(0).addClass('fadeInLeft');
                        myDesc.eq(0).addClass('fadeInLeft');
                        myBtn.eq(0).addClass('fadeInLeft');
                        var total = myContent.size();
                        myCounter.find('.total').html(total);
                    },
                    walk: function (index, slideSettings) {
                        myContent.removeClass('active').eq(index).addClass('active');
                        myTitle.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        myDesc.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        myBtn.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        var current = index +1;
                        myCounter.find('.current').html(current);
                    },
                    end: function (index, slideSettings) {
                    }
                });

                myPrev.on('click', function () {
                    myVegas.vegas('previous');
                });

                myNext.on('click', function () {
                    myVegas.vegas('next');
                });
            }
        });
        // add video support on mobile device for vegas slider
        if( $(".home-slider-vegas-wrapper").length ) {
            $.vegas.isVideoCompatible = function () {
                return true;
            }
        }
    }

    // anarkaliVegasTemplate Preview function
    function anarkaliVegasTemplateSlider() {
        $(".vegas-template-slider").each(function () {
            var myEl        = $(this),
                myContent   = myEl.find('.vegas-content-wrapper .elementor-top-section'),
                myBgContent = myEl.find('.vegas-bg-content'),
                mySettings  = myBgContent.data('slider-settings'),
                myVegasId   = myBgContent.attr('id'),
                myVegas     = $( '#' + myVegasId ),
                myPrev      = myEl.find('.vegas-control-prev'),
                myNext      = myEl.find('.vegas-control-next'),
                myCounter   = myEl.find('.nt-vegas-slide-counter');

            myEl.parents('.elementor-widget-anarkali-vegas-template').removeClass('elementor-invisible');

            var mySlides = [];
            myContent.each( function(){
                var mySlide = $(this),
                    bgImage = mySlide.css('background-image');
                    bgImage = bgImage.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, ''),
                    bgImage = {"src": bgImage};

                mySlides.push( bgImage );
                mySlide.addClass('vegas-slide-template-section').css({
                    'background-image' : 'none',
                    'background-color' : 'transparent',
                });
            });

            if( mySlides.length ) {
                var anim  = mySettings.animation ? mySettings.animation : 'kenburns',
                    trans = mySettings.transition ? mySettings.transition : 'slideLeft',
                    delay = mySettings.delay ? mySettings.delay : 7000,
                    dur   = mySettings.duration ? mySettings.duration : 2000,
                    aply  = mySettings.autoplay,
                    shuf  = 'yes' == mySettings.shuffle ? true : false,
                    timer = 'yes' == mySettings.timer ? true : false,
                    over  = 'none' != mySettings.overlay ? true : false;

                myVegas.vegas({
                    autoplay: aply,
                    delay: delay,
                    timer: timer,
                    shuffle: shuf,
                    animation: anim,
                    transition: trans,
                    transitionDuration: dur,
                    overlay: over,
                    slides: mySlides,
                    init: function (globalSettings) {
                        myContent.eq(0).addClass('active');
                        var total = myContent.size();
                        myCounter.find('.total').html(total);
                        myContent.each( function(){
                            var myElAnim = $(this).find( '.elementor-element[data-settings]' ),
                                myData = myElAnim.data('settings'),
                                myAnim = myData && myData._animation ? myData._animation : '',
                                myDelay = myData && myData._animation_delay ? myData._animation_delay / 1000 : '';

                            if (myData && myAnim ) {
                                myElAnim.removeClass( 'animated' );
                                $(this).find(myElAnim).css({
                                    'animation-delay' : myDelay+'s',
                                });
                            }
                        });
                    },
                    walk: function (index, slideSettings) {

                        myContent.removeClass('active').eq(index).addClass('active');

                        myContent.each( function(){
                            var myElAnim = $(this).find( '.elementor-element[data-settings]' ),
                                myData = myElAnim.data('settings'),
                                myAnim = myData && myData._animation ? myData._animation : '',
                                myDelay = myData && myData._animation_delay ? myData._animation_delay / 1000 : '';

                            if (myData && myAnim ) {
                                myElAnim.removeClass( 'animated ' + myAnim );
                                myContent.eq(index).find(myElAnim).addClass('animated ' + myAnim);
                            }
                        });
                        var current = index +1;
                        myCounter.find('.current').html(current);
                    },
                    end: function (index, slideSettings) {
                    }
                });

                myPrev.on('click', function () {
                    myVegas.vegas('previous');
                });

                myNext.on('click', function () {
                    myVegas.vegas('next');
                });
            }
        });
    }

   // anarkaliFixedSection
    function anarkaliFixedSection() {
        var myFixedSection = $( '.anarkali-section-fixed-yes' );
        if ( myFixedSection.length ) {
            myFixedSection.parents( '[data-elementor-type="section"]' ).addClass( 'anarkali-section-fixed anarkali-custom-header' );
            win.on( "scroll", function () {
                var bodyScroll = win.scrollTop();
                if ( bodyScroll > 100 ) {
                    myFixedSection.parents( '[data-elementor-type="section"]' ).addClass( 'section-fixed-active' );
                } else {
                   myFixedSection.parents( '[data-elementor-type="section"]' ).removeClass( 'section-fixed-active' );
                }
            });
        }
    }
    // anarkaliPopup
    function anarkaliPopupTemplate() {
        var myPopups = $('.anarkali-popup-item');
        myPopups.each(function (i, el) {
            var myPopup = $(el),
                myId    = myPopup.attr('id'),
                myEl    = $('body a[href="#'+myId+'"]' );

            if ( myEl.length ) {
                myEl.addClass('anarkali-open-popup');
            }
        });
        $(".anarkali-open-popup").magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'scroll',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 0,
            mainClass: 'anarkali-mfp-slide-bottom',
            tClose: '',
            tLoading: '<span class="loading-wrapper"><span class="ajax-loading"></span></span>',
            closeMarkup: '<div title="%title%" class="mfp-close anarkali-mfp-close"></div>',
            callbacks: {
                open: function() {
                    $("html,body").addClass('anarkali-popup-open');
                    if ( $('.anarkali-popup-item .anarkali-slick-slider').length ) {
                        $('.anarkali-popup-item .anarkali-slick-slider').each(function () {
                            $(this).slick('refresh');
                        });
                    }
                },
                close: function() {
                    $("html,body").removeClass('anarkali-popup-open anarkali-overlay-open');
                }
            }
        });
    }


    /*=============================================
    Theme WooCommerce
    =============================================*/
    /* added_to_cart
    *  updated_cart_totals
    */


    // none elementor page fix some js
    function noneElementorPageFix() {
        if ( !$('body').hasClass('archive') ) {
            return;
        }
        $('[data-widget_type="accordion.default"] .elementor-accordion-item .elementor-tab-title').each(function(e){
            $( this ).on('click',function(e){
                var $this = $( this );
                var $parent = $this.parent();

                $this.toggleClass('elementor-active');
                $parent.find('.elementor-tab-content').slideToggle();
                $parent.siblings().find('.elementor-tab-title').removeClass('elementor-active');
                $parent.siblings().find('.elementor-tab-content').slideUp();
            });
        });
    }

    // anarkaliCf7Form
    function anarkaliCf7Form() {
        $('.anarkali-cf7-form-wrapper.form_front').each( function(){
            $(this).find('form>*').each( function(index,el){
                $(this).addClass('child-'+index);
            });
        });
    }

    // popupNewsletter
    function popupNewsletter() {
        if ( !$('body').hasClass('newsletter-popup-visible') ) {
            return;
        }

        var expires = $( '.anarkali-newsletter' ).data( 'expires' );

        if (typeof Cookies !== 'undefined') {
            if (!( Cookies.get( 'newsletter-popup-visible' ) ) ) {
                $( window ).on( 'load', function() {
                    $('.anarkali-newsletter').trigger( 'click' );
                });
            }

            $(".anarkali-newsletter .dontshow").click(function() {
                if ($(this).is(":checked")) {
                    Cookies.set( 'newsletter-popup-visible', 'disable', { expires: expires, path: '/' });
                } else {
                    Cookies.remove('newsletter-popup-visible')
                }
            });
        }
    }

    function anarkaliGallery() {
        if ( $('.gallery_front').length > 0 ){
            const $this     = $('.gallery_front');
            const gallery   = $this.find('.anarkali-wc-gallery .row');
            const filter    = $this.find('.gallery-menu');
            const filterbtn = $this.find('.gallery-menu span');
            gallery.imagesLoaded(function () {
                // init Isotope
                var $grid = gallery.isotope({
                    itemSelector    : '.grid-item',
                    percentPosition : true,
                    masonry         : {
                        columnWidth : '.grid-sizer'
                    }
                });
                // filter items on button click
                filter.on('click', 'span', function () {
                    var filterValue = $(this).attr('data-filter');
                    $grid.isotope({ filter: filterValue });
                });
            });
            //for menu active class
            filterbtn.on('click', function (event) {
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
                event.preventDefault();
            });
        }
    }


    doc.ready( function() {
        $('.slider-home-onepage .swiper-container').each( function() {
            var $this = $(this).attr('id');
            anarkaliSlider('#'+$this);
        });

        winw = $(window).outerWidth();
        bodyResize();
        //headerSpacerHeight(winw);
        sideMainHeader();
        topMainHeader();
        mobileSlidingMenu();
        mobileHeaderActions();
        anarkaliHeaderCatMenu();
        anarkaliSwiperSlider();
        anarkaliSlickSlider();
        anarkaliVegasSlider();
        anarkaliVegasTemplateSlider();
        anarkaliFixedSection();
        anarkaliPopupTemplate();
        scrollToTopBtnClick();
        noneElementorPageFix();
        anarkaliLightbox();
        anarkaliUITooltip();
        popupNewsletter();
        anarkaliCf7Form();
        anarkaliGallery();

        $('.anarkali-header-bottom-bar .anarkali-shop-filter-top-area').removeClass('anarkali-shop-filter-top-area');
        if ( $('.anarkali-header-content>div').length == 3 ) {
            //$('div.header-top-side').sameSize(true);
        }
        if ( $('.header-top-area').length > 0 ) {
            var topbarH = $('.header-top-area').height();
            var breakpoint = parseFloat( $('.anarkali-header-mobile-top').data('breakpoint') );
            if ( window.innerWidth <= breakpoint ) {
                $('.anarkali-header-mobile-top').css('top',topbarH+'px');
            }
        }
    });

    // === window When resize === //
    win.resize( function() {
        winw = $(window).outerWidth();
        bodyResize(winw);
        topMainHeaderResize(winw);
        mobileHeaderResize(winw);
        headerSpacerHeight(winw);

        if ( $('.anarkali-header-content>div').length == 3 ) {
            $('div.header-top-side').sameSize(true);
        }
        body.addClass("anarkali-on-resize");
        body.attr("data-anarkali-resize", winw);

        if ( typeof elementorFrontend != 'undefined' ) {
            var deviceMode = elementorFrontend.getCurrentDeviceMode();

            $('[data-bg-responsive]').each( function(index, el) {
                var $this = $(el);
                var elBg  = $this.data('bg-responsive');

                if ( typeof elBg != 'undefined' ) {
                    var desktop = $(el).data('bg');

                    var widescreen   = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var laptop       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var tablet_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : laptop;
                    var tablet       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet_extra;
                    var mobile_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet;
                    var mobile       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : mobile_extra;
                    var bgUrl        = mobile;

                    if ( bgUrl ) {
                        $this.css('background-image', 'url(' + bgUrl + ')' );
                    }
                }
            });
        }
        if ( $('.header-top-area').length > 0 ) {
            var topbarH = $('.header-top-area').height();
            var breakpoint = parseFloat( $('.anarkali-header-mobile-top').data('breakpoint') );
            if ( window.innerWidth <= breakpoint ) {
                $('.anarkali-header-mobile-top').css('top',topbarH+'px');
            }
        }
    });

    var headerH = $('.has-sticky-header .anarkali-header-default').height(),
        headerP = $('.has-sticky-header .anarkali-header-default').position(),
        headerP = typeof headerP != 'undefined' ? headerP.top : 0,
        topbarH = $('.anarkali-header-top-area').height(),
        offSetH = headerH + topbarH;

    // === window When scroll === //
    win.on("scroll", function () {
        var bodyScroll = win.scrollTop();
        var st = $(this).scrollTop();

        if ( bodyScroll > headerP ) {
            $('.has-sticky-header .anarkali-header-default').addClass("sticky-start");
        } else {
            $('.has-sticky-header .anarkali-header-default').removeClass("sticky-start");
        }

        if ( bodyScroll > 0 ) {
            body.addClass("scroll-start");
        } else {
            body.removeClass("scroll-start");
        }

        var filterArea = $('.anarkali-products-column .anarkali-before-loop.anarkali-shop-filter-top-area');

        if ( filterArea.length ) {
            var filterAreaPos = filterArea.offset(),
                topoffset = $('.anarkali-header-bottom-bar').hasClass('anarkali-elementor-template') ? 10 : filterAreaPos.top-62;
            if ( bodyScroll > topoffset ) {
                $('.anarkali-header-bottom-bar').addClass('sticky-filter-active');
            } else {
                $('.anarkali-header-bottom-bar').removeClass('sticky-filter-active');
            }
        }

        scrollToTopBtnHide();

        if ( $('.header-top-area').length > 0 ) {
            var topbarH = $('.header-top-area').height();
            var breakpoint = parseFloat( $('.anarkali-header-mobile-top').data('breakpoint') );
            if ( window.innerWidth <= breakpoint && bodyScroll > topbarH ) {
                $('.anarkali-header-mobile-top').css('top',0);
            } else {
                $('.anarkali-header-mobile-top').css('top',topbarH+'px');
            }
        }
    });

    // === window When Loading === //
    win.on("load", function () {
        var bodyScroll = win.scrollTop();

        if ( bodyScroll > 10 ) {
            body.addClass("scroll-start");
            $('.has-sticky-header .anarkali-header-default').addClass("sticky-start");
        } else {
            body.removeClass("scroll-start");
            $('.has-sticky-header .anarkali-header-default').removeClass("sticky-start");
        }

        if ( $(".preloader").length ) {
          $( ".preloader" ).fadeOut();
        }
        body.addClass("page-loaded");

        anarkaliSimpleParallax();
    });

    win.on('orientationchange', function(event) {
        setTimeout(function(){
        },1000);
        body.addClass("anarkali-orientation-changed");
    });

})(window, document, jQuery);
