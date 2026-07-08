(function () {
    document.querySelectorAll('.nav-logo-mark').forEach(function (mark) {
        mark.src = 'images/hogan-signature.svg';
        mark.classList.remove('nav-logo-mark--color');
    });
})();
