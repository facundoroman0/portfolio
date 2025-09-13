// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.01)';
    } else {
        navbar.style.background = 'transparent';
    }
});

// Loading animation
window.addEventListener('load', function() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    setTimeout(() => {
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 500);
        }
    }, 2000);
});

// Mobile menu close on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

const cursor = document.querySelector('.cursor-circle');

// Seguimiento del mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Efecto hover en elementos interactivos
document.querySelectorAll('.cursor-effect').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.width = '3rem';
        cursor.style.height = '3rem';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.width = '1.5rem';
        cursor.style.height = '1.5rem';
    });

});

