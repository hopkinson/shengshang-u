<!--
@Author: hopkinson
@Date:   2018-04-06T11:11:28+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T14:01:29+08:00
-->



<style lang="css" scoped>

.cs-detail {
    margin-top: 30px;
    margin-bottom: 30px;
}

.cs-detail__product--num {
    color: red;
}

.cs-detail__code--item {
    color: #666;
    font-size: 26px;
    padding: 10px;
}

.cs-detail__product--status {
    font-size: 30px;
    color: orange;
}

.cs-detail__code--btn {
    position: absolute;
    right: 0;
    top: 0;
}

.cs-detail__rater {
    align-items: center;
}

.cs-detail__rater--text {
    margin-top: 30px;
    margin-bottom: 40px;
    color: #666;
    font-size: 26px;
}

.cs-detail--icon {
    margin-left: 30px;
    margin-right: 30px;
}

.cs-detail__driver--value {
    flex-direction: row;
}

</style>

<template>
<scroller>
    <div v-if="show">
        <!-- 司机信息 -->
        <block-list :data="driver" hideRight :hasArrow="false" v-if="!statusCancel">
            <div slot="value" class="cs-detail__driver--value">
                <c-icon value="&#xe725;" v-if="!noPay" @click="handleTel" class="cs-detail--icon"></c-icon>
                <c-icon value="&#xe69b;" @click="handleSendMess" class="cs-detail--icon"></c-icon>
            </div>
            <text slot="desc">{{driver.plateNum}}</text>
        </block-list>
        <!-- 地方信息 -->
        <place-info class="cs-detail" readOnly :data="Data.detail"></place-info>
        <!-- 订单-->
        <wxc-cell label="订单状态" :has-margin="!Data.detail.fee">
            <text slot="title" class="cs-detail__product--status">{{Const.Orderstatus[Data.detail.status]}}</text>
        </wxc-cell>
        <wxc-cell label="订单金额" has-margin :has-bottom-border="false" v-if="Data.detail.fee">
            <text slot="title" class="cs-detail__product--num">{{Data.detail.fee | filterMoney}}</text>
        </wxc-cell>
        <!-- 货品信息 -->
        <wxc-cell label="货品信息" has-arrow @wxcCellClicked="go('product.detail')">
            <div slot="title">
                <text>{{Data.detail.goodsType | filterDict(dict.goodsType)}}</text>
                <text>{{Data.detail.goodsWeight | filterDict(dict.goodsWeight)}}</text>
            </div>
        </wxc-cell>
        <wxc-cell label="订单车型" :title="Data.detail.carType | filterDict(dict.carType)"></wxc-cell>
        <wxc-cell label="是否本人" has-margin :title="Data.detail.contactsSelf | filterDict(Const.YesNo)">
            <text v-if="isNotMyself">{{Data.detail.contactsUserName}}{{Data.detail.contactsMobile}}</text>
        </wxc-cell>
        <wxc-cell label="是否跟车" :title="Data.detail.follow | filterDict(Const.YesNo)">
            <text v-if="isFollow">{{Data.detail.followNum | filterFollow}}</text>
        </wxc-cell>
        <wxc-cell label="其他要求" has-margin>
            <textarea disabled :rows="3" v-model="Data.detail.memo"></textarea>
        </wxc-cell>
        <wxc-cell :has-bottom-border="false">
            <div slot="label">
                <text class="cs-detail__code--item ">订单号：{{Data.detail.orderCode}}</text>
                <text class="cs-detail__code--item ">创建时间：{{Data.detail.createTimeLen}}</text>
                <text class="cs-detail__code--item" v-if="Data.detail.payTime">支付时间：{{Data.detail.payTime | filterTime}}</text>
            </div>
            <wxc-button slot="value" size="small" type="white" text="复制订单号" @wxcButtonClicked="handleCopyCode "></wxc-button>
        </wxc-cell>
        <!-- ========== -->
        <!-- 各 种 操 作 -->
        <!-- ========== -->
        <!-- 代接货 - 查看二维码 -->
        <div class="cs-detail" v-if="statusTakeGoods">
            <wxc-cell title="查看货品二维码" has-arrow :has-bottom-border="false" @wxcCellClicked="go('product.qrcode')"></wxc-cell>
        </div>
        <!-- 运输中 - 查看地图 -->
        <!-- -->
        <div class="cs-detail" v-if="statusTransport">
            <wxc-cell title="查看货品实时位置" has-arrow :has-bottom-border="false" @wxcCellClicked="Show.mask = true"></wxc-cell>
        </div>
        <!-- 已完成 - 未评分（进行评分） -->
        <div class="cs-detail__rater cs-detail" v-if="canRater">
            <rater @change="handleRater" :score="0"></rater>
            <text class="cs-detail__rater--text">您的评价会让司机做的更好</text>
            <wxc-button text="完成订单" type="yellow" @wxcButtonClicked="handleChangeScore"></wxc-button>
        </div>
        <!-- 待接货 - 司机地图 -->
        <wxc-popup pos="bottom" :height="mapHeight" :show="Show.mask" @wxcPopupOverlayClicked="Show.mask = false">
            <map :geo="driverGEO"></map>
        </wxc-popup>
        <!-- 待支付 - 支付方式 -->
        <!-- <pay-mask :fee="Data.detail.fee" :show.sync="Show.pay" @pay="handlePayMoney"></pay-mask> -->
        <!-- 已完成 - 已评分（进行评分） -->
        <div class="cs-detail" v-if="visitRater">
            <wxc-cell label="司机评分">
                <rater slot="title" :canChange="false" :score="Data.detail.driverScore"></rater>
            </wxc-cell>
            <wxc-cell label="用户评分">
                <rater slot="title" :canChange="false" :score="Data.detail.userScore"></rater>
            </wxc-cell>
        </div>
        <!-- ======= -->
        <!-- 底部按钮 -->
        <!-- ======= -->
        <!-- 1.待支付，取消中 -->
        <div class="cs-detail__rater cs-detail">
            <wxc-button v-if="statusPay" text="立刻支付" type="yellow" @wxcButtonClicked="handlePay"></wxc-button>
            <wxc-button v-if="showAgreeCancelBtn" text="同意取消" type="yellow" @wxcButtonClicked="handleConfirmCancel"></wxc-button>
        </div>
        <!-- 对话框 - 取消 -->
        <popover-cancel :show.sync="Show.popover" @change="handleConfirmCancel"></popover-cancel>
        <!-- 取消 - 对话框 -->
        <wxc-dialog title="提示" content="若取消订单，需要扣款10%的订单费用" :show="Dialog.cancel" confirm-text="取消订单" cancel-text="放弃" @wxcDialogCancelBtnClicked="Dialog.cancel = false" @wxcDialogConfirmBtnClicked="Show.popover = true" />
    </div>
