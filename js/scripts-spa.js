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
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var  accordeons = createAccordeons(accordeonClassName, true);

    // inputs();

    var  ticking = false;
    var  scrollPage;
    var  scrollLeft;

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
     * Валидация формы записи
     */
    var validationRecord = new MakeValidationForm(
        document.getElementsByTagName('form')[0],      // Form DOM
        '/mailer/PHPmailer.php',                               // Path to Mailer
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