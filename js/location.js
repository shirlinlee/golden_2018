var app = new Vue({
    el: '#wrapper',
    data: {
        $body: null,
        isHide: false,
        geocoder: null,
        current_location: null,
        current_area: null,
        notyet: true,
        select_data: [],
        search_city: '',
        search_dist: '',
        search_txt: '',
        allAct: [],
        allStore: [],
        allGeoData: [],
        showActBanner: false,
        actBannerTitle: '',
        actBannerDes: '',
        actBannerPic: '',
        actBannerLink: '',
        from_index: false,
        actNumber: 3
    },
    computed: {
        slideWidth() {
            //寬200px marginRight 20
            return this.actNumber * (200 + 20) + 'px';
        }
    },
    watch: {
        search_city: function (val) {
            if (!this.notyet) {
                //原頁點選需歸零
                this.search_dist = this.search_txt = '';

                this
                    .allGeoData
                    .filter((el, i) => {
                        // console.log(el.City,this.search_city);
                        if (el.City === this.search_city) {
                            if (this.current_area !== el.Area) {
                                this.current_area = el.Area;
                            }
                        }
                    })
                // console.log('in');
            } else {
                //從首頁來  console.log('out');
            }
            this.serch();
        },
        search_dist: function () {
            this.serch();
        },
        notyet: function () {
            this.serch();
        }
    },
    beforeMount() {
        if (this.getParameterByName('city').length !== 0 || this.getParameterByName('dist').length !== 0 || this.getParameterByName('txt').length !== 0) {
            this.search_city = this.getParameterByName('city');
            this.search_dist = this.getParameterByName('dist');
            this.search_txt = this.getParameterByName('txt');

            this.callApi(this.search_city);

            this.from_index = true;
            // window.history.pushState({}, document.title, "/goldenplan/location");
        }
    },
    mounted() {
        //檢查網址是否從首頁來
        this.$body = (window.opera) ?
            (document.compatMode == "CSS1Compat" ?
                $('html') :
                $('body')) :
            $('html,body');

        this.$nextTick(() => {
            if (!this.from_index) {
                this.init();
                this.initialize();
            }

            this.selectInit();
            this.bannerInit();

            window.addEventListener("keydown", (e) => {
                // console.log(e);
                if (e.keyCode === 13) {
                    e.preventDefault();
                    this.serch();
                }
            })
            window.addEventListener("scroll", (e) => {
                if (!this.isHide) {
                    var scrollVal = $(window).scrollTop();
                    this.isHide = true;
                    setTimeout(() => {
                        this.isHide = false;
                    }, 500)
                }
            });

            gtag('config', 'UA-129178589-1', {
                'page_title': '全台夢想據點',
                'page_path': '/location'
            });
        })
    },
    methods: {
        init() {
            if (navigator.geolocation) {
                navigator
                    .geolocation
                    .getCurrentPosition(this.successFunction, this.errorFunction);
            }
            this.callApi('台北市');

        },
        selectInit() {
            var $this = this;
            $.ajax({
                url: domain + "/goldenplan/api/dist_list.ashx",
                type: "GET",
                dataType: "json",
                success: function (Jdata) {
                    $this.select_data = Jdata;
                },
                error: function () {
                    console.log("ERROR!!!");
                }
            });
        },
        bannerInit() {
            //總公司熱門活動
            var $this = this;
            var v = new Date().getTime();
            $.ajax({
                url: domain + "/goldenplan/api/get_store_banner.ashx",
                type: "GET",
                dataType: "json",
                success: function (Jdata) {
                    // console.log(Jdata);
                    $this.actBannerLink = Jdata.banner_link;
                    $this.actBannerTitle = Jdata.title;
                    $this.actBannerDes = Jdata.con;
                    $this.actBannerPic = domain + '/goldenplan/pic/store/banner.jpg?v=' + v;
                },
                error: function () {
                    console.log("ERROR!!!");
                }
            });
        },
        successFunction(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            this.codeLatLng(lat, lng);
        },
        errorFunction() {
            console.error("Geocoder failed");
        },
        initialize() {
            if (typeof google != 'undefined')
                this.geocoder = new google.maps.Geocoder();
        },
        codeLatLng(lat, lng) {
            console.log('取得位置', lat, lng);
            var latlng = new google
                .maps
                .LatLng(lat, lng);
            var $this = this;

            this.geocoder.geocode({
                'latLng': latlng
            }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    // console.log(results)

                    if (results[1]) {
                        //formatted address alert(results[0].formatted_address) find country name
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                // there are different types that might hold a city admin_area_lvl_1 usually
                                // does in come cases looking for sublocality type will be more appropriate
                                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                    //this is the object you are looking for
                                    var city = results[0].address_components[i];
                                    break;
                                }
                            }
                        }
                        //得到city 城市名稱
                        $this.callApi(city.short_name);

                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.error("Geocoder failed due to: " + status);
                }
            });
        },
        callApi(city) {
            var $this = this;
            $.ajax({
                url: domain + "/goldenplan/api/location.ashx",
                type: "GET",
                dataType: "json",
                success: function (Jdata) {
                    $this.allGeoData = Jdata;
                    $this.current_location = city;
                    $this.search_city = city;
                    $this.getArea();
                },
                error: function () {
                    console.log("ERROR!!!");
                }
            });
        },
        timeModify(time) {
            // console.log(time);
            if (time > 12) {
                var new_time = time - 12;
                return new_time + ' pm';
            } else {
                return time + ' am';
            }
        },
        getArea() {
            // console.log('getArea');
            this
                .allGeoData
                .filter((el, i) => {

                    if (el.City === this.current_location) {
                        // console.log(el);
                        if (this.current_area === null) {
                            this.current_area = el.Area;
                            this.getAreaAct();
                            this.getStore();
                        }
                    }
                })
        },
        getStore() {
            this.allStore = [];
            // console.log(this.allGeoData,this.current_area);
            $('.store_wrapper li').removeClass('show');
            this
                .allGeoData
                .filter((item, index, array) => {
                    if (item.Area === this.current_area) {
                        if (!this.from_index) {
                            var obj = item;
                            this
                                .allStore
                                .push(obj);
                        } else {
                            if (item.City === this.search_city) {
                                if (this.search_dist) {
                                    // 還有有dist
                                    if (item.Dist === this.search_dist) {
                                        if (this.search_txt) {
                                            //還有有地址
                                            if (item.Address.indexOf(this.search_txt) > -1) {

                                                var obj = item;
                                                this
                                                    .allStore
                                                    .push(obj);
                                            }
                                        } else {
                                            var obj = item;
                                            this
                                                .allStore
                                                .push(obj);
                                        }
                                    }
                                } else {
                                    // 只有city
                                    var obj = item;
                                    this
                                        .allStore
                                        .push(obj);
                                }
                            }
                        }
                    }
                });
            // if(this.allStore.length == 0){     swal({         text: '搜尋沒有結果哦！',
            // confirmButtonColor: '#00a83c',     }); }
            this.notyet = false;
        },
        getAreaAct() {
            // 以下抓取最多人數活動 this.allGeoData.filter((item, index, array)=>{     // if(
            // item.Activities.length > 0 && item.Area === this.current_area) { //撈整大區塊 if(
            // item.Activities.length > 0 ) { //撈全台         var obj = item.Activities;
            // Object.keys(obj).map((key)=> {             //直接推             var ele =
            // obj[key]             this.allAct.push(ele);         });     } });
            // this.allAct.sort(function(a, b) {     //排列由多到少     return
            // parseFloat(b.People) - parseFloat(a.People); }); 以上為判斷參與人數由前端排列

            var $this = this;
            $.ajax({
                url: domain + "/goldenplan/api/get_event_top3.ashx",
                type: "GET",
                dataType: "json",
                success: function (Jdata) {
                    // console.log(Jdata);
                    $this.allAct = Jdata;
                },
                error: function () {
                    console.log("ERROR!!!");
                }
            });

        },
        backgroundFunc(src) {
            return 'url(' + src + ')';
        },
        fb_click(addr, gaEle) {
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'fb_btn_' + gaEle
            });
            window.open(addr);
        },
        fb_act_click(addr, gaEle) {
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'go_' + gaEle + '_fbPage'
            });
            window.open(addr);
        },
        seeAct(index, gaEle) {
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'see_act_btn_' + gaEle
            });
            $(this.$refs.i[index]).toggleClass('show');
            $(this.$refs.i[index])
                .find('.detail')
                .slideToggle('show');
        },
        hotBannerHandler() {
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'go_act_hot_banner'
            });
            setTimeout(() => {
                window.open(this.actBannerLink);
            });
        },
        hot_act(addr, gaEle) {
            // console.log('location_click','go_act'+ gaEle );
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'go_act' + gaEle
            });
            window.open(addr);
        },
        serch() {
            gtag('event', 'click', {
                event_category: 'location_click',
                event_action: 'go_location_search'
            });

            if (this.search_txt.trim() === '' && this.search_city === '' && this.search_dist === '') {
                //什麼都沒輸入
                this.getStore();

            } else {
                this.allStore = [];
                var tempt_addr = [];
                var tempt_city = [];
                var tempt_dist = [];
                // console.log(this.allGeoData);
                //有輸入地點text
                this
                    .allGeoData
                    .filter((item, index) => {
                        // console.log(item.Address.indexOf(this.search_txt));
                        if (item.Address.indexOf(this.search_txt) > -1) {

                            //與地址符合
                            var obj = item;
                            tempt_addr.push(obj);
                        } else if (item.StoreName.indexOf(this.search_txt) > -1) {
                            //與店名符合
                            var obj = item;
                            tempt_addr.push(obj);

                        }

                        setTimeout(() => {
                            if (index === this.allGeoData.length - 1) {
                                // console.log('4'); 有選擇縣市
                                tempt_addr.filter((el, i) => {
                                    if (el.City.indexOf(this.search_city) > -1) {

                                        //與地址符合
                                        var obj = el;
                                        tempt_city.push(obj);
                                    }

                                    if (i === tempt_addr.length - 1) {

                                        // console.log(tempt_city); 有選擇區域
                                        tempt_city.filter((ele, n) => {
                                            if (ele.Dist.indexOf(this.search_dist) > -1) {
                                                //與地址符合
                                                var obj = ele;
                                                tempt_dist.push(obj);
                                            }
                                            if (n === tempt_city.length - 1) {
                                                //  console.log(tempt_dist);
                                                this.allStore = tempt_dist;
                                            }
                                        });
                                    }
                                });
                            }
                        }, 100)

                    });
                // console.log(this.allStore); if(this.allStore.length == 0){     swal({ text:
                // '搜尋沒有結果哦！',         confirmButtonColor: '#00a83c',     }); }

            }
        },
        index_search() {
            gtag('event', 'click', {
                event_category: 'index_click',
                event_action: 'go_location_page'
            });
            window.location = "/goldenplan/location?city=" + this.search_city + "&dist=" + this.search_dist + "&txt=" + this.search_txt;

        },
        areaHandler(area) {
            this.current_area = area;
            this.search_city = this.search_dist = this.search_txt = '';
            this.from_index = false;
            this.getStore();
        },
        getParameterByName(name) {
            name = name
                .replace(/[\[]/, "\\[")
                .replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ?
                "" :
                decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        goTop() {
            this
                .$body
                .animate({
                    scrollTop: 0
                }, 800);
        }

    }
})