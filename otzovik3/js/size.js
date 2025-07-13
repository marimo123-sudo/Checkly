let lastVisualHeight = window.visualViewport?.height || window.innerHeight;

const updateViewport = () => {
    const currentVisualHeight = window.visualViewport?.height || window.innerHeight;
    const keyboardOpened = Math.abs(lastVisualHeight - currentVisualHeight) > 100;

    // Только если клавиатура НЕ открыта — обновляем vh
    if (!keyboardOpened) {
        const vh = currentVisualHeight;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        lastVisualHeight = currentVisualHeight;
    }
};

// Начальная установка
updateViewport();

// При изменении размера экрана
window.addEventListener('resize', updateViewport);

document.addEventListener('touchstart', function (e) {
    const active = document.activeElement;

    const isTextInput = el =>
        el && (
            el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.isContentEditable
        );

    const isClickInsideInput = el =>
        el.closest('input') ||
        el.closest('textarea') ||
        el.closest('[contenteditable="true"]');

    if (isTextInput(active) && !isClickInsideInput(e.target)) {
        active.blur();
    }
});


