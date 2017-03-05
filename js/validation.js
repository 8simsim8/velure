function validForm(form, path, messagesSetting, settings, callback) {

    var isSumbit = false;

    var buttonSubm = form.querySelector('[type=submit]');
    var input = form.querySelectorAll('input[required]:not([type=submit])');
    var DELAY_HIDE_MESSAGE_ERROR = settings.duringShowError || null;                // Время до скрытия сообщения об
    // ошибке

    var messDefault = {
        'name'  :   {
            'required'  :   'Необходимо ввести свое имя',
            'invalid'   :   'Не верный ввод имени'
        },
        'phone' :   {
            'required'  :   'Необходимо ввести свой номер телефона',
            'invalid'   :   'Проверьте номер телефона'
        },
        'email' :   {
            'required'  :   'Необходимо ввести свой E-mail',
            'invalid'   :   'Проверьте свой E-mail'
        }
    };

    // var defaultMessage = {
    //     'default':  {
    //         'required'  :   'Необходимо ввести свои данные',
    //         'invalid'   :   'Проверьте введненные данные'
    //     }
    // };

    var messObj;

    if(typeof messagesSetting === 'object') {
        messObj = messagesSetting;
    } else {
        messObj = messDefault;
        if (typeof messagesSetting === 'function') {
            callback = messagesSetting;
        }
    }

    var i;
    var sendMessage;
    var isEnablePrintError = [];
    var timerHide;

    buttonSubm.addEventListener('click', handlerClick);

    for(i = 0; i < input.length; i++) {
        input[i].addEventListener('keyup', handlerInvalidInputKeyUp);
        input[i].addEventListener('change', handlerInvalidInput);
        input[i].addEventListener('input', handlerInvalidInputWithShow);
        input[i].addEventListener('focus', handlerInvalidInputWithShow);
        input[i].addEventListener('blur', handlerInvalidInputWithHide);
        isEnablePrintError[i] = false;
    }

    function handlerClick(e) {
        sendMessage = true;

        var errors = form.querySelectorAll('span.error');
        for(i = 0; i < errors.length; i++) {
            errors[i].remove();
        }

        handlerValid(e);
        e.preventDefault();

        for(i = 0; i < input.length; i++) {
            isEnablePrintError[i] = true;
        }

        for(i = 0; i < input.length; i++) {
            if (input[i].checkValidity() == false) {
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
            if (input[i].checkValidity() == false) {
                printError(input[i], true);
                if(DELAY_HIDE_MESSAGE_ERROR) {
                    hideError(input[i]);                // Убрать сообщение c задержкой
                }

            }
        }
    }

    function handlerInvalidInputKeyUp(e) {
        var self = this;

        if(e.code != 'Tab') {
            var index = searchIndex(input, self);
            isEnablePrintError[index] = true;
        }

        if (self.validity.valid) {
            removeError(self);
        } else {
            // printError(self, true);
        }
    }

    function handlerInvalidInput(e) {
        var self = this;

        var index = searchIndex(input, self);

        if(isEnablePrintError[index]){
            if (self.validity.valid) {
                removeError(self);
            } else {
                printError(self, true);
            }
        }
    }

    function handlerInvalidInputWithHide(e) {
        var self = this;

        var index = searchIndex(input, self);

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
        var self = this;

        var index = searchIndex(input, self);

        if(isEnablePrintError[index] && self.classList.contains('error')){
            if (self.validity.valid) {
                removeError(self);
            } else {
                printError(self, true);
            }
        }
    }

    // noMissing    - Display error only if click on submit
    // elem         - Item input element
    function printError(elem, noMissing) {
        var nameElem = messObj[elem.getAttribute('name')] ? elem.getAttribute('name') : '';
        var mes;

        removeError(elem);

        if(elem.validity.valueMissing && noMissing) {
            mes = nameElem ? messObj[nameElem]['required'] : '';
            createErrorBlock(elem, mes);
        }
        if(elem.validity.typeMismatch || elem.validity.patternMismatch) {
            mes = nameElem ? messObj[nameElem]['invalid'] : '';
            createErrorBlock(elem, mes);
        }
    }

    function removeError(input, isInputErrorRemove) {
        isInputErrorRemove = (isInputErrorRemove === undefined) ? true : false;
        var error = input.nextElementSibling;
        if(error && error.classList.contains('error')) {
            error.remove();
            if(isInputErrorRemove) {
                input.classList.remove('error');
            }
        }
    }

    function sendForm(path) {
        var xhr = new XMLHttpRequest();

        var formData = new FormData(form);

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
        var error = document.createElement('span');
        error.classList.add('error');
        message = message || input.validationMessage;
        error.innerHTML = message;
        input.after(error);
        input.classList.add('error');
    }

    function searchIndex(arr, elem) {
        for(var i = 0, len = arr.length; i < len; i++) {
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