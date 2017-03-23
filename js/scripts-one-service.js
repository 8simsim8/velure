window.addEventListener('load', function(){

    // window.addEventListener('scroll', handlerScrollWindow);

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    var sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    var accordeons = createAccordeons(accordeonClassName, true);

    var ticking = false;
    var scrollPage;
    var scrollLeft;

    function handlerScrollWindow() {
        scrollPage = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if(document.body.classList.contains('finish-load')) {
                    scrollAnim('start');
                }
                ticking = false;
            });
        }
        ticking = true;
    }

    // /*
    //  * Валидация формы записи
    //  */
    // var validation = new MakeValidationForm(
    //     document.getElementsByTagName('form')[0],      // Form DOM
    //     '/mailer/PHPmailer.php',                       // Path to Mailer
    //     textError = {                                  // Text error messages
    //         'services': {
    //             'required'  :   'Выберите услугу',
    //         }
    //     },
    //     settings = {
    //         // duringShowError : 2000                       // Duration show error messages
    //     },
    //     function(options){                               // Callback function
    //         console.log("ок");
    //     }
    // );

});