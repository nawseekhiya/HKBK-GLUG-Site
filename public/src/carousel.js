// document.addEventListener('DOMContentLoaded', () => {
//     const carouselSlide = document.querySelector('.carousel-slide');
//     const slides = document.querySelectorAll('.carousel-slide .card');
//     const slideCount = slides.length;
//     const slideWidth = slides[0].clientWidth;
//     let currentIndex = 0;
//     let interval;

//     // Clone the first and last slides for infinite effect
//     carouselSlide.appendChild(slides[0].cloneNode(true));
//     carouselSlide.insertBefore(slides[slideCount - 1].cloneNode(true), slides[0]);

//     // Set initial position to the first slide
//     carouselSlide.style.transform = `translateX(-${slideWidth}px)`;

//     function showNextSlide() {
//         currentIndex++;
//         carouselSlide.style.transition = 'transform 1s ease-in-out';
//         carouselSlide.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;

//         // Check for transition end to reset position for circular effect
//         carouselSlide.addEventListener('transitionend', function transitionEnd() {
//             if (currentIndex === slideCount) {
//                 setTimeout(() => {
//                     carouselSlide.style.transition = 'none';
//                     currentIndex = 1; // Reset to Slide 2
//                     carouselSlide.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
//                 }, 1000); // Delay after reaching last slide, adjust as needed
//             }
//             carouselSlide.removeEventListener('transitionend', transitionEnd);
//         });
//     }

//     function showPrevSlide() {
//         currentIndex--;
//         carouselSlide.style.transition = 'transform 1s ease-in-out';
//         carouselSlide.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;

//         // Check for transition end to reset position for circular effect
//         carouselSlide.addEventListener('transitionend', function transitionEnd() {
//             if (currentIndex === -1) {
//                 setTimeout(() => {
//                     carouselSlide.style.transition = 'none';
//                     currentIndex = slideCount - 2; // Adjust to Slide 7
//                     carouselSlide.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;
//                 }, 1000); // Delay after reaching first slide, adjust as needed
//             }
//             carouselSlide.removeEventListener('transitionend', transitionEnd);
//         });
//     }

//     // Auto slide every 3 seconds
//     interval = setInterval(showNextSlide, 3000);

//     // Optional: Add navigation buttons
//     document.querySelector('#nextBtn').addEventListener('click', () => {
//         clearInterval(interval);
//         showNextSlide();
//         interval = setInterval(showNextSlide, 3000);
//     });

//     document.querySelector('#prevBtn').addEventListener('click', () => {
//         clearInterval(interval);
//         showPrevSlide();
//         interval = setInterval(showNextSlide, 3000);
//     });
// });




document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector(".carousel-slide");
    const arrowBtns = document.querySelectorAll(".carousel-container i");
    const wrapper = document.querySelector(".carousel-container");

    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard.offsetWidth;

    let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
        if (!isDragging) return;

        const newScrollLeft = startScrollLeft - (e.pageX - startX);

        if (newScrollLeft <= 0 || newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
            isDragging = false;
            return;
        }

        carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
        centerEvenCard();
    };
    
    const centerEvenCard = () => {
        const scrollLeft = carousel.scrollLeft;
        const totalWidth = carousel.scrollWidth;
        const visibleWidth = carousel.offsetWidth;
        const firstCardWidth = carousel.querySelector(".card").offsetWidth;
    
        const cardsInView = Math.floor(visibleWidth / firstCardWidth);
        let centerCardIndex = Math.round((scrollLeft + visibleWidth / 2) / firstCardWidth);
    
        if (centerCardIndex % 2 === 1) {
            centerCardIndex = Math.min(centerCardIndex + 1, Math.floor(totalWidth / firstCardWidth) - 1);
        }
    
        const newScrollLeft = centerCardIndex * firstCardWidth - (visibleWidth - firstCardWidth) / 2;
        carousel.scrollLeft = newScrollLeft;
    };
    
    const autoPlay = () => {
        if (window.innerWidth < 800) return;
    
        const totalCardWidth = carousel.scrollWidth;
        const maxScrollLeft = totalCardWidth - carousel.offsetWidth;
    
        if (carousel.scrollLeft >= maxScrollLeft) return;
    
        timeoutId = setTimeout(() => {
            carousel.scrollLeft += firstCardWidth;
            centerEvenCard();
        }, 2500);
    };
    

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);

    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
            centerEvenCard();
        });
    });

    autoPlay();
});
