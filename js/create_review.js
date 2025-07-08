let mediaCount = 0;
const maxMedia = 5;
const carousel = document.getElementById('carousel');
const dotsContainer = document.getElementById('dots');
let currentIndex = 0;
var uploadedFiles = []
let product_id;
let user_tg_id;



document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    tg.ready();  
    tg.BackButton.show();
    
    tg.BackButton.onClick(() => {
        window.history.back();
    });
    const params = new URLSearchParams(window.location.search);
    
    const user = params.get("user");
    const product = params.get("product_id");

    if (user) {
        console.log("Пользователь:", user);
        user_tg_id = user;
        show_second_question();
    } else if (product) {
        console.log("Продукт:", product);
        product_id = product;
        show_second_question();
    } else {
        console.log("Нет параметров user или product_id в URL");
    }
    
    
});







function handleFile(input) {
    const file = input.files[0];
    if (!file || mediaCount >= maxMedia) return;

    uploadedFiles.push(file);
    const page = document.createElement('div');
    page.className = 'media-page';

    const url = URL.createObjectURL(file);

    if (file.type.startsWith('image')) {
        const img = document.createElement('img');
        img.src = url;
        page.appendChild(img);
    } else if (file.type.startsWith('video')) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        page.appendChild(video);
    }

    const addButton = carousel.querySelector('.add-button');
    carousel.insertBefore(page, addButton);
    mediaCount++;

    if (mediaCount >= maxMedia) {
        addButton.remove();
    }

    currentIndex++;
    updateCarousel();
    updateDots();
}

updateDots();




