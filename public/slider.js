let slider = tns({
  container: ".the-team-behind-slider-wrapper",
  items: 2,
  // startIndex: 3,
  autoplay: true,
  autoplayTimeout: 3000,
  navPosition: "bottom",
  autoplayHoverPause: true,
  navContainer: ".the-team-behind-nav-container",
  autoplayButtonOutput: false,
  mouseDrag: true,
  controls: false,
  responsive: {
    350: {
      items: 1,
      controls: false,
      edgePadding: 50,
    },
    500: {
      items: 1,
    },
    800: {
      items: 1
    },
    1100: {
      items: 2
    },
    1600: {
      items: 3
    },
    1400: {
      items: 2
    },
    1100:{
      items: 1.5
    }
  },
  swipeAngle: false,
  speed: 500,
});
