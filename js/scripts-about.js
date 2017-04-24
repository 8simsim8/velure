window.addEventListener('load', function(){

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    if(window.breakPointTabletLandscape < innerWidth) {
        var parallaxEl = document.querySelectorAll('[data-parallax-bg]');
        parallaxBg(parallaxEl);
    }

});

swipeForRewards();

function parallaxBg(elementsParalax) {
    var scrollPage,
        arrayElems = elementsParalax,
        koefScroll = [];
    var ticking = false;

    initParallax();

    window.addEventListener('scroll', function(){
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        if(!ticking) {
            window.requestAnimationFrame(function () {

                handlerParallax(scrollPage, koefScroll, arrayElems);

                ticking = false;
            });
        }
        ticking = true;
    },true);

    window.addEventListener('resize', resizeWindow);

    function handlerParallax(scroll, kScroll, elems){
        var i,
            len = elems.length;

        for(i = 0; i < len; i++ ) {
            var current = elems[i];
            var parentEl = current.parentNode;
            var position = parentEl.getBoundingClientRect();

            if(position.top < window.innerHeight && position.bottom > 0) {

                var valueScroll = (scroll - parentEl.offsetTop + window.innerHeight) * kScroll[i];

                current.style.webkitTransform = 'translate(0, ' + valueScroll + 'px)';
                current.style.transform = 'translate(0, ' + valueScroll + 'px)';
            }
        }
    }

    function resizeWindow() {
        koefScroll = calcParallax(arrayElems);
        initParallax();
    }

    function calcParallax(elems) {
        var i,
            array = [],
            len = elems.length;
        for(i = 0; i < len; i++ ) {

            var value = (elems[i].offsetHeight - elems[i].parentNode.offsetHeight)/window.innerHeight;
            array.push(value);
        }
        return array;
    }

    function initParallax() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        koefScroll = calcParallax(arrayElems);
        handlerParallax(scrollPage, koefScroll, arrayElems);
    }

}

/*
 *   Создание свайпа для наград
 */
function swipeForRewards() {

    var slider;
    var isSliderCreate = false;

    const slidersElem = document.getElementsByClassName('b-rewards__viewport')[0];

    resizeWindow();

    window.addEventListener('resize', resizeWindow);

    function resizeWindow() {

        if (window.innerWidth <= window.breakPointTabletLandscape) {
            if (!isSliderCreate) {

                slider = makeSlider(slidersElem);
                isSliderCreate = true;

            }
        } else {
            if (isSliderCreate) {

                slider.destroy(false, true);
                isSliderCreate = false;

            }
        }
    }

    function makeSlider(wrapClass){

        var swipeSlide,
            paginElemClass =    wrapClass.querySelector('.swiper-pagination') || null;

        swipeSlide = new Swiper(wrapClass, {
            slidesPerView: 'auto',
            pagination: paginElemClass,
            paginationClickable: true,
            setWrapperSize: true,
            centeredSlides: true,
            breakpoints: {

            }
        });

        return swipeSlide;
    }

}