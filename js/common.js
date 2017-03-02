
var header = document.getElementsByClassName('l-navigation')[0];
// Проскроливание фиксорованного меню
window.addEventListener('scroll', function () {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    if(window.innerWidth <= 1210) {
         header.style.left = - scrollLeft + "px";
    }
});
