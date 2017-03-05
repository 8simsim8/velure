
var header = document.getElementsByClassName('l-navigation')[0];
// Проскроливание фиксорованного меню
window.addEventListener('scroll', function () {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    if(window.innerWidth <= 1210) {
         header.style.left = - scrollLeft + "px";
    }
});


window.addEventListener('scroll', handlerScrollWindow);

var logoShadow = document.querySelector('.b-slider__shadow');

var ticking = false;
var scrollPage;

function handlerScrollWindow() {
    scrollPage =  window.pageYOffset || document.documentElement.scrollTop;
    if(!ticking) {
        window.requestAnimationFrame(function() {
            logoShadowAnim();
            ticking = false;
        });
    }
    ticking = true;
}

function logoShadowAnim(){
    var posEl = logoShadow.getBoundingClientRect();

    if(posEl.top <= window.innerHeight - logoShadow.offsetHeight/2) {
        logoShadow.classList.remove('shadow');
    }
}

/*--------------------------*/
/*		 Swipe block		*/
/*--------------------------*/
// How work
var swipeSlide,
    swipeElemClass = '.swiper-container';

swipeSlide = new Swiper(swipeElemClass, {
    slidesPerView: 1,
    spaceBetween: 20,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    setWrapperSize: true
});

var input = document.getElementsByClassName('input__field');

for(var i = 0; i < input.length; i++) {
    input[i].addEventListener('focus', function() {
        this.parentNode.classList.add('input--filled');
    });
    input[i].addEventListener('blur', function() {
        if(this.value == '') {
            this.parentNode.classList.remove('input--filled');
        }
    });

}