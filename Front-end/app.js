// script.js

const bigWrapper = document.querySelector('.big-wrapper');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const overlay = document.querySelector('.overlay');

// Add event listener to hamburger menu
hamburgerMenu.addEventListener('click', () => {
  bigWrapper.classList.toggle('open');
  overlay.classList.toggle('open');
});

// Add event listener to overlay
overlay.addEventListener('click', () => {
  bigWrapper.classList.remove('open');
  overlay.classList.remove('open');
});

// Add event listener to light/dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
  const lightDarkModeToggle = document.createElement('button');
  lightDarkModeToggle.textContent = 'Toggle Light/Dark Mode';
  lightDarkModeToggle.classList.add('light-dark-mode-toggle');
  document.body.appendChild(lightDarkModeToggle);

  lightDarkModeToggle.addEventListener('click', () => {
    bigWrapper.classList.toggle('dark');
  });
});         