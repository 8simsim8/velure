window.addEventListener('load', function(){

    const WIDTH_HIDE_FORM = 992;

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    var ticking = false;
    var scrollPage;
    var scrollLeft;
    const sideBar = document.getElementsByClassName('b-side__bar')[0];
    var buttonOpenSideBar = document.querySelector('.b-side__bar-open');

    const deafultTopSideBar = -90;

	window.marginHeaderSideBar = parseInt(window.getComputedStyle(sideBar).getPropertyValue("margin-top"));

	window.paddingLeftParentBar = parseInt(window.getComputedStyle(sideBar.parentNode).getPropertyValue("padding-left"));
	window.paddingRightParentBar = parseInt(window.getComputedStyle(sideBar.parentNode).getPropertyValue("padding-right"));
    window.sideBarFixed = false;

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var accordeons = createAccordeons(accordeonClassName, true);

    if(WIDTH_HIDE_FORM < window.innerWidth) {
        // Плавающая боковая форма
        initScrollSideBar(sideBar, deafultTopSideBar);
        if(document.querySelector('.preloader')) {
            document.querySelector('.preloader').addEventListener(transitionEnd, finishPreload);
        } else {
            finishPreload();
        }
    } else {
        buttonOpenSideBar.addEventListener('click', openSideBar);
    }

    window.addEventListener('resize',resizeBar);

    function openSideBar() {
        document.querySelector('.b-side__bar').classList.toggle('open-side-bar');
    }

    function handlerScrollSideBar() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {

                flowSideBar(scrollPage, sideBar, deafultTopSideBar);

                ticking = false;
            });
        }
        ticking = true;
    }

    function resizeBar() {
        if(WIDTH_HIDE_FORM < window.innerWidth) {
            buttonOpenSideBar.removeEventListener('click', openSideBar);
            initScrollSideBar(sideBar, deafultTopSideBar);
            handlerResizeSideBar(sideBar);
            window.addEventListener('scroll', handlerScrollSideBar);
        } else {
            sideBar.style.position = '';
            sideBar.style.right = '';
            sideBar.style.top = '';
            sideBar.style.left = '';
            sideBar.style.bottom = '';
            sideBar.style.width = '';
            window.removeEventListener('scroll', handlerScrollSideBar);

            buttonOpenSideBar.addEventListener('click', openSideBar);
        }
    }

    function finishPreload() {
        var scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        flowSideBar(scrollPage, sideBar, deafultTopSideBar);
        window.addEventListener('scroll', handlerScrollSideBar);
    }

});

function initScrollSideBar(sideBar, deafultTopSideBar) {
    var scrollPage = window.pageYOffset || document.documentElement.scrollTop;

	if(	scrollPage >= (window.innerHeight - document.getElementsByClassName('b-navigation__header')[0].offsetHeight + deafultTopSideBar - window.marginHeaderSideBar)) {
		if(sideBar.parentNode.getBoundingClientRect().bottom <= ( document.getElementsByClassName('b-navigation__header')[0].offsetHeight + window.marginHeaderSideBar + sideBar.offsetHeight)) {
			sideBar.style.bottom = '0px';
			sideBar.style.top = 'auto';
			sideBar.style.width = '';
		} else {
			var distanceToTopBar = sideBar.parentNode.getBoundingClientRect().top;
			sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight  - distanceToTopBar + 'px';
		}
	}

}

function handlerResizeSideBar(sideBar) {

    if(window.sideBarFixed) {
        if(window.sideBarToBottom) {
            sideBar.style.position = 'absolute';
            sideBar.style.bottom = '0px';
            sideBar.style.left = window.paddingLeftParentBar + 'px';
            sideBar.style.top = 'auto';
            sideBar.style.right = window.paddingRightParentBar + 'px';
            sideBar.style.width = '';
        } else {
			sideBar.style.right = 'auto';
			sideBar.style.bottom = 'auto';
            sideBar.style.left = sideBar.parentNode.offsetLeft + window.paddingLeftParentBar + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth - ( window.paddingLeftParentBar + window.paddingRightParentBar ) + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + 'px';
        }
    }
}

function flowSideBar(scrollPage,sideBar, deafultTopSideBar) {

    if(scrollPage >= (window.innerHeight - document.getElementsByClassName('b-navigation__header')[0].offsetHeight + deafultTopSideBar - window.marginHeaderSideBar)) {

        if(!window.sideBarFixed) {
            sideBar.style.position = 'fixed';
            sideBar.style.left = sideBar.parentNode.offsetLeft + window.paddingLeftParentBar + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth -  ( window.paddingLeftParentBar + window.paddingRightParentBar )  + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + 'px';
            sideBar.style.bottom = 'auto';
            window.sideBarFixed = true;
        }
    } else {
        if(window.sideBarFixed) {
            sideBar.style.position = '';
            sideBar.style.top = '';
            sideBar.style.width = '';
            sideBar.style.left = '';
            window.sideBarFixed = false;
        }
    }

    if(window.sideBarFixed) {
        if(sideBar.parentNode.getBoundingClientRect().bottom <= document.getElementsByClassName('b-navigation__header')[0].offsetHeight + window.marginHeaderSideBar + sideBar.offsetHeight) {
            sideBar.style.position = 'absolute';
            sideBar.style.bottom = '0px';
            sideBar.style.left = window.paddingLeftParentBar + 'px';
            sideBar.style.top = 'auto';
            sideBar.style.right = window.paddingRightParentBar + 'px';
            sideBar.style.width = '';
            window.sideBarToBottom = true;
        } else {
            sideBar.style.position = 'fixed';
            sideBar.style.bottom = 'auto';
            sideBar.style.right = 'auto';
            sideBar.style.left = sideBar.parentNode.offsetLeft + window.paddingLeftParentBar + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth - ( window.paddingLeftParentBar + window.paddingRightParentBar ) + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + 'px';
            window.sideBarToBottom = false;
        }
    }

}