function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 85}vw)`;
    updateDots();
}

function updateDots() {
    const totalSlides = carousel.children.length;
    dotsContainer.innerHTML = "";

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === currentIndex) {
            dot.classList.add("active");
        }
        dotsContainer.appendChild(dot);
    }
}

// свайп
let startX = 0;

carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < carousel.children.length - 1) {
            currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
            currentIndex--;
        }
        updateCarousel();
    }
});


let selectedRating = 0;
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');

stars.forEach(star => {
  star.addEventListener('click', () => {
      selectedRating = +star.dataset.value;
      updateStars();
    });
});

function updateStars() {
  stars.forEach(star => {
    star.classList.toggle('active', +star.dataset.value <= selectedRating);
  });
  ratingValue.textContent = selectedRating;
}

// начальная установка
updateStars();



const input = document.querySelector('.second');
const btn = document.querySelector('.finish_review');

let currentRating = 1; // начальное значение (как в разметке)

function checkFields() {
  // Проверяем, что отзыв не пустой (убираем пробелы)
  const reviewFilled = input.textContent.trim().length > 0;
  
  // Проверяем, что рейтинг больше 0 (здесь ratingValue должен быть числом > 0)
  const ratingFilled = parseInt(ratingValue.textContent) > 0;
  
  // Если оба true — активируем кнопку, иначе дизейблим
  if (reviewFilled && ratingFilled) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }
}

// Обновляем рейтинг при клике на звезду
stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.getAttribute('data-value'));
    currentRating = value;
    ratingValue.textContent = value;

    // Обновляем классы для подсветки звёзд
    stars.forEach(s => {
      s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= value);
    });

    checkFields();
  });
});

// Отслеживаем изменения в поле с отзывом
input.addEventListener('input', () => {
  checkFields();
});

// Проверяем состояние при загрузке страницы
checkFields();






function forceLoadAnimation(i) {
    // Если есть текущая анимация — уничтожаем её мгновенно
    if (animation) {
        isPlaying = false
        animation.destroy();
        animation = null;
    }
    loadAnimation(i);
}
let animation;
let isPlaying = false;

let currentAnimation = null;

var animationPhase0 = lottie.loadAnimation({
        container: document.getElementById('anim0'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'gif/crocodile_laptop.json'
    });

var animationPhase1 = lottie.loadAnimation({
    container: document.getElementById('anim1'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: 'gif/crocodile_dance.json'
});

var animationPhase2 = lottie.loadAnimation({
    container: document.getElementById('anim2'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: 'gif/crocodile_cry.json'
});

function hideAllAnimations() {
    document.getElementById('anim0').style.display = 'none';
    document.getElementById('anim1').style.display = 'none';
    document.getElementById('anim2').style.display = 'none';
}

function loadAnimation(i) {
    if (isPlaying) return;

    let next;
    let containerId;
    hideAllAnimations();
    if (i === 0) {
        next = animationPhase0;
        containerId = 'anim0';
    } else if (i === 1) {
        next = animationPhase1;
        containerId = 'anim1';
    } else {
        next = animationPhase2;
        containerId = 'anim2'; // !!! У тебя оба phase1 и phase2 используют anim1
    }

    if (next) {
        hideAllAnimations();
        document.getElementById(containerId).style.display = 'block';

        next.loop = i === 1 || i === 2;
        next.goToAndPlay(0, true);
        currentAnimation = next;
        isPlaying = true;

        // Когда анимация закончится, сбросим isPlaying
        if (!next.loop) {
            next.addEventListener('complete', () => {
                isPlaying = false;
            });
        } else {
            isPlaying = false; // Если loop, можно сразу снять блокировку
        }
    }
}



async function sendReview() {
    const tg_id = Telegram.WebApp.initDataUnsafe.user.id;
    const username = document.querySelector('.input.us').innerText.trim();
    const review_txt = document.getElementById('review_txt').innerText.trim();
    const rating = parseInt(document.getElementById('ratingValue').textContent);
    const formData = new FormData();
    const type = document.getElementById("selectedType").textContent.trim();
    if (product_id) {
        formData.append("product_id", product_id)
    }
    else if (user_tg_id) {
        formData.append("to_user_tg_id", user_tg_id)
    }
    else {
        if (type == "User") {
            formData.append("to_user_username", username)
        }
        else {
            formData.append("product_username", username)
        }
    }

    formData.append("tg_id", tg_id);
    formData.append("text", review_txt);
    formData.append("stars", rating);

    // Добавим все файлы из carousel (кроме кнопки добавления)
    const carousel = document.getElementById("carousel");
    if (uploadedFiles) {
        uploadedFiles.forEach(file => {
            formData.append("photos", file);
        });
    }
    else {
        formData.append("photos", []);
    }

    console.log(tg_id, review_txt, rating, username);
    
    try {
        const response = await fetch('https://otzoviktg.ru/add_review', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data['detail'] == "Продукт не найден")
            return false
        return data
    } catch (err) {
        console.error('Error sending review:', err);

        return false
    }
}


document.querySelector('.finish_review').addEventListener('click', async () => {
    await second_phase();
});


async function second_phase() {
    // Убедимся, что блок вообще показан
    const secondPhase = document.querySelector('.second_phase');
    const first_phase = document.querySelector(".first_phase");
    first_phase.style.display = "none"
    secondPhase.style.display = 'block';
    setTimeout(() => {
        loadAnimation(0);
    }, 50);
    var result = await sendReview()
    await new Promise(resolve => setTimeout(resolve, 3500));
    console.log(result);
    
    if (result) {
        forceLoadAnimation(1);
        var txt = document.querySelector(".publication_txt")
        txt.textContent = "Готово!"
        var img = document.querySelector(".loading")
        img.style.display = "none"
        const hiddenContent = document.querySelector('.second_phase .hidden_content');
        hiddenContent.style.display = 'block'; // или можно использовать classList.add('show') если ты хочешь анимацию
        let link;
        if (result['product_id'] != 0) {
            link = `profile.html?product_id=${result['product_id']}`;
        }
        else if (result['tg_id'] != 0) {
            link = `profile.html?user=${result['tg_id']}`;
        }
        if (link) {
            setTimeout(() => {window.location = link}, 2000);
        }
        else {
            // setTimeout(() => {window.history.back();}, 4000);
        }
    }
    else {
        forceLoadAnimation(2);
        var txt = document.querySelector(".publication_txt")
        txt.textContent = "Не удалось найти"
        var img = document.querySelector(".loading")
        img.style.display = "none"
        const hiddenContent = document.querySelector('.second_phase .hidden_content');
        hiddenContent.style.display = 'block'; // или можно использовать classList.add('show') если ты хочешь анимацию
        setTimeout(() => {window.history.back();}, 4000);
        
    }
    
}


document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector('.input.us');
    const button = document.querySelector('.next_btn');
    const type = document.getElementById("selectedType");

    function check_is_valid() {
        const text = input.innerText.trim();
        const selectedType = type.textContent.trim();

        const isValid = (
            ((text.startsWith('@') && text.length >= 5) ||
            (!text.startsWith('@') && text.length >= 4)) &&
            selectedType !== "Type..."
        );

        if (isValid) {
            button.disabled = false;
            button.style.opacity = "1";
            button.style.cursor = "pointer";
        } else {
            button.disabled = true;
            button.style.opacity = "0.7";
            button.style.cursor = "not-allowed";
        }
    }

    // Обновлять при изменении input'а
    input.addEventListener('input', check_is_valid);

    // Так как selectedType — просто <span>, на него не сработает input
    // Решение: каждый раз при выборе типа вручную вызывать check_is_valid

    window.selectType = function (value) {
        type.textContent = value;
        document.getElementById("optionsList").display = "none";
        check_is_valid(); // обновить кнопку
    };

    var options = document.getElementById("optionsList");
    options.addEventListener("click", function () {
        console.log(1);
        
        options.style.display = "none";
    }) 
});


function show_second_question() {
    const current = document.getElementById('0');
    const next = document.getElementById('1');

    current.classList.remove('active');
    next.classList.add('active');
}







function toggleOptions() {
  const list = document.getElementById("optionsList");
  list.style.display = list.style.display === "block" ? "none" : "block";
}

function selectType(value) {
  document.getElementById("selectedType").innerText = value;
  document.getElementById("optionsList").style.display = "none";
  // Если нужно — отправим значение формы:
  // Например, в скрытый input:
}

// Закрытие при клике вне
document.addEventListener("click", function(event) {
  const wrapper = document.querySelector(".select-wrapper");
  if (!wrapper.contains(event.target)) {
    document.getElementById("optionsList").style.display = "none";
  }
});
