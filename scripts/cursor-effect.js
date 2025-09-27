document.addEventListener('DOMContentLoaded', function () {
    // Verificar si es móvil antes de crear los cursores
    function isMobile() {
        return window.innerWidth <= 500 || 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    // Si es móvil, no crear los cursores
    if (isMobile()) {
        return;
    }

    const cursorDot = document.createElement('div');
    const cursorCircle = document.createElement('div');

    cursorDot.classList.add('cursor-dot');
    cursorCircle.classList.add('cursor-circle');

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorCircle);

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let scale = 1;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const interactiveElements = document.querySelectorAll('a, button, .btn-custom, .project-card, .skill-card, .theme-toggle');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            scale = 1.3;
            cursorCircle.style.backgroundColor = 'rgba(203, 197, 234, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
            scale = 1;
            cursorCircle.style.backgroundColor = 'transparent';
        });
    });

    function animateCursor() {
        // Verificar nuevamente por si cambió el tamaño
        if (isMobile()) {
            cursorDot.style.display = 'none';
            cursorCircle.style.display = 'none';
            return;
        }

        cursorDot.style.left = `${mouseX - 2}px`;
        cursorDot.style.top = `${mouseY - 2}px`;
        circleX += (mouseX - circleX - 15) * 0.2;  
        circleY += (mouseY - circleY - 15) * 0.2;

        cursorCircle.style.left = `${circleX}px`;
        cursorCircle.style.top = `${circleY}px`;
        cursorCircle.style.transform = `scale(${scale})`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorCircle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorCircle.style.opacity = '1';
    });

    // También ocultar en resize
    window.addEventListener('resize', function() {
        if (isMobile()) {
            cursorDot.style.display = 'none';
            cursorCircle.style.display = 'none';
        } else {
            cursorDot.style.display = 'block';
            cursorCircle.style.display = 'block';
        }
    });
});