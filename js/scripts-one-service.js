window.addEventListener('load', function(){

    // window.addEventListener('scroll', handlerScrollWindow);

    const accordeonClassName = 'accordeon';
    const sliderClassName = 'swiper-container';

    // Sliders
    let sliders = createSliders(sliderClassName, accordeonClassName);

    // Accordeons
    let accordeons = createAccordeons(accordeonClassName, sliderClassName);

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

});

function createSliders(classNameSlidersContainer, classNameWrappAccordeon){
    const slidersElem = document.getElementsByClassName(classNameSlidersContainer);
    let sliders = [];
    for(let i = 0, len = slidersElem.length; i < len; i++) {
        sliders[i] = makeSlider(slidersElem[i]);
        if(slidersElem[i].closest('.'+classNameWrappAccordeon)) {
            sliders[i].stopAutoplay();
        }
    }
    return sliders;
}

function makeSlider(wrapClass){

    let swipeSlide,
        nextButtonClass =   wrapClass.querySelector('.swiper-controls-next') || null,
        prevButtonClass =   wrapClass.querySelector('.swiper-controls-prev') || null,
        paginElemClass =    wrapClass.querySelector('.swiper-pagination') || null;

    swipeSlide = new Swiper(wrapClass, {
        spaceBetween: 0,
        slidesPerView: 1,
        autoplay: 5000,
        nextButton: nextButtonClass,
        prevButton: prevButtonClass,
        pagination: paginElemClass,
        paginationClickable: true,
        setWrapperSize: true,
        loop: true
    });

    swipeSlide.wrapper[0].addEventListener('click', function () {
        swipeSlide.slideNext();
    });

    return swipeSlide;
}

function createAccordeons(classNameAccordeonContainer, classNameSlidersContainer){
    const accordeonsElem = document.getElementsByClassName(classNameAccordeonContainer);
    let accordeons = [];

    for(let i = 0, len = accordeonsElem.length; i < len; i++) {
        accordeons[i] = new MakeAccordeon(accordeonsElem[i]);
        accordeons[i].accordeonStart();

        // Открыть первую вкладку
        accordeons[i].button[0].click();

    }

    return accordeons;
}

function MakeAccordeon(elem){

    this.accordeonWrap = elem;
    this.items = elem.getElementsByClassName("acc-item");
    this.button = elem.getElementsByClassName('acc-button-element');
    this.hidden = elem.getElementsByClassName("acc-hidden-element");

    this.accordeonStart = function() {
        for (let i = 0, len = this.button.length; i < len; i++) {

            this.button[i].addEventListener('click', clickAccordeon);

            this.button[i].addEventListener('mouseover',handlerMouseOver);

            this.items[i].classList.toggle('accordeon-item');

            this.hidden[i].style.maxHeight = null;
            this.hidden[i].style.display = 'none';
        }
    };

    function clickAccordeon(e){
        let prevElem = elem.querySelector(".active");

        if(prevElem && prevElem != this) {
            prevElem.classList.toggle("active");
            prevElem.nextElementSibling.style.maxHeight = null;
            prevElem.addEventListener(transitionEnd, handlerAnim);
        }

        this.classList.toggle("active");

        let panel = this.nextElementSibling;

        panel.addEventListener(transitionEnd, handlerAnim);

        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.display = '';
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

        function handlerAnim() {
            console.log('click acc');
            if(!this.style.maxHeight) {
                this.style.display = 'none';
            }
            this.addEventListener(transitionEnd, handlerAnim);
        }
    }

    function handlerMouseOver() {
        let self = this,
            hidden = self.nextElementSibling;

        willChangeSwitch(hidden, 'max-height');
        if(!hidden.style.maxHeight) {
            hidden.style.display = '';
        }
        self.addEventListener('mouseleave',handlerMouseLeave);

        function handlerMouseLeave() {
            let self = this,
                hidden = self.nextElementSibling;

            willChangeSwitch(hidden, 'auto');
            if(!hidden.style.maxHeight) {
                hidden.style.display = 'none';
            }
            self.removeEventListener('mouseleave', handlerMouseLeave);
        }

    }

    this.accordeonStop = function() {
        let i;
        for (i = 0; i < this.button.length; i++) {
            this.button[i].removeEventListener('click', clickAccordeon);
            this.button[i].removeEventListener('mouseover',handlerMouseOver);
            this.items[i].classList.remove('accordeon-item');

            this.hidden[i].style.maxHeight = null;
            this.hidden[i].style.display = '';

        }
        if(elem.querySelector(".active")) {
            elem.querySelector(".active").classList.remove('active');
        }

    }

}

function inputs(){
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

    const input = document.getElementsByClassName('input__field');

    // Styles inputs
    for(let i = 0; i < input.length; i++) {
        input[i].addEventListener('focus', function() {
            this.parentNode.classList.add('input--filled');
        });
        input[i].addEventListener('blur', function() {
            if(this.value == '') {
                this.parentNode.classList.remove('input--filled');
            }
        });

    }

    droplist();

}

function droplist() {
    let droplistsSelect = document.getElementsByClassName('droplist');
    let droplists = [];

    for(let i = 0, len = droplistsSelect.length; i < len; i++) {
        let id = '#' + droplistsSelect[i].id;
        let isDisableOnLoad;

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
                let filter = this.filter;
                setTimeout(function(){
                    filter.blur();
                },200);
                // change color of font
                this.target.parentNode.querySelector('.value').classList.add('select-active');

                // droplist where need to put list by request if need
                let selector = '[data-next-select-id = ' + this.target.id + ']';
                let elemBuildSelect = document.querySelector(selector);

                // Test
                if(elemBuildSelect) {
                    elemBuildSelect.parentNode.querySelector('.value').removeAttribute('disabled');
                    // requestResult(this.value, elemBuildSelect);
                }
            }
        );
    }
}