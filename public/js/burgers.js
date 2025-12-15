const burger = document.querySelector('.burger');
const menu = document.querySelector('.side-menu');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close-btn');

burger.addEventListener('click', () => {
  menu.classList.add('open');
  overlay.classList.add('show');
  burger.classList.add('hide');
});

closeBtn.addEventListener('click', () => {
  menu.classList.remove('open');
  overlay.classList.remove('show');
  burger.classList.remove('hide'); 
});

overlay.addEventListener('click', () => {
  menu.classList.remove('open');
  overlay.classList.remove('show');
  burger.classList.remove('hide');
});

