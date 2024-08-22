jQuery(document).ready(function($) {
    "use strict";

    $('.anarkali-wc-tab-slider').each(function () {
        var myWrapper = $( this ),
            ajaxTab   = myWrapper.find('.anarkali-tab-nav-item:not(.loaded)'),
            loadedTab = myWrapper.find('.anarkali-tab-nav-item');

        myWrapper.find('.anarkali-tab-slider.is-active .thm-tab-slider').each(function (el,i) {
            let mySwiper = new NTSwiper(this, JSON.parse(this.dataset.swiperOptions));
        });

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
                imgsize  = terms.imgsize,
                ajaxurl  = terms.ajaxurl,
                data     = {
                    action     : 'anarkali_ajax_tab_slider',
                    cat_id     : cat_id,
                    per_page   : per_page,
                    order      : order,
                    orderby    : orderby,
                    img_size   : imgsize,
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
                        $('body').trigger('anarkali_lazy_load');
                    });

                    $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"] .variations_form').each(function () {
                        $(this).wc_variation_form();
                    });
                    $('.anarkali-tab-slider[data-cat-id="'+cat_id+'"]').removeClass('tab-loading');
                    
                    $(document.body).trigger('anarkali_quick_shop');
                    $('body').trigger('anarkali_quick_init');
                    $(document.body).trigger('anarkali_variations_init');
                    
                });
            }
        });

    });

});
