"use strict";var app=new Vue({el:"#wrapper",data:{geocoder:null,current_location:null,current_area:null,notyet:!0,select_data:[],search_city:"",search_dist:"",search_txt:"",allAct:[],allStore:[],allGeoData:[],showActBanner:!1,actBannerTitle:"",actBannerDes:"",actBannerPic:"",from_index:!1,actNumber:2},computed:{slideWidth:function(){return 200*this.actNumber+"px"}},watch:{search_city:function(t){this.notyet||(this.search_dist=this.search_txt="")}},beforeMount:function(){0===this.getParameterByName("city").length&&0===this.getParameterByName("dist").length&&0===this.getParameterByName("txt").length||(this.search_city=this.getParameterByName("city"),this.search_dist=this.getParameterByName("dist"),this.search_txt=this.getParameterByName("txt"),this.callApi(this.search_city),this.from_index=!0,window.history.pushState({},document.title,"/golden/location"))},mounted:function(){var t=this;this.$nextTick(function(){t.from_index||(t.init(),t.initialize()),t.selectInit(),t.bannerInit(),window.addEventListener("keydown",function(e){13===e.keyCode&&(e.preventDefault(),t.serch())}),gtag("config","UA-129178589-1",{page_title:"全台夢想據點",page_path:"/location"})})},methods:{init:function(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(this.successFunction,this.errorFunction),this.callApi("台北市")},selectInit:function(){var t=this;$.ajax({url:domain+"/golden/api/dist_list.ashx",type:"GET",dataType:"json",success:function(e){t.select_data=e},error:function(){console.alert("ERROR!!!")}})},bannerInit:function(){var t=this,e=(new Date).getTime();$.ajax({url:domain+"/golden/api/get_store_banner.ashx",type:"GET",dataType:"json",success:function(a){t.actBannerTitle=a.title,t.actBannerDes=a.con,t.actBannerPic=domain+"/golden/pic/store/banner.jpg?v="+e},error:function(){console.alert("ERROR!!!")}})},successFunction:function(t){var e=t.coords.latitude,a=t.coords.longitude;this.codeLatLng(e,a)},errorFunction:function(){console.error("Geocoder failed")},initialize:function(){"undefined"!=typeof google&&(geocoder=new google.maps.Geocoder)},codeLatLng:function(t,e){console.log("取得位置",t,e);var a=new google.maps.LatLng(t,e),n=this;geocoder.geocode({latLng:a},function(t,e){if(e==google.maps.GeocoderStatus.OK)if(t[1]){for(var a=0;a<t[0].address_components.length;a++)for(var i=0;i<t[0].address_components[a].types.length;i++)if("administrative_area_level_1"==t[0].address_components[a].types[i]){city=t[0].address_components[a];break}n.callApi(city.short_name)}else console.alert("No results found");else console.error("Geocoder failed due to: "+e)})},callApi:function(t){var e=this;$.ajax({url:domain+"/golden/api/location.ashx",type:"GET",dataType:"json",success:function(a){e.allGeoData=a,e.current_location=t,e.search_city=t,e.getArea()},error:function(){console.alert("ERROR!!!")}})},timeModify:function(t){return t>12?t-12+" pm":t+" am"},getArea:function(){var t=this;this.allGeoData.filter(function(e,a){e.City===t.current_location&&null===t.current_area&&(t.current_area=e.Area,t.getAreaAct(),t.getStore())})},getStore:function(){var t=this;this.allStore=[],$(".store_wrapper li").removeClass("show"),this.allGeoData.filter(function(e,a,n){if(e.Area===t.current_area)if(t.from_index){if(e.City===t.search_city)if(t.search_dist){if(e.Dist===t.search_dist)if(t.search_txt){if(e.Address.indexOf(t.search_txt)>-1){i=e;t.allStore.push(i)}}else{i=e;t.allStore.push(i)}}else{i=e;t.allStore.push(i)}}else{var i=e;t.allStore.push(i)}}),0==this.allStore.length&&swal({text:"搜尋沒有結果哦！",confirmButtonColor:"#00a83c"}),this.notyet=!1},getAreaAct:function(){var t=this;this.allGeoData.filter(function(e,a,n){if(e.Activities.length>0&&e.Area===t.current_area){var i=e.Activities;Object.keys(i).map(function(e){var a=i[e];t.allAct.push(a)})}}),this.allAct.sort(function(t,e){return parseFloat(e.People)-parseFloat(t.People)}),""===domain&&(this.actNumber=this.allAct.length>=3?3:this.allAct.length)},backgroundFunc:function(t){return"url("+t+")"},fb_click:function(t,e){gtag("event","click",{event_category:"location_click",event_action:"fb_btn_"+e}),window.open(t)},seeAct:function(t,e){gtag("event","click",{event_category:"location_click",event_action:"see_act_btn_"+e}),$(this.$refs.i[t]).toggleClass("show"),$(this.$refs.i[t]).find(".detail").slideToggle("show")},hot_act:function(t,e){gtag("event","click",{event_category:"location_click",event_action:"go_act"+e}),window.open(t)},serch:function(){var t=this;if(gtag("event","click",{event_category:"location_click",event_action:"go_location_search"}),""===this.search_txt.trim()&&""===this.search_city&&""===this.search_dist)this.getStore();else{this.allStore=[];var e=[],a=[],n=[];this.allGeoData.filter(function(i,o){if(i.Address.indexOf(t.search_txt)>-1){c=i;e.push(c)}else if(i.StoreName.indexOf(t.search_txt)>-1){var c=i;e.push(c)}o===t.allGeoData.length-1&&e.filter(function(i,o){if(i.City.indexOf(t.search_city)>-1){var c=i;a.push(c)}o===e.length-1&&a.filter(function(e,i){if(e.Dist.indexOf(t.search_dist)>-1){var o=e;n.push(o)}i===a.length-1&&(console.log(n),t.allStore=n)})})}),0==this.allStore.length&&swal({text:"搜尋沒有結果哦！",confirmButtonColor:"#00a83c"})}},index_search:function(){gtag("event","click",{event_category:"index_click",event_action:"go_location_page"}),window.location="/golden/location?city="+this.search_city+"&dist="+this.search_dist+"&txt="+this.search_txt},areaHandler:function(t){this.current_area=t,this.search_city=this.search_dist=this.search_txt="",this.getStore()},getParameterByName:function(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var e=new RegExp("[\\?&]"+t+"=([^&#]*)").exec(location.search);return null===e?"":decodeURIComponent(e[1].replace(/\+/g," "))}}});