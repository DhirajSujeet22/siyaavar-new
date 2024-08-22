(function($){

    "use strict";

    function productSearch(form,query,currentQuery,timeout){

        var search     = form.find('.anarkali-ajax-search-input'),
            category   = form.find('.anarkali-ajax-category'),
            resultWrap = form.next('.anarkali-ajax-search-results'),
            formWrap   = form.parent(),
            max_char   = anarkali_vars.max_char,
            time_out   = anarkali_vars.time_out;

        formWrap.addClass('active');
        resultWrap.html('').removeClass('active');
        search.parents('.anarkali-header-mobile-content').removeClass('ajax-active search-loading');

        query = query.trim();

        if ( query.length >= max_char ) {

            if ( timeout ) {
                clearTimeout(timeout);
            }

            search.parents('.anarkali-header-mobile-content').addClass('search-loading');
            resultWrap.removeClass('empty').addClass('loading').html('<span class="loading-wrapper"><span class="ajax-loading"></span></span>');
            search.parent().removeClass('active');

            if ( query != currentQuery ) {
                timeout = setTimeout(function() {

                    $.ajax({
                        url:anarkali_vars.ajax_url,
                        type: 'get',
                        data: {
                            action: 'anarkali_ajax_search_product',
                            keyword: query,
                            category: category.val()
                        },
                        success: function(data) {
                            currentQuery = query;

                            resultWrap.removeClass('loading');
                            search.parents('.anarkali-header-mobile-content').removeClass('search-loading').addClass('ajax-active');

                            if ( !resultWrap.hasClass('empty') ) {
                                search.parent().addClass('active');

                                if (data.length) {
                                    resultWrap.html('<ul>'+data+'</ul>').addClass('active').removeClass('anarkali-no-results');;
                                } else {
                                    resultWrap.html(anarkali_vars.no_results).addClass('active anarkali-no-results');
                                }
                            }

                            clearTimeout(timeout);
                            timeout = false;
                        }
                    });

                }, 100);
            }
        } else {

            search.parent().removeClass('loading');
            resultWrap.empty().removeClass('active loading').addClass('empty');

            clearTimeout(timeout);
            timeout = false;
        }
    }

    $('form[name="anarkali-ajax-product-search-form"]').each(function(){

        var form          = $(this),
            search        = form.find('.anarkali-ajax-search-input'),
            category      = form.find('.anarkali-ajax-category'),
            close         = form.find('.anarkali-ajax-close-search-results'),
            resultWrap    = form.next('.anarkali-ajax-search-results'),
            formWrap      = form.parent(),
            currentQuery  = '',
            timeout       = false;

        category.on('change',function(){
            currentQuery  = '';
            var query = search.val();
            productSearch(form,query,currentQuery,timeout);
        });

        search.keyup(function(){
            var query = $(this).val();
            productSearch(form,query,currentQuery,timeout);
        });

        search.on('keypress', function (e) {
            if( e.which === 13 ) {
                var count = resultWrap.find('li').length;
                if ( count == 1 ) {
                    e.preventDefault();
                    var url = resultWrap.find('>ul li a').attr('href');
                    window.location.href = url;
                }
            }
        });

        close.on('click', function (e) {
            search.val('');
            resultWrap.removeClass('active');
            formWrap.removeClass('active');
            $(this).parent().removeClass('active loading');
            $(this).parents('.anarkali-header-mobile-content').removeClass('ajax-active');
        });
    });

    $('.anarkali-product-categories-inner .dropdown-btn').on('click', function (e) {
        var parent_li = $(this).parent();
        var parents_ul = $(this).parents('.anarkali-wc-category-list');
        if ( parent_li.hasClass('active') ) {
            parent_li.removeClass('active');
            parents_ul.removeClass('active');
            $(this).next().removeClass('active').slideUp('slow');
        } else {
            parent_li.addClass('active');
            parents_ul.addClass('active');
            $(this).next().addClass('active').slideDown('slow');
        }
    });

})(jQuery);
