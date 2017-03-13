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

});

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