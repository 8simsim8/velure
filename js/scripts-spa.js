window.addEventListener('load', function(){

    // window.addEventListener('scroll', handlerScrollWindow);

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var  accordeons = createAccordeons(accordeonClassName, true);

    var  ticking = false;
    var  scrollPage;
    var  scrollLeft;

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if(document.body.classList.contains('finish-load')) {
                    scrollAnim('start');
                }
                ticking = false;
            });
        }
        ticking = true;
    }

});