"use strict";var app=new Vue({el:"#wrapper",data:{$body:null,aws_0:null,aws_1:null,aws_2:null,aws_3:null,progress:0,qes:[{title:"一旦設定目標，會想盡辦法完成"},{title:"遇到挑戰不會害怕，反而躍躍欲試"},{title:"我喜歡用自己的方式解決問題"},{title:"面對狀況，我重視彈性大於原則"}],dbClick:!1,a:0,b:0,des:"",character:[],getResult:!1,wow:null,wow_buble:null},computed:{add1:function(){return this.progress-1}},updated:function(){},mounted:function(){var t=this;this.$body=window.opera?"CSS1Compat"==document.compatMode?$("html"):$("body"):$("html,body"),this.$nextTick(function(){t.init()}),gtag("config","UA-129178589-1",{page_title:"高登計畫",page_path:"/golden"})},methods:{init:function(){this.wow=new WOW({boxClass:"wow",animateClass:"animated",duration:".3s",callback:function(t){$(t).addClass("show")},scrollContainer:null}),this.wow.init()},pushItem:function(t){-1===this.character.toString().indexOf(t)&&this.character.push(t)},choose:function(t,e){var i=this;if(!this.dbClick){if(this.dbClick=!0,this[t]=e,setTimeout(function(){i.dbClick=!1},300),"aws_0"===t)e?(this.pushItem("執行力高"),this.pushItem("領導潛力")):(this.pushItem("獨立自主"),this.pushItem("沉著穩重")),this.a=this.a+1,this.b=this.b+1,gtag("event","click",{event_category:"golden_click",event_action:"go_golden_qa1"});else if("aws_1"===t)e?(this.pushItem("企圖心強"),this.a=this.a+1):(this.pushItem("沉著穩重"),this.b=this.b+1),gtag("event","click",{event_category:"golden_click",event_action:"go_golden_qa2"});else if("aws_2"===t)e?(this.pushItem("獨立自主"),this.a=this.a+1):(this.pushItem("重視合作"),this.b=this.b+1),gtag("event","click",{event_category:"golden_click",event_action:"go_golden_qa3"});else if("aws_3"===t)return e?(this.pushItem("企圖心強"),this.pushItem("重視合作")):(this.pushItem("執行力高"),this.pushItem("領導潛力")),this.a=this.a+1,this.b=this.b+1,gtag("event","click",{event_category:"golden_click",event_action:"go_golden_qa4"}),this.a>this.b?this.des="你是天生行動派，不害怕失敗，勇於做自己，且喜歡追求新鮮事物，加入高登計畫，能幫助你實踐更多人生目標，達到生活與工作的完美平衡。":this.b>this.a?this.des="你是冷靜謹慎派，思考邏輯清晰，在有壓力情況下也能保持理性，透過高登計畫，可以幫你發揮最大潛能，規畫完美職涯。":this.des="你是樂觀積極派，喜歡和人互動，做事有條理，深得朋友信任，加入高登計畫，能讓你找到更多志同道合夥伴，一同實現夢想。",this.getResult=!0,void setTimeout(function(){i.$body.animate({scrollTop:$("#result").offset().top})},20);this.progress=this.progress+1}},scrollHandler:function(t,e){gtag("event","click",{event_category:"golden_click",event_action:"go_golden_"+e}),this.$body.animate({scrollTop:$("#"+t).offset().top},500)},seeVideo:function(t,e){gtag("event","click",{event_category:"golden_click",event_action:"go_golden_"+e}),$(".story-videoBox").addClass("open");$(".videoBox").html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/KdeBI-QUH2k?autoplay=1" frameborder="0"></iframe>'),$(".videoBox-close").on("click",function(){$(".story-videoBox").removeClass("open"),$(".videoBox").html("")})}}});