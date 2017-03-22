window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);

    var APP_ID = '4645070665';
    var APP_ACCES_TOKEN = '4645070665.af79c98.0666edaf12bb43858609d90c7637a4b1';

    var APP_LIMIT = 4;

    blockInstagram();

    function blockInstagram() {

        // window.addEventListener('resize',cutBlocks);

        var feed = new Instafeed({
            get: 'user',
            userId: APP_ID,
            limit: APP_LIMIT,
            resolution: 'standard_resolution',
            accessToken: APP_ACCES_TOKEN,
            filter: function(image) {

                image.data_create = getTime(image.created_time*1000);

                return true;
            },
            after: function(){
            },
            template: '<a href="{{model.link}}" class="item-insta col xs-6 sm-3' +
            ' lg-3"><img src="{{image}}"/><p class="insta-header"><span class="insta-logo icon-logo text' +
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

            var actiondate = new Date(parseInt(date));

            var today = new Date();
            if(today.getDate() === actiondate.getDate() && today.getMonth() === actiondate.getMonth() && today.getYear() === actiondate.getYear()){
                var hourssince =   today.getHours() - actiondate.getHours();
                var minutessince =   today.getMinutes() - actiondate.getMinutes();
                var secondssince =   today.getSeconds() - actiondate.getSeconds();
                if(hourssince > 0){
                    date = hourssince+'ч';
                }else if(minutessince > 0){
                    date = minutessince+'мин';
                }else{
                    date = secondssince+'сек';
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
                        date = Math.round(diffDays / 7)+'нед';
                    } else {
                        if(diffMonth < 12) {
                            date = Math.round(diffMonth) + 'мес';
                        } else {
                            date = Math.round(diffYear) + 'г';
                        }
                    }

                } else {
                    if(diffDays == '0'){
                        diffDays = '1';
                    }
                    date = diffDays+'д';
                }
            }
            return date;
        }
    }

},false);
