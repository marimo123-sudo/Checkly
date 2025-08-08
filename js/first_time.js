let current = 0;
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    var btn = document.querySelector(".next_btn")
    // Обработка "next"
    if (index === "next") {
        if (current >= 2) {
            window.location = "profile.html";
            return
        }
        current += 1;
    }
    // Обработка числового индекса
    else if (typeof index === 'number') {
        if (index < 0 || index > 2) {
            if (index > 2) {
                window.location = "profile.html";
            }
            return
        }; // Проверка границ
        current = index;
    }
    if (current == 0) {
        btn.textContent = "Продолжить"
    }
    else if (current == 1) {
        btn.textContent = "Ясно!"
    }
    else {
        btn.textContent = "Дальше"
    }
    // Применяем трансформацию
    slides.style.transform = `translateX(-${current * 100}vw)`;
    
    // Обновляем точки
    dots.forEach(dot => dot.classList.remove('active'));
    dots[current]?.classList.add('active'); // ?. на случай если dots[current] не существует
}

let animation;
let isPlaying = false;

function loadAnimation() {
    if (isPlaying) return;

    if (!animation) {
        animation = lottie.loadAnimation({
            container: document.getElementById('lottie-container'),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'gif/crocodile_water.json'
        });

        animation.addEventListener('complete', () => {
            isPlaying = false;
        });

        isPlaying = true;
    } else {
        isPlaying = true;
        animation.goToAndPlay(0, true); // запускаем с начала
    }
}


loadAnimation();


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
