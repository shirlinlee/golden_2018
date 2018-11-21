//判斷是否為測試站
var address = window.location.href;
var domain = ( address.indexOf('webgene')> -1 || address.indexOf('127')> -1 )? 'https://cathay.webgene.com.tw':'';


window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

//移到內頁呼叫
// gtag('config', 'UA-129178589-1');


if (location.hostname != '192.168.123.30' && location.hostname != '127.0.0.1') {
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

    //選單-國泰icon
    $('nav .logo').on('click',function(e){
        e.preventDefault();
        location.href = '/golden/#Plan';
    })
    

    //手機版選單按鈕
    $('.nav-icon, .nav-page a').on('click', function(e) {
       

        e.preventDefault();

         gtag('event', 'click', { event_category:  'nav_click', event_action: 'hamberger_btn' });
        $('body').toggleClass('menu-open');
        $('.nav-page').slideToggle();
    });

    //點選單的字 收合手機版選單
    // $('.nav-page a').on('click', function() {
    //     $('body').toggleClass('menu-open');
    //     $('.nav-page').slideToggle();
    // });
})


function page(change, now, page){

    
    gtag('event', 'click', { event_category:  now+'_click', event_action: page+'_btn' });


    // gtag('event', 'click', { event_category:  'index_click', event_action: 'go_story_btn' });


    console.log('gtag', now+'_click', page+'_btn');
    
    if(change === 'nodirect'){
        location.href = '#'+page;
    } else {

        if(now === 'nav'){
            location.href = '/golden/#'+page;
            return;
        }
        location.href = '/golden/'+page;
        
    }
    
}