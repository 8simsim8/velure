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

    var ticking = false;
    var scrollPage;
    var scrollLeft;

    var isScrollAnimFinish = false;

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

    var form = document.querySelector('[name=form-online-record]');

    /*
    * Валидация формы
    */
    validForm(
        document.getElementsByTagName('form')[0],      // Form DOM
        'PHPmailer.php',                               // Path to Mailer
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

});