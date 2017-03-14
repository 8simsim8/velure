function validForm(form, path, messagesSetting, settings, callback) {

    let isSumbit = false;

    const buttonSubm = form.querySelector('[type=submit]');
    const input = form.querySelectorAll('input[required]:not([type=submit]), select[required]');
    // const input = form.getElementsByClassName('value-input');

    const DELAY_HIDE_MESSAGE_ERROR = settings.duringShowError || null;                // Время до скрытия сообщения об
    // ошибке

    let messDefault = {
        'name'  :   {
            'required'  :   'Введите свое имя'
        },
        'phone' :   {
            'required'  :   'Введите свой номер телефона',
            'invalid'   :   'Проверьте номер телефона'
        },
        'email' :   {
            'required'  :   'Введите свой E-mail',
            'invalid'   :   'Проверьте свой E-mail'
        },
        'date'  :   {
            'required'  :   'Введите дату',
        },
        'time'  :   {
            'required'  :   'Введите время',
        },
        'default'   :   {
            'required'  :   'Ошибка ввода'
        }
    };

    let messObj = {};

    if(typeof messagesSetting === 'object') {
        messObj = Object.assign(messDefault, messagesSetting);
    } else {
        messObj = messDefault;
        if (typeof messagesSetting === 'function') {
            callback = messagesSetting;
        }
    }

    let sendMessage;
    let isEnablePrintError = [];
    let timerHide;

    buttonSubm.addEventListener('click', handlerClick);

    for(let i = 0; i < input.length; i++) {
        input[i].addEventListener('keyup', handlerInvalidInputKeyUp);
        input[i].addEventListener('change', handlerInvalidInput);
        input[i].addEventListener('input', handlerInvalidInputWithShow);
        input[i].addEventListener('focus', handlerInvalidInputWithShow);
        input[i].addEventListener('blur', handlerInvalidInputWithHide);
        isEnablePrintError[i] = false;
    }

    function handlerClick(e) {
        sendMessage = true;

        let errors = form.querySelectorAll('span.error');
        for(let i = 0, len = errors.length; i < len; i++) {
            errors[i].remove();
        }

        handlerValid(e);
        e.preventDefault();

        for(let i = 0, len = input.length; i < len; i++) {
            isEnablePrintError[i] = true;
        }

        for(let i = 0, len = input.length; i < len; i++) {
            if ((input[i].checkValidity() == false) || (!input[i].willValidate && input[i].value == '')) {
                sendMessage = false;
                break;
            }
        }

        // Ошибок нету -> отправка
        if(sendMessage && !isSumbit) {
            sendForm(path);
        }

    }

    function handlerValid(e) {
        for(i = 0; i < input.length; i++) {
            if ((input[i].willValidate && input[i].checkValidity() == false) || (!input[i].willValidate && input[i].value == '')) {
                printError(input[i], true);
                if(DELAY_HIDE_MESSAGE_ERROR) {
                    hideError(input[i]);                // Убрать сообщение c задержкой
                }
            }
        }
    }

    function handlerInvalidInputKeyUp(e) {
        let self = this;

        if(e.code != 'Tab') {
            let index = searchIndex(input, self);
            isEnablePrintError[index] = true;
        }

        if (self.validity.valid || (!self.willValidate && self.value != '')) {
            removeError(self);
        } else {
            // printError(self, true);
        }
    }

    function handlerInvalidInput(e) {
        let self = this;

        // console.log(self);

        let index = searchIndex(input, self);
        isEnablePrintError[index] = true;
        //
        // if(isEnablePrintError[index]){

            if (self.validity.valid || (!self.willValidate && self.value != '')) {
                removeError(self);
            } else {
                printError(self, true);
            }
        // }
    }

    function handlerInvalidInputWithHide(e) {
        let self = this;

        let index = searchIndex(input, self);

        if(self.value != '') {
            if(isEnablePrintError[index]){
                if (self.validity.valid) {
                    removeError(self);
                } else {
                    printError(self, true);
                    timerHide = hideError(self, false);
                }
            }
        } else {
            removeError(self);
        }
    }

    function handlerInvalidInputWithShow(e) {
        let self = this;

        let index = searchIndex(input, self);

        if(isEnablePrintError[index] && self.classList.contains('error')){
            if (self.validity.valid || (!self.willValidate && self.value != '')) {
                removeError(self);
            } else {
                printError(self, true);
            }
        }
    }

    // noMissing    - Display error only if click on submit
    // elem         - Item input element
    function printError(elem, noMissing) {
        let nameElem = messObj[elem.getAttribute('name')] ? elem.getAttribute('name') : '';
        let mes;

        removeError(elem);

        if((elem.validity.valueMissing && noMissing) || (!elem.willValidate && elem.value == '' && noMissing)) {
            mes = nameElem ? messObj[nameElem]['required'] : '';
            createErrorBlock(elem, mes);
        }
        if(elem.validity.typeMismatch || elem.validity.patternMismatch) {
            mes = nameElem ? messObj[nameElem]['invalid'] : '';
            createErrorBlock(elem, mes);
        }
    }

    function removeError(input, isInputErrorRemove) {
        isInputErrorRemove = (isInputErrorRemove === undefined);
        let error = input.nextElementSibling;
        if(error && error.firstElementChild && error.firstElementChild.classList.contains('error')) {
            error.remove();
            if(isInputErrorRemove) {
                input.classList.remove('error');
            }
        }
    }

    function sendForm(path) {
        let xhr = new XMLHttpRequest();

        let formData = new FormData(form);

        xhr.open('POST', path);

        xhr.send(formData);

        isSumbit = true;

        xhr.onreadystatechange = function() {
            if(xhr.readyState != 4) {
                isSumbit = false;
                return;
            }

            if (xhr.status != 200) {
                isSumbit = false;
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                if(typeof callback === 'function') {
                    callback('Message send');
                }
                isSumbit = true;
            }
        };
    }

    function createErrorBlock(input, message){
        let wrap = document.createElement('div');
        wrap.classList.add('wrap-error');

        let error = document.createElement('span');
        error.classList.add('error');
        message = message || input.validationMessage || messObj['default']['required'];
        error.innerHTML = message;
        wrap.append(error);
        input.after(wrap);
        input.classList.add('error');
    }

    function searchIndex(arr, elem) {
        for(let i = 0, len = arr.length; i < len; i++) {
            if(arr[i] === elem) {
                return i;
            }
        }
    }

    function hideError(elem, isDeleteOnInputError) {
        return setTimeout(function(){
            removeError(elem,isDeleteOnInputError);
        }, DELAY_HIDE_MESSAGE_ERROR);
    }

}