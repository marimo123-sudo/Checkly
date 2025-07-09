let tg_id;
var s = 0;
let product_id;
let sent_reviews_count;
let get_reviews_count;
let user_id;
let delete_review_id;
let can_i_write_today = true;
let can_i_write_to_this = true;



var button1 = document.getElementById("search")
var button2 = document.getElementById("plus")
var button3 = document.getElementById("profile")


button1.addEventListener("click", () => {
    window.location = "search.html"
});
button2.addEventListener("click", () => {
    if (!button2.classList.contains('favourite')) {
        if (!can_i_write_to_this || !can_i_write_today) {
            const el = document.getElementById('linkCopied');
            const el_txt = document.getElementById("link_copied_text");
            const el_img = document.getElementById("chain_img");
            el_img.style.display = "none"
            el_txt.style.paddingRight = "2vw";
            el.classList.add('move-up');
            if (!can_i_write_to_this) {
                el_txt.textContent = "Вы уже оставляли тут отзыв";
            }
            else {
                el_txt.textContent = "Истрачен ежедневный лимит";
            }

            setTimeout(() => {
                el.classList.remove('move-up');
            }, 2000);
        }
        else {
            const handler = window.location.search.slice(1); // Убираем "?" и получаем всё остальное
            window.location = `create_review.html?${handler}`;
        }
    } else {
        window.location = "favourite.html";
    }
});
button3.addEventListener("click", () => {
    window.location = "profile.html"
});


function renderReviews(containerId, reviews, is_product=false) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // очищаем предыдущий контент
    
    if (reviews.length === 0) {
        if (containerId == 1) {
            var txt = "Упс!<br>А тут пусто"
        }
        else {
            var txt = "Пусто!<br>попроси оставить<br>о тебе отзыв"
        }
        const empty = document.createElement('div');
        empty.className = 'nothing_container';
        empty.innerHTML = `<div class="nothing">${txt}</div>`;
        container.appendChild(empty);
        return;
    }
    
    
    reviews.forEach(review => {
        var has_bin = "";
        var review_id = review.id;
        if (container) {
            if (user_id == review.from_user_id || user_id == review.user_id) {
                has_bin = `<div class="remove_and_recreate">
                                
                                <img src="photos/bin.png" alt="" class="remove" onclick="delete_review(event, ${review.id})">
                            </div>`;
            }
        }
        if (is_product) {
            var stars = review.stars;
            var review_text = review.text;
            var reviewer_avatar = review.avatar;
            var person_name = review.username;
            var photos = review.photos[0] ? `<img src="${review.photos[0]}" alt="" class="screenshot" onclick='show_screenshots(event, ${JSON.stringify(review.photos)})'>` : '';
            var person_review = review.person_review;
            var link = `user=${review.tg_id}`;
            if (!reviewer_avatar) {
                reviewer_avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
            }
        }
        else {
            var stars = review.stars;
            var review_text = review.text;
            var reviewer_avatar = review.to_product_avatar || review.to_user_avatar || review.from_avatar;
            var person_name = review.to_product_name || review.to_user_name || review.from_name;
            var photos = review.images[0] ? `<img src="${review.images[0] || ""}" alt="" class="screenshot" onclick='show_screenshots(event, ${JSON.stringify(review.images)})'>` : ''
            if (review.to_product_avg_rating) {
                var link = `product_id=${review.to_product_id}`;
            }
            else {
                var link = `user=${review.to_user_tg_id || review.user_tg_id}`;
            }
            if (!reviewer_avatar) {
                reviewer_avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
            }
            var person_review = review.to_product_avg_rating || review.to_user_avg_rating || review.product_avg_rating;
        }
        console.log(link);
        
        const reviewHTML = `
        <div class="review_container mini" data-review-id="${review.id}">
            <div class="review" onclick="open_profile('${link}')">
                <div class="review_id">ID: ${review}</div>
                <div class="first_line">
                    <div class="review_count">${review.stars}</div>
                    <div class="stars">
                        ${'<img src="photos/star.png" alt="" class="review_star">'.repeat(stars)}
                    </div>
                </div>
                <div class="second_line">
                    <div class="first_column">
                        <div class="review_txt">${review_text}</div>
                        <div class="person">
                            <img src=${reviewer_avatar} class="person_ava" alt="">
                            <div class="person_info">
                                <div class="person_name">${person_name}</div>
                                <div class="person_review">
                                    <div class="person_review_int">${person_review}</div>
                                    <img class="person_review_img" src="photos/star.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="second_column">
                        ${photos}
                        ${has_bin}
                    </div>
                </div>
            </div>
        </div>`
        ;
        container.insertAdjacentHTML('beforeend', reviewHTML);
    });
}


