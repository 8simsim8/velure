window.addEventListener('load', function() {

    window.transitionEnd = whichTransitionEvent();

    const header = document.getElementsByClassName('l-navigation')[0];
    const buttonOnlineRecord = document.querySelector('.online-record');

    // Scroll on click button
    buttonOnlineRecord.addEventListener('click', function handlerOnlineRecordButton(e){
        aminScroll(document.querySelector('.b-form'), 1000);
    });

    let isTouch;

    initBrowser();

    window.addEventListener('scroll', handlerScrollWindow);

    let ticking = false;
    let scrollPage;
    let scrollLeft;

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.innerWidth <= 1210) {
                    header.style.left = -scrollLeft + "px";
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

    let el = document.querySelectorAll(classAnimEl);
    if(el.length == 0) return;

    for(let i = 0, len = el.length; i < len; i++) {

        let posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight - el[i].offsetHeight / 2) {
            el[i].classList.remove('start');
        }

    }


}

function whichTransitionEvent(){
    let t;
    let el = document.createElement('fakeelement');
    let restransitionsEnd;

    let transitionsEnd = {
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

    let EasingFunctions = {
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