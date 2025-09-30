document.addEventListener('DOMContentLoaded', function () {
    let cursorDot, cursorCircle;
    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let scale = 1;
    let animationId;

    function isMobile() {
        return window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    function initCursor() {
        if (cursorDot) cursorDot.remove();
        if (cursorCircle) cursorCircle.remove();
        if (animationId) cancelAnimationFrame(animationId);

        if (isMobile()) {
            return;
        }

        cursorDot = document.createElement('div');
        cursorCircle = document.createElement('div');

        cursorDot.classList.add('cursor-dot');
        cursorCircle.classList.add('cursor-circle');

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorCircle);

        initEvents();
        animateCursor();
    }

    function initEvents() {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const interactiveElements = document.querySelectorAll('a, button, .btn-custom, .project-card, .skill-card, .theme-toggle');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                scale = 1.3;
                if (cursorCircle) cursorCircle.style.backgroundColor = 'rgba(203, 197, 234, 0.1)';
            });

            el.addEventListener('mouseleave', () => {
                scale = 1;
                if (cursorCircle) cursorCircle.style.backgroundColor = 'transparent';
            });
        });

        document.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.style.opacity = '0';
            if (cursorCircle) cursorCircle.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.style.opacity = '1';
            if (cursorCircle) cursorCircle.style.opacity = '1';
        });
    }

    function animateCursor() {
        if (isMobile() || !cursorDot || !cursorCircle) {
            return;
        }

        cursorDot.style.left = `${mouseX - 2}px`;
        cursorDot.style.top = `${mouseY - 2}px`;
        
        circleX += (mouseX - circleX - 15) * 0.2;  
        circleY += (mouseY - circleY - 15) * 0.2;

        cursorCircle.style.left = `${circleX}px`;
        cursorCircle.style.top = `${circleY}px`;
        cursorCircle.style.transform = `scale(${scale})`;

        animationId = requestAnimationFrame(animateCursor);
    }

    initCursor();

    window.addEventListener('resize', function() {
        initCursor();
    });
});