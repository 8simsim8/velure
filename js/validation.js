function MakeValidationForm(form, path, messagesSetting, settings, callback) {

    this.form = form;

    var isSumbit = false;

    const buttonSubm = form.querySelector('[type=submit]') || form.querySelector('button');
    const input = form.querySelectorAll('input[required]:not([type=submit]), select[required]');

    const DELAY_HIDE_MESSAGE_ERROR = settings.duringShowError || null;                // Время до скрытия сообщения об
    // ошибке

    const clearAfterSend = settings.clearAfterSend.length ? settings.clearAfterSend : null;                    // Очищать inputs после
    // отправки и давать возможность еще раз отправить

    var messDefault = {
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
            'required'  :   'Введите дату'
        },
        'time'  :   {
            'required'  :   'Введите время'
        },
        'default'   :   {
            'required'  :   'Ошибка ввода'
        }
    };

    var messObj = {};

    if(typeof messagesSetting === 'object') {
        // messObj = Object.assign(messDefault, messagesSetting);
        messObj = assignObjects(messDefault, messagesSetting);
    } else {
        messObj = messDefault;
        if (typeof messagesSetting === 'function') {
            callback = messagesSetting;
        }
    }

    var sendMessage;
    var isEnablePrintError = [];
    var timerHide;

    buttonSubm.addEventListener('click', handlerClick);
    form.addEventListener('submit', handlerClick);

    for(var i = 0; i < input.length; i++) {
        input[i].addEventListener('keyup', handlerInvalidInputKeyUp);
        input[i].addEventListener('change', handlerInvalidInput);
        input[i].addEventListener('input', handlerInvalidInputWithShow);
        input[i].addEventListener('focus', handlerInvalidInputWithShow);
        input[i].addEventListener('blur', handlerInvalidInputWithHide);
        isEnablePrintError[i] = false;
    }

    function assignObjects(a,b) {
        var c = {},
            key;
        for (key in a) {
            if (a.hasOwnProperty(key)) {
                c[key] = key in b ? b[key] : a[key];
            }
        }
        return c;
    }

    function handlerClick(e) {
        var i, len;

        sendMessage = true;

        var errors = form.querySelectorAll('span.error');
        for(i = 0, len = errors.length; i < len; i++) {
            errors[i].remove();
        }

        handlerValid(e);
        e.preventDefault();

        for(i = 0, len = input.length; i < len; i++) {
            isEnablePrintError[i] = true;
        }

        for(i = 0, len = input.length; i < len; i++) {
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
        var self = this;

        if(e.code != 'Tab') {
            var index = searchIndex(input, self);
            isEnablePrintError[index] = true;
        }

        if (self.validity.valid || (!self.willValidate && self.value != '')) {
            removeError(self);
        } else {
            // printError(self, true);
        }
    }

    function handlerInvalidInput(e) {
        var self = this;

        var index = searchIndex(input, self);
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
        var nameElem = messObj[elem.getAttribute('name')] ? elem.getAttribute('name') : '';
        var mes;

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
        var error = input.nextElementSibling;
        if(error && error.firstElementChild && error.firstElementChild.classList.contains('error')) {
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
                clearInputs(clearAfterSend);
                if(typeof callback === 'function') {
                    callback();
                }
                isSumbit = !clearAfterSend;
            }
        };
    }

    function clearInputs(elems) {
        for(var i = 0, len = elems.length; i < len; i++ ) {
            elems[i].value = '';
        }
    }

    function createErrorBlock(input, message){
        var wrap = document.createElement('div');
        wrap.classList.add('wrap-error');

        var error = document.createElement('span');
        error.classList.add('error');
        message = message || input.validationMessage || messObj['default']['required'];
        error.innerHTML = message;
        wrap.append(error);
        input.after(wrap);
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

    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function(target, firstSource) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }

}