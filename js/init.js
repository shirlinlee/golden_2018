//判斷是否為測試站
var address = window.location.href;
var domain = ( address.indexOf('webgene')> -1 || address.indexOf('127')> -1 )? 'https://cathay.webgene.com.tw':'';


window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

//移到內頁呼叫
// gtag('config', 'UA-129178589-1');


if (location.hostname != '192.168.123.30' && location.hostname != '127.0.0.1') {
    console.log('fb init');
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/zh_TW/all.js#xfbml=1";
        fjs.parentNode.insertBefore(js, fjs);
        window.fbAsyncInit = function () {
            FB.init({
                appId: '206986350200776',  //測試用
                // appId: '897392467315481',  //正式站
                xfbml: true,
                version: 'v3.1',
            });
        };
    }(document, 'script', 'facebook-jssdk'));
}


$(function(){
    //增加版本號
    $('.version').html(new Date())

    //如果非首頁，增加boay的padding
    var isIndex = $('#fullpage').length;
    if(isIndex === 0) $('body').addClass('paddingTop');
    // console.log(isIndex);

    $('button').on('click',function(e){
        e.preventDefault();
    })

    $('.btn').click(function(e){
        e.preventDefault();
        location.href = '#join';
    });

    //手機版選單icon或選單內的字 開合手機版選單
    $('.nav-icon, .nav-page a').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('menu-open');
        $('.nav-page').slideToggle();
    });

    $(window).on('load',function(){
        //console.log('loaded');
        $('.loading').fadeOut();
    })

})


//ga
function page(change, now, page){

    //    gtag('event', 'click', { event_category:  now+'_click', event_action: page+'_btn' });

    if(now === 'menu'){
        //                console.log('gtag', now+'_click', now+'_'+page);
        gtag('event', 'click', { event_category:  now+'_click', event_action: now+'_'+page });
        if(change === 'nodirect'){
            if(page === 'logo' || page === 'home'){
                location.href = '#golden';
            } else if(page === 'fb'){
                location.href = 'https://www.cathaybk.com.tw/cathaybk/';
            } else{
                location.href = '#'+page;
            }
        } else if(change === 'direct'){
            if(page === 'logo' || page === 'home'){
                location.href = '/golden/#golden';
            } else if(page === 'fb'){
                location.href = 'https://www.cathaybk.com.tw/cathaybk/';
            } else{
                location.href = '/golden/#'+page;
            }
        } 
    } else if(now === 'index'){
        if(change === 'video'){
            //            console.log('gtag', now+'_click', 'go_'+page+'_cancel');
            gtag('event', 'click', { event_category:  now+'_click', event_action: 'go_'+page+'_cancel' });
        } else {
            //            console.log('gtag', now+'_click', 'go_'+page+'_page');  
            gtag('event', 'click', { event_category:  now+'_click', event_action: 'go_'+page+'_page' });
            if(change === 'direct'){
                location.href = '/golden/'+page;
            }
        }
    } else if(now === 'bar'){
        location.href = '#'+page;
    }

}