window.addEventListener('load', () => {
    document.getElementById('preloader').style.display = 'none';
    document.getElementById('appContent').style.display = 'flex';
});

var favourite_btn0 = document.getElementById("fav0");
var favourite_btn1 = document.getElementById("fav1");
var favourite_index = false;
var started_index = false;
function do_favourite () {
    if (favourite_index == 0) {
        favourite_index = true
        favourite_btn0.style.display = 'none';
        favourite_btn1.style.display = 'block';
    }
    else {
        favourite_index = false
        favourite_btn1.style.display = 'none';
        favourite_btn0.style.display = 'block';
    }
    console.log(favourite_index);
}

let what_is_is



document.addEventListener("DOMContentLoaded", async () => {
    var ava = document.querySelector(".profile_img")
    var bottom_ava = document.querySelector(".bottom_ava")
    var main_review = document.querySelector(".review_number")
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;
    tg_id = user.id;
    const params = new URLSearchParams(window.location.search);
    product_id = params.get("product_id");
    const user_of_profile_id = params.get('user');
    var profile_link = `https://otzoviktg.ru/get_person?tg_id=${tg_id}`;
    if (product_id) {
        profile_link = `https://otzoviktg.ru/get_person?tg_id=${tg_id}&product_id=${product_id}`;
    }
    else if (user_of_profile_id) {
        profile_link = `https://otzoviktg.ru/get_person?tg_id=${user_of_profile_id}&my_tg_id=${tg_id}`;
    }
    console.log(profile_link);
    
    var user_response = await fetch(profile_link);
    const user_data = await user_response.json();
    console.log(user_data);
    try {
        can_i_write_to_this = user_data[8]['can_i_write_to_this'];
        can_i_write_today = user_data[7]['can_i_write_today'];
    }
    catch {
        console.log(12);
        
    }
    user_id = user_data[0];
    var from_me_count = document.getElementById("from_me")
    var for_me_count = document.getElementById("for_me")
    if (ava.style.height == "0" || user_data[3] == null) {
        bottom_ava.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        ava.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
    else {
        ava.src = user_data[3];
        bottom_ava.src = user_data[3];
    }
    main_review.textContent = user_data[4];
    tg.ready();
    tg.BackButton.hide();

    
    // Определяем, чей профиль открывать
    let firstName = user.first_name || "";
    let lastName = user.last_name || "";
    let username = user.username || "";
    
    if (user_of_profile_id) {
        tg_id = user_of_profile_id;
    } else if (user) {
        tg_id = user.id;
    } else {
        console.log("Пользователь не найден и не передан через ссылку");
        return;
    }
    if (product_id) {
        try {
            console.log(product_id);
            what_is_is = "product";
            var product_response = await fetch(`https://otzoviktg.ru/get_reviews?product_id=${product_id}`)
            var product_info = await product_response.json();
            product_data = product_info['product'];
            console.log(product_info);
            document.getElementById("subs").textContent = `${product_data['members']} подписчиков`;
            document.getElementById("name").textContent = product_data["name"]; // предполагаем, что это имя
            document.getElementById("username").textContent = `@${product_data["username"]}`; // предполагаем, что это username
            main_review.textContent = product_data["review"];
            ava.src = product_data["avatar"];
            var btn_from_me = document.querySelector(".from");
            btn_from_me.style.display = 'none';
            console.log(product_data);
            var review_list = product_info['reviews']
            console.log(review_list);
            renderReviews(0, review_list, is_product=true)
            get_reviews_count = review_list.length;
            for_me_count.textContent = get_reviews_count;
            var fav_container = document.getElementById("fav");
            index_response = await fetch(`https://otzoviktg.ru/is_favourite?user_id=${tg_id}&product_id=${product_id}`);
            started_index = await index_response.json();
            started_index = started_index;
            favourite_index = started_index;
            var for_me_txt = document.getElementById("for_me_txt");
            var otzivi_text = document.getElementById("otzivi_txt");
            var wrapper = document.getElementById("wrapper");
            wrapper.style.top = "calc(var(--vh) * 0.264)";

            for_me_txt.textContent = "Отзывы";
            otzivi_text.style.display = "none";

            fav_container.style.display = "flex";
            console.log(favourite_index);
            
            if (favourite_index) {
                favourite_btn0.style.display = 'none';
                favourite_btn1.style.display = 'block';
            }
        }
        catch (err) {
            console.error('Ошибка при получении рейтинга:', err);
        }
    }
    else {
        document.getElementById("subs").style.display = "none";
        // Загружаем данные пользователя
        try {
            // Генерируем ссылку    
    
            // Отображаем рейтинг

            // Если профиль чужой (по ссылке), подставляем имя из API, иначе из Telegram
            if (user_of_profile_id && user_of_profile_id != user.id) {
                what_is_is = "user"
                var for_me_txt = document.getElementById("for_me_txt");
                var otzivi_text = document.getElementById("otzivi_txt");
                var wrapper = document.getElementById("wrapper");
                for_me_txt.textContent = "Отзывы";
                otzivi_text.style.display = "none";
                wrapper.style.top = "calc(var(--vh) * 0.264)";
                var user_of_profile_response = await fetch(`https://otzoviktg.ru/get_person?tg_id=${tg_id}`);
                var user_of_profile_data = await user_of_profile_response.json();
                console.log(user_of_profile_data);
                document.getElementById("name").textContent = user_of_profile_data[2]; // предполагаем, что это имя
                ava.src = user_of_profile_data[3];
                if (ava.style.height == "0" || user_of_profile_data[3] == null) {
                    ava.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                }
                main_review.textContent = user_of_profile_data[4];
                var btn_from_me = document.querySelector(".from")
                btn_from_me.style.display = 'none';
                var reviews_response = await fetch(`https://otzoviktg.ru/get_user_reviews?tg_id=${user_of_profile_id}`)
                var reviews_data = await reviews_response.json();
                console.log(reviews_data);

                var from_me = reviews_data["received_reviews"];
                var for_me = reviews_data["sent_reviews"];
                console.log(from_me, for_me);
                renderReviews(1, for_me);
                renderReviews(0, from_me);
                get_reviews_count = from_me.length;
                for_me_count.textContent = get_reviews_count;
                sent_reviews_count = for_me.length;
                from_me_count.textContent = sent_reviews_count;

            } else {
                what_is_is = "me";
                var center_img = document.getElementById("plus_img");
                var center_btn = document.getElementById("plus");
                center_btn.classList.add("favourite");
                center_img.classList.add("favourite");
                center_img.src = "photos/favourite.png";
                center_img.style.height = "33%"
                document.getElementById("name").textContent = `${firstName} ${lastName}`.trim();
                document.getElementById("username").textContent = username ? `@${username}` : "@Anonim";
                var reviews_response = await fetch(`https://otzoviktg.ru/get_user_reviews?tg_id=${tg_id}`)
                var reviews_data = await reviews_response.json();
                console.log(reviews_data);
                var from_me = reviews_data["received_reviews"];
                var for_me = reviews_data["sent_reviews"];
                console.log(from_me, for_me);
                renderReviews(1, for_me);
                renderReviews(0, from_me);
                for_me_count.textContent = from_me.length;
                from_me_count.textContent = for_me.length;
            }
    
        } catch (error) {
            console.error('Ошибка при получении рейтинга:', error);
            document.querySelector('.review_number').textContent = 'Ошибка загрузки рейтинга';
        }
    }
});


// Анимация табов
async function triggerAnimation(index) {
    if (s == index) return;
    await switchTab(index);
    const underline = document.getElementById('underline');
    underline.classList.toggle("right", index === 1);
    s = index;
}

let activeTab = 0;

async function switchTab(index) {
    const tabContent = document.getElementById("tabContent");
    const tabs = document.querySelectorAll(".tab");
    activeTab = index;
    tabContent.style.transform = `translateX(-${index * 50}%)`;

    tabs.forEach((tab, i) => {
        tab.classList.toggle("active", i === index);
    });
}


function showCopied() {
    const query = window.location.search.substring(1); // удаляем "?" в начале
    if (!query) {
        console.error("В URL нет query-параметров");
        var telegramLink = `https://t.me/Checkly_use_bot?startapp=${encodeURIComponent(`user=${tg_id}`)}`;
    }
    else {
        var telegramLink = `https://t.me/Checkly_use_bot?startapp=${encodeURIComponent(query)}`
    }
    if (what_is_is == "me") {
        var text_for_copy = `Привет! Буду рад, если оставишь отзыв обо мне 🙌 Я использую Chek’ly — сервис для отзывов, чтобы подтвердить свою репутацию и избежать скама. Вот моя ссылка:\n`
    }
    else if (what_is_is == "product") {
        
        var text_for_copy = `Chek’ly — отзывы о каналах, чатах и пользователях. \nСмотри или оставь отзыв:\n`
    }
    else {
        var text_for_copy = `Твой отзыв поможет этому пользователю поднять рейтинг в Chek’ly\n`
    }
    
    navigator.clipboard.writeText(`${text_for_copy}${telegramLink}`).then(() => {
        const el = document.getElementById('linkCopied');
        const el_txt = document.getElementById("link_copied_text");
        const el_img = document.getElementById("chain_img");
        el_txt.textContent = "Ссылка скопирована!";
        el_img.style.display = "block";
        el_txt.style.paddingRight = "";
        el.classList.add('move-up');

        setTimeout(() => {
            el.classList.remove('move-up');
        }, 2000);
    }).catch(err => {
        console.error('Ошибка при копировании:', err);
    });
}


const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentImages = [];
let currentIndex = 0;


closeBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', () => showNext(-1));
nextBtn.addEventListener('click', () => showNext(1));

document.addEventListener('keydown', e => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showNext(-1);
    if (e.key === 'ArrowRight') showNext(1);
});

