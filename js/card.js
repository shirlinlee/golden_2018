(function () {
    var cardCrtl = new Vue({
        el: '.wrap',
        data: {
            initTitle: false,
            isOpen: false,
            isRandom: false,
            step: $.cookie('id') ? 2 : 1,
            fbID: $.cookie('id') ? $.cookie('id') : '',
            name: $.cookie('name') ? $.cookie('name') : '',
            email: $.cookie('email') ? $.cookie('email') : '',
            dream: '',
            title: '扛霸子',
            pic: $.cookie('id') ? 'https://graph.facebook.com/' + $.cookie('id') + '/picture?type=large' : '',
            pic_for_canvas: '',
            pic_base64: '',
            share_url: '',
            normalList: {
                cathay: ['高登人氣新人王', '超級業務王', '高登明日之星', '業績超新星', '頂尖業務高手', '高登MVP', '高登潛力股', '明星業務員', '高登業務傳奇', '團隊扛壩子'],
                dream: ['街頭撩妹冠軍', '急凍冷笑話大王', '台灣電競宗師', '空氣吉他大師', '發呆界王者', '最萌鏟屎官', '紫爆文生產機', '地表最強背包客', '吃不胖專家', '國民初戀情人', '噴飯諧星咖', '天才饒舌歌手', '時尚終結者', '年輕創業偶像', '台灣巴飛特', '桌遊之神', '笑點超低冠軍', '網路傳奇紅人', '一秒入睡達人', '專業老司機'],
            },
            random_num: 0,
            canvas: null,
            
        },
        computed: {
            finalName() {
                // 處理名字中間的空白，目前只處理三個字跟四個字的
                if (this.name.length == 3) {
                    return this.name.split('')[0] + '&nbsp;&nbsp;' + this.name.split('')[1] + this.name.split('')[2]
                } else if (this.name.length == 4) {
                    return this.name.split('')[0] + this.name.split('')[1] + '&nbsp;&nbsp;' + this.name.split('')[2] + this.name.split('')[3]
                } else {
                    return this.name;
                }
            },
            finalDream() {
                // 處理職稱判斷
                var str = this.dream;
                if (!this.isRandom) {
                    str += (this.title != '無') ? this.title : '';
                } else {

                }
                return str;
            },
            afterWidth() {
                // 用來處理step3的職稱後面的after長度
                return 'word' + this.finalDream.length;
            },
        },
        created() {
            window.addEventListener('scroll', this.ctrlScroll);
            window.addEventListener('orientationchange', this.avoidAnriod);
        },
        beforeMount() {
            // 預載step2背景圖
            var imgs = ['img/namecard_bg.jpg'];
            this.loadImages(imgs, function () {
                // callback
            });
        },
        mounted() {
            this.$nextTick( ()=> {
                // 首頁連場效果做在scroll上
                // this.ctrlScroll();

                // 如果從首頁登入過來，則step == 2做進場效果
                if(this.step == 1 && this.fbID ==='' ) {
                    setTimeout(() => {
                        document.querySelector('.wrap.card .content').classList.add('step1Show');
                    }, 500);
                }
                else if (this.step == 2) {
                    setTimeout(() => {
                        document.querySelector('.wrap.card .content').classList.add('step2Show','step1Show');
                        // document.querySelector('.wrap.card .content').classList.add('step1Show');

                        this.getuserImg();
                    }, 500);
                }
            })

            gtag('config', 'UA-129178589-1', {
                'page_title': '我的夢想名片',
                'page_path': '/card'
            });
        },
        methods: {
            getuserImg(){
                $.ajax({
                    type: 'POST',
                    url: domain+ '/golden/api/up_fb_pic.ashx',
                    data: { 
                        'fb_pic':this.pic,
                    },
                    complete:(res)=>{
                        this.pic_for_canvas = res.responseJSON.fb_pic_url;
                        console.log('轉換圖',res.responseJSON.fb_pic_url);
                        
                    }
                });
            },
            ctrlScroll() {
                var offsetTop = $(window).scrollTop();
                var myPage = $('.wrap.card .content').offset().top / 3 * 2;
                if (!this.initTitle && offsetTop >= myPage) {
                    this.initTitle = true;
                    window.removeEventListener('scroll', this.ctrlScroll);
                    document.querySelector('.wrap.card .content').classList.add('step1Show');
                }
            },
            next(step) {
                if (this.step == 2) {
                    if (this.name == '') {
                        alert('請輸入姓名！');
                        return;
                    }
                    if (this.dream == '') {
                        alert('請輸入夢想！');
                        return;
                    }

                    // 分享圖base64 >> pic_base64
                    var $this = this;
                

                    this.drawCanvas(function(){
                        
                        $.ajax({
                            type: 'POST',
                            url: domain+ '/golden/api/post_card.ashx',
                            data: { 
                                'fbid': $this.fbID,
                                'name': $this.name,
                                'email': $this.email,
                                'pic_64': $this.pic_base64,
                                'job': $this.title
                            },
                            complete:(res)=>{
                                // console.log(res);
                                if(res.status === 200 ) {
                                    console.log('合成成功');
                                    $this.share_url = res.responseJSON["fb_url"];
                                } else {
                                    console.log('合成失敗');
                                }
                            }
                        });
                        
                    });
                }

                this.step = step;
                this.$nextTick(() => {
                    if (step == 3) {
                        setTimeout(() => {
                            document.querySelector('.wrap.card .content').classList.add('step3Show');
                            document.querySelector('.title .join').classList.add('show');
                        }, 450);
                    }
                });
            },
            drawCanvas(cb) {
                if (cb === void 0) { cb = null; }
                // 高畫質已處理完畢，
                this.canvas = document.getElementById('share_canvas');
                var ctx = this.canvas.getContext('2d');
                // var devicePixelRatio = window.devicePixelRatio || 1;
                // var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                //     ctx.mozBackingStorePixelRatio ||
                //     ctx.msBackingStorePixelRatio ||
                //     ctx.oBackingStorePixelRatio ||
                //     ctx.backingStorePixelRatio || 1;
                // var ratio = devicePixelRatio / backingStoreRatio;
                // var share_width = 600;
                // var share_height = 315;

                // canvas.width = share_width;
                // canvas.height = share_height;
                // var oldWidth = canvas.width;
                // var oldHeight = canvas.height;
                // canvas.width = oldWidth * ratio;
                // canvas.height = oldHeight * ratio;
                // canvas.style.width = oldWidth + 'px';
                // canvas.style.height = oldHeight + 'px';
                // ctx.scale(ratio, ratio);

                // 先畫大頭貼
                var user = document.getElementById("user_img");
                ctx.drawImage(user, 267, 35, 65, 65);

                // 再畫bg做圓頭像
                var bg = document.getElementById("basic_img");
                ctx.drawImage(bg, 0, 0, 600, 315);

                
                // 補上字
                ctx.fillStyle = '#00a84e';
                ctx.font = "18px Arial";
                ctx.fillText('高登超級新人王', 65, 70);


                this.canvas.style.letterSpacing = '.5px';
                ctx.font = "11px Arial";
                ctx.fillText('cathaylife@cathay.com', 66, 90);

                this.canvas.style.letterSpacing = '1px';
                ctx.font = "20px Arial";
                ctx.fillText(this.name, 270 , 165 );

                
                this.pic_base64 = this.canvas.toDataURL('image/png');
                
                if (cb) cb();
            },
            random() {
                // 不重複隨機index
                var oldValue = this.random_num;
                // 先用cathay的列表
                var indexArr = this.normalList.cathay;
                var newValue = Math.floor((Math.random() * (indexArr.length)));

                this.isRandom = true;

                do {
                    newValue = Math.floor((Math.random() * (indexArr.length)));
                    this.random_num = newValue;
                    this.dream = indexArr[newValue];
                }
                while (oldValue == newValue);
            },
            loadImages(images, callback) {
                // preload img function
                var total = images.length,
                    count = 0,
                    i;

                function check(n) {
                    if (n == total) {
                        callback();
                    }
                }

                for (i = 0; i < total; ++i) {
                    var src = images[i];
                    var img = document.createElement("img");
                    img.src = src;

                    img.addEventListener("load", function () {
                        if (this.complete) {
                            count++;
                            check(count);
                        }

                    });
                }
            },
            shareFB() {
                // 測試環境跳過FB分享
                gtag('event', 'click', { event_category:'card_click', event_action: 'go_card_share' });
                if (location.hostname != '192.168.123.30' && location.hostname != '127.0.0.1') {
                    FB.ui({
                        method: 'share',
                        href: this.share_url,
                        display: 'popup',
                        hashtag: '#斜槓人生在走兩張名片要有'
                    }, (response) => {
                        //有分享才紀錄
                        if( response !== undefined)  gtag('event', 'click', { event_category:'card_click', event_action: 'go_card_post' });
                    });
                }
            },
            chkFB() {
                // console.log('chkFB坐在按鈕click');
                // 測試環境跳過FB
                if (location.hostname != '192.168.123.30' && location.hostname != '127.0.0.1') {
                    // 判斷cookie有無登入FB
                    FB.login(
                        (response) => {
                            if (response.status === 'connected') {
                                FB.api(
                                    '/me',
                                    'GET', {
                                        "fields": "id,name,email"
                                    },
                                    (response) => {
                                        console.log(response);
                                        this.fbID = response.id;
                                        this.name = response.name;
                                        this.email = response.email;
                                        this.pic = 'https://graph.facebook.com/' + response.id + '/picture?type=large';
                                        this.step = 2;

                                        gtag('event', 'click', { event_category:'card_click', event_action: 'go_card_authorize' });

                                        setTimeout(() => {
                                            document.querySelector('.wrap.card .content').classList.add('step2Show');
                                            this.getuserImg();
                                        }, 250);
                                    }
                                );
                            } else {

                            }
                        }, {
                            scope: 'email'
                        }
                    );
                } else {
                    // 測試用
                    
                    this.fbID = '1969571996469866';
                    this.name = '紀術部';
                    this.email = 'technic@webgene.com.tw';
                    this.pic = 'https://graph.facebook.com/1969571996469866/picture?type=large';
                    this.dream = '工程師';
                    this.title = '扛霸子';
                    this.step = 2;

                    setTimeout(() => {
                        document.querySelector('.wrap.card .content').classList.add('step2Show');
                    }, 250);
                }
                
            },
            avoidAnriod(evt) {
                // 判裝安卓手機
                function getMobileOperatingSystem() {
                    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                    if (/android/i.test(userAgent)) {
                        return true;
                    }
                    return false;
                };

                // 安卓才做處理
                if (getMobileOperatingSystem()) {
                    document.querySelector('.trans_bg').classList.add('input_focus');
                    screen.orientation.onchange = function () {
                        var way = screen.orientation.type.match(/\w+/)[0];
                        if (way == "landscape") {
                            document.querySelector('.trans_bg').classList.remove('input_focus');
                        }
                    };
                };
            },
        },
        destroyed: function () {
            window.removeEventListener('scroll', this.ctrlScroll);
            window.removeEventListener('orientationchange', this.avoidAnriod);
        },
    })
})();
