window.addEventListener('load', function() {

    const header = document.getElementsByClassName('l-navigation')[0];

    var ticking = false;
    var scrollPage;
    var scrollLeft;
    var updateMap = false;

    window.addEventListener('scroll', handlerScrollWindow);


    var isTouch;

    /*
    *   Инициализация браузера
    */
    initBrowser();

    /*
    *   Инициализация формы
    */
    controlInputs();

    /*
    *   Инициализация карты
    */
    map();

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                // if (window.innerWidth <= 1210) {
                //     header.style.left = -scrollLeft + "px";
                // } else {
                //     header.style.left = '';
                // }
                prepareMapScroll(scrollPage);
                ticking = false;
            });
        }
        ticking = true;
    }

    /*
    *   Подготовка карты к открытию при скролле
    */
    function prepareMapScroll(scrollPage) {
        if((document.body.offsetHeight - scrollPage) <= window.innerHeight + 5) {
            if(!updateMap) {
                setTimeout(function(){
                    var popup = document.getElementsByClassName('b-popup')[0];

                    popup.style.display = 'flex';

                    myMap();

                    google.maps.event.trigger(map, 'resize');

                },100);
                updateMap = true;
            }
        } else {
            if(updateMap) {
                updateMap = false;
                document.getElementsByClassName('b-popup')[0].style.display = '';
            }
        }
    }

    /*
    *   Подготовка карты к открытию/закрытию
    */
    function map() {

        var buttonMap = document.getElementsByClassName('show-map')[0];

        buttonMap.addEventListener('click', handlerShowMap);
        buttonMap.addEventListener('mouseenter', prepareShowMap);
        buttonMap.addEventListener('mouseleave', cancelPrepareShowMap);

        function handlerShowMap(e) {
            var buttonCloseMap = document.getElementsByClassName('b-popup__map-button-close')[0];
            buttonCloseMap.addEventListener('click', handlerCloseMap);
            buttonCloseMap.addEventListener('mouseenter', prepareCloseMap);
            buttonCloseMap.addEventListener('mouseleave', cancelPrepareCloseMap);

            var popup = document.getElementsByClassName('b-popup')[0];

            document.body.classList.toggle('open-popup');

            if(!updateMap) {
                myMap();
                google.maps.event.trigger(map, 'resize');
            }

            e.preventDefault();

            function prepareCloseMap(e) {
                willChangeSwitch(popup, 'opacity');
            }

            function cancelPrepareCloseMap() {
                removeWillChange.call(popup);
            }

            function handlerCloseMap() {
                document.body.classList.toggle('open-popup');
                this.removeEventListener('click', handlerCloseMap);
            }
        }

        function prepareShowMap(e) {

            var popup = document.getElementsByClassName('b-popup')[0];

            willChangeSwitch(popup, 'opacity');
            popup.addEventListener(transitionEnd, removeWillChange);

        }

        function cancelPrepareShowMap() {
            var popup = document.getElementsByClassName('b-popup')[0];
            removeWillChange.call(popup);
        }

    }

    /*
    *   Инициализация браузера
    */
    function initBrowser() {
        isTouch = detectTouch();
        if (isTouch) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.remove('touch-device');
        }

        /*
         *   Определение touch устройства
         */
        function detectTouch() {
            try {
                document.createEvent("TouchEvent");
                return true;
            }
            catch (e) {
                return false;
            }
        }

    }
});

/*
*   Отслеживание старта анимации элементов при скроле
*/
function scrollAnim(classAnimEl, classAfterFinish) {

    var start = classAnimEl || 'start';
    var finish = classAfterFinish || 'finish';

    var el = document.querySelectorAll('.'+start);

    if(el.length == 0) return;

    for(var i = 0, len = el.length; i < len; i++) {

        var posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight - el[i].offsetHeight / 2) {
            el[i].classList.remove(start);
            el[i].addEventListener(transitionEnd, listenAnim);
        }

    }

    function listenAnim(){
        this.classList.add(finish);
        this.removeEventListener(transitionEnd, listenAnim);
    }

}

/*
*   Подготовка элементов к анимации при скроле
*/
function prepareToAnim(classAnimEl) {
    var start = classAnimEl || 'start';

    var el = document.querySelectorAll('.'+start);

    if(el.length == 0) return;

    for(var i = 0, len = el.length; i < len; i++) {

        var posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight && el[i].style.willChange == '') {
            willChangeSwitch(el[i], 'transition, opacity');
            el[i].addEventListener(transitionEnd, removeWillChange);
        }

    }
}

