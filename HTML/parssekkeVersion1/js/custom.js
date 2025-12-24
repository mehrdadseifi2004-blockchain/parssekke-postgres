(function ($) {
    "use strict";
  
    $(document).ready(function () {
  
      /* ----------------------------
         Slideshow
      ----------------------------- */
      if ($('.slideshow').length) {
        $('.slideshow').owlCarousel({
          items: 1,
          autoplay: true,
          nav: true,
          dots: true,
          navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
          ]
        });
      }
  
      /* ----------------------------
         Banner Slider
      ----------------------------- */
      if ($('.banner').length) {
        $('.banner').owlCarousel({
          items: 1,
          autoplay: true,
          dots: false,
          nav: false,
          animateOut: 'fadeOut'
        });
      }
  
      /* ----------------------------
         Brand Slider
      ----------------------------- */
      if ($('#carousel').length) {
        $('#carousel').owlCarousel({
          items: 6,
          autoplay: true,
          lazyLoad: true,
          nav: true,
          dots: true,
          navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
          ]
        });
      }
  
      /* ----------------------------
         Tooltips
      ----------------------------- */
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
  
      /* ----------------------------
         Scroll To Top
      ----------------------------- */
      $(window).on('scroll', function () {
        if ($(this).scrollTop() > 150) {
          $('#back-top').fadeIn();
        } else {
          $('#back-top').fadeOut();
        }
      });
  
      $('#back-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        return false;
      });
  
    });
  
  })(jQuery);
  