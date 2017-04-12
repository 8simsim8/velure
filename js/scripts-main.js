window.addEventListener('load', function(){

    /*
     * Swipe block
     */
    const swipeElemClass = '.swiper-container';
    const nextButtonClass = document.querySelector('.swiper-controls-next') || null,
        prevButtonClass = document.querySelector('.swiper-controls-prev') || null,
        paginElemClass =  document.querySelector('.swiper-pagination') || null;

    const swipeSlide = new Swiper(swipeElemClass, {
        // spaceBetween: 20,
        slidesPerView: 'auto',
        lazyLoading: false,
        centeredSlides: true,
        nextButton: nextButtonClass,
        prevButton: prevButtonClass,
        pagination: paginElemClass,
        setWrapperSize: true,
        loop: true,
        breakpoints: {
            1024: {
                slidesPerView: 1,
                spaceBetween: 0
                // loop: false,
                // centeredSlides: false
            }
        }
    });

    if(document.querySelector('.b-programs__circles')) {
        openCircle();

        var swipeSlideCircle,
            isSwipeStart = false;

        if(window.innerWidth <= window.breakPointTabletPortrait) {
            if(!isSwipeStart) {
                swipeSlideCircle = new Swiper('.b-programs__circles-right', {
                    slidesPerView: 3,
                    lazyLoading: false,
                    centeredSlides: false,
                    pagination: paginElemClass,
                    setWrapperSize: true,
                    breakpoints: {
                        768: {
                            slidesPerView: 3
                        },
                        550: {
                            slidesPerView: 1,
                            centeredSlides: true
                        }
                    }
                });
                isSwipeStart = true;
            }
        }

        window.addEventListener('resize', changeSize);

        function changeSize(){
            if(window.innerWidth <= window.breakPointTabletPortrait) {
                if(!isSwipeStart) {
                    swipeSlideCircle = new Swiper('.b-programs__circles-right', {
                        slidesPerView: 3,
                        lazyLoading: false,
                        centeredSlides: false,
                        pagination: paginElemClass,
                        setWrapperSize: true,
                        breakpoints: {
                            768: {
                                slidesPerView: 3
                            },
                            550: {
                                slidesPerView: 1,
                                centeredSlides: true
                            }
                        }
                    });
                    isSwipeStart = true;
                }
            } else {
                if(isSwipeStart) {
                    swipeSlideCircle.destroy(false,true);
                    isSwipeStart = false;
                }
            }
        }

    }

});

function openCircle() {
    var circlesWrap = document.querySelector('.circles-wrap');
    var tablesWrap = document.querySelector('.tables-wrap');

    var parent = tablesWrap.parentNode;

    var circles = circlesWrap.querySelectorAll('.b-programs__circles-right-item');

    var currentRecommendation,
        currentCircle,
        necessaryTable;

    for(var i = 0, len = circles.length; i < len; i++) {
        circles[i].addEventListener('click',handlerClickCircle);
        circles[i].addEventListener('mouseenter',handlerPrepareToAnim);
    }

    function handlerPrepareToAnim(e) {
        // временно
        necessaryTable = document.querySelector('[data-table=well]');
        // currentRecommendation = this.getAttribute('data-recommendation');
        // necessaryTable = document.querySelector('[data-table='+ currentRecommendation +']');

        willChangeSwitch(this, 'opacity');
        willChangeSwitch(this.querySelector('.circles-bg'), 'transform');

        if(necessaryTable) {
            willChangeSwitch(necessaryTable, 'opacity');
            necessaryTable.style.display = 'block';
        }
        willChangeSwitch(tablesWrap, 'transform, opacity');
        willChangeSwitch(circlesWrap, 'opacity');

        this.addEventListener('mouseleave', handlerLiveCircle);

        function handlerLiveCircle(e) {
            var self = this;
            willChangeSwitch(self, 'auto');
            willChangeSwitch(self.querySelector('.circles-bg'), 'auto');

            if(necessaryTable) {
                willChangeSwitch(necessaryTable, 'auto');
                if(!necessaryTable.classList.contains('current-open-table')) {
                    necessaryTable.style.display = '';
                }
            }
            willChangeSwitch(tablesWrap, 'auto');
            willChangeSwitch(circlesWrap, 'auto');
        }

    }

    function handlerClickCircle(){
        currentCircle = this;
        // currentRecommendation = this.getAttribute('data-recommendation');
        // necessaryTable = document.querySelector('[data-table='+ currentRecommendation +']');

        currentCircle.querySelector('.circles-bg').style.transform = 'scale(1.5)';
        currentCircle.style.opacity = '0';
        currentCircle.style.boxShadow = 'none';
        currentCircle.querySelector('.circles-bg').style.transition = 'transform 0.1s ease';
        currentCircle.style.transition = 'opacity 0.5s ease';

        tablesWrap.addEventListener(transitionEnd, afterEndAnimationCircle);

        parent.classList.add('open-table');
        parent.parentNode.querySelector('.b-programs__circles-left').classList.add('open-table');

        if(necessaryTable) {
            necessaryTable.classList.add('current-open-table');
            necessaryTable.style.pointerEvents = 'auto';
            necessaryTable.style.opacity = '1';
            necessaryTable.style.display = 'block';
        }

        var buttonClose = tablesWrap.querySelector('.tables-button-close');
        buttonClose.addEventListener('click', closeTable);

    }

    function closeTable() {

        parent.classList.add('close-table');
        parent.classList.remove('open-table');
        parent.parentNode.querySelector('.b-programs__circles-left').classList.remove('open-table');

        circlesWrap.addEventListener(transitionEnd, deleteClassAfterEndAnimation);

        if(necessaryTable) {
            necessaryTable.style.pointerEvents = '';
            necessaryTable.style.opacity = '';
            necessaryTable.style.display = '';
            necessaryTable.classList.remove('current-open-table');
        }

        this.removeEventListener('click', closeTable);
    }

    function afterEndAnimationCircle() {
        currentCircle.querySelector('.circles-bg').style.transition = '';
        currentCircle.style.transition = '';
        currentCircle.querySelector('.circles-bg').style.transform = '';
        currentCircle.style.opacity = '';
        currentCircle.style.boxShadow = '';
        this.removeEventListener(transitionEnd, afterEndAnimationCircle);
    }

    function deleteClassAfterEndAnimation() {

        currentCircle.querySelector('.circles-bg').style.transition = '';
        currentCircle.querySelector('.circles-bg').style.transform = '';
        currentCircle.querySelector('.circles-bg').style.opacity = '';

        necessaryTable.style.display = '';

        parent.classList.remove('close-table');

        this.addEventListener(transitionEnd, deleteClassAfterEndAnimation);
    }

}