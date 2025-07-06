document.addEventListener('DOMContentLoaded', () => {

    // --- New Page Transition Logic ---
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Use a minimal timeout to ensure the overlay is painted before we transition it out
        setTimeout(() => {
            overlay.classList.add('is-hidden');
        }, 50);
    }

    // --- Page Navigation Interception ---
    const allLinks = document.querySelectorAll('a[href]');
    const animationDuration = 400; // should match CSS

    allLinks.forEach(link => {
        // Exclude links that open in a new tab, mailto links, and simple anchor links
        const url = new URL(link.href, window.location.origin);
        if (link.target === '_blank' || link.protocol.startsWith('mailto') || url.hash) {
            return;
        }

        // Check if the link points to a different page on the same website
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', e => {
                if (link.href === window.location.href) {
                    return;
                }
                
                e.preventDefault();
                const destination = link.href;

                // Make overlay visible
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
                
                setTimeout(() => {
                    window.location.href = destination;
                }, animationDuration);
            });
        }
    });

    // Handle form submissions that navigate
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const destination = signupForm.action;
            // Make overlay visible
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
            setTimeout(() => {
                window.location.href = destination;
            }, animationDuration);
        });
    }

    // Handle back/forward browser navigation from bfcache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && overlay) {
            // When a page is restored from bfcache, it might be in a visible state. Hide it.
            overlay.classList.add('is-hidden');
        }
    });

    // --- Payment page logic ---
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        const orderSummaryEl = document.getElementById('order-summary');
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');

        const plans = {
            individual: { name: "Individual Plan", price: "$20/month" },
            family: { name: "Family Plan", price: "$35/month" }
        };

        if (plan && plans[plan] && orderSummaryEl) {
            orderSummaryEl.innerHTML = `
                <p><strong>Plan:</strong> ${plans[plan].name}</p>
                <p><strong>Price:</strong> ${plans[plan].price}</p>
                <p>You will be billed monthly. You can cancel at any time.</p>
            `;
        } else if (orderSummaryEl) {
            orderSummaryEl.innerHTML = `<p>No plan selected. Please <a href="pricing.html">choose a plan</a>.</p>`;
            paymentForm.querySelector('button[type="submit"]').disabled = true;
        }

        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const destination = paymentForm.action;
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
            setTimeout(() => {
                window.location.href = destination;
            }, animationDuration);
        });
    }

    // --- Subject Page Filters ---
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        const filterBtns = filtersContainer.querySelectorAll('.filter-btn');
        const subjectCards = document.querySelectorAll('.subject-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class on button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.textContent.trim();

                subjectCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'All' || filter === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other active items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });

    // --- Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const galleryImgs = document.querySelectorAll('.gallery-img');
        const closeBtn = document.querySelector('.lightbox-close');

        galleryImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('show');
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeLightbox);
        
        // Close on clicking the background
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formContainer = document.getElementById('contact-form-container');
            if (formContainer) {
                formContainer.innerHTML = `
                    <div class="form-success-message">
                         <div class="success-animation">
                            <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="success-icon-circle" cx="26" cy="26" r="25" fill="none"/>
                                <path class="success-icon-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <h3>Thank you!</h3>
                        <p>Your message has been received. We'll be in touch shortly.</p>
                    </div>
                `;
            }
        });
    }

    // --- Newsletter Form Submission ---
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const newsletterContainer = form.parentElement;

            if (emailInput && emailInput.value && newsletterContainer) {
                newsletterContainer.innerHTML = `
                    <h4>Thank You!</h4>
                    <p>You're subscribed. Check your inbox for VRLearn updates.</p>
                `;
            }
        });
    });

    // --- Testimonials Slider ---
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        const slides = Array.from(sliderTrack.children);
        const dotsContainer = document.querySelector('.slider-dots');
        let currentSlide = 0;
        let slideInterval;

        // Create dots
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);

        const goToSlide = (slideIndex) => {
            sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
            
            slides.forEach(s => s.classList.remove('active'));
            slides[slideIndex].classList.add('active');
            
            dots.forEach(d => d.classList.remove('active'));
            dots[slideIndex].classList.add('active');
            
            currentSlide = slideIndex;
        };
        
        const nextSlide = () => {
            const nextSlideIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextSlideIndex);
        };
        
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }
});