</scroller>
</template>

<script>
import {
    WxcCell,
    WxcButton,
    WxcDialog,
    WxcPopup,
    Utils
}
from 'weex-ui'
import {
    Orderstatus,
    YesNo,
    WxPayResult
}
from 'Const'
import BlockList from 'Pages/driver/components/BlockList'
import PlaceInfo from 'Pages/map/modules/PlaceInfo'
import Rater from './components/Rater'
import PopoverCancel from './modules/Cancel'
// import PayMask from './modules/PayMask'
import Map from './modules/Map'
import status from 'Mixins/status'
import cache from 'Mixins/cache'
import {
    wxpay
} from 'Const/key'
var bmWXPay = weex.requireModule('bmWXPay')
export default {
    mixins: [status, cache],
    data: () => ({
        Data: {
            detail: {},
            payResult: {}
        },
        Const: {
            Orderstatus: Orderstatus,
            YesNo: YesNo
        },
        Show: {
            popover: false,
            mask: false,
            pay: false
        },
        Dialog: {
            cancel: false
        },
        Params: {
            orderId: ''
        },
        Form: {
            score: 0
        },
        show: false
    }),
    watch: {
        Params: {
            handler(val) {
                if (val.orderId) {
                    this.$notice.loading.show('加载中...')
                    this.$fetch({
                        method: 'POST',
                        name: 'u/order/detail',
                        data: val
                    }).then(data => {
                        this.$set(this.Data, 'detail', data)
                        this.show = true
                        this.setRightNav(data.status)
                        this.$notice.loading.hide()
                    })
                }
            },
            deep: true
        }
    },
    eros: {
        beforeAppear(params, options) {
            if (Object.keys(params).length) {
                this.Params.orderId = params.orderId
            }
        },
        disappeared(options) {
            this.Params.orderId = ''
        },
        beforeBackAppear(params, options) {
            if (Object.keys(params).length) {
                this.Params.orderId = params.orderId
            }
        }
    },
    filters: {
        filterFollow(val) {
            return `（${val}人跟车）`
        }
    },
    created() {
        // 初始化微信SDK
        bmWXPay.initWX(wxpay.appId)
    },
    computed: {
        // 显示“同意取消”
        // => 订单状态为订单中 + cacelStatus为1:待货主确认
        showAgreeCancelBtn() {
            return this.Data.detail.cacelStatus === '1' && this.statusCanceling
        },
        // 司机的信息
        driver() {
            return this.Data.detail.driver ? this.Data.detail.driver : {}
        },
        driverGEO() {
            if (this.driver) {
                return [Number(this.driver.x), Number(this.driver.y)] || []
            }
        },
        mapHeight() {
            return Utils.env.getPageHeight() / 2
        },
        // 是否本人
        isNotMyself() {
            return this.Data.detail.contactsSelf === '0'
        },
        // 是否跟车
        isFollow() {
            return this.Data.detail.contactsSelf === '1'
        },
        // 能否评分 （为1才可以）
        canRater() {
            return this.statusFinish && this.Data.detail.canScore === '1'
        },
        // 显示评了的分
        visitRater() {
            return this.statusFinish && this.Data.detail.canScore === '0'
        }
    },
    methods: {
        //  对司机评分
        handleRater({
            score
        }) {
            this.Form.score = score
        },
        //  完成订单
        //  => 评分
        handleChangeScore() {
            this.$fetch({
                method: 'POST',
                name: 'u/order/score',
                data: {
                    ...this.Params,
                    score: this.Form.score
                }
            }).then(data => {
                this.$router.finish()
                this.$router.open({
                    name: 'order.finish',
                    navShow: true,
                    navTitle: '完成订单',
                    params: {
                        button: '回到首页',
                        content: '恭喜你，完成订单！',
                        pic: 'bmlocal://assets/order-finish.png'
                    }
                })
            })
        },
        // 复制订单号
        handleCopyCode() {
            this.$tools.copyString(this.Data.detail.orderCode).then(resData => {
                this.$notice.toast({
                    message: '复制成功'
                })
            }, error => {
                this.$notice.toast({
                    message: '复制失败'
                })
            })
        },
        // 拨打电话
        handleTel() {
            this.$coms.call(this.driver.mobile)
        },
        // 发送信息
        handleSendMess() {
            this.$router.open({
                name: 'chat.chat',
                navShow: true,
                navTitle: this.driver.userName,
                params: {
                    otherUserId: this.driver.userId
                }
            })
        },
        // 按钮 => 立刻支付
        handlePay() {
            // this.Show.pay = true
            this.handleUseWxPay()
        },
        // 点击确认支付
        // handlePayMoney({
        //     value,
        //     title
        // }) {
        //     if (title.includes('余额')) {
        //         this.handleUsePay()
        //     }
        //     if (title.includes('微信')) {
        //         this.handleUseWxPay()
        //     }
        // },
        // 支付成功的处理
        handleCheckPayOrder(item) {
            this.$fetch({
                method: 'POST',
                name: 'pay/weixin/checkPayOrder',
                data: item
            }).then(data => {
                let status = {
                    0: () => {
                        this.$notice.alert({
                            title: '错误',
                            message: '订单未支付，请重新支付'
                        })
                    },
                    1: () => {
                        this.$router.open({
                            name: 'order.finish',
                            navShow: true,
                            navTitle: '支付成功',
                            params: {
                                content: '成功支付订单！请耐心等待司机的回复...',
                                button: '查看订单详情',
                                pic: 'bmlocal://assets/order-pay.png',
                                ...this.Data.detail
                            }
                        })
                    }
                }
                return status[data.payStatus].call(null)
            })
        },
        // 余额支付
        // handleUsePay() {
        //     this.$fetch({
        //         method: 'POST',
        //         name: 'pay/account/use',
        //         data: this.Params
        //     }).then(data => {
        //         let userInfo = Object.assign({}, this.userInfo, {
        //             money: this.userInfo.money - this.Data.detail.fee
        //         })
        //         this.$storage.setSync('userInfo', userInfo)
        //         this.$notice.toast({
        //             message: '成功支付订单'
        //         })
        //         setTimeout(() => {
        //             this.$router.open({
        //                 name: 'order.payResult'
        //             })
        //         }, 500)
        //     })
        // },
        // 待支付 直接取消 => 显示popover
        // 待接货订单20分钟内可随时取消 => 显示popover
        // 待接货订单20分钟之后，提示用户需要扣款10%的订单费用
        handleCancelOrder() {
            let getMins = this.Data.detail.payTimeLen / 60
            if (getMins > 20) {
                this.Dialog.cancel = true
                return
            }
            this.Show.popover = true
        },
        // 确认取消订单
        handleConfirmCancel(e) {
            this.$fetch({
                method: 'POST',
                name: 'u/order/cancel',
                data: {
                    ...this.Params,
                    resonType: e.value || ''
                }
            }).then(data => {
                let result = {
                    0: () => {
                        this.$router.finish()
                        this.$router.open({
                            name: 'order.finish',
                            navShow: true,
                            navTitle: '取消订单',
                            params: {
                                button: '回到首页',
                                content: '成功取消订单...',
                                pic: 'bmlocal://assets/order-cancel.png'
                            }
                        })
                    },
                    1: (data) => {
                        // 判断是否安装微信app
                        var result = bmWXPay.isInstallWXApp()
                        console.log(result)
                        if (result) {
                            this.payWechat(data)
                        } else {
                            this.$notice.alert({
                                title: '错误',
                                message: '使用微信支付前，请安装微信'
                            })
                        }
                    },
                    '-1': () => {
                        this.$notice.toast({
                            message: '取消失败'
                        })
                    }
                }
                return result[data.result](data)
            })
        },
        // 跳转
        go(name) {
            this.$router.open({
                name: name,
                params: {
                    ...this.Data.detail,
                    fromType: 'order.detail'
                },
            })
        },
        // 设置右边导航菜单
        // => 待支付，待接货的时候显示取消订单
        setRightNav(status) {
            this.$navigator.setRightItem({
                text: status < '3' ? '取消订单' : '',
                fontSize: 26,
                textColor: '#333'
            }, () => {
                this.handleCancelOrder()
            })
        },
        /**
         * ============
         *  微 信 支 付
         * ============
         */
        // 获取微信支付参数
        loadWxConfig(callback) {
            this.$fetch({
                method: 'POST',
                name: 'pay/weixin/getPayOrder',
                data: this.Params
            }).then(data => {
                callback(data)
            })
        },
        // 1.使用微信支付
        handleUseWxPay() {
            // 判断是否安装微信app
            var result = bmWXPay.isInstallWXApp()
            if (result) {
                this.loadWxConfig(config => {
                    this.payWechat(config)
                })
            } else {
                this.$notice.alert({
                    title: '错误',
                    message: '使用微信支付前，请安装微信'
                })
            }
        },
        // 2.支付
        payWechat(item) {
            bmWXPay.pay(item, res => {
                if (!WxPayResult[res.status]) {
                    this.$router.finish()
                    this.$router.open({
                        name: 'order.finish',
                        navShow: true,
                        navTitle: '支付成功',
                        params: {
                            content: '已支付所需费用',
                            button: '回到首页',
                            pic: 'bmlocal://assets/order-pay.png'
                        }
                    })
                } else {
                    this.$notice.toast({
                        message: WxPayResult[res.status]
                    })
                }
            })
        }
    },
    components: {
        WxcCell,
        WxcButton,
        BlockList,
        Rater,
        WxcPopup,
        Map,
        // PayMask,
        PlaceInfo,
        WxcDialog,
        PopoverCancel
    }
}
</script>
