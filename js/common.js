window.addEventListener('load', function() {

    window.transitionEnd = whichTransitionEvent();

    var header = document.getElementsByClassName('l-navigation')[0];

    var isTouch;

    initBrowser();

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

    for(let i = 0, len = el.length; i < len; i++) {

        var posEl = el[i].getBoundingClientRect();

        if (posEl.top <= window.innerHeight - el[i].offsetHeight / 2) {
            el[i].classList.remove('start');
        }

    }


}

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');

    var transitionsEnd = {
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd',
        'transition':'transitionend'
    };

    for(t in transitionsEnd){
        if( el.style[t] !== undefined ){
            transitionEnd = transitionsEnd[t];
        }
    }

    return transitionEnd;
}