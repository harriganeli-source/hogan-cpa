/* Signature intro: the H draws on over the purple field, flies up into its
   nav slot, then the site fades on underneath. Gated by html.intro-play,
   set in <head> (skipped after first view this session, or reduced motion;
   force with ?intro). */
(function () {
    var root = document.documentElement;
    if (!root.classList.contains('intro-play')) return;
    var overlay = document.getElementById('intro-overlay');
    var mark = document.getElementById('intro-mark');
    if (!overlay || !mark) { root.classList.remove('intro-play'); return; }
    try { sessionStorage.setItem('hoganIntroSeen', '1'); } catch (e) {}
    document.body.classList.add('intro-lock');

    var finished = false, skipping = false;
    function finish() {
        if (finished) return;
        finished = true;
        document.body.classList.remove('intro-lock');
        overlay.style.pointerEvents = 'none';
        // Show the real nav mark FIRST, and keep the overlay mark sitting on top of it
        // (same spot, same size) for a beat, so the browser has painted the nav mark
        // before the overlay goes. Removing both in one frame left a blank slot.
        // Plain timer, not rAF: rAF stalls in a background tab and would park the overlay.
        root.classList.add('intro-out');
        root.classList.remove('intro-play');
        setTimeout(function () { overlay.remove(); root.classList.remove('intro-out'); }, 160);
    }
    setTimeout(finish, 6000); // safety net: never trap the visitor

    // Click/tap anywhere skips straight to the site
    overlay.addEventListener('pointerdown', function () {
        if (finished || skipping) return;
        skipping = true;
        overlay.style.transition = 'opacity 0.25s ease';
        overlay.style.opacity = '0';
        setTimeout(finish, 250);
    });

    // Center the mark, sized to the viewport
    var vw = window.innerWidth, vh = window.innerHeight;
    var h = Math.min(vh * 0.42, vw * 0.5, 380), w = h * 756.89 / 803.13;
    mark.style.width = w + 'px';
    mark.style.height = h + 'px';
    mark.style.transform = 'translate(' + (vw - w) / 2 + 'px, ' + (vh - h) * 0.44 + 'px)';
    requestAnimationFrame(function () { overlay.classList.add('draw'); });

    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var navImg = document.querySelector('.nav-logo-mark');
    var navReady = new Promise(function (r) { // the real mark must be painted before we hand off, or the slot is empty on slow connections
        function decoded() { // loaded is not painted: force the decode so the swap has pixels ready
            if (navImg && navImg.decode) navImg.decode().then(r, r); else r();
        }
        if (!navImg || (navImg.complete && navImg.naturalWidth)) { decoded(); return; }
        navImg.addEventListener('load', decoded, { once: true });
        navImg.addEventListener('error', r, { once: true });
        setTimeout(r, 2500);
    });
    Promise.all([
        new Promise(function (r) { setTimeout(r, 1900); }), // strokes end ~1.72s, hold a beat
        fontsReady, // nav must have final layout before we measure the target
        navReady
    ]).then(function () {
        if (finished || skipping) return;
        var img = document.querySelector('.nav-logo-mark');
        var t = img && img.getBoundingClientRect();
        if (!t || !t.width) { finish(); return; }
        mark.style.transition = 'transform 0.6s cubic-bezier(0.7, 0, 0.3, 1)';
        mark.style.transform = 'translate(' + t.left + 'px, ' + t.top + 'px) scale(' + (t.height / h) + ')';
        setTimeout(function () {
            overlay.classList.add('reveal'); // purple field fades; signature stays put
            setTimeout(finish, 700);         // then swap to the real nav mark
        }, 640);
    });
})();
