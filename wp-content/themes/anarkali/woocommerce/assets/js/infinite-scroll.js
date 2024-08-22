jQuery(document).ready(function ($) {


    $(document).on('anarkaliShopInit', function () {
        infinitescroll();
    });

    function infinitescroll() {

        $(window).data('ajaxready', true).scroll(function(e) {

            if ($(window).data('ajaxready') == false) return;
            var products_row = $('div.anarkali-products').offset().top + $('div.anarkali-products.row').outerHeight();
            var products_rowh = $('div.anarkali-products.row').outerHeight();
            if( $(window).scrollTop() >= ( products_row - window.innerHeight ) - products_rowh ) {

                $(window).data('ajaxready', false);

                anarkali_infinite_pagination();

            }
        });
    }

    infinitescroll();

    function anarkali_infinite_pagination() {
        var obj = $('.shop-data-filters').data('shop-filters');
        var data = {
            cache      : false,
            action     : 'anarkali_shop_load_more',
            beforeSend : function() {
                if ( obj.current_page == obj.max_page ) {
                    $('.anarkali-load-more').addClass('no-more').text(obj.no_more);
                    setTimeout(function(){
                        $('.row-infinite').slideUp('slow');
                    }, 3000);
                } else {
                    $('.anarkali-load-more').addClass('loading');
                }
            },
            'ajaxurl'      : obj.ajaxurl,
            'current_page' : obj.current_page,
            'per_page'     : obj.per_page,
            'max_page'     : obj.max_page,
            'cat_id'       : obj.cat_id,
            'tag_id'       : obj.tag_id,
            'brand_id'     : obj.brand_id,
            'filter_cat'   : obj.filter_cat,
            'layered_nav'  : obj.layered_nav,
            'on_sale'      : obj.on_sale,
            'in_stock'     : obj.in_stock,
            'orderby'      : obj.orderby,
            'min_price'    : obj.min_price,
            'max_price'    : obj.max_price,
            'product_style': obj.product_style,
            'column'       : obj.column,
            'no_more'      : obj.no_more,
            'is_search'    : obj.is_search,
            'is_shop'      : obj.is_shop,
            'is_brand'     : obj.is_brand,
            'is_cat'       : obj.is_cat,
            'is_tag'       : obj.is_tag,
            's'            : obj.s
        };

        if ( obj.current_page == obj.max_page ) {
            $('.anarkali-load-more').addClass('no-more').text(obj.no_more);
            setTimeout(function(){
                $('.row-infinite').slideUp('slow');
            }, 3000);
            return;
        }

        $.post(obj.ajaxurl, data, function(response) {
            $('div.anarkali-products.row').append(response);

            $(document.body).trigger('anarkali_quick_shop');
            $('body').trigger('anarkali_quick_init');
            $(document.body).trigger('anarkali_variations_init');

            if ( $('.anarkali-loop-slider') ) {
                $('.anarkali-loop-slider:not(.swiper-initialized)').each(function () {
                    const options  = $(this).data('swiper-options');
                    const mySlider = new NTSwiper(this, options);
                });
            }

            if ( obj.current_page == obj.max_page ) {
                $('.anarkali-load-more').addClass('no-more').text(obj.no_more);
                setTimeout(function(){
                    $('.row-infinite').slideUp('slow');
                }, 3000);
                return false;
            }

            $(document.body).trigger('anarkali_masonry_init');

            obj.current_page++;

            if ( obj.current_page == obj.max_page ) {
                $('.anarkali-load-more').addClass('no-more').text(obj.no_more);
                setTimeout(function(){
                    $('.row-infinite').slideUp('slow');
                }, 3000);
                return false;
            }

            $(window).data('ajaxready', true);
        });

        return false;
    }
});
