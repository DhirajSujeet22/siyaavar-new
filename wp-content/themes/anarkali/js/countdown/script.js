jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';
    // countdown
    $('[data-countdown]').each(function () {
        var $this = $(this),
            data  = $this.data('countdown'),
            date  = data.date,
            hr    = data.hr,
            min   = data.min,
            sec   = data.sec,
            exp   = data.expired;
        $this.countdown(date, function (event) {
            $this.html(event.strftime('<div class="time-count day"><span>%D</span></div><div class="time-count hour"><span>%H</span></div><div class="time-count min"><span>%M</span></div><div class="time-count sec"><span>%S</span></div>'));
        }).on('finish.countdown', function () {
            if ( exp.length ) {
                $(this).addClass('time-finish').find('.time-count').wrapAll('<div class="time-expired-count"></div>');
                $(this).append('<p class="time-expired-message">'+exp+'</p>');
            }
        });
    });
});
