// Animación del cursor personalizado
document.addEventListener('DOMContentLoaded', function () {
    const cursorDot = document.createElement('div');
    const cursorCircle = document.createElement('div');

    cursorDot.classList.add('cursor-dot');
    cursorCircle.classList.add('cursor-circle');

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorCircle);

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let scale = 1;

    // Seguir la posición del mouse
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Efecto al hacer hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .btn-custom, .project-card, .skill-card, .theme-toggle');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            scale = 1.5;
            cursorCircle.style.backgroundColor = 'rgba(203, 197, 234, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
            scale = 1;
            cursorCircle.style.backgroundColor = 'transparent';
        });
    });

    // Animación suave con requestAnimationFrame
    function animateCursor() {
        // Movimiento instantáneo para el punto
        cursorDot.style.left = `${mouseX - 4}px`;
        cursorDot.style.top = `${mouseY - 4}px`;

        // Movimiento con retraso para el círculo
        circleX += (mouseX - circleX - 15) * 0.2;  // 30/2=15
        circleY += (mouseY - circleY - 15) * 0.2;

        cursorCircle.style.left = `${circleX}px`;
        cursorCircle.style.top = `${circleY}px`;
        cursorCircle.style.transform = `scale(${scale})`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Ocultar cursor al salir de la ventana
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorCircle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorCircle.style.opacity = '1';
    });
});