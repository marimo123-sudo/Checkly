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
            path: 'gif/flower.json'
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

document.addEventListener("DOMContentLoaded", async () => {
    var response = await fetch(`https://otzoviktg.ru/get_avatar?tg_id=${window.Telegram.WebApp.initDataUnsafe?.user.id}`)
    var data = await response.json();
    console.log(data);
    var el = document.querySelector('.profile_img')
    if (el.style.height == "0" || data['link'][0] == null) {
        el.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
    }
    else {
        el.src = data['link'][0];
    }
    var center_img = document.getElementById("plus_img");
    center_img.style.height = "33%";
    
});

// Автозапуск при загрузке
loadAnimation();

function open_telegraph() {
    const url = "https://telegra.ph/Checkly--chtoby-doverie-v-Telegram-bylo-osoznannym-07-05";
    window.open(url, "_blank");
}

var search_btn = document.querySelector(".arrow-button")
const inputDiv = document.querySelector('.input');

search_btn.addEventListener("click", async () => {
    if (inputDiv.textContent.trim().length >= 4) {
        await startSearch();
    }
});


async function startSearch() {
    const input = document.querySelector('.input');
    const query = input.textContent.trim();
    var response
    var is_user = false
    if (query) {
        if (/^\d+$/.test(query)) {
            if (query.includes("-100")) {
                query = query.replace("-100", "")
            }
            response = await fetch(`https://otzoviktg.ru/get_product_info?chat_id=${query}&tg_id=${window.Telegram.WebApp.initDataUnsafe?.user.id}`);
        }
        else {
            response = await fetch(`https://otzoviktg.ru/get_product_info?username=${query}&tg_id=${window.Telegram.WebApp.initDataUnsafe?.user.id}`);
        }
        var data = await response.json();
        console.log(data);
        console.log(response);
        if ("error" in data) {
            console.log("error");
            var sms = document.querySelector(".link_copied");
            sms.classList.add("move-up");
            sms.textContent = data['message'];
            setTimeout(() => {
                sms.classList.remove('move-up');
            }, 2000);
            return
        }
        if (data['detail'] == "Product not found") {
            console.log("error");
            var sms = document.querySelector(".link_copied");
            sms.classList.add("move-up");
            sms.textContent = "Не удалось найти"
            setTimeout(() => {
                sms.classList.remove('move-up');
            }, 2000);
        }
        else {
            if (data["type"] == "user") {
                is_user = true;
            }
            var link;
            if (is_user) {
                link = `profile.html?user=${data['info']}`;
            }
            else {
                link = `profile.html?product_id=${data['info'][0]}`;
            }
            window.location = link;
        }
    }
}





inputDiv.addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();

        // Удаляем всё содержимое кроме текста без переноса
        inputDiv.innerText = inputDiv.innerText.replace(/\n/g, '').trim();

        await startSearch();
    }
});


window.addEventListener('load', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.BackButton.hide();
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('appContent').style.display = 'flex';
    }, 1000);
});
