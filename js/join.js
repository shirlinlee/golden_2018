(function () {
    // 下拉選單的plugin
    Vue.component('v-select', VueSelect.VueSelect);
    var joinCrtl = new Vue({
        el: '.wrap',
        data: {
            step: 1,
            name: '',
            gender: '',
            genderOptions: {
                list: ['男', '女'],
            },
            edu: '',
            eduOptions: {
                list: ['碩士以上', '大學', '專科', '高中職'],
            },
            birth: '',
            place: '',
            dept: '',
            phone: '',
            email: '',
            areaData: [],
            maxHeight: '250px',
            chkmsg: [],
            isFocus: '',
            isDone: false,
            slogan: '先讓我們了解你吧！請填寫基本資料'
        },
        computed: {
            availableCities() {
                // 更新選縣市後的單位列表
                return this.place ? this.place.store : []
            },
            birthday() {
                var year = this.birth.getFullYear();
                var month = ((this.birth.getMonth() + 1) < 10) ? '0' + (this.birth.getMonth() + 1) : this.birth.getMonth() + 1;
                var day = (this.birth.getDate() < 10) ? '0' + this.birth.getDate() : this.birth.getDate();

                return year + '/' + month + '/' + day;
            },
        },
        created() {
            window.addEventListener('orientationchange', this.avoidAnriod);
        },
        beforeMount: function () {
            // 先從後端取上班地點及單位
            $.get(domain + '/goldenplan/api/store_list.ashx', (result) => {
                $.each(result, (key, obj) => {
                    // 整理下拉所需的資料進 areaData
                    this.areaData.push({
                        'country': key,
                        'store': obj
                    })
                });
            });
        },
        mounted() {
            window.onload = function () {
                document.querySelector('.wrap.join .content').classList.add('in');
            }
            // this.sendMail();  //測試mail是否成功寄出
        },
        methods: {
            next() {
                console.log(this.dept);
                // 下一步都寫這在

                // 進度條特效 out
                document.querySelector('.progress .line').classList.remove('show');

                // 先清空錯誤訊息
                this.chkmsg = [];


                // 資料驗証規則寫在這
                if (this.step == 1) {

                    // 姓名、性別、生日、學歷的驗証規則
                    if (!CH.checktxt(this.name)) {
                        this.chkmsg.push('姓名');
                    }
                    if (!CH.checktxt(this.gender)) {
                        this.chkmsg.push('性別');
                    }
                    if (this.birth == '') {
                        this.chkmsg.push('生日');
                    }
                    if (!CH.checktxt(this.edu)) {
                        this.chkmsg.push('學歷');
                    }

                    if (this.chkmsg.length == 0) {
                        this.step = 2;
                        this.slogan = '國泰據點分布全台，請選擇希望上班地點';
                    } else {
                        // 開 popup 提示訊息
                        // console.log(this.chkmsg);
                        // gtag('event', 'click', { event_category:'golden_click', event_action: 'go_goden_qa1' });
                        swal({
                            text: this.chkmsg + '為必填欄位',
                            type: 'error',
                            confirmButtonColor: '#00a83c',
                        });
                        return;
                    }

                } else if (this.step == 2) {

                    // 希望上班地方、是否希望指定聯繫單位
                    if (this.place == '') {
                        this.chkmsg.push('希望上班地點');
                    }
                    if (this.dept == null) {
                        this.chkmsg.push('希望指定聯繫單位');
                    }

                    if (this.chkmsg.length == 0) {
                        this.step = 3;
                        this.slogan = '最後別忘了告訴我們你的聯繫方式';
                    } else {
                        // 開 popup 提示訊息
                        console.log(this.chkmsg);
                        swal({
                            text: this.chkmsg + '為必填欄位',
                            type: 'error',
                            confirmButtonColor: '#00a83c',
                        });
                        return;
                    }
                } else if (this.step == 3) {
                    // 接後端ajax，然後開popup通知

                    // 姓名 >> this.name
                    // 性別 >> this.gender
                    // 生日 >> this.birthday
                    // 學歷 >> this.edu
                    // 希望上班地點 >> this.place.country
                    // 是否希望指定聯繫單位 >> this.dept
                    // 手機 >> this.phone
                    // EMAIL >> this.email
                    // 已詳閱 >> read

                    var read = document.querySelector('#read').checked;

                    if (!CH.isValidCell(this.phone)) {
                        this.chkmsg.push('手機十碼');
                    }

                    if (!CH.isValidMail(this.email)) {
                        this.chkmsg.push('EMAIL');
                    }

                    if (!read) {
                        this.chkmsg.push('同意相關規定');
                    }


                    if (this.chkmsg.length == 0) {
                        // this.step = 1;

                        console.log(
                            this.place.country,
                            this.birthday
                        );

                        var $this = this;
                        // AJAX 送資料
                        $.ajax({
                            type: 'POST',
                            url: domain + '/goldenplan/api/post_join.ashx',
                            data: {
                                'name': this.name,
                                'sex': this.gender,
                                'email': this.email,
                                'phone': this.phone,
                                'birthday': this.birthday,
                                'education': this.edu,
                                'work_place': this.place.country,
                                'store': this.dept
                            },
                            complete: function (res) {
                                // console.log(res);
                                if (res.responseJSON.OK === 'OK') {
                                    swal({
                                        text: '您的資料已成功送出',
                                        type: 'success',
                                        confirmButtonColor: '#00a83c',
                                    }).then((result) => {
                                        $this.isDone = true;
                                        $this.step = 1;

                                        $this.name = '';
                                        $this.gender = '';
                                        $this.email = '';
                                        $this.phone = '';
                                        $this.birth = '';
                                        $this.edu = '';
                                        $this.place = '';
                                        $this.dept = '';
                                        $this.chkmsg = [];
                                        $this.slogan = '先讓我們了解你吧！請填寫基本資料';

                                    });

                                    $this.sendMail();

                                } else {
                                    swal({
                                        text: '您的資料未成功送出，信箱已被重複註冊',
                                        type: 'error',
                                        confirmButtonColor: '#00a83c',
                                    });
                                }
                            }
                        });


                    } else {
                        // 開 popup 提示訊息
                        console.log(this.chkmsg);
                        swal({
                            text: this.chkmsg + '為必填欄位',
                            type: 'error',
                            confirmButtonColor: '#00a83c',
                        });
                        return;
                    }
                }

                this.$nextTick(() => {
                    // 進度條特效 in
                    document.querySelector('.progress .line').classList.add('show');
                });
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
            labelF(ele) {
                this.isFocus = ele;
            },
            labelB(ele) {
                this.isFocus = '';
            },
            sendMail() {
                var mail_users = ['jessica3@cathaylife.com.tw', 'chshen@cathaylife.com.tw', 'elvis@cathaylife.com.tw', 'sanzo_ko@webgene.com.tw']
                var i;
                for (i = 0; i < mail_users.length; i++) {
                    // console.log(mail_users[i]);
                    $.ajax({
                        type: 'POST',
                        url: 'https: //www.cathaylife.com.tw/oc/OCWeb/servlet/HttpDispatcher/OCApiTxBean/execute?ACTION_NAME=OCI3_0200&METHOD_NAME=getNPSCampaign',
                        data: {
                            'EMAIL': mail_users[i],
                        },
                        complete: function (res) {
                            console.log(res);
                        }
                    });
                }

            }
        },
        destroyed: function () {
            window.removeEventListener('orientationchange', this.avoidAnriod);
        },
    })
})();