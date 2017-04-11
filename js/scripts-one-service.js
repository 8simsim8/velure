window.addEventListener('load', function(){

    const WIDTH_HIDE_FORM = 1200;

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
        if(document.querySelector('.preloader') && document.querySelector('.preloader').length > 0) {
            document.querySelector('.preloader').addEventListener(transitionEnd, finishPreload);
        } else {
            finishPreload();
        }
    } else {
        buttonOpenSideBar.addEventListener('click', openSideBar);
    }

    window.addEventListener('resize', resizeBar);

    function openSideBar(e) {

        var barParent =  document.querySelector('.b-side');
        var bar = document.querySelector('.b-side__bar');

        barParent.classList.toggle('open-side-bar');
        if(barParent.classList.contains('open-side-bar')) {
            var topOn = window.innerHeight/2 - bar.offsetHeight/2;
            bar.style.transform = 'translate(0, -' + topOn + 'px)';
            bar.style.webkitTransform = 'translate(0, -' + topOn + 'px)';

            barParent.addEventListener('click', closeBar);

        } else {
            bar.style.transform = '';
            bar.style.webkitTransform = '';
        }

        function closeBar(e) {
            var target = e.target;

            if(target == barParent) {
                barParent.removeEventListener('click', closeBar);
                bar.style.transform = '';
                bar.style.webkitTransform = '';
                barParent.classList.remove('open-side-bar');
            }
        }

       // e.stopPropagation();
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
            sideBar.style.transform = '';
            sideBar.style.webkitTransform = '';
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

	if(	scrollPage >= (window.innerHeight - document.getElementsByClassName('b-navigation__main')[0].offsetHeight + deafultTopSideBar - window.marginHeaderSideBar)) {
		if(sideBar.parentNode.getBoundingClientRect().bottom <= ( document.getElementsByClassName('b-navigation__main')[0].offsetHeight + window.marginHeaderSideBar + sideBar.offsetHeight)) {
			sideBar.style.bottom = '0px';
			sideBar.style.top = 'auto';
			sideBar.style.width = '';
            window.sideBarFixed = false;
            window.sideBarToBottom = !window.sideBarFixed;
		} else {
			var distanceToTopBar = sideBar.parentNode.getBoundingClientRect().top;
			sideBar.style.top = document.getElementsByClassName('b-navigation__main')[0].offsetHeight  - distanceToTopBar + 'px';
            window.sideBarFixed = true;
            window.sideBarToBottom = !window.sideBarFixed;
		}
	}

}

function handlerResizeSideBar(sideBar) {

        if(window.sideBarToBottom) {
            sideBar.style.position = 'absolute';
            sideBar.style.bottom = '0px';
            sideBar.style.left = '';
            sideBar.style.top = 'auto';
            sideBar.style.right = '';
            sideBar.style.width = '';
        }
        if(window.sideBarFixed) {
            sideBar.style.position = 'fixed';
			sideBar.style.right = 'auto';
			sideBar.style.bottom = 'auto';
            sideBar.style.left = sideBar.parentNode.offsetLeft + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth - ( window.paddingLeftParentBar + window.paddingRightParentBar ) + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__main')[0].offsetHeight + 'px';
        }

}

function flowSideBar(scrollPage,sideBar, deafultTopSideBar) {

    if(scrollPage >= (window.innerHeight - document.getElementsByClassName('b-navigation__main')[0].offsetHeight + deafultTopSideBar - window.marginHeaderSideBar)) {

        if(!window.sideBarFixed) {
            sideBar.style.position = 'fixed';
            sideBar.style.left = sideBar.parentNode.offsetLeft + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth -  ( window.paddingLeftParentBar + window.paddingRightParentBar )  + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__main')[0].offsetHeight + 'px';
            sideBar.style.bottom = 'auto';
            window.sideBarFixed = true;
        }

    } else {
        sideBar.style.position = '';
        sideBar.style.top = '';
        sideBar.style.width = '';
        sideBar.style.left = '';
        window.sideBarFixed = false;
    }

    if(window.sideBarFixed) {
        if(sideBar.parentNode.getBoundingClientRect().bottom <= document.getElementsByClassName('b-navigation__main')[0].offsetHeight + window.marginHeaderSideBar + sideBar.offsetHeight) {
            sideBar.style.position = 'absolute';
            sideBar.style.bottom = '0px';
            sideBar.style.left = '';
            sideBar.style.top = 'auto';
            sideBar.style.right = '';
            sideBar.style.width = '';
            window.sideBarToBottom = true;
        } else {
            sideBar.style.position = 'fixed';
            sideBar.style.bottom = 'auto';
            sideBar.style.right = 'auto';
            sideBar.style.left = sideBar.parentNode.offsetLeft + 'px';
            sideBar.style.width = sideBar.parentNode.clientWidth - ( window.paddingLeftParentBar + window.paddingRightParentBar ) + 'px';
            sideBar.style.top = document.getElementsByClassName('b-navigation__main')[0].offsetHeight + 'px';
            window.sideBarToBottom = false;
        }
    }

}