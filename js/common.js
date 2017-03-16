window.addEventListener('load', function() {

    window.transitionEnd = whichTransitionEvent();

    const header = document.getElementsByClassName('l-navigation')[0];

    var buttonMap = document.getElementsByClassName('show-map')[0];

    buttonMap.addEventListener('click', handlerShowMap);

    function handlerShowMap(e) {
        var buttonCloseMap = document.getElementsByClassName('b-popup__map-button-close')[0];
        buttonCloseMap.addEventListener('click', handlerCloseMap);

        document.body.classList.toggle('open-popup');

        e.preventDefault();

        function handlerCloseMap() {
            document.body.classList.toggle('open-popup');
            this.removeEventListener('click', handlerCloseMap);
        }
    }

    var isTouch;

    initBrowser();

    controlInputs();

    window.addEventListener('scroll', handlerScrollWindow);

    var ticking = false;
    var scrollPage;
    var scrollLeft;

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.innerWidth <= 1210) {
                    header.style.left = -scrollLeft + "px";
                } else {
                    header.style.left = 0;
                }
                ticking = false;
            });
        }
        ticking = true;
    }

    // Определение touch устройства
    function detectTouch() {
        try {
            document.createEvent("TouchEvent");
            return true;
        }
        catch (e) {
            return false;
        }
    }

    function initBrowser() {
        isTouch = detectTouch();
        if (isTouch) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.remove('touch-device');
        }
    }
});

function scrollAnim(classAnimEl) {

    var el = document.querySelectorAll(classAnimEl);
    if(el.length == 0) return;

    for(var i = 0, len = el.length; i < len; i++) {

        var posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight - el[i].offsetHeight / 2) {
            el[i].classList.remove('start');
        }

    }

}

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var restransitionsEnd;

    var transitionsEnd = {
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd',
        'transition':'transitionend'
    };

    for(t in transitionsEnd){
        if( el.style[t] !== undefined ){
            restransitionsEnd = transitionsEnd[t];
        }
    }

    return restransitionsEnd;
}

//*** Scroll with animation ***/
function aminScroll(e, time) {

    var EasingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t },
        // accelerating from zero velocity
        easeInQuad: function (t) { return t*t },
        // decelerating to zero velocity
        easeOutQuad: function (t) { return t*(2-t) },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        // accelerating from zero velocity
        easeInCubic: function (t) { return t*t*t },
        // decelerating to zero velocity
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        // accelerating from zero velocity
        easeInQuart: function (t) { return t*t*t*t },
        // decelerating to zero velocity
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        // accelerating from zero velocity
        easeInQuint: function (t) { return t*t*t*t*t },
        // decelerating to zero velocity
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t; },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    };

    var duration = time;
    var bringIntoView_started = Date.now();
    var bringIntoView_ends = bringIntoView_started + duration;

    var bringIntoView_y = (window.pageYOffset || document.documentElement.scrollTop) + e.getBoundingClientRect().top - document.querySelector('.b-navigation__header').offsetHeight + 5;

    window.requestAnimationFrame(bringIntoView_tick);

    function bringIntoView_tick() {

        var distanceLeft, dt, t, travel, temp, scrollY;
        t = Date.now();

        scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (t <= bringIntoView_ends) {
            dt = t - bringIntoView_started;
            temp = EasingFunctions.easeInQuart(dt/duration);
            distanceLeft = bringIntoView_y - scrollY;
            travel = distanceLeft * temp;

            window.scrollTo(0, scrollY + travel);

            window.requestAnimationFrame(bringIntoView_tick);
        } else {
            window.scrollTo(0, bringIntoView_y);
        }
    }

}

//*** Work with property will-change ***//
function willChangeSwitch(elem, prop) {
    if(elem.length) {
        for(var i=0; i < elem.length; i++) {
            elem[i].style.willChange = prop;
        }
    } else {
        elem.style.willChange = prop;
    }
}

//*** Delete composition layer ***//
function removeWillChange(e){
    willChangeSwitch(this, 'auto');
    this.removeEventListener(transitionEnd, removeWillChange);
}

/*
 *   Создание слайдеров, если слайдер внутри аккордеона, без автосмены слайда
 *   classNameSlidersContainer   - обертка слайдера
 *   classNameWrappAccordeon     - обертка аккордеона,
 */
