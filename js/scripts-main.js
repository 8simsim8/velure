window.addEventListener('load', function(){

    document.body.addEventListener(transitionEnd, loaderAnimation);

    function loaderAnimation() {
        handlerScrollWindow();
        document.body.removeEventListener(transitionEnd, loaderAnimation);
    }

    window.addEventListener('scroll', handlerScrollWindow);

    droplist();

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
        nextButton: '.swipe-controls-next',
        prevButton: '.swipe-controls-prev',
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

    const input = document.getElementsByClassName('input__field');

    // Styles inputs
    for(var i = 0; i < input.length; i++) {
        input[i].addEventListener('focus', function() {
            this.parentNode.classList.add('input--filled');
        });
        input[i].addEventListener('blur', function() {
            if(this.value == '') {
                this.parentNode.classList.remove('input--filled');
            }
        });

    }

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

    function droplist() {
        var droplistsSelect = document.getElementsByClassName('droplist');
        var droplists = [];

        for(var i = 0, len = droplistsSelect.length; i < len; i++) {
            var id = '#' + droplistsSelect[i].id;
            var isDisableOnLoad;

            isDisableOnLoad = (droplistsSelect[i].hasAttribute('data-next-select-id')) ? isDisableOnLoad = true : isDisableOnLoad = false;

            droplists[i] = new Select(id, {
                    // auto show the live filter
                    filtered: 'auto',
                    // auto show the live filter when the options >= 8
                    filter_threshold: 10,
                    // custom placeholder
                    filter_placeholder: 'Filter options...',
                    // on start disable/enable select
                    onLoadDisable: isDisableOnLoad
                },
                // callback
                function (){
                    // close virtual keyboard
                    var filter = this.filter;
                    setTimeout(function(){
                        filter.blur();
                    },200);
                    // change color of font
                    this.target.parentNode.querySelector('.value').classList.add('select-active');

                    // droplist where need to put list by request if need
                    var selector = '[data-next-select-id = ' + this.target.id + ']';
                    var elemBuildSelect = document.querySelector(selector);

                    // Test
                    if(elemBuildSelect) {
                        elemBuildSelect.parentNode.querySelector('.value').removeAttribute('disabled');
                        // requestResult(this.value, elemBuildSelect);
                    }
                }
            );
        }
    }

});