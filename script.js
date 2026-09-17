document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const revealContainer = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('.hover-reveal-img');
    const revealVideo = document.querySelector('.hover-reveal-video'); // Hämtar video-elementet
    const revealItems = document.querySelectorAll('.reveal-item');

    // Följ musrörelsen för den anpassade rektangeln
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Förstoring av muspekaren vid hovring på länkar och interaktiva element
        const interactiveElements = document.querySelectorAll('a, button, select, input, .reveal-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // Fullskärms Hover Reveal (Bilder & Videor)
    if (revealContainer && revealItems.length > 0) {
        revealItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const videoUrl = item.getAttribute('data-video');
                const imgUrl = item.getAttribute('data-image');

                if (videoUrl && revealVideo) {
                    revealVideo.src = videoUrl;
                    revealVideo.play();
                    revealContainer.classList.add('has-video');
                    revealContainer.classList.add('active');
                } else if (imgUrl && revealImg) {
                    revealImg.src = imgUrl;
                    revealContainer.classList.remove('has-video');
                    revealContainer.classList.add('active');
                }
            });

            item.addEventListener('mouseleave', () => {
                revealContainer.classList.remove('active');
                if (revealVideo) {
                    revealVideo.pause();
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
  // Här lägger vi till .item-text så att dina <span> fångas upp!
  const clickableElements = document.querySelectorAll("h1, h2, h3, .item-text, .track-click");

if (clickableElements && clickableElements.length > 0) {
  clickableElements.forEach(function (element) {
    element.addEventListener("click", function (e) {
      const clickedText = this.innerText ? this.innerText.trim() : "";
      const tagType = this.tagName;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'heading_click',
        'heading_text': clickedText,
        'heading_type': tagType
      });

      console.log("Custom event pushed:", clickedText);
    });
  });
