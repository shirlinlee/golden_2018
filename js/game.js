var app = new Vue({
    el: '#wrappper',
    data: {

    },
    updated: function () {
        // console.log(this.search_city);
    },
    mounted() {
        this.$nextTick( ()=> {
            this.init();
            
        })
    }, 
    methods:{
        init() {
       
        },


    }
  })



  
