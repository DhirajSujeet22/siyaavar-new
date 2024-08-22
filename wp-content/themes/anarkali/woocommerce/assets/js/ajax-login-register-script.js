(function(window, document, $) {

    "use strict";

    $(document).ready(function($) {
        var login_button = $('.woocommerce-form-login.anarkali-ajax-login button'),
            reg_button   = $('.woocommerce-form-register button'),
            form_height  =  $('.account-area-form-wrapper .woocommerce-form-login.anarkali-ajax-login').outerHeight(),
            req_string   = anarkali_vars.required,
            valid_email  = anarkali_vars.valid_email;

        login_button.append('<span class="loading-wrapper"><span class="ajax-loading"></span></span>');
        login_button.after('<div class="anarkali-login-message" style="display:none"></div>');
        reg_button.append('<span class="loading-wrapper"><span class="ajax-loading"></span></span>');
        reg_button.after('<div class="anarkali-register-message" style="display:none"></div>');

        // AJAX login
        $(document).on("submit", '.woocommerce-form-login.anarkali-ajax-login', function(e){

            var form             = $(this),
                username         = form.find("#username"),
                username_parent  = username.parent(),
                password         = form.find("#password"),
                password_parent  = password.parents('.anarkali-is-required'),
                message_div      = form.find('.anarkali-login-message'),
                error;

            if ( username.val() === '' ) {
                username.attr('placeholder',req_string );
                showerror( username_parent );
                error = true;
            } else {
                hideerror( username_parent );
            }

            if ( password.val() == '' ) {
                password.attr('placeholder',req_string );
                showerror( password_parent );
                error = true;
            } else {
                hideerror( password_parent );
            }

            if ( error == true ) {
                return false;
            }

            login_button.addClass("loading");

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: anarkali_vars.ajax_url,
                data: form.serialize(),
                success: function(data){

                    login_button.removeClass("loading");

                    if ( data.loggedin == true ) {

                        message_div.addClass('anarkali-success').html(data.message).show();
                        setTimeout( function(){
                            if ( data.redirect != false ) {
                                window.location = data.redirect;
                            } else {
                                window.location.reload();
                            }
                        },2000 );

                    } else {
                        if ( data.invalid_username == true ) {
                            showerror( username_parent );
                            message_div.addClass('anarkali-error invalid-username');
                        } else {
                            hideerror( username_parent );
                        }

                        if ( data.incorrect_password == true ) {
                            showerror( password_parent );
                            message_div.addClass('anarkali-error invalid-password');
                        } else {
                            hideerror( password_parent );
                        }

                        if ( data.invalid_username == true || data.incorrect_password == true ) {
                            message_div.html(data.message).show();
                            var height = message_div.height();
                            $(".account-area-form-wrapper").css('min-height', form_height+height+60 );
                        } else {
                            message_div.html(data.message).hide();
                            $(".account-area-form-wrapper").css('min-height', form_height+50 );
                        }
                    }
                    $('body').trigger('anarkali_myaccount_steps_register');
                },
                error: function (jqXHR, exception) {

                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else if (jqXHR.responseText === '-1') {
                        msg = 'Please refresh page and try again.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    message_div.addClass('anarkali-error').html(msg).show();
                    $('body').trigger('anarkali_myaccount_steps_register');
                }
            });
            e.preventDefault();
        });

        // Change event of login username and password
        $(document).on("keyup", '.woocommerce-form-login.anarkali-ajax-login #username', function(e){
            var form     = $('.woocommerce-form-login.anarkali-ajax-login'),
                username = form.find("#username"),
                parent   = username.parents('.anarkali-is-required'),
                error;

            if ( username.val() === '' ){
                showerror( parent );
                username.attr('placeholder',req_string );
                error = true;
            } else {
                hideerror( parent );
            }

            if ( error == true ) {
                return false;
            }
        });

        // Change event of login username and password
        $(document).on("keyup", '.woocommerce-form-login.anarkali-ajax-login #password', function(e){
            var form = $('.woocommerce-form-login.anarkali-ajax-login'),
                error,
                password = form.find("#password"),
                parent = password.parents('.anarkali-is-required');

            if ( password.val() === '' ) {
                showerror( parent );
                password.attr('placeholder',req_string );
                error = true;
            } else {
                hideerror( parent );
            }

            if ( error == true ) {
                return false;
            }
        });

        /*
        * AJAX registration
        */
        jQuery(document).on("submit", '.woocommerce-form-register', function(e){
            var form                = jQuery(this),
                reg_email           = form.find("#reg_email"),
                reg_password        = form.find("#reg_password"),
                reg_email_parent    = reg_email.parent(),
                reg_password_parent = reg_password.parents('.anarkali-is-required'),
                reg_message_div     = form.find('.anarkali-register-message'),
                error;

            if ( reg_email.val() === '' ) {
                reg_email.attr('placeholder',req_string );
                showerror( reg_email_parent );
                error = true;
            } else {
                if ( validateEmail( reg_email.val() ) ) {
                    hideerror( reg_email_parent );
                } else {
                    reg_message_div.addClass('anarkali-error').html(valid_email).show();
                    showerror( reg_email_parent );
                    error = true;
                    var height = reg_message_div.height();
                    $(".account-area-form-wrapper").css('min-height', form_height+height+60 );
                }
            }

            if ( reg_password.val() == '' ) {
                reg_password.attr('placeholder',req_string );
                showerror( reg_password_parent );
                error = true;
            } else {
                hideerror( reg_password_parent );
            }

            if ( error == true ) {
                return false;
            }

            reg_button.addClass("loading");

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: anarkali_vars.ajax_url,
                data: form.serialize(),
                success: function(data){

                    reg_button.removeClass("loading");

                    if ( data.code === 200 ){
                        reg_message_div.addClass('anarkali-success').html(data.message).show();
                        if ( data.redirect != false ) {
                            window.location = data.redirect;
                        } else {
                            window.location.reload();
                        }
                    } else {
	                    reg_message_div.addClass('anarkali-error').html(data.message).show();
                        var height = reg_message_div.height();
                        $(".account-area-form-wrapper").css('min-height', form_height+height+60 );
                    }
                    $('body').trigger('anarkali_myaccount_steps_register');
                },
                error: function (jqXHR, exception) {

                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status === 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status === 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else if (jqXHR.responseText === '-1') {
                        msg = 'Please refresh page and try again.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    reg_button.removeClass("loading");
                    reg_message_div.addClass('anarkali-error').html(msg).show();
                    $(".account-area-form-wrapper").css('min-height', form_height+50 );
                    $('body').trigger('anarkali_myaccount_steps_register');
                }
            });
            e.preventDefault();
        });

        // Change event of registration email
        jQuery(document).on("keyup", '.woocommerce-form-register #reg_email', function(e){
            var form      = jQuery('.woocommerce-form-register'),
                reg_email = form.find("#reg_email"),
                parent    = reg_email.parents('.anarkali-is-required'),
                reg_message_div     = form.find('.anarkali-register-message'),
                error;

            if( reg_email.val() === '' ) {
                showerror( parent );
                reg_email.attr('placeholder',req_string );
                error = true;
            } else {
                if( validateEmail( reg_email.val() ) ) {
                    hideerror( parent );
                    reg_message_div.hide();
                } else {
                    showerror( parent );
                    error = true;
                }
            }

            if ( error == true ) {
                return false;
            }
        });

        // Change event of registration password
        jQuery(document).on("keyup", '.woocommerce-form-register #reg_password', function(e){
            var form         = jQuery('.woocommerce-form-register'),
                reg_password = form.find("#reg_password"),
                parent       = reg_password.parents('.anarkali-is-required'),
                error;

            if ( reg_password.val() == '' ) {
                reg_password.attr('placeholder',req_string );
                showerror( parent );
                error = true;
            } else {
                hideerror(parent);
            }

            if ( error == true ) {
                return false;
            }
        });

        function validateEmail(value){
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(value) == false) {
                return false;
            }
            return true;
        }
        function showerror(element){
            element.addClass("anarkali-invalid");
        }
        function hideerror(element){
            element.removeClass("anarkali-invalid");
        }
    });
})(window, document, jQuery);
