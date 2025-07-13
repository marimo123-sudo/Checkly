
let current = 0;
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
slides.style.transform = `translateX(-${index * 100}vw)`;
dots.forEach(dot => dot.classList.remove('active'));
dots[index].classList.add('active');
current = index;
}

document.addEventListener('keydown', e => {
if (e.key === 'ArrowRight' && current < 2) {
    goToSlide(current + 1);
} else if (e.key === 'ArrowLeft' && current > 0) {
    goToSlide(current - 1);
}
});

let touchStartX = 0;
document.addEventListener("touchstart", e => {
touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
const deltaX = e.changedTouches[0].clientX - touchStartX;
if (deltaX < -50 && current < 2) {
    goToSlide(current + 1);
} else if (deltaX > 50 && current > 0) {
    goToSlide(current - 1);
}
});
