window.addEventListener('load', function(){

    const headers = document.querySelectorAll('.b-news__list-item h4');

    var i, len;

    for(i = 0, len = headers.length; i < len; i++) {
        clamp(headers[i], {clamp: 2});
    }

    const texts = document.querySelectorAll('.b-news__list-item .note');

    for(i = 0, len = texts.length; i < len; i++) {
        clamp(texts[i], {clamp: 4});
    }
});