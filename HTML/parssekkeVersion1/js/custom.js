(function ($) {
  "use strict";
  
  $(document).ready(function () {
  
    /* ========= SAFE OWL INIT ========= */
    function safeOwl(selector, options) {
      if ($(selector).length && $.fn.owlCarousel) {
        $(selector).owlCarousel(options);
      }
    }
  
    /* Slideshow */
    safeOwl('.slideshow', {
      items: 1,
      autoPlay: 3000,
      navigation: true,
      pagination: true
    });
  
    /* Banner */
    safeOwl('.banner', {
      items: 1,
      autoPlay: 3000,
      singleItem: true,
      pagination: false,
      transitionStyle: 'fade'
    });
  
    /* ❌ PRODUCT CAROUSEL حذف شد */
    /* این بخش نباید اینجا باشد */
    /*
    $(".owl-carousel.product_carousel").owlCarousel(...)
    */
  
    /* Brand Slider */
    safeOwl('#carousel', {
      items: 6,
      autoPlay: 3000,
      navigation: true,
      pagination: true
    });
  
    /* Categories Hover */
    if ($(window).width() > 991) {
      $('#menu .nav > li').hover(
        function () { $(this).find('.dropdown-menu').stop(true,true).slideDown('fast'); },
        function () { $(this).find('.dropdown-menu').stop(true,true).hide(); }
      );
    }
  
  });
  })(jQuery);
  