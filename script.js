document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If it's a counter container, trigger counter animation
                if (entry.target.classList.contains('trust-banner')) {
                    startCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        scrollObserver.observe(element);
    });

    // 3. Counter Animation
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                
                // Calculate increment
                const inc = target / speed;

                if (count < target) {
                    // format with commas for larger numbers
                    const nextVal = Math.ceil(count + inc);
                    counter.innerText = nextVal.toLocaleString();
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };

            updateCount();
        });
    }

    // 4. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active class on header
            header.classList.toggle('active');
            
            // Get the content
            const content = header.nextElementSibling;
            
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0px";
            }

            // Close other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = "0px";
                }
            });
        });
    });

    // 5. Lead Form Submission
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get button to show loading state
            const btn = leadForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            
            // Simulate API call
            setTimeout(() => {
                btn.innerText = 'Request Sent!';
                btn.style.background = '#10b981'; // Success green
                btn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                
                // Reset form
                leadForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // 6. Tabbed Services Logic
    const tabs = document.querySelectorAll('.mega-tab');
    const contents = document.querySelectorAll('.mega-pane');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // 6. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // 7. Video Carousel Logic
    const carouselCards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carouselCards.length > 0) {
        let currentIndex = 2; // 3rd item is initial center
        const totalCards = carouselCards.length;
        
        const updateCarousel = () => {
            // Pause all videos when carousel navigates
            carouselCards.forEach(card => {
                const video = card.querySelector('video');
                if (video) {
                    video.pause();
                }
            });

            carouselCards.forEach((card, index) => {
                card.classList.remove('card-center', 'card-mid-left', 'card-mid-right', 'card-far-left', 'card-far-right', 'card-hidden');
                
                let diff = (index - currentIndex) % totalCards;
                if (diff < -Math.floor(totalCards/2)) diff += totalCards;
                if (diff > Math.floor(totalCards/2)) diff -= totalCards;
                
                if (diff === 0) {
                    card.classList.add('card-center');
                } else if (diff === -1) {
                    card.classList.add('card-mid-left');
                } else if (diff === 1) {
                    card.classList.add('card-mid-right');
                } else if (diff === -2) {
                    card.classList.add('card-far-left');
                } else if (diff === 2) {
                    card.classList.add('card-far-right');
                } else {
                    card.classList.add('card-hidden');
                }
            });
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            });
        }
        
        carouselCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (currentIndex !== index) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });
    }

    // 8. Before & After Sliders
    const baWrappers = document.querySelectorAll('.ba-img-wrapper');
    baWrappers.forEach((wrapper, i) => {
        const slider = wrapper.querySelector('.ba-slider-input');
        const imgBefore = wrapper.querySelector('.ba-img-before');
        const divider = wrapper.querySelector('.ba-divider');
        
        if (slider && imgBefore && divider) {
            // Initialize clip-path instead of relying solely on CSS
            imgBefore.style.clipPath = `inset(0 ${100 - slider.value}% 0 0)`;
            
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                imgBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
                divider.style.left = `${val}%`;
            });
        }
    });

    // Before & After Carousel Navigation
    const baGrid = document.querySelector('.ba-grid');
    const baPrev = document.querySelector('.ba-prev');
    const baNext = document.querySelector('.ba-next');

    if (baGrid && baPrev && baNext) {
        baNext.addEventListener('click', () => {
            const card = baGrid.querySelector('.ba-card');
            if (card) {
                const cardWidth = card.offsetWidth + 20; // 20 is the gap
                baGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });
        baPrev.addEventListener('click', () => {
            const card = baGrid.querySelector('.ba-card');
            if (card) {
                const cardWidth = card.offsetWidth + 20;
                baGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });
    }

    // 9. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-content').style.maxHeight = null;
            });
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 10. Mobile Navigation Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    }

    // 11. Bouquet Carousel Auto-Slide
    const bouquetGrid = document.querySelector('.bouquet-grid');
    if (bouquetGrid) {
        let autoSlideInterval;
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                const card = bouquetGrid.querySelector('.bouquet-item');
                if (card) {
                    const cardWidth = card.offsetWidth + 30; // 30 is the gap
                    // If scrolled near the end, scroll back to start
                    if (bouquetGrid.scrollLeft + bouquetGrid.clientWidth >= bouquetGrid.scrollWidth - 10) {
                        bouquetGrid.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        bouquetGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
                    }
                }
            }, 3000); // 3 seconds
        };
        
        startAutoSlide();

        // Pause on hover
        bouquetGrid.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        bouquetGrid.addEventListener('mouseleave', startAutoSlide);
        
        // Pause on touch
        bouquetGrid.addEventListener('touchstart', () => clearInterval(autoSlideInterval), {passive: true});
        bouquetGrid.addEventListener('touchend', startAutoSlide, {passive: true});
    }

    // Hero Slider
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (sliderWrapper && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            
            sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startSlideShow() {
            stopSlideShow();
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds
        }

        function stopSlideShow() {
            if(slideInterval) clearInterval(slideInterval);
        }
        
        // Touch and Drag Logic
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;

        sliderWrapper.addEventListener('touchstart', touchStart, {passive: true});
        sliderWrapper.addEventListener('touchend', touchEnd);
        sliderWrapper.addEventListener('touchmove', touchMove, {passive: true});

        sliderWrapper.addEventListener('mousedown', touchStart);
        sliderWrapper.addEventListener('mouseup', touchEnd);
        sliderWrapper.addEventListener('mouseleave', touchEnd);
        sliderWrapper.addEventListener('mousemove', touchMove);
        
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if(img) img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        function touchStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            stopSlideShow();
            sliderWrapper.style.transition = 'none';
            sliderWrapper.style.cursor = 'grabbing';
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                const diff = currentPosition - startPos;
                const newTranslate = -(currentSlide * 100) + (diff / sliderWrapper.clientWidth * 100);
                sliderWrapper.style.transform = `translateX(${newTranslate}%)`;
            }
        }

        function touchEnd(event) {
            if (!isDragging) return;
            isDragging = false;
            sliderWrapper.style.cursor = 'grab';
            
            const endPos = event.type.includes('mouse') ? event.clientX : (event.changedTouches ? event.changedTouches[0].clientX : startPos);
            const diff = endPos - startPos;
            
            sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
            
            if (diff < -50) {
                nextSlide();
            } else if (diff > 50) {
                prevSlide();
            } else {
                goToSlide(currentSlide);
            }
            startSlideShow();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                startSlideShow();
            });
        });

        sliderWrapper.style.cursor = 'grab';
        startSlideShow();
    }

    // 12. Popup Modal Logic
    const popupModal = document.getElementById('popupModal');
    const popupClose = document.getElementById('popupClose');
    const openPopupBtns = document.querySelectorAll('.open-popup-btn');

    if (popupModal && popupClose) {
        // Open popup
        openPopupBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                popupModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close popup
        const closePopup = () => {
            popupModal.classList.remove('show');
            document.body.style.overflow = '';
        };

        popupClose.addEventListener('click', closePopup);

        // Close on outside click
        popupModal.addEventListener('click', (e) => {
            if (e.target === popupModal) {
                closePopup();
            }
        });
        
        // Auto-open popup on page load
        setTimeout(() => {
            if (!popupModal.classList.contains('show')) {
                popupModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }, 1500);
        
        // Handle popup form submit
        const popupForm = document.getElementById('popupForm');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = popupForm.querySelector('.popup-submit-btn');
                const originalText = submitBtn.innerText;
                
                submitBtn.innerText = 'Booking...';
                submitBtn.style.opacity = '0.7';
                
                // Simulate API Call
                setTimeout(() => {
                    submitBtn.innerText = 'Consultation Booked!';
                    submitBtn.style.background = '#10b981';
                    
                    setTimeout(() => {
                        closePopup();
                        popupForm.reset();
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                    }, 2000);
                }, 1500);
            });
        }
    }

    // Gallery Lightbox Logic
    const lightbox = document.getElementById('gallery-lightbox');
    if(lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-pair .half img');

        galleryItems.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                lightbox.style.display = "block";
                setTimeout(() => {
                    lightbox.classList.add('show');
                }, 10);
                lightboxImg.src = this.src;
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = "none";
            }, 300); 
        };

        closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // 13. GMB Carousel Logic
    const gmbCarousel = document.getElementById('gmbCarousel');
    const gmbPrevBtn = document.getElementById('gmbPrevBtn');
    const gmbNextBtn = document.getElementById('gmbNextBtn');

    if (gmbCarousel && gmbPrevBtn && gmbNextBtn) {
        gmbNextBtn.addEventListener('click', () => {
            const card = gmbCarousel.querySelector('.gmb-card');
            if (card) {
                const cardWidth = card.offsetWidth + 20; // 20 is the gap
                gmbCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });
        gmbPrevBtn.addEventListener('click', () => {
            const card = gmbCarousel.querySelector('.gmb-card');
            if (card) {
                const cardWidth = card.offsetWidth + 20;
                gmbCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });
    }

});