function createSliders(classNameSlidersContainer, classNameWrappAccordeon){
    const slidersElem = document.getElementsByClassName(classNameSlidersContainer);
    var sliders = [];
    for(var i = 0, len = slidersElem.length; i < len; i++) {
        if(isClosest(slidersElem[i], '.'+classNameWrappAccordeon)) {
            sliders[i] = makeSlider(slidersElem[i]);
        } else {
            sliders[i] = makeSlider(slidersElem[i],5000);
        }
    }
    return sliders;
}

/*
 *   Создание аккоредонов
 *   classNameAccordeonContainer - класс обертки аккордеона
 *   isFirstOpen                 - открывать первую вкладку при старте (если нету, закрыты все)
 */
function createAccordeons(classNameAccordeonContainer, isFirstOpen){
    const accordeonsElem = document.getElementsByClassName(classNameAccordeonContainer);
    var accordeons = [];

    for(var i = 0, len = accordeonsElem.length; i < len; i++) {
        accordeons[i] = new MakeAccordeon(accordeonsElem[i]);
        accordeons[i].accordeonStart();

        // Открыть первую вкладку
        if(isFirstOpen) {
            accordeons[i].button[0].click();
        }

    }

    return accordeons;
}

/*
 *   Создание одного аккордеона
 *   elem                        - класс обертки аккордеона
 */
function MakeAccordeon(elem){

    this.accordeonWrap = elem;
    this.items = elem.getElementsByClassName("acc-item");
    this.button = elem.getElementsByClassName('acc-button-element');
    this.hidden = elem.getElementsByClassName("acc-hidden-element");

    this.accordeonStart = function() {
        for (var i = 0, len = this.button.length; i < len; i++) {

            this.button[i].addEventListener('click', clickAccordeon);

            this.button[i].addEventListener('mouseover',handlerMouseOver);

            this.items[i].classList.toggle('accordeon-item');

            this.hidden[i].style.maxHeight = null;
            this.hidden[i].style.display = 'none';
        }
    };

    function clickAccordeon(e){
        var prevElem = elem.querySelector(".active");

        if(prevElem && prevElem != this) {
            prevElem.classList.toggle("active");
            prevElem.nextElementSibling.style.maxHeight = null;
            prevElem.addEventListener(transitionEnd, handlerAnim);
        }

        this.classList.toggle("active");

        var panel = this.nextElementSibling;

        panel.addEventListener(transitionEnd, handlerAnim);

        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.display = '';
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

        function handlerAnim() {
            if(!this.style.maxHeight) {
                this.style.display = 'none';
            }
            this.addEventListener(transitionEnd, handlerAnim);
        }
    }

    function handlerMouseOver() {
        var self = this,
            hidden = self.nextElementSibling;

        willChangeSwitch(hidden, 'max-height');
        if(!hidden.style.maxHeight) {
            hidden.style.display = '';
        }
        self.addEventListener('mouseleave',handlerMouseLeave);

        function handlerMouseLeave() {
            var self = this,
                hidden = self.nextElementSibling;

            willChangeSwitch(hidden, 'auto');
            if(!hidden.style.maxHeight) {
                hidden.style.display = 'none';
            }
            self.removeEventListener('mouseleave', handlerMouseLeave);
        }

    }

    this.accordeonStop = function() {
        var i;
        for (i = 0; i < this.button.length; i++) {
            this.button[i].removeEventListener('click', clickAccordeon);
            this.button[i].removeEventListener('mouseover',handlerMouseOver);
            this.items[i].classList.remove('accordeon-item');

            this.hidden[i].style.maxHeight = null;
            this.hidden[i].style.display = '';

        }
        if(elem.querySelector(".active")) {
            elem.querySelector(".active").classList.remove('active');
        }

    }

}

/*
 *   Создание одного слайдера
 *   wrapClass                   - обертка слайдера,
 *   delayAutoplay               - время между автосменой слайдов (если отсутствует, автосмены нету)
 */
function makeSlider(wrapClass, delayAutoplay){

    var swipeSlide,
        nextButtonClass =   wrapClass.querySelector('.swiper-controls-next') || null,
        prevButtonClass =   wrapClass.querySelector('.swiper-controls-prev') || null,
        paginElemClass =    wrapClass.querySelector('.swiper-pagination') || null;

    delayAutoplay = delayAutoplay || null;

    swipeSlide = new Swiper(wrapClass, {
        spaceBetween: 0,
        slidesPerView: 1,
        autoplay: delayAutoplay,
        nextButton: nextButtonClass,
        prevButton: prevButtonClass,
        pagination: paginElemClass,
        paginationClickable: true,
        setWrapperSize: true,
        loop: true
    });

    swipeSlide.wrapper[0].addEventListener('click', function () {
        swipeSlide.slideNext();
    });

    return swipeSlide;
}

