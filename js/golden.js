// console.log(domain);
var app = new Vue({
    el: '#wrapper',
    data: {
        $body: null,
        aws_0: null,
        aws_1: null,
        aws_2: null,
        aws_3: null,
        progress: 0,
        qes:[
            {title:'一旦設定目標，會想盡辦法完成'},
            {title:'遇到挑戰不會害怕，反而躍躍欲試'}, 
            {title:'我喜歡用自己的方式解決問題'},
            {title:'面對狀況，我重視彈性大於原則'},
        ],
        dbClick: false,
        a:0,
        b:0,
        des:'',
        character:[],
        getResult: false,
        wow: null,
        wow_buble: null
        
    },
    computed: {
         add1: function() {
            return this.progress-1;
        }
    },
    updated: function () {
      
    },
    mounted() {
        this.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
        this.$nextTick( ()=> {
            this.init();
        })
        gtag('config', 'UA-129178589-1', {
            'page_title': '高登計畫',
            'page_path': '/golden'
        });
    }, 
    methods:{
        init() {
            this.wow = new WOW({
                boxClass:     'wow',      // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                duration: '.3s',
                callback:     function(box) {
                    console.log(box);
                    $(box).addClass('show');
                    $(box).find('.buble').removeClass('mb_hide');

                },
            scrollContainer: null // optional scroll container selector, otherwise use window
            });
            this.wow.init();

            // this.wow_buble = new WOW({
            //     boxClass:     'wow_b',      // animated element css class (default is wow)
            //     animateClass: 'animated', // animation css class (default is animated)
            //     callback:     function(box) {
            //     },
            // scrollContainer: null // optional scroll container selector, otherwise use window
            // });
            // this.wow_buble.init();
  
        },
        pushItem(el){
            var str = this.character.toString();
            if(str.indexOf(el) === -1) {
                this.character.push(el);
            }

        },
        choose(qes, ans) {
            //擋連續觸發
            if(this.dbClick) return;
            

            this.dbClick = true;
            this[qes]= ans;
            setTimeout(()=>{
                this.dbClick = false;
            },300)
            

            if( qes === "aws_0" ) {
                if(ans) {
                    this.pushItem('執行力高');
                    this.pushItem('領導潛力');
                } else {
                    this.pushItem('獨立自主');
                    this.pushItem('沉著穩重');
                }
                this.a = this.a+1;
                this.b = this.b+1;
                gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_qa1' });
                

            }  else if( qes === "aws_1") {
                if(ans) {
                    this.pushItem('企圖心強');
                    this.a = this.a+1;

                } else {
                    this.pushItem('沉著穩重');
                    this.b = this.b+1;
                }
                gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_qa2' });

                
            } else if( qes === "aws_2") {
                if(ans) {
                    this.pushItem('獨立自主');
                    this.a = this.a+1;

                } else {
                    this.pushItem('重視合作');
                    this.b = this.b+1;
                }
                gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_qa3' });


            }
            else if( qes === "aws_3" ) {
                if(ans) {
                    this.pushItem('企圖心強');
                    this.pushItem('重視合作');

                } else {
                    this.pushItem('執行力高');
                    this.pushItem('領導潛力');
                }
                this.a = this.a+1;
                this.b = this.b+1;
                gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_qa4' });


                if( this.a > this.b ) {
                    this.des="你是天生行動派，不害怕失敗，勇於做自己，且喜歡追求新鮮事物，加入高登計畫，能幫助你實踐更多人生目標，達到生活與工作的完美平衡。";
                } else if ( this.b > this.a ) {
                    this.des="你是冷靜謹慎派，思考邏輯清晰，在有壓力情況下也能保持理性，透過高登計畫，可以幫你發揮最大潛能，規畫完美職涯。";
                    
                } else {
                    this.des="你是樂觀積極派，喜歡和人互動，做事有條理，深得朋友信任，加入高登計畫，能讓你找到更多志同道合夥伴，一同實現夢想。";
                }

                this.getResult = true;
                setTimeout(()=>{
                    this.$body.animate({scrollTop:$('#result').offset().top});
                },20);     

                
                return;
            }

            this.progress = this.progress+1;
            
        },
        scrollHandler(el, gaEle) {
            gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_'+ gaEle });
            this.$body.animate({scrollTop: $('#'+el).offset().top}, 500);
        },
        seeVideo(id, gaEle) {
            gtag('event', 'click', { event_category:'golden_click', event_action: 'go_golden_'+ gaEle });
            //開影片
            $('.story-videoBox').addClass('open');
            var newID = 'KdeBI-QUH2k';
            $('.videoBox').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + newID + '?autoplay=1" frameborder="0"></iframe>');

            $('.videoBox-close').on('click', function () {
                $('.story-videoBox').removeClass('open');
                $('.videoBox').html('');
            });

        }
       
        

    }
  })



  
