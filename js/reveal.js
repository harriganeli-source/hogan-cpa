(function () {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = document.querySelectorAll(
        '.differ, .about-snap, .testimonial-band, .services-preview, .cta-band, ' +
        '.about-body, .contact-body, .service-section'
    );

    var pending = [];
    targets.forEach(function (el) {
        // Anything already on screen at load stays static; only below-the-fold
        // content animates in, so the intro and hero are never affected.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        el.classList.add('reveal');
        pending.push(el);
    });
    if (!pending.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px' });

    pending.forEach(function (el) { io.observe(el); });
})();
