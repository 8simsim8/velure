window.addEventListener('load', function(){

    // window.addEventListener('scroll', handlerScrollWindow);

    slider();

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

    // Accordeon
    let wrapAcc = document.querySelector('.accordeon');
    const accordeon = new MakeAccordeon(wrapAcc);

    accordeon.accordeonStart();

});

function slider(){
    let swipeElemClass =    '.swiper-container',
        nextButtonClass =   '.swiper-controls-next',
        prevButtonClass =   '.swiper-controls-prev',
        paginElemClass =    '.swiper-pagination';

    let swipeSlide = new Swiper(swipeElemClass, {
        spaceBetween: 0,
        slidesPerView: 1,
        autoplay: 5000,
        nextButton: nextButtonClass,
        prevButton: prevButtonClass,
        pagination: paginElemClass,
        setWrapperSize: true,
        loop: true
    });
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

/*--------------------------*/
/*        Accordeon         */
/*--------------------------*/
function MakeAccordeon(elem){

    let items = elem.getElementsByClassName("acc-item");
    let button = elem.getElementsByClassName('acc-button-element');
    let hidden = elem.getElementsByClassName("acc-hidden-element");

    this.accordeonStart = function() {

        for (let i = 0, len = button.length; i < len; i++) {

            button[i].addEventListener('click', clickAccordeon);
            items[i].classList.toggle('accordeon');

            hidden[i].style.maxHeight = null;

        }
    };

    function clickAccordeon(e){

        let prevElem = elem.querySelector(".active");

        if(prevElem && prevElem != this) {
            prevElem.classList.toggle("active");
            prevElem.nextElementSibling.style.maxHeight = null;
        }

        this.classList.toggle("active");

        let panel = this.nextElementSibling;

        console.log(panel.style.maxHeight);

        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }

    this.accordeonStop = function() {
        let i;
        for (i = 0; i < button.length; i++) {
            button[i].removeEventListener('click', clickAccordeon);
            items[i].classList.remove('accordeon');

            hidden[i].style.maxHeight = null;

        }
        if(elem.querySelector(".active")) {
            elem.querySelector(".active").classList.remove('active');
        }

    }

}