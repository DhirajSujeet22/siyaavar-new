(function(window, document, $) {

  "use strict";

	jQuery(document).ready(function( $ ) {

        // masonry
        var masonry = $('.anarkali-masonry-container');
        if ( masonry.length ) {
            //set the container that Masonry will be inside of in a var
            var container = document.querySelector('.anarkali-masonry-container');
            //create empty var msnry
            var msnry;
            // initialize Masonry after all images have loaded
            imagesLoaded( container, function() {
               msnry = new Masonry( container, {
                   itemSelector: '.anarkali-masonry-container>div'
               });
            });
        }

        var block_check = $('.nt-single-has-block');
        if ( block_check.length ) {
            $( ".nt-anarkali-content ul" ).addClass( "nt-anarkali-content-list" );
            $( ".nt-anarkali-content ol" ).addClass( "nt-anarkali-content-number-list" );
        }
        $( ".anarkali-post-content-wrapper>*:last-child" ).addClass( "anarkali-last-child" );


        // add class for bootstrap table
        $( ".menu-item-has-shortcode" ).parent().parent().addClass( "menu-item-has-shortcode-parent" );
        $( ".nt-anarkali-content table, #wp-calendar" ).addClass( "table table-striped" );
        $( ".woocommerce-order-received .nt-anarkali-content table" ).removeClass( "table table-striped" );
        // CF7 remove error message
        $('.wpcf7-response-output').ajaxComplete(function(){
            window.setTimeout(function(){
                $('.wpcf7-response-output').addClass('display-none');
            }, 4000); //<-- Delay in milliseconds
            window.setTimeout(function(){
                $('.wpcf7-response-output').removeClass('wpcf7-validation-errors display-none');
                $('.wpcf7-response-output').removeAttr('style');
            }, 4500); //<-- Delay in milliseconds
        });
        if ( $('.woocommerce-ordering select').length ) {
            $('.woocommerce-ordering select').niceSelect();
        }
        if ( $('.anarkali-ajax-product-search select').length ) {
            $('.anarkali-ajax-product-search select').niceSelect();
            $('.anarkali-ajax-product-search .nice-select .list').addClass('anarkali-scrollbar');
        }
        // Animate loader off screen
        $('#nt-preloader').fadeOut(1000);
    }); // end ready

    // Animate loader off screen
    $('#nt-preloader').fadeOut(1000);
    
})(window, document, jQuery);
