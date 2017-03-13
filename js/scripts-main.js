window.addEventListener('load', function(){

    document.body.addEventListener(transitionEnd, loaderAnimation);

    function loaderAnimation() {
        if(document.body.classList.contains('finish-load')) {
            scrollAnim('.start');
        }
        document.body.removeEventListener(transitionEnd, loaderAnimation);
    }

    const buttonOnlineRecord = document.querySelector('.online-record');

    // Scroll on click button
    buttonOnlineRecord.addEventListener('click', function handlerOnlineRecordButton(e){
        aminScroll(document.querySelector('.b-form'), 1000);
    });


    window.addEventListener('scroll', handlerScrollWindow);

    //
    //  Calendar
    //
    const dateInput = document.getElementsByClassName('input-date')[0];
    const timeInput = document.getElementsByClassName('input-time')[0];
    const datePick = new Flatpickr(dateInput, {
        minDate: "today",
        altInput: true,
        disableMobile: true,
        locale: 'ru'
    });
    const timePick = new Flatpickr(timeInput, {
        noCalendar: true,
        enableTime: true,
        time_24hr: true,
        disableMobile: true
    });

    //
    // Swipe block
    //
    const swipeElemClass = '.swiper-container';
    const swipeSlide = new Swiper(swipeElemClass, {
        spaceBetween: 20,
        slidesPerView: 'auto',
        lazyLoading: false,
        centeredSlides: true,
        nextButton: '.swiper-controls-next',
        prevButton: '.swiper-controls-prev',
        setWrapperSize: true,
        loop: true,
        breakpoints: {
            1024: {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                centeredSlides: false
                }
            }
        });

    let ticking = false;
    let scrollPage;
    let scrollLeft;

    let isScrollAnimFinish = false;

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if(document.body.classList.contains('finish-load')) {
                    scrollAnim('.start');
                }
                ticking = false;
            });
        }
        ticking = true;
    }

});