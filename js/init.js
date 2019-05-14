//判斷是否為測試站
var address = window.location.href;
var domain = ( address.indexOf('webgene')> -1 || address.indexOf('127')> -1 )? 'https://cathay.webgene.com.tw':'';


window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

//移到內頁呼叫
// gtag('config', 'UA-129178589-1');
var fb = (domain === '') ? '897392467315481':'206986350200776'
console.log('fb_id',fb);

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
                appId: (domain === '') ? '897392467315481':'206986350200776',  
                // 測試用 '206986350200776'
                // 正式站'897392467315481'
                xfbml: true,
                version: 'v3.1',
            });
        };
    }(document, 'script', 'facebook-jssdk'));
}


$(function(){
    
    //增加版本號
    // $('.version').html(new Date())

    //如果非首頁，增加boay的padding
    var isIndex = $('#fullpage').length;
    if(isIndex === 0) $('body').addClass('paddingTop');
    // console.log(isIndex);

    $('button').on('click',function(e){
        e.preventDefault();
    });


    $('.join_banner').on('click','.button',function(e){
        e.preventDefault();
        gtag('event', 'click', { event_category:'join_banner_click', event_action: 'go_golden_join' });
        location.href = '/goldenplan/#join';
    });

    //手機版選單icon或選單內的字 開合手機版選單
    $('.nav-icon, .nav-page a').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('menu-open');
        $('.nav-page').slideToggle();
    });

    // 防止輸入時挑出翻轉訊息
    $('input').on('focus',function(){
        $('.trans_bg').addClass('input_focus');
    })


})

$(window).on('load',function(){
    //console.log('loaded');
    $('.loading').fadeOut();
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
                window.open('https://www.facebook.com/Cathaylife/');
            } else{
                location.href = '#'+page;
            }
        } else if(change === 'direct'){
            if(page === 'logo' || page === 'home'){
                location.href = '/goldenplan/#golden';
            } else if(page === 'fb'){
                window.open('https://www.facebook.com/Cathaylife/');
            } else{
                location.href = '/goldenplan/#'+page;
            }
        } 
    } else if(now === 'index'){
        if(change === 'video'){
            gtag('event', 'click', { event_category:  now+'_click', event_action: 'go_'+page+'_cancel' });
        } else {
            gtag('event', 'click', { event_category:  now+'_click', event_action: 'go_'+page+'_page' });
            if(change === 'direct'){
                location.href = '/goldenplan/'+page;
            }
        }
    } else if(now === 'bar'){
        location.href = '#'+page;
    } else if(now === 'footer'){
        if(page === 'fb'){
            window.open('https://www.facebook.com/Cathaylife/');
        } else if(page === 'website'){
            window.open('https://www.cathaybk.com.tw/cathaybk/');
        }

    } 

}