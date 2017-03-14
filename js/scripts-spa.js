window.addEventListener('load', function(){

    // window.addEventListener('scroll', handlerScrollWindow);

    const buttonOnlineRecord = document.querySelector('.online-record');

    // Scroll on click button
    buttonOnlineRecord.addEventListener('click', function handlerOnlineRecordButton(e){
        aminScroll(document.querySelector('.b-certificate .wrap'), 1000);
    });


    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    let sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    let accordeons = createAccordeons(accordeonClassName, true);

    // inputs();

    let ticking = false;
    let scrollPage;
    let scrollLeft;

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