/* NT Addons for Elementor v1.0 */

!(function ($) {


    /* anarkaliSwiperSlider */
    function anarkaliSwiperSlider($scope, $) {
        $scope.find('.anarkali-swiper-slider').each(function () {
            const options = JSON.parse(this.dataset.swiperOptions);
            let mySlider = new NTSwiper( $(this), options );
        });
    }

    function anarkaliCountdown($scope, $) {
        $scope.find('.anarkali-coming-time').each(function () {
            const options = eval(JSON.parse(this.dataset.countdownOptions));
            $( this ).countdown(options);
        });
    }
    function anarkaliInstagram($scope, $) {
        $scope.find('.anarkali-instagram-slider').each(function () {
            var $this = $(this);
            var data = $this.data('insta');
            var icon = '<svg height="512" viewBox="0 0 64 64" width="512" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="m48 64h-32a16.0007 16.0007 0 0 1 -16-16v-32a16.0007 16.0007 0 0 1 16-16h32a16 16 0 0 1 16 16v32a16 16 0 0 1 -16 16" fill="#ff3a55"/><path d="m30 18h18a9.0006 9.0006 0 0 0 .92-17.954c-.306-.017-.609-.046-.92-.046h-32a16.0007 16.0007 0 0 0 -16 16v32a30.0007 30.0007 0 0 1 30-30" fill="#ff796c"/><path d="m48 32a16 16 0 1 0 16 16v-32a16 16 0 0 1 -16 16" fill="#e00047"/></g><circle cx="44.5" cy="19.5" fill="#fff" r="2.5"/><path d="m32 24a8 8 0 1 1 -8 8 8.0042 8.0042 0 0 1 8-8zm0-4a12 12 0 1 1 -12 12 12.0057 12.0057 0 0 1 12-12z" fill="#fff" fill-rule="evenodd"/><path d="m52 22a10 10 0 0 0 -10-10h-20a10 10 0 0 0 -10 10v20a10 10 0 0 0 10 10h20a10 10 0 0 0 10-10zm4 0a14 14 0 0 0 -14-14h-20a14 14 0 0 0 -14 14v20a14 14 0 0 0 14 14h20a14 14 0 0 0 14-14z" fill="#fff" fill-rule="evenodd"/></svg>';
            if ( typeof data != 'undefined' ) {
                var feed = new Instafeed({
                    target: data.target,
                    accessToken: data.token,
                    limit: data.limit,
                    resolution: 'square',
                    template: '<div class="anarkali-image-wrapper swiper-slide"><a class="anarkali-instagram-link" href="{{link}}" target="'+data.link_taregt+'" title="{{caption}}"><img title="{{caption}}" src="'+data.blankimage+'" data-src="{{image}}" />'+icon+'</a></div>'
                });
                feed.run();
            }
        });
    }
    function anarkaliDealsCountDown($scope, $) {
        $scope.find('[data-countdown]').each(function () {
            var $this = $(this),
                data = $this.data('countdown'),
                finalDate = data.date,
                hr = data.hr,
                min = data.min,
                sec = data.sec;
            $this.countdown(finalDate, function (event) {
                $this.html(event.strftime('<div class="time-count day"><span>%D</span></div><div class="time-count hour"><span>%H</span></div><div class="time-count min"><span>%M</span></div><div class="time-count sec"><span>%S</span></div>'));
            });
        });
    }
    function anarkaliProductGallery($scope, $) {
        $scope.find('.gallery-products__wrapper').each(function () {
            const $this = $(this);
            const gallery = $this.find('.exclusive-active');
            const filter = $this.find('.product-menu');
            const filterbtn = $this.find('.product-menu button');
            const options = eval(JSON.parse(this.dataset.isotopeOptions));
            gallery.imagesLoaded(function () {
                // init Isotope
                var $grid = gallery.isotope(options);
                // filter items on button click
                filter.on('click', 'button', function () {
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
        });
    }
    function anarkaliWcTabbedSlider($scope, $) {
        $scope.find('.anarkali-wc-tab-slider-edit-mode').each(function () {
            var myWrapper = $( this ),
                ajaxTab   = myWrapper.find('.anarkali-tab-nav-item:not(.loaded)'),
                loadedTab = myWrapper.find('.anarkali-tab-nav-item');

            loadedTab.on('click', function(event){
                var $this = $(this),
                    terms = $this.data('tab-terms'),
                    id    = terms.id;
                myWrapper.find('.anarkali-tab-nav-item').removeClass('is-active');
                $this.addClass('is-active');
                $('.anarkali-tab-slider:not([data-cat-id="'+id+'"])').removeClass('is-active');
                $('.anarkali-tab-slider[data-cat-id="'+id+'"]').addClass('is-active');
            });

            var height = myWrapper.find('.anarkali-tabs-wrapper .thm-tab-slider').height();

            ajaxTab.on('click', function(event){

                var $this    = $(this),
                    terms    = $this.data('tab-terms'),
                    cat_id   = terms.id,
                    per_page = terms.per_page,
                    order    = terms.order,
                    orderby  = terms.orderby,
                    ajaxurl  = terms.ajaxurl,
                    data     = {
                        action     : 'anarkali_ajax_tab_slider',
                        cat_id     : cat_id,
                        per_page   : per_page,
                        order      : order,
                        orderby    : orderby,
                        beforeSend : function() {
                            $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"]').css('min-height', height ).addClass('tab-loading');
                            myWrapper.find('.anarkali-tab-nav-item').removeClass('is-active');
                            $this.addClass('is-active');
                        }
                    };
                if ( !$this.hasClass('loaded') && $('.anarkali-tab-slider:not([data-cat-id="'+cat_id+'"])').length ) {

                    // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
                    $.post(ajaxurl, data, function(response) {

                        $('.anarkali-tab-slider:not([data-cat-id="'+cat_id+'"])').removeClass('is-active');
                        $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"]').addClass('is-active loaded');
                        $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"] .swiper-wrapper').append(response);

                        $this.addClass('loaded');

                        $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"] .thm-tab-slider').each(function () {
                            const options = JSON.parse(this.dataset.swiperOptions);
                            var mySwiper  = new NTSwiper( this, options );
                        });

                        $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"] .variations_form').each(function () {
                            $(this).wc_variation_form();
                        });
                        $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"]').removeClass('tab-loading');
                    });
                }
            });

            myWrapper.find('.anarkali-tab-slider.is-active .thm-tab-slider').each(function (el,i) {
                let mySwiper = new NTSwiper(this, JSON.parse(this.dataset.swiperOptions));
            });
            myWrapper.css('min-height', myWrapper.outerHeight() );
        });
    }

    /* anarkaliAnimationFix */
    function anarkaliAnimationFix() {
        $scope.find('body:not(.elementor-page)').each(function () {

            var myTarget     = $( this ),
                myInvisible  = myTarget.find( '.elementor-invisible' );

            myInvisible.each( function () {
                var $this     = $( this ),
                    animData  = $this.data('settings'),
                    animName  = animData._animation,
                    animDelay = animData._animation_delay;
                $this.addClass( 'wow '+ animName ).removeClass( 'elementor-invisible' );
                $this.css( 'animation-delay', animDelay + 'ms');
            });
        });
    }

   // anarkaliJarallax
    function anarkaliJarallax() {
        var myParallaxs = $('.anarkali-parallax');
        myParallaxs.each(function (i, el) {

            var myParallax = $(el),
                myData     = myParallax.data('anarkaliParallax');
            if (!myData) {
                return true; // next iteration
            }
            myParallax.jarallax({
                type            : myData.type,
                speed           : myData.speed,
                imgSize         : myData.imgsize,
                imgSrc          : myData.imgsrc,
                disableParallax : myData.mobile ? /iPad|iPhone|iPod|Android/ : null,
                keepImg         : false,
            });
        });
    }

    var NtVegasHandler = function ($scope, $) {
        var target = $scope,
            sectionId = target.data("id"),
            settings = false,
            editMode = elementorFrontend.isEditMode();

        if ( editMode ) {
            settings = generateEditorSettings(sectionId);
        }

        if ( !editMode || !settings ) {
            //return false;
        }

        if ( settings[1] ) {
            generateVegas();
        }

        function generateEditorSettings(targetId) {
            var editorElements = null,
                sectionData = {},
                sectionMultiData = {},
                settings = [];

            if (!window.elementor.hasOwnProperty("elements")) {
                return false;
            }

            editorElements = window.elementor.elements;

            if ( !editorElements.models ) {
                return false;
            }

            $.each(editorElements.models, function(index, elem) {

                if (targetId == elem.id) {

                    sectionData = elem.attributes.settings.attributes;
                } else if ( elem.id == target.closest(".elementor-top-section").data("id") ) {

                    $.each(elem.attributes.elements.models, function(index, col) {
                        $.each(col.attributes.elements.models, function(index,subSec) {
                            sectionData = subSec.attributes.settings.attributes;
                        });
                    });
                }
            });

            if ( !sectionData.hasOwnProperty("anarkali_vegas_animation_type") || "" == sectionData["anarkali_vegas_animation_type"] ) {
                return false;
            }

            settings.push(sectionData["anarkali_vegas_switcher"]);  // settings[0]
            settings.push(sectionData["anarkali_vegas_images"]);    // settings[1]
            settings.push(sectionData["anarkali_vegas_animation_type"]);      // settings[2]
            settings.push(sectionData["anarkali_vegas_transition_type"]);     // settings[3]
            settings.push(sectionData["anarkali_vegas_overlay_type"]);    // settings[4]
            settings.push(sectionData["anarkali_vegas_delay"]);     // settings[5]
            settings.push(sectionData["anarkali_vegas_duration"]);   // settings[6]
            settings.push(sectionData["anarkali_vegas_shuffle"]);   // settings[7]
            settings.push(sectionData["anarkali_vegas_timer"]);   // settings[8]

            if (0 !== settings.length) {
                return settings;
            }

            return false;
        }

        function generateVegas() {

            var vegas_animation  = settings[2] ? Object.values(settings[2]) : 'kenburns';
            var vegas_transition = settings[3] ? Object.values(settings[3]) : 'slideLeft';
            var vegas_delay      = settings[5] ? settings[5] : 7000;
            var vegas_duration   = settings[6] ? settings[6] : 2000;
            var vegas_shuffle    = 'yes' == settings[7] ? true : false;
            var vegas_timer      = 'yes' == settings[8] ? true : false;
            var vegas_overlay    = 'none' != settings[4] ? true : false;

            if ( settings[1].length ) {

                if ( settings[0] == 'yes' && !$('#vegas-js_' + sectionId ).length ) {
                    $('<div id="vegas-js_' + sectionId + '" class="anarkali-vegas-effect"></div>').prependTo(target);

                    var images = [];
                    for( i = 0; i<settings[1].length; i++ ) {
                        images.push({ src: settings[1][i]['url'] });
                    }

                    setTimeout(function() {
                        $('#vegas-js_' + sectionId).vegas({
                            delay: vegas_delay,
                            timer: vegas_timer,
                            shuffle: vegas_shuffle,
                            animation: vegas_animation,
                            transition: vegas_transition,
                            transitionDuration: vegas_duration,
                            overlay: vegas_overlay,
                            slides: images
                        });
                    }, 500);

                } else {
                    if ( settings[0] != 'yes' && $('#vegas-js_' + sectionId ).length ) {
                        $('#vegas-js_' + sectionId ).remove();
                    }
                }
            }
        }
    }

    // NtVegas Preview function
    function NtVegas() {

        $(".elementor-section[data-vegas-settings]").each(function (i, el) {
            var myVegas = jQuery(el);
            var myVegasId = myVegas.data('vegas-id');
            var myElementType = myVegas.data('element_type');
            if ( myElementType == 'section' ) {

                $('<div id="vegas-js_' + myVegasId + '" class="anarkali-vegas-effect"></div>').prependTo(myVegas);

                var settings = myVegas.data('vegas-settings');

                if(settings.slides.length) {

                    var vegas_animation  = settings.animation ? settings.animation : 'kenburns';
                    var vegas_transition = settings.transition ? settings.transition : 'slideLeft';
                    var vegas_delay      = settings.delay ? settings.delay : 7000;
                    var vegas_duration   = settings.duration ? settings.duration : 2000;
                    var vegas_shuffle    = 'yes' == settings.shuffle ? true : false;
                    var vegas_timer      = 'yes' == settings.timer ? true : false;
                    var vegas_overlay    = 'none' != settings.overlay ? true : false;

                    $( '#vegas-js_' + myVegasId ).vegas({
                        delay: vegas_delay,
                        timer: vegas_timer,
                        shuffle: vegas_shuffle,
                        animation: vegas_animation,
                        transition: vegas_transition,
                        transitionDuration: vegas_duration,
                        overlay: vegas_overlay,
                       slides: settings.slides
                    });
                }
            }
        });
    }

    var NtParticlesHandler = function ($scope, $) {
        var target = $scope,
            sectionId = target.data("id"),
            settings = false,
            editMode = elementorFrontend.isEditMode();

        if ( editMode ) {
            settings = generateEditorSettings(sectionId);
        }

        if ( !editMode || !settings ) {
            return false;
        }

        if ( "none" != settings[1] ) {
            target.addClass('anarkali-particles');
            $('<div id="particles-js_' + sectionId + '" class="anarkali-particles-effect"></div>').prependTo(target);
            generateParticles();
        }

        function generateEditorSettings(targetId) {
            var editorElements = null,
                sectionData = {},
                sectionMultiData = {},
                settings = [];

            if (!window.elementor.hasOwnProperty("elements")) {
                return false;
            }

            editorElements = window.elementor.elements;

            if (!editorElements.models) {
                return false;
            }

            $.each(editorElements.models, function(index, elem) {

                if (targetId == elem.id) {

                    sectionData = elem.attributes.settings.attributes;
                } else if ( elem.id == target.closest(".elementor-top-section").data("id") ) {

                    $.each(elem.attributes.elements.models, function(index, col) {
                        $.each(col.attributes.elements.models, function(index,subSec) {
                            sectionData = subSec.attributes.settings.attributes;
                        });
                    });
                }
            });

            if ( !sectionData.hasOwnProperty("anarkali_particles_type") || "none" == sectionData["anarkali_particles_type"] ) {
                return false;
            }

            settings.push(sectionData["anarkali_particles_switcher"]);  // settings[0]
            settings.push(sectionData["anarkali_particles_type"]);      // settings[1]
            settings.push(sectionData["anarkali_particles_shape"]);     // settings[2]
            settings.push(sectionData["anarkali_particles_number"]);    // settings[3]
            settings.push(sectionData["anarkali_particles_color"]);     // settings[4]
            settings.push(sectionData["anarkali_particles_opacity"]);   // settings[5]
            settings.push(sectionData["anarkali_particles_size"]);      // settings[5]

            if ( 0 !== settings.length ) {
                return settings;
            }

            return false;
        }

        function generateParticles() {

            var type     = settings[1] ? settings[1] : 'deafult';
            var shape    = settings[2] ? settings[2] : 'buble';
            var number   = settings[3] ? settings[3] : '';
            var color    = settings[4] ? settings[4] : '#fff';
            var opacity  = settings[5] ? settings[5] : '';
            var d_size   = settings[6] ? settings[6] : '';
            //var n_size   = settings[8] ? settings[8] : '';
            //var s_size   = settings[9] ? settings[9] : '';
            var snumber = number ? number : 6;
            var nbsides = shape == 'star' ? 5 : 6;
            var size    = d_size ? d_size : 100;
            setTimeout(function() {

                if ( type == 'bubble' ) {
                    snumber = number ? number : 6;
                    nbsides = shape == 'star' ? 5 : 6;
                    size    = d_size ? d_size : 100;
                    particlesJS("particles-js_" + sectionId, { "fps_limit": 0, "particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": nbsides }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": size, "random": false, "anim": { "enable": true, "speed": 10, "size_min": 40, "sync": false } }, "line_linked": { "enable": false, "distance": 200, "color": "#ffffff", "opacity": 1, "width": 2 }, "move": { "enable": true, "speed": 8, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false, "mode": "grab" }, "onclick": { "enable": false, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else if( type == 'nasa' ) {
                    snumber = number ? number : 160;
                    size    = d_size ? d_size : 3;
                    particlesJS("particles-js_" + sectionId, { "fps_limit": 0, "particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } }, "size": { "value": size, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 600 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 3 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else if( type == 'snow' ) {
                    snumber = number ? number : 400;
                    size    = d_size ? parseFloat(d_size) : 10;
                    particlesJS("particles-js_" + sectionId, { "fps_limit": 0, "particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": size, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": false, "distance": 500, "color": "#ffffff", "opacity": 0.4, "width": 2 }, "move": { "enable": true, "speed": 6, "direction": "bottom", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 0.5 } }, "bubble": { "distance": 400, "size": 4, "duration": 0.3, "opacity": 1, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else if( type == 'default' ) {
                    snumber = number ? number : 80;
                    size    = d_size ? d_size : 3;
                    particlesJS("particles-js_" + sectionId, { "fps_limit": 0, "particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": size, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else {
                    target.find('.anarkali-particles-effect').remove();
                    target.removeClass('anarkali-particles');
                }
            }, 500);
        }
    }

    // ntrParticles Preview function
    function NtParticles() {

        $(".elementor-section[data-particles-settings]").each(function (i, el) {
            var myParticles = $(el);
            var myParticlesId = myParticles.attr('data-particles-id');
            var myElementTtype = myParticles.attr('data-element_type');
            if ( myElementTtype == 'section' ) {

                $('<div id="particles-js_' + myParticlesId + '" class="anarkali-particles-effect"></div>').prependTo(myParticles);

                var settings = myParticles.data('particles-settings');

                var type     = settings.type;
                var color    = settings.color ? settings.color : '#fff';
                var opacity  = settings.opacity ? settings.opacity : 0.4;
                var shape    = settings.shape ? settings.shape : 'circle';
                var snumber = settings.number ? settings.number : 6;
                var nbsides = settings.shape == 'star' ? 5 : 6;
                var size    = settings.size ? settings.size : 100;

                if ( type == 'bubble' ) {
                    snumber = settings.number ? settings.number : 6;
                    nbsides = settings.shape == 'star' ? 5 : 6;
                    size = settings.size ? settings.size : 100;
                    particlesJS("particles-js_" + myParticlesId,{ "fps_limit": 0,"particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000" }, "polygon": { "nb_sides": nbsides }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": size, "random": false, "anim": { "enable": true, "speed": 10, "size_min": 40, "sync": false } }, "line_linked": { "enable": false, "distance": 200, "color": "#ffffff", "opacity": 1, "width": 2 }, "move": { "enable": true, "speed": 8, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false, "mode": "grab" }, "onclick": { "enable": false, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else if( type == 'nasa' ) {
                    snumber = settings.number ? settings.number : 160;
                    size = settings.size ? settings.size : 3;
                    particlesJS("particles-js_" + myParticlesId, { "fps_limit": 0,"particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": color }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } }, "size": { "value": size, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 600 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 3 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else if( type == 'snow' ) {
                    snumber = settings.number ? settings.number : 400;
                    size = settings.size ? settings.size : 10;
                    particlesJS("particles-js_" + myParticlesId, { "fps_limit": 0,"particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#fff" }, "shape": { "type": shape, "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": opacity, "random": true, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": size, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": false, "distance": 500, "color": "#ffffff", "opacity": 0.4, "width": 2 }, "move": { "enable": true, "speed": 6, "direction": "bottom", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 0.5 } }, "bubble": { "distance": 400, "size": 4, "duration": 0.3, "opacity": 1, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                } else {
                    snumber = settings.number ? settings.number : 80;
                    size = settings.size ? settings.size : 3;
                    particlesJS("particles-js_" + myParticlesId, { "fps_limit": 0,"particles": { "number": { "value": snumber, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
                }
            }
        });
    }

    var NtParallaxHandler = function ($scope, $) {
        var target = $scope,
            sectionId = target.data("id"),
            settings = false,
            editMode = elementorFrontend.isEditMode();

        if ( editMode ) {
            settings = generateEditorSettings(sectionId);
        }

        if ( !editMode || !settings ) {
            //return false;
        }

        if ( settings[0] == "yes" ) {
            generateJarallax();
        }

        function generateEditorSettings(targetId) {
            var editorElements = null,
                sectionData = {},
                sectionMultiData = {},
                settings = [];

            if ( !window.elementor.hasOwnProperty("elements") ) {
                return false;
            }

            editorElements = window.elementor.elements;

            if ( !editorElements.models ) {
                return false;
            }

            $.each(editorElements.models, function(index, elem) {

                if (targetId == elem.id) {

                    sectionData = elem.attributes.settings.attributes;
                } else if ( elem.id == target.closest(".elementor-top-section").data("id") ) {

                    $.each(elem.attributes.elements.models, function(index, col) {
                        $.each(col.attributes.elements.models, function(index,subSec) {
                            sectionData = subSec.attributes.settings.attributes;
                        });
                    });
                }
            });

            if ( !sectionData.hasOwnProperty("anarkali_parallax_type") || "" == sectionData["anarkali_parallax_type"] ) {
                return false;
            }

            settings.push(sectionData["anarkali_parallax_switcher"]);                          // settings[0]
            settings.push(sectionData["anarkali_parallax_type"]);                              // settings[1]
            settings.push(sectionData["anarkali_parallax_speed"]);                             // settings[2]
            settings.push(sectionData["anarkali_parallax_bg_size"]);                           // settings[3]
            settings.push("yes" == sectionData["anarkali_parallax_mobile_support"] ? 0 : 1);   // settings[4]
            settings.push("yes" == sectionData["anarkali_add_parallax_video"] ? 1 : 0);        // settings[5]
            settings.push(sectionData["anarkali_local_video_format"]);                         // settings[6]
            settings.push(sectionData["anarkali_parallax_video_url"]);                         // settings[7]
            settings.push(sectionData["anarkali_parallax_video_start_time"]);                  // settings[8]
            settings.push(sectionData["anarkali_parallax_video_end_time"]);                    // settings[9]
            settings.push(sectionData["anarkali_parallax_video_volume"]);                      // settings[10]

            if ( 0 !== settings.length ) {
                return settings;
            }

            return false;
        }

        function responsiveParallax(android, ios) {
            switch (true || 1) {
                case android && ios:
                    return /iPad|iPhone|iPod|Android/;
                    break;
                case android && !ios:
                    return /Android/;
                    break;
                case !android && ios:
                    return /iPad|iPhone|iPod/;
                    break;
                case !android && !ios:
                    return null;
            }
        }

        function generateJarallax() {
            var $type     = settings[1] ? settings[1] : 'scroll';
            var $speed    = settings[2] ? settings[2] : '0.4';
            var $imgsize  = settings[3] ? settings[3] : 'cover';

            setTimeout(function() {
                target.jarallax({
                    type            : $type,
                    speed           : $speed,
                    imgSize         : $imgsize,
                    disableParallax : responsiveParallax(1 == settings[4])
                });
            }, 500);
        }
    }


    var NtLazyLoadHandler = function ($scope, $) {
        var target = $scope,
            sectionId = target.data("id"),
            settings = false,
            editMode = elementorFrontend.isEditMode();

        if ( editMode ) {
            settings = generateEditorSettings(sectionId);
        }

        if ( !editMode || !settings ) {
            //return false;
        }

        if ( settings[0] != "" ) {
            generateBg();
        }

        function generateEditorSettings(targetId) {
            var editorElements = null,
                sectionData = {},
                sectionMultiData = {},
                settings = [];

            if ( !window.elementor.hasOwnProperty("elements") ) {
                return false;
            }

            editorElements = window.elementor.elements;

            if ( !editorElements.models ) {
                return false;
            }

            $.each(editorElements.models, function(index, elem) {

                if (targetId == elem.id) {

                    sectionData = elem.attributes.settings.attributes;

                } else if ( elem.id == target.closest(".elementor-top-section").data("id") ) {

                    $.each(elem.attributes.elements.models, function(index, col) {
                        if (targetId == col.id) {
                            sectionData = col.attributes.settings.attributes;
                        }

                        $.each(col.attributes.elements.models, function(index,subSec) {
                            if (targetId == subSec.id) {
                                sectionData = subSec.attributes.settings.attributes;
                            }

                            $.each(subSec.attributes.elements.models, function(index,subCol) {
                                if (targetId == subCol.id) {
                                    sectionData = subCol.attributes.settings.attributes;
                                }
                            });

                        });

                    });
                }
            });

            settings.push(sectionData["anarkali_lazy_bg_image"]);
            settings.push(sectionData["anarkali_lazy_bg_image_widescreen"]);
            settings.push(sectionData["anarkali_lazy_bg_image_laptop"]);
            settings.push(sectionData["anarkali_lazy_bg_image_tablet_extra"]);
            settings.push(sectionData["anarkali_lazy_bg_image_tablet"]);
            settings.push(sectionData["anarkali_lazy_bg_image_mobile_extra"]);
            settings.push(sectionData["anarkali_lazy_bg_image_mobile"]);

            if ( 0 !== settings.length ) {
                return settings;
            }

            return false;
        }

        function generateBg() {


            target.each( function(index,el) {

                var bgUrl = '';
                var deviceMode = elementorFrontend.getCurrentDeviceMode();
                var breakpoints = elementorFrontend.config.responsive.activeBreakpoints;
                var style = '';

                var remove_class = 'elementor-element-editable';
                var targetEl = $(el)[0].className.replace(' ' + remove_class, '').replace(remove_class, '').split(" ");
                var targetId = $(el).attr('data-id');
                    targetEl = targetEl[0]+'-'+targetId;
                var colTarget = ( typeof $(el)[0].classList.contains('elementor-column') ) == true ? '>.elementor-element-populated' : '';

                if ( typeof settings[0] != 'undefined' ) {

                    bgUrl = settings[0];
                    style += bgUrl.url != '' ? '.'+targetEl+'{background-image: url('+bgUrl.url+');}' : '';
                }
                if ( typeof settings[1] != 'undefined' ) {
                    bgUrl = settings[1];
                    style += bgUrl.url != '' ? '@media(min-width:'+breakpoints.widescreen.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( typeof settings[2] != 'undefined' ) {
                    bgUrl = settings[2];
                    style += bgUrl.url != '' ? '@media(max-width:'+breakpoints.laptop.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( typeof settings[3] != 'undefined' ) {
                    bgUrl = settings[3];
                    style += bgUrl.url != '' ? '@media(max-width:'+breakpoints.tablet_extra.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( typeof settings[4] != 'undefined' ) {
                    bgUrl = settings[4];
                    style += bgUrl.url != '' ? '@media(max-width:'+breakpoints.tablet.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( typeof settings[5] != 'undefined' ) {
                    bgUrl = settings[5];
                    style += bgUrl.url != '' ? '@media(max-width:'+breakpoints.mobile_extra.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( typeof settings[6] != 'undefined' ) {
                    bgUrl = settings[6];
                    style += bgUrl.url != '' ? '@media(max-width:'+breakpoints.mobile.value+'px){.'+targetEl+colTarget+'{background-image: url('+bgUrl.url+');}}' : '';
                }
                if ( style != '' ) {
                    $('head #anarkaliElementInline-'+targetId).remove();
                    $('head').append('<style id="anarkaliElementInline-'+targetId+'">'+style+'</style>');
                } else {
                    $('head #anarkaliElementInline-'+targetId).remove();
                }
            });
        }
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    class Slideshow {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.settings = {
                animation: {
                    slides: {
                        duration: 600,
                        easing: 'easeOutQuint'
                    },
                    shape: {
                        duration: 300,
                        easing: {in: 'easeOutQuint', out: 'easeOutQuad'}
                    }
                },
                frameFill: '#f1f1f1'
            }
            this.init();
        }
        init() {
            this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.anarkali-slides > .anarkali-slide'));
            this.slidesTotal = this.DOM.slides.length;
            this.DOM.nav = this.DOM.el.querySelector('.anarkali-slidenav');
            this.DOM.nextCtrl = this.DOM.nav.querySelector('.anarkali-slidenav-item-next');
            this.DOM.prevCtrl = this.DOM.nav.querySelector('.anarkali-slidenav-item-prev');
            this.current = 0;
            this.createFrame();
            this.initEvents();
        }
        createFrame() {
            this.rect = this.DOM.el.getBoundingClientRect();
            this.frameSize = this.rect.width/12;
            this.paths = {
                initial: this.calculatePath('initial'),
                final: this.calculatePath('final')
            };
            this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.DOM.svg.setAttribute('class', 'shape');
            this.DOM.svg.setAttribute('width','100%');
            this.DOM.svg.setAttribute('height','100%');
            this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
            this.DOM.svg.innerHTML = `<path fill="${this.settings.frameFill}" d="${this.paths.initial}"/>`;
            this.DOM.el.insertBefore(this.DOM.svg, this.DOM.nav);
            this.DOM.shape = this.DOM.svg.querySelector('path');
        }
        updateFrame() {
            this.paths.initial = this.calculatePath('initial');
            this.paths.final = this.calculatePath('final');
            this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
            this.DOM.shape.setAttribute('d', this.isAnimating ? this.paths.final : this.paths.initial);
        }
        calculatePath(path = 'initial') {
            return path === 'initial' ?
                    `M 0,0 0,${this.rect.height} ${this.rect.width},${this.rect.height} ${this.rect.width},0 0,0 Z M 0,0 ${this.rect.width},0 ${this.rect.width},${this.rect.height} 0,${this.rect.height} Z` :
                    `M 0,0 0,${this.rect.height} ${this.rect.width},${this.rect.height} ${this.rect.width},0 0,0 Z M ${this.frameSize},${this.frameSize} ${this.rect.width-this.frameSize},${this.frameSize} ${this.rect.width-this.frameSize},${this.rect.height-this.frameSize} ${this.frameSize},${this.rect.height-this.frameSize} Z`;
        }
        initEvents() {
            this.DOM.nextCtrl.addEventListener('click', () => this.navigate('next'));
            this.DOM.prevCtrl.addEventListener('click', () => this.navigate('prev'));

            window.addEventListener('resize', debounce(() => {
                this.rect = this.DOM.el.getBoundingClientRect();
                this.updateFrame();
            }, 20));

            document.addEventListener('keydown', (ev) => {
                const keyCode = ev.keyCode || ev.which;
                if ( keyCode === 37 ) {
                    this.navigate('prev');
                }
                else if ( keyCode === 39 ) {
                    this.navigate('next');
                }
            });
        }
        navigate(dir = 'next') {
            if ( this.isAnimating ) return false;
            this.isAnimating = true;

            const animateShapeIn = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.in,
                d: this.paths.final
            });

            const animateSlides = () => {
                return new Promise((resolve, reject) => {
                    const currentSlide = this.DOM.slides[this.current];
                    anime({
                        targets: currentSlide,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        translateX: dir === 'next' ? -1*this.rect.width : this.rect.width,
                        complete: () => {
                            currentSlide.classList.remove('anarkali-slide-current');
                            resolve();
                        }
                    });

                    this.current = dir === 'next' ?
                        this.current < this.slidesTotal-1 ? this.current + 1 : 0 :
                        this.current > 0 ? this.current - 1 : this.slidesTotal-1;

                    const newSlide = this.DOM.slides[this.current];
                    newSlide.classList.add('anarkali-slide-current');
                    anime({
                        targets: newSlide,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        translateX: [dir === 'next' ? this.rect.width : -1*this.rect.width,0]
                    });

                    const newSlideImg = newSlide.querySelector('.anarkali-slide-img');
                    anime.remove(newSlideImg);
                    anime({
                        targets: newSlideImg,
                        duration: this.settings.animation.slides.duration*4,
                        easing: this.settings.animation.slides.easing,
                        translateX: [dir === 'next' ? 200 : -200, 0]
                    });

                    anime({
                        targets: [newSlide.querySelector('.anarkali-slide-title'), newSlide.querySelector('.anarkali-slide-desc'), newSlide.querySelectorAll('.anarkali-slide-link')],
                        duration: this.settings.animation.slides.duration*2,
                        easing: this.settings.animation.slides.easing,
                        delay: (t,i) => i*100+100,
                        translateX: [dir === 'next' ? 300 : -300,0],
                        opacity: [0,1]
                    });
                });
            };

            const animateShapeOut = () => {
                anime({
                    targets: this.DOM.shape,
                    duration: this.settings.animation.shape.duration,
                    delay: 150,
                    easing: this.settings.animation.shape.easing.out,
                    d: this.paths.initial,
                    complete: () => this.isAnimating = false
                });
            }

            animateShapeIn.finished.then(animateSlides).then(animateShapeOut);
        }
    };
    /* anarkaliAnimationFix */
    function anarkaliHomeSlideShow($scope, $) {
        $scope.find('.anarkali-slideshow').each(function () {
            new Slideshow(document.querySelector('.anarkali-slideshow'));
            //imagesLoaded('.slide__img', { background: true }, () => document.body.classList.remove('loading'));
        });
    }

    jQuery(window).on('load', function () {

    });

    function updatePageSettings(newValue) {
        var settings = false,
            editMode = elementorFrontend.isEditMode();
        if ( !editMode ) {
            return false;
        }
        if ( editMode ) {

            var header_template = elementor.settings.page.model.attributes.anarkali_page_header_template;
            var header_bg_type  = elementor.settings.page.model.attributes.anarkali_page_header_bg_type;
            var header_logo     = elementor.settings.page.model.attributes.anarkali_page_header_logo;
            var header_slogo    = elementor.settings.page.model.attributes.anarkali_page_header_sticky_logo;
            var def_logo        = $('.nt-logo.header-logo.logo-type-img .main-logo:first-child').attr('src');
            var def_slogo       = $('.nt-logo.header-logo.logo-type-img .sticky-logo').attr('src');

            if ( header_bg_type ) {
                if ( 'dark' === header_bg_type ) {
                    $( 'body' ).removeClass('has-default-header-type-default has-default-header-type-trans header-trans-light header-trans-dark').addClass('has-default-header-type-dark');
                } else if ( 'default' === header_bg_type ) {
                    $( 'body' ).removeClass('has-default-header-type-dark has-default-header-type-trans header-trans-light header-trans-dark').addClass('has-default-header-type-default');
                } else if ( 'trans-light' === header_bg_type ) {
                    $( 'body' ).removeClass('has-default-header-type-default has-default-header-type-dark header-trans-dark').addClass('has-default-header-type-trans header-trans-light');
                } else if ( 'trans-dark' === header_bg_type ) {
                    $( 'body' ).removeClass('has-default-header-type-default has-default-header-type-dark header-trans-light').addClass('has-default-header-type-trans header-trans-dark');
                }
            }

            if ( header_logo && '' !== header_logo['url'] ) {
                $('.nt-logo.header-logo.logo-type-img .main-logo:first-child').attr('src', header_logo['url']);
            } else {
                $('.nt-logo.header-logo.logo-type-img .main-logo:first-child').attr('src', def_logo);
            }
            if ( header_slogo && '' !== header_slogo['url'] ) {
                $('.nt-logo.header-logo.logo-type-img .sticky-logo').attr('src', header_slogo['url']);
            } else {
                $('.nt-logo.header-logo.logo-type-img .sticky-logo').attr('src', def_slogo);
            }
        }
    }

    jQuery(window).on('elementor/frontend/init', function () {

        if ( typeof elementor != "undefined" && typeof elementor.settings.page != "undefined") {
            elementor.settings.page.addChangeCallback( 'anarkali_page_header_template', updatePageSettings );
            elementor.settings.page.addChangeCallback( 'anarkali_page_header_bg_type', updatePageSettings );
            elementor.settings.page.addChangeCallback( 'anarkali_page_header_logo', updatePageSettings );
            elementor.settings.page.addChangeCallback( 'anarkali_page_header_sticky_logo', updatePageSettings );
        }

        elementorFrontend.hooks.addAction('frontend/element_ready/section', anarkaliJarallax);

        // WooCommerce
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-woo-gallery.default', anarkaliProductGallery);
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-woo-tab-slider.default', anarkaliWcTabbedSlider);
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-woo-mini-slider.default', anarkaliSwiperSlider);
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-countdown.default', anarkaliDealsCountDown);
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-slide-show.default', anarkaliHomeSlideShow);
        elementorFrontend.hooks.addAction('frontend/element_ready/anarkali-instagram-slider.default', anarkaliInstagram);

        var editMode = elementorFrontend.isEditMode();
        if ( editMode ) {
            elementorFrontend.hooks.addAction('frontend/element_ready/global', NtLazyLoadHandler);
            elementorFrontend.hooks.addAction('frontend/element_ready/global', NtVegasHandler);
            //elementorFrontend.hooks.addAction('frontend/element_ready/global', NtParticlesHandler);
            elementorFrontend.hooks.addAction('frontend/element_ready/global', NtParallaxHandler);
        } else {
            NtVegas();
            NtParticles();
        }

    });

})(jQuery);
