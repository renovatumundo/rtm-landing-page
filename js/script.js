$(function () {
    $('.nav-btn').on('click', function () {
        $(this).toggleClass('open');
    });
});

$(window).ready(function () {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > 100) {
            $("#header").addClass('glass-effect');
        } else {
            $("#header").removeClass("glass-effect");
        }
    })
})

// Flip cards touch support for mobile devices
$(document).ready(function () {
    // Check if device is mobile/tablet
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }

    // Add touch event listeners for flip cards on mobile
    if (isMobileDevice()) {
        $('.services-repair-section .flip-card').on('click touchstart', function (e) {
            // Check if the clicked element is a button or inside a button
            if ($(e.target).is('button') || $(e.target).closest('button').length > 0) {
                // Allow button click to proceed, don't flip the card
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Remove flipped class from all other cards
            $('.services-repair-section .flip-card').not(this).removeClass('flipped');

            // Toggle flipped class on current card
            $(this).toggleClass('flipped');
        });

        // Close flipped cards when clicking outside
        $(document).on('click touchstart', function (e) {
            // Check if the clicked element is a button or inside a button
            if ($(e.target).is('button') || $(e.target).closest('button').length > 0) {
                // Allow button click to proceed
                return;
            }

            if (!$(e.target).closest('.flip-card').length) {
                $('.services-repair-section .flip-card').removeClass('flipped');
            }
        });
    }
});



