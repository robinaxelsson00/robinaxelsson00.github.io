document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const revealContainer = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('.hover-reveal-img');
    const revealVideo = document.querySelector('.hover-reveal-video');
    const revealFrame = document.querySelector('.hover-reveal-frame');
    const revealItems = document.querySelectorAll('.reveal-item');

    // 1. Muspekare & Interaktivitet
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

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

    // 2. Fullskärms Hover Reveal (Bilder, Videor & HTML-sidor)
    if (revealContainer && revealItems.length > 0) {
        revealItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const htmlUrl = item.getAttribute('data-html');
                const videoUrl = item.getAttribute('data-video');
                const imgUrl = item.getAttribute('data-image');

                if (htmlUrl && revealFrame) {
                    if (revealFrame.getAttribute('src') !== htmlUrl) {
                        revealFrame.src = htmlUrl;
                    }
                    revealContainer.classList.remove('has-video');
                    revealContainer.classList.add('has-html');
                    revealContainer.classList.add('active');
                } else if (videoUrl && revealVideo) {
                    revealVideo.src = videoUrl;
                    revealVideo.play().catch(() => {});
                    revealContainer.classList.remove('has-html');
                    revealContainer.classList.add('has-video');
                    revealContainer.classList.add('active');
                } else if (imgUrl && revealImg) {
                    revealImg.src = imgUrl;
                    revealContainer.classList.remove('has-html');
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

    // 3. Säker Klickspårning för Rubriker (DataLayer)
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

                console.log("%c[dataLayer] heading_click:", "color: #10b981; font-weight: bold;", {
                    event: 'heading_click',
                    heading_text: clickedText,
                    heading_type: tagType
                });
            });
        });
    }

    // 4. Eget dataLayer event för projektklick i portföljen
    const portfolioLinks = document.querySelectorAll('.reveal-item');
    portfolioLinks.forEach(item => {
        item.addEventListener('click', function(e) {
            const titleEl = this.querySelector('h3') || this.querySelector('.item-text');
            const itemName = titleEl ? titleEl.innerText.trim() : (this.innerText ? this.innerText.trim() : 'Okänt projekt');
            const itemCategory = this.getAttribute('data-category') || 'Portfolio';
            const destinationUrl = this.getAttribute('href') || '';

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'portfolio_item_click',
                'portfolio_item_name': itemName,
                'portfolio_category': itemCategory,
                'destination_url': destinationUrl,
                'click_timestamp': new Date().toISOString()
            });

            console.log("%c[dataLayer] portfolio_item_click:", "color: #3b82f6; font-weight: bold;", {
                event: 'portfolio_item_click',
                portfolio_item_name: itemName,
                portfolio_category: itemCategory,
                destination_url: destinationUrl
            });
        });
    });

    // 5. Kontaktformulär Modal Logik
    const openMailBtn = document.getElementById('open-mail-modal-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const contactForm = document.getElementById('contact-mail-form');
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const copyEmailText = document.getElementById('copy-email-text');
    const formFeedback = document.getElementById('contact-form-feedback');

    function openModal() {
        if (!contactModal) return;
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'contact_modal_open'
        });
        console.log("%c[dataLayer] contact_modal_open", "color: #8b5cf6; font-weight: bold;");

        // Fokusera på första fältet
        const firstInput = document.getElementById('contact-name');
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
    }

    function closeModal() {
        if (!contactModal) return;
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
        if (formFeedback) {
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
        }
    }

    if (openMailBtn) {
        openMailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name')?.value.trim() || '';
            const email = document.getElementById('contact-email')?.value.trim() || '';
            const subject = document.getElementById('contact-subject')?.value.trim() || 'Kontakt via portföljen';
            const message = document.getElementById('contact-message')?.value.trim() || '';

            const bodyContent = `Hej Robin,\n\n${message}\n\n---\nAvsändare: ${name}\nE-post: ${email}`;
            const mailtoUrl = `mailto:Robin.axelsson@student.berghs.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

            if (formFeedback) {
                formFeedback.textContent = 'Öppnar ditt e-postprogram för att skicka...';
                formFeedback.className = 'form-feedback success';
            }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'contact_form_submit',
                'sender_name': name,
                'sender_email': email,
                'subject': subject
            });
            console.log("%c[dataLayer] contact_form_submit:", "color: #ec4899; font-weight: bold;", {
                name, email, subject
            });

            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 300);
        });
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailToCopy = 'Robin.axelsson@student.berghs.se';
            navigator.clipboard.writeText(emailToCopy).then(() => {
                if (copyEmailText) copyEmailText.textContent = 'Kopierad! ✓';
                if (formFeedback) {
                    formFeedback.textContent = 'E-postadressen är kopierad till urklipp!';
                    formFeedback.className = 'form-feedback success';
                }

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'contact_email_copied'
                });
                console.log("%c[dataLayer] contact_email_copied", "color: #f59e0b; font-weight: bold;");

                setTimeout(() => {
                    if (copyEmailText) copyEmailText.textContent = 'Kopiera e-post';
                }, 2500);
            }).catch(() => {
                if (copyEmailText) copyEmailText.textContent = 'Robin.axelsson@student.berghs.se';
            });
        });
    }
});