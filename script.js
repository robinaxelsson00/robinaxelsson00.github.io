document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const revealContainer = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('.hover-reveal-img');
    const revealItems = document.querySelectorAll('.reveal-item');

    // Följ musrörelsen för den anpassade rektangeln
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Fullskärms Hover Reveal
    revealItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgUrl = item.getAttribute('data-image');
            if (imgUrl) {
                revealImg.src = imgUrl;
                revealContainer.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            revealContainer.classList.remove('active');
        });
    });

    // Förstoring av muspekaren vid hovring på länkar
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});