/*
*   Скролл к элементу с анимацией
*/
function aminScroll(e, time) {

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
function removeWillChange(){
    var self = this;

    willChangeSwitch(self, 'auto');
    self.removeEventListener(transitionEnd, removeWillChange);
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
        accordeons[i] = new MakeAccordeon(accordeonsElem[i], 500);

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
function MakeAccordeon(elem, time){

    this.accordeonWrap = elem;
    this.time = time;
    this.items = elem.getElementsByClassName("acc-item");
    this.button = elem.getElementsByClassName('acc-button-element');
    this.hidden = elem.getElementsByClassName("acc-hidden-element");

    this.accordeonStart = function() {
        for (var i = 0, len = this.button.length; i < len; i++) {

            this.button[i].addEventListener('click', handlerClick);
            this.items[i].classList.add('accordeon-item');

            this.hidden[i].style.height = 0;
            this.hidden[i].style.padding = 0;
            this.hidden[i].style.overflow = 'hidden';
            this.hidden[i].style.display = 'none';
        }
    };

    function handlerClick(e) {
        clickAccordeon(this, elem,time);
        e.preventDefault();
        e.stopPropagation();
    }

    function clickAccordeon(self, element,durationDown) {

        var bringStarted = Date.now();
        var bringEndsDown = bringStarted + durationDown;
        var durationUp = 500;
        var bringEndsUp = bringStarted + durationUp;

        var prevElem = element.querySelector(".active");

        self.classList.toggle("active");

        if (prevElem && prevElem != self) {
            prevElem.classList.toggle("active");
            window.requestAnimationFrame(bringSlideUp.bind(null,prevElem, true));
        } else if(prevElem && prevElem == self) {
            console.log(self);
            window.requestAnimationFrame(bringSlideUp.bind(null,self, false));
        } else {
            window.requestAnimationFrame(bringSlideDown.bind(null,self));
        }

        function bringSlideUp(buttonBlock, callBack) {

            var panel = buttonBlock.nextElementSibling;

            var dt, t, temp;

            t = Date.now();

            if (t <= bringEndsUp) {
                dt = t - bringStarted;
                temp = EasingFunctions.easeInQuart(dt / durationUp);

                panel.style.height = (panel.scrollHeight - Math.floor(panel.scrollHeight*temp) ) + 'px' ;

                window.requestAnimationFrame(bringSlideUp.bind(null,buttonBlock,callBack));
            } else {
                panel.style.height = '0px';
                panel.style.display = 'none';
                if(callBack) {
                    bringStarted = Date.now();
                    bringEndsDown = bringStarted + durationDown;
                    window.requestAnimationFrame(bringSlideDown.bind(null,element.querySelector(".active")));
                }
            }
        }

        function bringSlideDown(buttonBlock) {

            var panel = buttonBlock.nextElementSibling;

            panel.style.display = '';

            var dt, t, temp;

            t = Date.now();

            if (t <= bringEndsDown) {
                dt = t - bringStarted;
                temp = EasingFunctions.easeOutQuart(dt / durationDown);

                panel.style.height = Math.floor(panel.scrollHeight*temp) + 'px';

                window.requestAnimationFrame(bringSlideDown.bind(null,buttonBlock));
            } else {
                panel.style.height = Math.floor(panel.scrollHeight) + 'px';
            }
        }
    }

    this.accordeonStop = function() {
        for (var i = 0, len = this.button.length; i < len; i++) {
            this.button[i].removeEventListener('click', handlerClick);

            this.items[i].classList.remove('accordeon-item');

            this.hidden[i].style.display = '';
            this.hidden[i].style.height = '';
            this.hidden[i].style.padding = '';
            this.hidden[i].style.overflow = '';
        }

        if(this.accordeonWrap.querySelector(".active")) {
            this.accordeonWrap.querySelector(".active").classList.remove('active');
        }
    };

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

    /*
     * Валидация формы записи
     */
    var validation = new MakeValidationForm(
        document.getElementsByTagName('form')[0],      // Form DOM
        '/mailer/PHPmailer.php',                       // Path to Mailer
        textError = {                                  // Text error messages
            'services': {
                'required'  :   'Выберите услугу',
            }
        },
        settings = {
            // duringShowError : 2000                       // Duration show error messages
        },
        function(options){                               // Callback function
            console.log("ок");
        }
    );

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

/*
*   Полифил для поиска вхождения элемента в группу
*/
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
function myMap() {
    var mapDiv = document.getElementById('map');
    var posit = {lat:50.905910, lng:34.792679};

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

