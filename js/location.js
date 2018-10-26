var app = new Vue({
    el: '#wrappper',
    data: {
        geocoder: null,
        current_location:'',
        current_area: null,
        notyet: true,
        select_data: [],
        search_city: '',
        search_dist: '',
        search_txt:'',
        allAct: [],
        allStore:[],
        allGeoData: []
    },
    updated: function () {
        // console.log(this.search_city);
    },
    mounted() {
        this.$nextTick( ()=> {
            this.init();
            this.initialize(); 
            this.selectInit(); 
            
            window.addEventListener("keydown", (e)=> {
                if( e.keyCode === 13 ) {
                    this.serch();
                }
            })
        })
    }, 
    methods:{
        init() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.successFunction, this.errorFunction);
            }
        },
        selectInit() {
            var $this = this;
            $.ajax({
                url: "https://cathay.webgene.com.tw/golden2018/api/dist_list.ashx",
                type: "GET",
                dataType: "json",
                success: function(Jdata) {
                    $this.select_data = Jdata;
                    // console.log($this.select_data);
                    
                },
                error: function() {
                    console.alert("ERROR!!!");
                }
            });
        },
        successFunction(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            this.codeLatLng(lat, lng)
        },
        errorFunction(){
            console.error("Geocoder failed");
        },
        initialize() {
            geocoder = new google.maps.Geocoder();
        },
        codeLatLng(lat, lng) {
            var latlng = new google.maps.LatLng(lat, lng);
            var $this = this;
            geocoder.geocode({'latLng': latlng}, (results, status)=> {
                if (status == google.maps.GeocoderStatus.OK) {
                // console.log(results)
                
                if (results[1]) {
                    //formatted address
                    // alert(results[0].formatted_address)
                    //find country name
                    for (var i=0; i<results[0].address_components.length; i++) {
                        for (var b=0;b<results[0].address_components[i].types.length;b++) {
            
                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                            if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                //this is the object you are looking for
                                city= results[0].address_components[i];
                                break;
                            }
                        }
                    }
                    //得到city 城市名稱
                    // alert(city.short_name)
                    
                    $.ajax({
                        url: "https://cathay.webgene.com.tw/golden2018/api/location.ashx",
                        type: "GET",
                        dataType: "json",
                        success: function(Jdata) {
                            // console.log(Jdata);
                            $this.allGeoData = Jdata;
                            // city.short_name = '台中市';
                            $this.current_location = city.short_name;
                            $this.search_city = city.short_name;
                            console.log($this.search_city);
                            
                            $this.getArea();
                        },
                        error: function() {
                            console.alert("ERROR!!!");
                        }
                    });
                
                    } else {
                        console.alert("No results found");
                    }
                } else {
                    console.error("Geocoder failed due to: " + status);
                }
            });
        },
        timeModify(time){
            // console.log(time);
            if( time > 12) {
                var new_time = time - 12;
                return new_time + ' pm';
            } else {
                return time + ' am';
            }
        },
        getArea() {
            this.allGeoData.filter((el, i)=>{
                // console.log(this.current_location, el.City);
                if( el.City === this.current_location) {
                    // console.log(el);
                    if( this.current_area === null ) {
                        this.current_area = el.Area;
                        this.getAreaAct();
                        this.getStore();
                    } 
                }
            })
        },
        getStore() {
            this.allStore = [];
            $('.store_wrapper li').removeClass('show');
            this.allGeoData.filter((item, index, array)=>{
                if( item.Area === this.current_area) {
                    var obj = item;
                    this.allStore.push(obj);
                }
            });
        },            
        getAreaAct() {
            // console.log(this.current_location);
            //以下抓取最多人數活動
            this.allGeoData.filter((item, index, array)=>{
                if( item.Activities.length > 0 && item.Area === this.current_area) {
                    var obj = item.Activities;
                    Object.keys(obj).map((key)=> {
                        // 額外增加key值
                        // var ele = {}
                        // ele[obj[key].people] = obj[key];
                        //直接推
                        var ele = obj[key]
                        this.allAct.push(ele);
                    });
                }
            });
    
            this.allAct.sort(function(a, b) {
                //排列由多到少
                return parseFloat(b.People) - parseFloat(a.People);
            });
            // console.log(this.allAct);
        },
        backgroundFunc(src) {
            return 'url(' + src + ')';
        },
        fb_click(addr) {
            window.open(addr);
        },
        seeAct(index) {
            // console.log(this.$refs);
            $(this.$refs.i[index]).toggleClass('show');
            // console.log($(this.$refs.i[index]).find('.detail'));
            $(this.$refs.i[index]).find('.detail').slideToggle('show');
        },
        serch() {
            
            if( this.search_txt.trim() === '' && this.search_city ==='' &&  this.search_dist ==='' ) {
                console.log('1');
                //什麼都沒輸入
                this.getStore(); 
            
            } else {
                this.allStore = [];
                var tempt_addr = [];
                var tempt_city = [];
                var tempt_dist = [];
                
                //有輸入地點text
                this.allGeoData.filter((item, index)=>{
                    if( item.Address.indexOf(this.search_txt)> -1) {
                        //與地址符合
                        var obj = item;
                        tempt_addr.push(obj);
                    } else if ( item.StoreName.indexOf(this.search_txt)> -1){
                        //與店名符合
                        var obj = item;
                        tempt_addr.push(obj);
                    }
                    if( index === this.allGeoData.length-1 ) {
                        //最後
                        // console.log(tempt_addr);
                        //有選擇縣市
                        tempt_addr.filter((el, i)=>{
                            if( el.City.indexOf(this.search_city) > -1 ) {
                                //與地址符合
                                var obj = el;
                                tempt_city.push(obj);
                            } 

                            if( i ===  tempt_addr.length-1 ) {
                                // console.log(tempt_city);
                                //有選擇區域
                                tempt_city.filter(( ele, n) => {
                                    if( ele.Dist.indexOf(this.search_dist) > -1 ) {
                                        //與地址符合
                                        var obj = ele;
                                        tempt_dist.push(obj);
                                    } 
                                    if( n ===  tempt_city.length-1 ) {
                                         console.log(tempt_dist);
                                         this.allStore = tempt_dist;
                                    }
                                });
                            }
                        });
                    }
                });

            }
            
        },
        areaHandler(area) {
            this.current_area = area;
            this.search_city = this.search_dist = this.search_txt = '';
            this.getStore();
        }

    }
  })



  
