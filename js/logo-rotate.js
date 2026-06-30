(function () {
    var logos = [
        'images/hogan logo 8.svg',
        'images/hogan logo 9.svg',
        'images/hogan logo 10.svg',
        'images/hogan logo 11.svg'
    ];
    var picked = logos[Math.floor(Math.random() * logos.length)];
    document.querySelectorAll('.nav-logo-mark').forEach(function (mark) {
        mark.src = picked;
        mark.classList.remove('nav-logo-mark--color');
    });
})();
