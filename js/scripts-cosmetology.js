window.addEventListener('load', function(){

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var  accordeons = createAccordeons(accordeonClassName, true);

});