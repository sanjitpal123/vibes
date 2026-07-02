const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const popupIndex = js.indexOf('// 9. Popup Modal Logic');
if (popupIndex !== -1) {
    js = js.substring(0, popupIndex) + '});\n';
}

const heroStart = js.indexOf('// Hero Slider');
const heroEndString = '        startSlideShow();\r\n    }';
const heroEndStringAlt = '        startSlideShow();\n    }';
let heroEnd = js.indexOf(heroEndString, heroStart);
let endLen = heroEndString.length;
if (heroEnd === -1) {
    heroEnd = js.indexOf(heroEndStringAlt, heroStart);
    endLen = heroEndStringAlt.length;
}

if (heroStart !== -1 && heroEnd !== -1) {
    const oldSlider = js.substring(heroStart, heroEnd + endLen);
    const newSlider = `// Hero Slider
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
            sliderWrapper.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
            
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
                sliderWrapper.style.transform = \`translateX(\${newTranslate}%)\`;
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
    }`;
    js = js.replace(oldSlider, newSlider);
} else {
    console.log('Could not find hero slider block');
}

fs.writeFileSync('script.js', js, 'utf8');
console.log('Successfully updated script.js');
