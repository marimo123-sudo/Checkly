const API_URL = 'https://otzoviktg.ru'; // Замените на ваш реальный адрес API
let tg_id;


let animation;
let isPlaying = false;

function loadAnimation() {
    if (isPlaying) return;

    if (!animation) {
        animation = lottie.loadAnimation({
            container: document.getElementById('lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'gif/crocodile_think.json'
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
    const tg = window.Telegram.WebApp;
    tg.ready();
    const user = tg.initDataUnsafe?.user;
    tg_id = user.id;
    tg.BackButton.show();
    
    tg.BackButton.onClick(() => {
        window.history.back();
    });
});




function add_nothing_text(create=false) {
    if (create) {
        var itemHTML = `<div class="nothing_container" id="nothing">
                        <div class="nothing_text">Вы пока ничего<br>не добавили в Избранное</div>
                        <div id="lottie-container" onclick="loadAnimation()"></div>
                    </div>`
        var container = document.getElementById("favourite_container")
        container.insertAdjacentHTML('beforeend', itemHTML);
    }
    var nothing_container = document.getElementById("nothing");
    nothing_container.style.display = 'flex';
    loadAnimation();
}

function open_profile(id) {
    window.location = `profile.html?product_id=${id}`
}

// Получение избранных продуктов
async function loadFavourites() {
    const container = document.querySelector('.favourite_container');
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;
    tg_id = user.id;
    try {
        const response = await fetch(`${API_URL}/get_list_of_favourites?user_id=${tg_id}`);
        const favourites = await response.json();
        console.log(favourites);
        var favourites_countes = favourites.length;
        console.log(favourites_countes);
        if (!favourites_countes) {
            add_nothing_text();
            return;
        }
        container.innerHTML = ''; // Очистим контейнер перед добавлением
        favourites.forEach(product => {
            const itemHTML = `
                <div class="favourite_item_container" data-product-id="${product.id}" onclick="open_profile(${product.id})">
                    <div class="favourite_item_and_bin">
                        <div class="favourite_item">
                            <div class="first_column">
                                <div class="first_line">
                                    <img src="${product.avatar || 'photos/ava.png'}" class="product_ava" alt="">
                                    <div class="name_and_username">
                                        <div class="name">${product.name}</div>
                                        <div class="username">@${product.username}</div>
                                    </div>
                                </div>
                                <div class="second_line">
                                    <div class="subs">Подписчиков: ${product.members}</div>
                                </div>
                            </div>
                            <div class="second_column">
                                <img class="star" src="photos/star.png" alt="">
                                <div class="review">${product.review || '—'}</div>
                            </div>
                        </div>
                        <div class="bin">
                            <img src="photos/bin.png" class="bin_img" alt="" id="delete" onclick="removeFromFavourites(event, ${product.id})">
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });
    } catch (error) {
        add_nothing_text();
        console.error('Ошибка загрузки избранного:', error);
    }
}

function removefavuriteById(id) {
    const reviewElement = document.querySelector(`div[data-product-id="${id}"]`);
    if (reviewElement) {
        reviewElement.remove();
    }
    var favourite_count = document.getElementById("favourite_container").children.length;
    console.log(favourite_count);
    if (favourite_count == 0) {
        add_nothing_text(true);
        
    }
}

window.addEventListener('load', () => {
    document.getElementById('preloader').style.display = 'none';
    document.getElementById('appContent').style.display = 'flex';
});


// Удаление из избранного
async function removeFromFavourites(e, productId) {
    e.stopPropagation(); // 💥 Теперь это работает
    removefavuriteById(productId);
    try {
        const res = await fetch(`${API_URL}/remove_favourite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: tg_id, product_id: productId })
        });

        const result = await res.json();
        console.log("deleted");
        
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
    }
}

// Запуск загрузки при загрузке страницы
document.addEventListener('DOMContentLoaded', loadFavourites);
