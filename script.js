document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');

    // Följ musrörelsen för den anpassade rektangeln
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Subtil förstoring vid hovring på länkar
    const interactiveElements = document.querySelectorAll('a, button');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});
