var app = new Vue({
    el: '#wrappper',
    data: {
        geocoder: null,
        current_location:'新北市',
        current_area: null,
        notyet: true,
        search_city: '新北市',
        search_dist: 0,
        search_txt:'',
        allAct: [],
        allStore:[],
        allGeoData: []
    },
    updated: function () {
        console.log(this.search_city);
       
    },
    mounted() {
        this.$nextTick( ()=> {
            this.init();
            this.initialize(); 
            window.addEventListener("keydown", (e)=> {
                if( e.keyCode === 13  && this.search_txt.trim() !== '') {
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
                            console.log(city.short_name);
                            $this.allGeoData = Jdata;
                            $this.current_location = city.short_name;
                            $this.search_city = city.short_name;
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
                if( el.Activities.length > 0 && el.City === this.current_location) {
                    if( this.current_area === null ) {
                        this.current_area = el.Area;
                        this.getAreaAct();
                        this.getStore();
                    } 
                }
            })
        },
        getStore() {
            var getAct = this.allGeoData.filter((item, index, array)=>{
                if( item.Area === this.current_area) {
                    var obj = item;
                    this.allStore.push(obj);
                }
            });
            // console.log(this.allStore);
        },            
        getAreaAct() {
            // console.log(this.current_location);
            //以下抓取最多人數活動
            var getAct = this.allGeoData.filter((item, index, array)=>{
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
            console.log(this.allAct);
        },
        backgroundFunc(src) {
            return 'url(' + src + ')';
        },
        fb_click(addr) {
            window.open(addr);
        },
        seeAct(index) {
            // console.log(this.$refs);
            // console.log(this.$refs.i[index]);
            $(this.$refs.i[index]).toggleClass('show');

        },
        serch() {
            if( this.search_txt.trim() === '') {
                //沒有輸入地點
                this.getStore(); 
            
            } else {
                //有輸入地點
                this.allStore = [];
                this.allGeoData.filter((item, index, array)=>{
                    if( item.Address.indexOf(this.search_txt)> -1) {
                        //與地址符合
                        var obj = item;
                        this.allStore.push(obj);
                    } else if ( item.StoreName.indexOf(this.search_txt)> -1){
                        //與店名符合
                        var obj = item;
                        this.allStore.push(obj);
                    }
                });
                // console.log(this.allStore);
            }
        }

    }
  })



  
