window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);

    var isMobileUserAgent = false;

    isMobileUserAgent = isMobile.any();

    var APP_ID = '4645070665';
    var APP_ACCES_TOKEN = '4645070665.af79c98.0666edaf12bb43858609d90c7637a4b1';

    var APP_LIMIT = 4;

    blockInstagram(isMobileUserAgent);

    function blockInstagram(isMobileUserAgent) {

        // window.addEventListener('resize',cutBlocks);

        var feed = new Instafeed({
            get: 'user',
            userId: APP_ID,
            limit: APP_LIMIT,
            resolution: 'standard_resolution',
            accessToken: APP_ACCES_TOKEN,
            filter: function(image) {

                image.data_create = getTime(image.created_time*1000);

                image.instaLink = isMobileUserAgent ? "instagram://user?username={{model.user.username}}" : "{{model.link}}";

                return true;
            },
            after: function(){
            },
            // template: '<a href="{{model.link}}" class="item-insta col xs-6 sm-3' +
            // ' lg-3"><p class="insta__wrap-img"><img src="{{image}}"/></p><p class="insta-header"><span' +
            // ' class="insta-logo' +
            // ' icon-logo' +
            // ' text' +
            // ' bold">VelurSpaSumy</span><span' +
            // ' class="insta-date-create">{{model.data_create}}</span></p></a>'
            // template: '<a href="instagram://user?username={{model.user.username}}" class="item-insta col xs-6 sm-3' +
            // ' lg-3"><p class="insta__wrap-img"><img src="{{image}}"/></p><p class="insta-header"><span' +
            // ' class="insta-logo' +
            // ' icon-logo' +
            // ' text' +
            // ' bold">VelurSpaSumy</span><span' +
            // ' class="insta-date-create">{{model.data_create}}</span></p></a>'
            template: '<a href={{model.instaLink}} class="item-insta col xs-6 sm-3' +
            ' lg-3"><p class="insta__wrap-img"><img src="{{image}}"/></p><p class="insta-header"><span' +
            ' class="insta-logo' +
            ' icon-logo' +
            ' text' +
            ' bold">VelurSpaSumy</span><span' +
            ' class="insta-date-create">{{model.data_create}}</span></p></a>'
        });

        feed.run();

        function cutBlocks(e) {
            var itemInst = document.getElementsByClassName('item-insta');

            if(window.innerWidth < 1200 && window.innerWidth > 990) {
                if(itemInst.length % 3 == 2) {
                    itemInst[itemInst.length-1].style.display = 'none';
                    itemInst[itemInst.length-2].style.display = 'none';
                }
                if(itemInst.length % 3 == 1) {
                    itemInst[itemInst.length-1].style.display = 'none';
                }
            } else {
                itemInst[itemInst.length-1].style.display = 'block';
                itemInst[itemInst.length-2].style.display = 'block';
            }
        }

        function getTime(date) {

            var language        = document.querySelector('.b-navigation__side-right .current').innerText;

            var actiondate      = new Date(parseInt(date));

            var today = new Date();
            if(today.getDate() === actiondate.getDate() && today.getMonth() === actiondate.getMonth() && today.getYear() === actiondate.getYear()){
                var hourssince =   today.getHours() - actiondate.getHours();
                var minutessince =   today.getMinutes() - actiondate.getMinutes();
                var secondssince =   today.getSeconds() - actiondate.getSeconds();
                if(hourssince > 0){
                    if(language == 'RU') {
                        date = hourssince + 'ч';
                    } else {
                        date = hourssince + 'h';
                    }
                }else if(minutessince > 0){
                    if(language == 'RU') {
                        date = minutessince + 'мин';
                    } else {
                        date = minutessince + 'min';
                    }
                }else{
                    if(language == 'RU') {
                        date = secondssince+'сек';
                    } else {
                        date = secondssince+'s';
                    }
                }
            }else{
                var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                var oneYear = oneDay*365;   // one year
                var oneMonth = oneYear/12;   // one month
                var diffDays = Math.round(Math.abs((today.getTime() - actiondate.getTime())/(oneDay)));
                var diffMonth = Math.round(Math.abs((today.getTime() - actiondate.getTime())/(oneMonth)));
                var diffYear = Math.round(Math.abs((today.getTime() - actiondate.getTime())/(oneYear)));

                if(diffDays >= 7){
                    if(diffMonth == 0) {
                        if(language == 'RU') {
                            date = Math.round(diffDays / 7)+'нед';
                        } else {
                            date = Math.round(diffDays / 7)+'w';
                        }
                    } else {
                        if(diffMonth < 12) {
                            if(language == 'RU') {
                                date = Math.round(diffMonth) + 'мес';
                            } else {
                                date = Math.round(diffMonth) + 'm';
                            }
                        } else {
                            if(language == 'RU') {
                                date = Math.round(diffYear) + 'г';
                            } else {
                                date = Math.round(diffYear) + 'y';
                            }
                        }
                    }

                } else {
                    if(diffDays == '0'){
                        diffDays = '1';
                    }
                    if(language == 'RU') {
                        date = diffDays+'д';
                    } else {
                        date = diffDays+'d';
                    }

                }
            }
            return date;
        }
    }

},false);

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
