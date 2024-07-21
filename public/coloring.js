const cards = document.querySelectorAll('.join-card');

const colors = [
  '#c21111', // Red
  '#59ab64', // Green
  '#4D96FF', // Blue
  '#a17e23', // Yellow
  '#9B59B6', // Purple
  '#c26a11', // Orange
  '#2980B9',  // Cyan
  '#e07a5f'
];

cards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    const randomColor = colors[index];
    card.style.backgroundColor = `${randomColor}12`; // Set background color with 20% opacity
    card.style.boxShadow = `inset 0 0 200px rgba(255, 255, 255, 0.8), inset 0 0 140px ${randomColor}, 0 8px 45px rgba(0, 0, 0, 0.2), 0 12px 80px rgba(0, 0, 0, 0.0)`;; // Add glow effect
    const subtext = card.querySelector('.join-subtext');
    subtext.style.transform = 'translate(-50%, -50%) translateY(-30px)';
    subtext.style.opacity = '1';
    subtext.style.color = randomColor; // Set subtext color directly without opacity
  
});

  card.addEventListener('mouseleave', () => {
    card.style.backgroundColor = '';
    card.style.boxShadow = ''; // Reset box shadow
    const subtext = card.querySelector('.join-subtext');
    subtext.style.transform = 'translate(-50%, -50%)';
    subtext.style.opacity = '0';
    subtext.style.color = 'white'; // Reset subtext color to white
  });

});
