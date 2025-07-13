var button1 = document.getElementById("search")
var button2 = document.getElementById("plus")
var button3 = document.getElementById("profile")


button1.addEventListener("click", () => {
    window.location = "search.html"
});
button2.addEventListener("click", () => {
    if (!button2.classList.contains('favourite')) {
        const handler = window.location.search.slice(1); // Убираем "?" и получаем всё остальное
        window.location = `create_review.html?${handler}`;
    } else {
        window.location = "favourite.html";
    }
});
button3.addEventListener("click", () => {
    window.location = "profile.html"
});