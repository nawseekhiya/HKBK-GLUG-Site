document.addEventListener("DOMContentLoaded", function () {
  const carouselSlide = document.querySelector(".join-card-carousel-slide");
  const cards = document.querySelectorAll(
    ".join-card-carousel-slide .join-card"
  );
  let counter = 0;

  function slideCards() {
    counter++;
    if (counter >= cards.length) {
      counter = 0;
    }
    carouselSlide.style.transform = `translateX(${-counter * 100}%)`;
  }

  setInterval(slideCards, 5000);
});
