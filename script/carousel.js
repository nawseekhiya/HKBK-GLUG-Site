let currentIndex = 0;

function showNextSlide() {
    const slides = document.querySelectorAll('.carousel-slide .card');
    const totalSlides = slides.length;
    const slideWidth = slides[0].clientWidth;
    const carouselSlide = document.querySelector('.carousel-slide');

    currentIndex = (currentIndex + 1) % totalSlides;
    carouselSlide.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

setInterval(showNextSlide, 3000); // Change slide every 3 seconds
