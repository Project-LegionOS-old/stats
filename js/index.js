$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    margin: 10,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: true,
      },
      600: {
        items: 3,
        nav: false,
        loop: true,
      },
      1000: {
        items: 4,
        nav: true,
        loop: true,
      },
    },
  });
});