/*
*   Создание и контроль inputs, droplist
*/
function controlInputs() {

    animTextInput('input__field');

    createDroplists('droplist');

    const timePick = createTime('input-time');

    const datePick = createDate('input-date');

}

/*
*    Отслеживание ввода для текстовых input
*    className                  - обертка текстового input
*/
function animTextInput(className) {
    const input = document.getElementsByClassName(className);

    // Styles inputs
    for (var i = 0; i < input.length; i++) {
        input[i].addEventListener('focus', handlerClickInput);
    }

    function handlerClickInput() {
        this.parentNode.classList.add('input--filled');
        if (this.value == '') {
            this.parentNode.querySelector('.input__label-content').style.opacity = '';
        }
        this.addEventListener('blur', handlerBlurInput);
    }

    function handlerBlurInput() {
        if (this.value == '') {
            this.parentNode.classList.remove('input--filled');
            this.parentNode.querySelector('.input__label-content').style.opacity = '';
        } else if(!this.classList.contains('error')) {
            this.parentNode.querySelector('.input__label-content').style.opacity = '0';
        }
        this.removeEventListener('blur', handlerBlurInput);
    }
}

/*
*   Создание выбора даты
*/
function createDate(classDate) {
    const dateInput = document.getElementsByClassName(classDate);
    var datePick = [];
    for(var i = 0, len = dateInput.length; i < len; i++) {
        datePick[i] = new Flatpickr(dateInput[i], {
            minDate: "today",
            altInput: true,
            disableMobile: true,
            locale: 'ru'
        });
    }
    return datePick;
}

/*
 *   Создание выбора времени
 */
function createTime(classTime) {
    const timeInput = document.getElementsByClassName(classTime);
    var timePick = [];
    for(var i = 0, len = timeInput.length; i < len; i++) {
        timePick[i] = new Flatpickr(timeInput[i], {
            noCalendar: true,
            enableTime: true,
            time_24hr: true,
            disableMobile: true
        });
    }
    return timePick;
}

/*
*   Найти на странице select и создать дроплисты
*   classNameDroplists          - класс-вызова дроплиста
*/
function createDroplists(classNameDroplists) {
    var droplistsSelect = document.getElementsByClassName(classNameDroplists);
    var droplists = [];

    for (var i = 0, len = droplistsSelect.length; i < len; i++) {

        droplists[i] = makeDroplist(droplistsSelect[i]);

    }
}

/*
*   Создание одного дроплиста
*   elem                        - select, который заменяет дроплист
*/
function makeDroplist(elem) {

    var id = '#' + elem.id;
    var isDisableOnLoad = elem.hasAttribute('data-next-select-id');

    return droplist = new Select(id, {
        // auto show the live filter
        filtered: 'auto',
        // auto show the live filter when the options >= 10
        filter_threshold: 10,
        // custom placeholder
        filter_placeholder: 'Введите...',
        // on start disable/enable select
        onLoadDisable: isDisableOnLoad
        },
        function () {
        }
    );
}

function isClosest(el, css) {
    var node = el;
    while (node) {
        if (node.matches(css)) return true;
        else node = node.parentElement;
    }
    return false;
}

/*
*   Вывод карты
*/
var mapDiv = document.getElementById('map');
var posit = {lat:50.905910, lng:34.792679};

function myMap() {
    var mapOptions = {
        center: posit,
        zoom: 18,
        disableDefaultUI: true,

        zoomControl: true,
        // mapTypeControl: true,
        // scaleControl: true,
        // streetViewControl: true,
        // rotateControl: true,

        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapDiv, mapOptions);
    var marker = new google.maps.Marker({
        position: posit,
        map: map,
        icon: 'img/marker-map-with-logo.png',
        // animation: google.maps.Animation.DROP,
        title: 'Velure SPA'
    });
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: posit,
            pov: {
                heading: 225,
                pitch: 0
            },
            disableDefaultUI: true
        });
    map.setStreetView(panorama);
}

