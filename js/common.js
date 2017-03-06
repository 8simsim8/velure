
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
var paralaxBlock = document.querySelector('.b-parallax');
var formBlock = document.querySelector('.b-form__bg');

createDataInput();

droplist();

var ticking = false;
var scrollPage;

function handlerScrollWindow() {
    scrollPage =  window.pageYOffset || document.documentElement.scrollTop;
    if(!ticking) {
        window.requestAnimationFrame(function() {
            scrollAnim(logoShadow);
            scrollAnim(formBlock);
            paralax(paralaxBlock, scrollPage);
            ticking = false;
        });
    }
    ticking = true;
}

function scrollAnim(el) {
    var posEl = el.getBoundingClientRect();

    if(posEl.top <= window.innerHeight - el.offsetHeight/2) {
        el.classList.remove('start');
    }
}

function paralax(el, scrollPage) {
    var posEl = el.getBoundingClientRect();

    var posElToTop = posEl.top + scrollPage;

    if(posEl.top <= window.innerHeight && posEl.bottom > 0) {
        el.style.backgroundPositionY = (scrollPage - posElToTop)*0.5 + 'px';
    }
}

function createDataInput(){
    var date = document.getElementsByClassName('forcibly-placeholder');

    for(var i = 0, len = date.length; i < len; i++) {
        date[i].addEventListener('change', function(){
            if(this.value != '') {
                this.classList.add('full');
            } else {
                this.classList.remove('full');
            }
        });
    }
}

function droplist() {
    var droplistsSelect = document.getElementsByClassName('droplist');
    var droplists = [];

    for(var i = 0, len = droplistsSelect.length; i < len; i++) {
        var id = '#' + droplistsSelect[i].id;
        var isDisableOnLoad;

        isDisableOnLoad = (droplistsSelect[i].hasAttribute('data-next-select-id')) ? isDisableOnLoad = true : isDisableOnLoad = false;

        droplists[i] = new Select(id, {
                // auto show the live filter
                filtered: 'auto',
                // auto show the live filter when the options >= 8
                filter_threshold: 10,
                // custom placeholder
                filter_placeholder: 'Filter options...',
                // on start disable/enable select
                onLoadDisable: isDisableOnLoad
            },
            // callback
            function (){
                // close virtual keyboard
                var filter = this.filter;
                setTimeout(function(){
                    filter.blur();
                },200);
                // change color of font
                this.target.parentNode.querySelector('.value').classList.add('select-active');

                // droplist where need to put list by request if need
                var selector = '[data-next-select-id = ' + this.target.id + ']';
                var elemBuildSelect = document.querySelector(selector);

                // Test
                if(elemBuildSelect) {
                    elemBuildSelect.parentNode.querySelector('.value').removeAttribute('disabled');
                    // requestResult(this.value, elemBuildSelect);
                }
            }
        );
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