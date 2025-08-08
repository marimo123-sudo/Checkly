function decodeStartAppParam(startapp) {
    if (!startapp) return {};

    const decoded = decodeURIComponent(startapp);
    const params = {};

    decoded.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            params[key] = value || '';
        }
    });

    return params;
}


window.addEventListener("load", async () => {
    document.body.classList.add("loaded")
});


function encodeParams(params) {
    return new URLSearchParams(params).toString();
}

function isDesktop() {
    const ua = navigator.userAgent.toLowerCase();
    return !/android|iphone|ipad|ipod|mobile/i.test(ua);
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
            path: 'gif/crocodile_died.json'
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


document.addEventListener("DOMContentLoaded", () => {

    // if (isDesktop()) {
    //     console.log("Пользователь, скорее всего, за ноутбуком/ПК");
    //     // Твоя логика тут
    //     var pc_container = document.getElementById("pc_container");
    //     var cont1 = document.getElementById("container_for_name");
    //     var cont2 = document.getElementById("load_and_version");
    //     cont1.style.display = "none";
    //     cont2.style.display = "none";

    //     pc_container.style.display = "flex";
    //     loadAnimation();
    //     return
    // }
    const tg = window.Telegram.WebApp;
    if (!tg) {
        window.close();
    }
    const formData = new FormData();
    formData.append('tg_id', tg.initDataUnsafe?.user?.id);
    formData.append('name', tg.initDataUnsafe?.user?.first_name);
    formData.append('username', tg.initDataUnsafe?.user?.username);

    fetch('https://otzoviktg.ru/verify_user', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('tgWebAppStartParam');
        const decodedParams = decodeStartAppParam(startParam);
        var status = data['status'];
        const queryString = encodeParams(decodedParams);
        console.log('Параметры для перехода:', queryString);
        console.log(status);
        
        setTimeout(() => {
            if (status == "new_user") {
                window.location = "first_time.html";
            }
            else {
                if (queryString) {
                    window.location.href = `profile.html?${queryString}`;
                } else if (data.status === 'new_user') {
                    window.location.href = "profile.html";
                } else {
                    window.location.href = "profile.html";
                }
            }
        }, 3000);
    })
    .catch(err => console.error('Ошибка запроса:', err));
});