function openModal() {
    modalImg.src = currentImages[currentIndex];
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function showNext(offset) {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + offset + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
}

function show_screenshots(e, screenshots_array) {
    e.stopPropagation(); // 💥 Теперь это работает
    currentImages = screenshots_array;
    openModal();
}

function removeReviewById(id) {
    const reviewElement = document.querySelector(`div[data-review-id="${id}"]`);
    if (reviewElement) {
        reviewElement.remove();
    }
    if (what_is_is == "product" || what_is_is == "user") {
        document.getElementById("for_me").textContent -= 1;
    }
    else {
        document.getElementById("from_me").textContent -= 1;
    }
    


}

function add_nothing(index) {
    if (index == 1) {
        var container = document.getElementById("1");
        var txt = "Упс!<br>А тут пусто"
    }
    else {
        var container = document.getElementById("0");
        var txt = "Пусто!<br>попроси оставить<br>о тебе отзыв"
    }
    
    const empty = document.createElement('div');
    empty.className = 'nothing_container';
    empty.innerHTML = `<div class="nothing">${txt}</div>`;
    container.appendChild(empty);
    return;
}

async function remove_review(id) {
    var remove_response = await fetch(`https://otzoviktg.ru/remove_review?id=${id}`, {
        method: "POST"
    })
    var data = await remove_response.json();
    console.log(data);
    var new_avg_rating = data["product_avg_rating"] || data['user_avg_rating'];
    document.getElementById("review_number").textContent = new_avg_rating;
    
    
}

function show_remove_window(id) {
    delete_review_id = id;
    const remove_window = document.getElementById("remove_window");
    document.getElementById("first_tab").style.overflowY = "hidden";
    document.getElementById("second_tab").style.overflowY = "hidden";
    // Сделай видимым (но прозрачным)
    remove_window.style.display = "flex";

    // Принудительно обновим стиль, чтобы переход сработал
    requestAnimationFrame(() => {
        remove_window.classList.add("show");
    });

    const reviewElement = document.querySelector(`div[data-review-id="${id}"]`);
    const wrapper_window = document.getElementById('tabContent');
    wrapper_window.classList.add("show_content");
    console.log(reviewElement);
    reviewElement.classList.add("on-top");
    reviewElement.style.opacity = 1;
}

function hide_remove_window(id) {
    const remove_window = document.getElementById("remove_window");

    document.getElementById("first_tab").style.overflowY = "auto";
    document.getElementById("second_tab").style.overflowY = "auto";
    // Убираем класс, чтобы запустить transition (плавное исчезновение)
    remove_window.classList.remove("show");

    // Через 500 мс (время transition из CSS), скрываем полностью
    setTimeout(() => {
        remove_window.style.display = "none"; // окончательно скрываем
    }, 500); // должно совпадать с transition: opacity 0.5s

    // Возвращаем z-index у review элемента
    const reviewElement = document.querySelector(`div[data-review-id="${id}"]`);
    const wrapper_window = document.getElementById('tabContent');
    wrapper_window.classList.remove("show_content");
    console.log(reviewElement);
    reviewElement.classList.remove("on-top");
    reviewElement.style.removeProperty("opacity");

}

function no_btn() {
    hide_remove_window(delete_review_id);
}

function yes_btn() {
    hide_remove_window(delete_review_id);
    removeReviewById(delete_review_id);
    var first = document.getElementById("for_me").textContent;
    var second = document.getElementById("from_me").textContent;
    console.log(first, second);
    
    if (first == "0") {
        add_nothing(0);
    }
    if (second == "0") {
        add_nothing(1);
    }
    try {
        remove_review(delete_review_id);
    }
    catch {
        console.log("Не получилось удалить");
    }
}

async function delete_review(e, id) {
    e.stopPropagation(); // 💥 Теперь это работает
    console.log(id);
    show_remove_window(id);
}

function open_profile(query) {
    let link;
    link = `profile.html?${query}`
    console.log(link);
    
    window.location = link;
}



async function add_favourite(product_id, user_tg_id, add) {
    const url = add
        ? "https://otzoviktg.ru/add_favourite"
        : "https://otzoviktg.ru/remove_favourite";

    const body = {
        user_id: user_tg_id,
        product_id: product_id,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
}


setInterval(async () => {
    // Здесь твоя проверка
    console.log("Проверка происходит каждые 3 секунды");

    // Например, можно проверять значение переменной
    if (started_index != favourite_index) {
        console.log("Условие выполнено!");
        console.log(started_index, favourite_index);
        
        await add_favourite(product_id, tg_id, favourite_index)

        started_index = favourite_index;
        
        // Можешь тут что-то менять в интерфейсе, вызывать другие функции и т.д.
    }

}, 3000); // 3000 миллисекунд = 3 секунды
