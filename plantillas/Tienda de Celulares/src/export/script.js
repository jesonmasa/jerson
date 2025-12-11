// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Formulario
const form = document.getElementById('contactForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar mensaje de éxito
    mensaje.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
    mensaje.style.display = 'block';
    
    // Limpiar formulario
    form.reset();
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000);
});
