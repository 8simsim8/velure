window.addEventListener('load', function(){

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    var ticking = false;
    var scrollPage;
    var scrollLeft;
    const sideBar = document.getElementsByClassName('b-side__bar')[0];
    const deafultTopSideBar = sideBar.offsetTop;
	window.marginHeaderSideBar = 20;
	window.paddingLeftParentBar = parseInt(window.getComputedStyle(sideBar.parentNode).getPropertyValue("padding-left"));
	window.paddingRightParentBar = parseInt(window.getComputedStyle(sideBar.parentNode).getPropertyValue("padding-right"));
    window.sideBarFixed = false;

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var accordeons = createAccordeons(accordeonClassName, true);

	// Плавающая боковая форма
	initScrollSideBar(sideBar, deafultTopSideBar);
	document.querySelector('.preloader').addEventListener(transitionEnd, function finishPreload() {
		var scrollPage = window.pageYOffset || document.documentElement.scrollTop;
		flowSideBar(scrollPage,sideBar, deafultTopSideBar)
		window.addEventListener('scroll', handlerScrollSideBar);

		window.addEventListener('resize', handlerResizeSideBar.bind(null, sideBar));
		document.querySelector('.preloader').removeEventListener(transitionEnd, finishPreload);
	});

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
			sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight  - distanceToTopBar + window.marginHeaderSideBar + 'px';
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
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + window.marginHeaderSideBar + 'px';
        }
    }
}

function flowSideBar(scrollPage,sideBar, deafultTopSideBar) {

    if(scrollPage >= (window.innerHeight - document.getElementsByClassName('b-navigation__header')[0].offsetHeight + deafultTopSideBar - window.marginHeaderSideBar)) {

        if(!window.sideBarFixed) {
            sideBar.style.position = 'fixed';
            sideBar.style.left = sideBar.parentNode.offsetLeft + window.paddingLeftParentBar + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth -  ( window.paddingLeftParentBar + window.paddingRightParentBar )  + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + window.marginHeaderSideBar + 'px';
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
            sideBar.style.top = document.getElementsByClassName('b-navigation__header')[0].offsetHeight + window.marginHeaderSideBar + 'px';
            window.sideBarToBottom = false;
        }
    }

}