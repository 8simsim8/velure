window.breakPointTabletLandscape = 1024;
window.breakPointTabletPortrait = 768;
window.breakPointMobile = 550;

window.isiPad;

var isTouch;
/*
 *   Инициализация браузера
 */
initBrowser();

const header = document.getElementsByClassName('l-navigation')[0];

// Решение проблемы на touch iOS
const linkMenu = document.querySelectorAll('.b-navigation__main .b-navigation__header-links a');
if(window.isiOS) {
    for (var i = 0, len = linkMenu.length; i < len; i++) {
        linkMenu[i].addEventListener('touchend', function(){
            this.click();
        });
    }
}

var isScrollAnim = true;

const isShowMap = document.querySelector('[data-map]').hasAttribute('data-nohide');

var ticking = false;
var scrollPage;
var scrollLeft;
window.updateMap = false;

handlerScrollWindow();

window.addEventListener('scroll', handlerScrollWindow);

const burgerMenuButton = document.getElementsByClassName('burger__button')[0];
if(burgerMenuButton) {
    burgerMenuButton.addEventListener('click', handlerOpenBurgerMenu);
}

window.addEventListener('load', function() {

    /*
    *   Отслдеить исчезновение прелоадера
    */
    if(document.querySelector('.preloader')) {
        document.querySelector('.preloader').addEventListener(transitionEnd, loaderAnimation);
    } else {
        if(document.body.classList.contains('finish-load')) {
            isScrollAnim = scrollAnim('start');
        }
    }

    /*
    *   Инициализация карты
    */
    map();

    /*
     *   Инициализация формы
     */
     controlInputs();


    /*
    *   Логика создания отключения аккордеонов для требуемых элементов в мобильной версии
    */
    toggleMobileAccordeon();

    /*
    *   Открытие попапа для записи
    */
    preparePopupToContact(isShowMap);

    /*
    *   Подготовка карты к открытию/закрытию
    */
    function map() {

        var buttonMap = document.getElementsByClassName('show-map');

        if(window.isiPad) {
            var buttonMapTitle = document.querySelector('.b-title__logo .show-map');
            if(buttonMapTitle) {
                buttonMapTitle.addEventListener('touchend', handlerShowMap);
            }

        }

        // Нету необходимости скрывать карту
        if(!window.updateMap && isShowMap) {
            document.querySelector('[data-map]').children[0].style.opacity = '0';
            myMap();
            google.maps.event.trigger(map, 'resize');
            window.updateMap = true;
        }

        for(var i = 0, len = buttonMap.length; i < len; i++) {
            buttonMap[i].addEventListener('click', handlerShowMap);
            buttonMap[i].addEventListener('mouseenter', prepareShowMap);
            buttonMap[i].addEventListener('mouseleave', cancelPrepareShowMap);
        }

        function handlerShowMap(e) {
            var popup = document.querySelector('[data-map]');
            var mapBlock = popup.children[0];

            var buttonCloseMap = mapBlock.getElementsByClassName('b-popup__button-close')[0];
            buttonCloseMap.addEventListener('click', handlerCloseMap);
            buttonCloseMap.addEventListener('mouseenter', prepareCloseMap);
            buttonCloseMap.addEventListener('mouseleave', cancelPrepareCloseMap);

            if(isShowMap) {
                mapBlock.style.opacity = '1';
            }

            document.body.classList.add('open-popup');
            popup.classList.add('open');

            if(!window.updateMap) {
                myMap();
                google.maps.event.trigger(map, 'resize');
            }

            e.preventDefault();

            popup.addEventListener('click', closePopup);

            function prepareCloseMap(e) {
                willChangeSwitch(popup, 'opacity');
            }

            function cancelPrepareCloseMap() {
                removeWillChange.call(popup);
            }

            function handlerCloseMap(e) {
                if(isShowMap) {
                    document.querySelector('[data-map]').children[0].style.opacity = '0';
                }
                document.body.classList.remove('open-popup');
                popup.classList.remove('open');
                e.stopPropagation();
                this.removeEventListener('click', handlerCloseMap);
            }


            function closePopup(e) {
                var target = e.target;
                if(target === popup) {
                    handlerCloseMap(e);
                    popup.removeEventListener('click', closePopup);
                    e.stopPropagation();
                }
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

});

togglePartText();

function togglePartText() {

    var isCreate = false;

    cutText();

    window.addEventListener('resize', function(){
        cutText();
    });

    function cutText() {
        const elems = document.getElementsByClassName('hide-parent-text');
        if (window.innerWidth <= window.breakPointMobile) {
            var i, len;

            if(!isCreate) {

                for (i = 0, len = elems.length; i < len; i++) {
                    var heightVisible = elems[i].hasAttribute('data-visible') ? elems[i].getAttribute('data-visible') : 400;
                    elems[i].classList.add('hide-part-text');
                    elems[i].style.overflowY = 'hidden';
                    elems[i].style.maxHeight = heightVisible + 'px';
                    createButton(elems[i]);
                }

                isCreate = true;
            }
        } else {
            if(isCreate) {

                for (i = 0, len = elems.length; i < len; i++) {
                    elems[i].classList.remove('hide-part-text');
                    elems[i].style.overflowX = '';
                    elems[i].style.maxHeight = '';
                    elems[i].classList.remove('current-open');
                    elems[i].getElementsByClassName('toggle-text-button')[0].removeEventListener('click', toggleText);
                    elems[i].getElementsByClassName('toggle-text-button')[0].remove();
                }

                isCreate = false;
            }
        }
    }

    function createButton(elem) {
        var button = document.createElement('p');
        button.classList.add('toggle-text-button');
        elem.appendChild(button);

        button.addEventListener('click', toggleText);
    }

    function toggleText() {
        var parent = this.parentNode;
        var heightVisible = parent.hasAttribute('data-visible') ? parent.getAttribute('data-visible') : 400;
        if(parent.classList.contains('current-open')) {
            parent.style.maxHeight = heightVisible + 'px';
            parent.classList.remove('current-open');
        } else {
            parent.style.maxHeight = parent.scrollHeight + 'px';
            parent.classList.add('current-open');
        }
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

    window.isiPad = navigator.userAgent.match(/iPad|iPhone/i) != null;
}

/*
*   Обработчк скролла
*/
function handlerScrollWindow() {
    scrollPage = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    if (!ticking) {
        window.requestAnimationFrame(function () {

            toggleMobileMenu(scrollPage, header);

            // Старт/пауза видео если не мобильный
            if(window.innerWidth > breakPointTabletLandscape) {
                switchPlayVideoOnScroll();
            }

            // Старт и подготовка анимаций при скролле
            if(document.body.classList.contains('finish-load') && isScrollAnim) {
                prepareToAnim();
                isScrollAnim = scrollAnim('start');
            }

            // Необходимо скрывать карту
            if(!isShowMap && !document.body.classList.contains('open-popup')) {
                prepareMapScroll(scrollPage);
            }
            ticking = false;
        });
    }
    ticking = true;
}

/*
*   Подготовка карты к открытию при скролле
*/
function prepareMapScroll(scrollPage) {
    if((document.body.offsetHeight - scrollPage) <= window.innerHeight + 100) {

        if(!window.updateMap) {

            setTimeout(function(){
                var popup = document.querySelector('[data-map]');

                popup.style.display = '-webkit-flex';
                popup.style.display = 'flex';
                popup.children[0].style.display = '-webkit-flex';
                popup.children[0].style.display = 'flex';

                myMap();

                google.maps.event.trigger(map, 'resize');

            },100);
            window.updateMap = true;
        }
    } else {
        if(window.updateMap) {
            window.updateMap = false;
            document.querySelector('[data-map]').style.display = '';
            document.querySelector('[data-map]').children[0].style.display = '';
        }
    }
}

/*
*   Показывать/скрывать меню в мобильной версии
*/
function toggleMobileMenu(scroll, header) {

    if (window.innerWidth <= window.breakPointMobile) {
        if (scroll >= (window.innerHeight/2)) {
            header.classList.add('transition-mobile-menu');
            header.classList.add('show-mobile-menu');
        } else {
            header.classList.add('transition-mobile-menu');
            header.classList.remove('show-mobile-menu');
        }
        header.addEventListener(transitionEnd, finishAnimation);
    } else {
        header.classList.remove('show-mobile-menu');
    }

    function finishAnimation(){
        header.classList.remove('transition-mobile-menu');
        header.removeEventListener(transitionEnd, finishAnimation);
    }
}

/*
*   Открытие/закрытие бургер меню в режиме "tablet"
*/
function handlerOpenBurgerMenu() {
    var burgerMenuList = document.getElementsByClassName('b-navigation__main')[0];
    burgerMenuList.classList.toggle('open-burger');
    this.classList.toggle('open-burger');
}

/*
*   Остановка воспроизведения видео, когда скрыто
*/
function switchPlayVideoOnScroll() {
    var video = document.querySelector('video');
    var waitTime = 150;

    if(video) {
        if(video.getBoundingClientRect().bottom < 0) {
            if(window.isVideoPlay) {
                video.muted = true;
                video.controls = false;

                setTimeout(function () {
                    // Resume play if the element if is paused.
                    if (video.played) {
                        video.pause();
                    }
                }, waitTime*2);
                window.isVideoPlay = false;
            }
        } else {
            if(!window.isVideoPlay) {
                video.muted = true;
                video.controls = false;

                setTimeout(function () {
                    // Resume play if the element if is paused.
                    if (video.paused) {
                        video.play();
                    }
                }, waitTime);
                window.isVideoPlay = true;
            }
        }
    }
}

/*
*   Отслеживание старта анимации элементов при скроле
*/
function scrollAnim(classAnimEl, classAfterFinish) {

    var start = classAnimEl || 'start';
    var finish = classAfterFinish || 'finish';

    var el = document.querySelectorAll('.'+start);

    if(el.length === 0) return false;

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

    return true;

}

/*
*   Подготовка элементов к анимации при скроле
*/
function prepareToAnim(classAnimEl) {
    var start = classAnimEl || 'start';

    var el = document.querySelectorAll('.'+start);

    if(el.length === 0) return;

    for(var i = 0, len = el.length; i < len; i++) {

        var posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight && el[i].style.willChange === '') {
            willChangeSwitch(el[i], 'transition, opacity');
            el[i].addEventListener(transitionEnd, removeWillChange);
        }

    }
}

/*
*   Создание слоя комнозиции с помощью will-change перед анимацией
*   elem                        - анимируемый элемент
*   prop                        - свойства, которые необходимо подготовить
*/
function willChangeSwitch(elem, prop) {

    if(elem.length) {
        for(var i=0; i < elem.length; i++) {
            elem[i].style.willChange = prop;
        }
    } else {
        elem.style.willChange = prop;
    }
}

/*
*   Удаление слоя из композиции
*/
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
    classNameWrappAccordeon = classNameWrappAccordeon || null;

    var duration;

    const slidersElem = document.getElementsByClassName(classNameSlidersContainer);
    var sliders = [];
    for(var i = 0, len = slidersElem.length; i < len; i++) {

        duration = slidersElem[i].hasAttributes('data-duration') ? parseInt(slidersElem[i].getAttribute('data-duration')) : null;

        if (slidersElem[i].getElementsByClassName('swiper-slide').length > 1) {
            if(classNameWrappAccordeon && isClosest(slidersElem[i], '.' + classNameWrappAccordeon) || isClosest(slidersElem[i], '[data-autoSlide=false]')) {
                sliders[i] = makeSlider(slidersElem[i]);
            } else {
                sliders[i] = makeSlider(slidersElem[i], duration);
            }
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
 *   Создание аккордеонов когда ширина меньше 768px
 *   Если обертка "accordeon-mobile" с атрибутом "data-first-open" - открыть первый
 */
function toggleMobileAccordeon() {

    var mobileAcc = document.getElementsByClassName('accordeon-mobile');
    var tabletAcc = document.getElementsByClassName('accordeon-tablet');

    var isAccordeonMobileStart = false;
    var isAccordeonTabletStart = false;

    // var items = cards.getElementsByClassName('acc-item');
    var accordeonsMobile = [];
    var accordeonsTablet = [];
    var i, len;

    for(i = 0, len = mobileAcc.length; i < len; i++) {
        accordeonsMobile[i] = new MakeAccordeon(mobileAcc[i], 500);
    }

    for(i = 0, len = tabletAcc.length; i < len; i++) {
        accordeonsTablet[i] = new MakeAccordeon(tabletAcc[i], 500);
    }

    createAccordeon();

    window.addEventListener('resize', createAccordeon);

    function createAccordeon() {

        if (window.innerWidth <= window.breakPointTabletPortrait) {
            if(!isAccordeonTabletStart) {
                for (i = 0, len = tabletAcc.length; i < len; i++) {
                    accordeonsTablet[i].accordeonStart();
                    if(accordeonsTablet[i].accordeonWrap.hasAttribute('data-first-open')) {
                        accordeonsTablet[i].button[0].click();
                    }
                }
                isAccordeonTabletStart = true;
            }
        } else {
            if(isAccordeonTabletStart) {
                for (i = 0, len = tabletAcc.length; i < len; i++) {
                    accordeonsTablet[i].accordeonStop();
                }
                isAccordeonTabletStart = false;
            }
        }

        if (window.innerWidth <= window.breakPointMobile) {
            if(!isAccordeonMobileStart) {
                for (i = 0, len = mobileAcc.length; i < len; i++) {
                    accordeonsMobile[i].accordeonStart();
                    if(accordeonsMobile[i].accordeonWrap.hasAttribute('data-first-open')) {
                        accordeonsMobile[i].button[0].click();
                    }
                }
                isAccordeonMobileStart = true;
            }
        } else {
            if(isAccordeonMobileStart) {
                for (i = 0, len = mobileAcc.length; i < len; i++) {
                    accordeonsMobile[i].accordeonStop();
                }
                isAccordeonMobileStart = false;
            }
        }
    }
}

/*
 *   Создание одного аккордеона
 *   elem                        - класс обертки аккордеона
 */
function MakeAccordeon(elem, time, callBack){

    const self = this;

    var defaultWidth = window.innerWidth;

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

        window.addEventListener('resize', resizeAccordeon.bind(self));

        this.accordeonWrap.classList.add('start-acc');

        if(typeof callBack === 'function') {
            callBack();
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

        if (self.classList.contains('active')) {
            window.requestAnimationFrame(bringSlideUp.bind(null,self,self, false));
        } else {
            window.requestAnimationFrame(bringSlideDown.bind(null,self));
        }

        var prevElem = element.querySelector(".active");

        self.classList.toggle("active");

        // if (prevElem && prevElem != self) {
        //     prevElem.classList.toggle("active");
        //     window.requestAnimationFrame(bringSlideUp.bind(null,self,prevElem, true));
        // } else if(prevElem && prevElem == self) {
        //     window.requestAnimationFrame(bringSlideUp.bind(null,self,self, false));
        // } else {
        //     window.requestAnimationFrame(bringSlideDown.bind(null,self));
        // }

        function bringSlideUp(newActiveButton, buttonBlock, callBack) {

            var panel = buttonBlock.nextElementSibling;

            var dt, t, temp;

            t = Date.now();

            if (t <= bringEndsUp) {
                dt = t - bringStarted;
                temp = EasingFunctions.easeInQuart(dt / durationUp);

                panel.style.height = (panel.scrollHeight - Math.floor(panel.scrollHeight*temp) ) + 'px' ;

                if(newActiveButton.getBoundingClientRect().top < 0) {

                    var bringIntoView_y = (window.pageYOffset || document.documentElement.scrollTop) + newActiveButton.getBoundingClientRect().top - document.querySelector('.b-navigation__header').offsetHeight + 5;

                    window.scrollTo(0, bringIntoView_y);

                    setTimeout(function(){
                        window.requestAnimationFrame(bringSlideUp.bind(null,self,buttonBlock,callBack));
                    },30);

                } else {
                    window.requestAnimationFrame(bringSlideUp.bind(null,self,buttonBlock,callBack));
                }

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

        this.accordeonWrap.classList.remove('start-acc');

        window.removeEventListener('resize', resizeAccordeon);
    };

    function resizeAccordeon(e) {

        setTimeout(function(){
            if(defaultWidth === window.innerWidth) {
                return false;
            } else {
                var self = this;
                var actives = elem.querySelectorAll('.active');

                for (var i = 0, len = actives.length; i < len; i++) {
                    var hidden = actives[i].nextElementSibling;
                    hidden.style.height = 0;
                    hidden.style.height = hidden.scrollHeight + 'px';
                }

                defaultWidth = window.innerWidth;
            }
        },150);
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

    var isLoop = !wrapClass.hasAttribute('data-no-loop');

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
        loop: isLoop
    });

    swipeSlide.wrapper[0].addEventListener('click', function () {
        swipeSlide.slideNext();
    });

    return swipeSlide;
}

/*
*   Создание и контроль inputs, droplist, textarea
*/
function controlInputs() {

    var i, len;
    var datePick;
    var isCreateDatePick = false;

    animTextInput('input__field');

    controlHeightTextArea();

    const timePick = createTime('input-time');

    createDroplists('droplist');

    if(window.innerWidth > breakPointMobile) {
        datePick = createDate('input-date');
        isCreateDatePick = true;
    } else {
        var date = document.getElementsByClassName('input-date');

        for(i = 0, len = date.length; i < len; i++) {
            date[i].addEventListener('change', function(){
                if(this.value !== '') {
                    this.classList.add('full');
                } else {
                    this.classList.remove('full');
                }
            });
        }
    }


    window.addEventListener('resize',function(){
        if(isCreateDatePick) {
            for (var i = 0, len = datePick.length; i < len; i++) {
                datePick[i].destroy();
                isCreateDatePick = false;
            }
        }
        datePick = createDate('input-date');
        isCreateDatePick = true;
    });

    var forms = document.getElementsByTagName('form');

    var validation = [];

    for(i = 0, len = forms.length; i < len; i++) {

        /*
         * Валидация формы записи
         */
        validation[i] = new MakeValidationForm(
            forms[i],                                     // Form DOM
            '/mailer/PHPmailer.php',                       // Path to Mailer
            textError = {                                  // Text error messages
                'services': {
                    'required'  :   'Выберите услугу'
                }
            },
            settings = {
                // duringShowError : 2000                                            // Duration show error messages
                clearAfterSend : forms[i].querySelectorAll('[data-clearAfterSend]')  // Убрать значения после отправки
            },
            function() {
                // Callback function

                var form = this;
                var sendWindow = this.parentNode.querySelector('.form-sent');
                form.style.webkitTransition = 'opacity 0.2s ease';
                form.style.transition = 'opacity 0.2s ease';
                form.style.opacity = 0;
                sendWindow.style.display = 'block';
                sendWindow.classList.add('show-message');

                var buttonClose = sendWindow.querySelector('.button-close');

                if (buttonClose) {
                    var clearTime;

                    buttonClose.addEventListener('click', closePopup);

                    function closePopup() {
                        clearTimeout(clearTime);
                        timeOut();
                    }

                    clearTime = setTimeout(timeOut, 5000);

                    function timeOut() {
                        var popup;
                        var node = form;

                        while (node) {
                            if (node.classList.contains('b-popup')) {
                                popup = node;
                                break;
                            }
                            node = node.parentNode;
                        }

                        var wrap = popup.children[0];

                        form.style.webkitTransition = '';
                        form.style.transition = '';
                        form.style.opacity = '';

                        popup.style.display = '';

                        wrap.style.display = '';

                        document.body.classList.remove('open-popup');
                        popup.classList.remove('open');
                        sendWindow.classList.remove('show-message');

                        sendWindow.addEventListener(transitionEnd, removeBlock);
                    }

                    function removeBlock() {
                        this.removeEventListener(transitionEnd, removeBlock);
                        sendWindow.style.display = '';
                    }
                }
            }

        );
    }

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

    function handlerClickInput(e) {
        this.parentNode.classList.add('input--filled');
        if (this.value === '') {
            this.parentNode.querySelector('.input__label-content').style.opacity = '';
        }
        this.addEventListener('blur', handlerBlurInput);
    }

    function handlerBlurInput() {
        if (this.value === '') {
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
    const dateInput     = document.querySelectorAll('.'+classDate);
    var datePick        = [];

    var language        = document.querySelector('.b-navigation__side-right .current').innerText;

    for(var i = 0, len = dateInput.length; i < len; i++) {
        datePick[i] = new Flatpickr(dateInput[i], {
            minDate: "today",
            altInput: true,
            disableMobile: true,
            defaultDate: "today",
            locale: (language == 'RU') ? 'ru' : null
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
        createSelectTime(timeInput[i]);
    }

    return timePick;

    function createSelectTime(input) {

        var label = document.createElement('label');

        var select = document.createElement('select');
        var attributes = Array.prototype.slice.call(input.attributes);
        for(var i = 0, len = attributes.length; i < len; i++) {
            if(attributes[i].name != 'placeholder') {
                select.setAttribute(attributes[i].name, attributes[i].value);
            }
        }
        select.setAttribute('data-placeholder', input.placeholder);
        select.setAttribute('data-nofilter', '');
        select.className += input.className + ' droplist';

        if(input.required) {
            select.setAttribute('required','');
        }

        var from = +input.getAttribute('data-from') || 9;
        var to = +input.getAttribute('data-to') || 19;
        var step = +input.getAttribute('data-step') || 1;

        i = from;
        while(i <= to) {
            var option = document.createElement("option");
            option.text = i + ':00';
            select.add(option);
            i += step;
        }

        label.append(select);

        input.parentNode.insertBefore(label, input);

        input.remove();
    }
}

/*
*   Найти на странице select и создать дроплисты
*   classNameDroplists          - класс-вызова дроплиста
*/
function createDroplists(classNameDroplists) {
    var droplistsSelect = document.querySelectorAll('.'+classNameDroplists);
    var droplists = [];

    for (var i = 0, len = droplistsSelect.length; i < len; i++) {
        droplists[i] = makeDroplist(droplistsSelect[i]);
    }

    return droplists;
}

/*
*   Создание одного дроплиста
*   elem                        - select, который заменяет дроплист
*/
function makeDroplist(elem) {

    var isDisableOnLoad = elem.hasAttribute('data-next-select-id');

    var isFilter = elem.hasAttribute('data-nofilter') ? false : 'auto';

    return droplist = new Select(elem, {
        // auto show the live filter
        // filtered: 'auto',
        filtered: isFilter,
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
*   Поддержка высоты текстового поля ввода
*/
function controlHeightTextArea() {

    var textarea = document.querySelectorAll('textarea[data-autoresize]');

    var heightInput = [];
    var defaultHeight = [];

    var resizeTextarea = function(index) {
        var self = this;

        if(self.scrollHeight > defaultHeight[index]) {
            if(heightInput[index] !== null && self.scrollHeight > heightInput[index]) {
                self.parentNode.style.transition = 'height 0.2s ease';
                self.parentNode.style.height = self.scrollHeight + 12 + 'px';
            }
            self.parentNode.style.lineHeight = '1.75em';
            self.style.height = self.scrollHeight + 'px';
        }
    };

    for(var i = 0, len = textarea.length; i < len; i++) {
        defaultHeight[i] = textarea[i].offsetHeight;
        heightInput[i] = textarea[i].parentNode.classList.contains('input') ? textarea[i].parentNode.offsetHeight : null;
        textarea[i].addEventListener('keyup', resizeTextarea.bind(textarea[i], i));
    }
}

/*
*   Полифил для поиска вхождения элемента в группу
*/
function isClosest(el, crit) {
    var node = el;
    if(typeof crit === 'string') {
        while (node) {
            if (node.matches(crit)) return true;
            else node = node.parentElement;
        }
        return false;
    }
    if(typeof crit === 'object') {
        while (node) {
            if (node === crit) return true;
            else node = node.parentElement;
        }
        return false;
    }
}

/*
*   Вывод карты
*/
function myMap() {
    var mapDiv = document.getElementById('map');
    var posit = {lat:50.905910, lng:34.792679};

    var zoomValue = (window.innerWidth <= window.breakPointMobile) ? 17 : 18;

    var mapOptions = {
        center: posit,
        zoom: zoomValue,
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

/*
*   Скролл к элементу с анимацией
*   e - элемент до которого скролл
*   delta - отступ от верха окна до элемента
*   time - колличество мс
*   timingEase - ease функция анимации
*/
function aminScroll(e, delta, time, timingEase) {

    var deltaTop = delta || (document.querySelector('.b-navigation__header').offsetHeight + 5);
    var duration = time || 0;
    var ease = timingEase || 'linear';
    var bringIntoView_started = Date.now();
    var bringIntoView_ends = bringIntoView_started + duration;

    var bringIntoView_y = (window.pageYOffset || document.documentElement.scrollTop) + e.getBoundingClientRect().top - deltaTop;

    window.requestAnimationFrame(bringIntoView_tick);

    function bringIntoView_tick() {

        var distanceLeft, dt, t, travel, temp, scrollY;
        t = Date.now();

        scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (t <= bringIntoView_ends) {
            dt = t - bringIntoView_started;
            temp = EasingFunctions[ease](dt/duration);
            distanceLeft = bringIntoView_y - scrollY;
            travel = distanceLeft * temp;

            window.scrollTo(0, scrollY + travel);

            window.requestAnimationFrame(bringIntoView_tick);
        } else {
            window.scrollTo(0, bringIntoView_y);
        }
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

}

/*
*   Старт анимации при загрузке, если на нужном обьекте
*/
function loaderAnimation() {
    if(document.body.classList.contains('finish-load')) {
        scrollAnim('start');
    }
    if(document.querySelector('.preloader')) {
        document.querySelector('.preloader').removeEventListener(transitionEnd, loaderAnimation);
    }
}

/*
*   Создание свайпа для списка сотрудников
*/
function swipeForStaffs() {
    // Sliders staffs
    var staffs;
    var isSliderCreate = false;

    const slidersElem = document.getElementsByClassName('b-staffs__slider')[0];

    if(slidersElem) {
        resizeWindow();

        window.addEventListener('resize', resizeWindow);
    }

    function resizeWindow() {

        if (window.innerWidth <= window.breakPointTabletPortrait) {
            // Sliders staffs
            if (!isSliderCreate) {
                staffs = makeSliderForStaff(slidersElem);
                isSliderCreate = true;
            }
        } else {
            if (isSliderCreate) {
                staffs.destroy(false, true);
                isSliderCreate = false;
            }
        }
    }

    function makeSliderForStaff(wrapClass){

        var swipeSlide,
            paginElemClass =    wrapClass.querySelector('.swiper-pagination') || null;

        swipeSlide = new Swiper(wrapClass, {
            spaceBetween: 0,
            slidesPerView: 3,
            pagination: paginElemClass,
            paginationClickable: true,
            setWrapperSize: true,
            loop: true,
            centeredSlides: true,
            breakpoints: {
                768: {
                    slidesPerView: 3
                },
                550: {
                    slidesPerView: 1,
                }
            }
        });

        return swipeSlide;
    }

}

/*
*   Открытие попапа записи
*   .button-record          - класс на кнопке вызова попапа через описание пакета
*   .button-online-record   - класс на кнопке вызова попапа онлайн регистрации
*   .name                   - класс на названии сервиса, которое вписывается в форму запроса (через пакет)
*/
function preparePopupToContact(isShowMap) {
    var buttonToOpenPopupContact = document.getElementsByClassName('button-record');
    var buttonToOpenPopupOnlineRecord = document.getElementsByClassName('button-online-record');
    var i, len;

    for(i = 0, len = buttonToOpenPopupContact.length; i < len; i++) {
        buttonToOpenPopupContact[i].addEventListener('click', handlerOpenPopupContact);
        if(window.isiPad) {
            buttonToOpenPopupContact[i].addEventListener('touchend', handlerOpenPopupContact);
        }
        buttonToOpenPopupContact[i].addEventListener('mouseenter', prepareOpenWrapPopup.bind(buttonToOpenPopupContact[i],'[data-contact]'));
    }

    for(i = 0, len = buttonToOpenPopupOnlineRecord.length; i < len; i++) {
        buttonToOpenPopupOnlineRecord[i].addEventListener('click', handlerOpenPopupOnlineRecord);
        if(window.isiPad) {
            // buttonToOpenPopupOnlineRecord[i].addEventListener('touchend', handlerOpenPopupOnlineRecord);
        }
        buttonToOpenPopupOnlineRecord[i].addEventListener('mouseenter', prepareOpenWrapPopup.bind(buttonToOpenPopupOnlineRecord[i],'[data-online-record]'));
    }


    function handlerOpenPopupContact(e) {
        var popup = document.querySelector('[data-contact]');
        var formWrap = popup.children[0];
        var self = this;
        var node;

        var valueService;

        node = self;
        while(!node.classList.contains('item-table-row') && node.parentNode.parentNode) {
            node = node.parentNode;
        }

        if(!node.classList.contains('item-table-row')) {
            node = self;
            while(!node.classList.contains('acc-item') && node.parentNode) {
                node = node.parentNode;
            }
        }

        valueService = node.querySelector('.name').innerHTML;

        formWrap.querySelector('h4').innerHTML = valueService;
        formWrap.querySelector('[name=services]').value = valueService;

        openWrapPopup(popup, formWrap);

        e.preventDefault();
    }

    function handlerOpenPopupOnlineRecord(e) {

        var popup = document.querySelector('[data-online-record]');
        var formWrap = popup.children[0];

        openWrapPopup(popup, formWrap);

        e.preventDefault();
    }

    function openWrapPopup(popup, wrap) {

        wrap.style.display = 'block';

        document.body.classList.add('open-popup');
        popup.classList.add('open');

        popup.style.display = 'flex';
        popup.style.display = '-webkit-flex';

        popup.addEventListener('click', closePopup);

        var buttonClosePopup = wrap.querySelector('.b-popup__button-close');
        buttonClosePopup.addEventListener('click', handlerClosePopup);

        function closePopup(e) {
            var target = e.target;
            if(target === popup) {
                popup.removeEventListener('click', closePopup);
                handlerClosePopup(e);
            }
        }

        function handlerClosePopup(e) {
            popup.style.display = '';

            wrap.style.display = '';

            document.body.classList.remove('open-popup');
            popup.classList.remove('open');
            // e.stopPropagation();
            this.removeEventListener('click', handlerClosePopup);
        }
    }

    function prepareOpenWrapPopup(attr) {

        var popup = document.querySelector(attr);
        popup.style.display = 'flex';
        popup.style.display = '-webkit-flex';

        willChangeSwitch(popup, 'opacity');

        this.addEventListener('mouseleave', handlerCancelPrepareToOpenWrapPopup.bind(this, popup));

        function handlerCancelPrepareToOpenWrapPopup(popup) {
            popup.style.display = '';
            removeWillChange.call(popup);
            this.removeEventListener('mouseleave', handlerCancelPrepareToOpenWrapPopup);
        }

    }

}

(function() {

    // проверяем поддержку 'matches'
    var matches = function() {
        if (!Element.prototype.matches) {
            // определяем свойство
            Document.prototype.append = Element.prototype.matches = Element.prototype.matchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector;
        }
    };

    // проверяем requestAnimationFrame
    var requestAnimationFrame = function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    };

    matches();

    requestAnimationFrame();

})();
