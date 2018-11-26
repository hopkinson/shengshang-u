<!--
@Author: hopkinson
@Date:   2018-04-10T09:10:48+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T13:55:55+08:00
-->



<!--  订单详情 - 待接单 -->
<style lang="css" scoped>
.cs-wait__notice{
  flex-direction: row;
}
.cs-wait__notice--time{
  color: orange;
}
.cs-wait__dirver--img{
  width: 50;
  height: 50;
  margin-right: 20;
}
</style>
<template>
<div>
    <!-- 菜单 -->
    <div class="cs-wait">
        <wxc-cell title="正在通知附近的司机" :cell-style="setNoticeStyle" :has-bottom-border="false">
            <c-icon value="&#xe6bc;" slot="label" size="30"></c-icon>
            <div slot="value" class="cs-wait__notice">
                <text>已等候：</text>
                <timer :data="Data.detail.pushTimeLen"></timer>
            </div>
        </wxc-cell>
        <wxc-cell :title="`${item.userName}：${item.lastMsg}`" @wxcCellClicked="handleClick(item)" has-arrow v-for="item in Data.detail.driverList">
            <image slot="label" :src="item.headImgUrl" class="cs-wait__dirver--img"></image>
        </wxc-cell>
    </div>
    <!-- popover - 取消订单 -->
    <!-- <popover-cancel :show.sync="Show.popover" @change="handleConfirmCancel"></popover-cancel> -->
    <!-- mask - 报价 -->
    <qoute-mask :data="Data.driver" :show.sync="Show.mask" @reject="loadRejectRace" @chat="handleChat" @accept="loadAcceptRace" />
    <!-- dialog - 接受订单 -->
    <wxc-dialog title="你已经接受司机竞价" content="请耐心等待..." :show="Show.dialogAccept" @wxcDialogConfirmBtnClicked="hanldeCloseDialog">
    </wxc-dialog>
    <wxc-dialog title="请确认是否取消订单？" :show="Show.dialogCancel" cancel-text="继续等待" confirm-text="确认取消" @wxcDialogCancelBtnClicked="Show.dialogCancel = false" @wxcDialogConfirmBtnClicked="handleConfirmCancel" />
    <!-- 地图 -->
    <map :geo="Data.geo"></map>
</div>
</template>
<script>
import {
    WxcCell,
    WxcDialog
} from 'weex-ui'
import Map from './modules/Map'
import Timer from './components/Timer'
import QouteMask from './modules/QouteMask'
export default {
    data: () => ({
        Params: {
            orderId: '',
            respMode: 0
        },
        Data: {
            detail: {},
            driver: {}
        },
        Timer: {
            race: null
        },
        Show: {
            mask: false,
            popover: false,
            dialogAccept: false,
            dialogCancel: false
        }
    }),
    eros: {
        beforeAppear(params, options) {
            if (Object.keys(params).length) {
                this.Params.orderId = params.orderId
                this.Data.geo = [params.originX, params.originY]
                this.setRightNav()
            }
        },
        beforeDisappear() {
            clearTimeout(this.Timer.race)
            this.Timer.race = null
        }
    },
    computed: {
        setNoticeStyle() {
            return {
                backgroundColor: '#fcf8e3'
            }
        },
        dict() {
            return this.$storage.getSync('dict')
        }
    },
    watch: {
        Params: {
            handler(val) {
                this.loadRace()
            },
            deep: true
        }
    },
    created() {},
    methods: {
        // 取消订单
        handleConfirmCancel(e) {
            this.$notice.loading.show('正在取消订单')
            this.$fetch({
                method: 'POST',
                name: 'u/order/cancel',
                data: {
                    ...this.Params
                    // resonType: e.value
                }
            }).then(data => {
                this.$notice.loading.hide()
                this.$notice.toast({
                    message: '成功取消订单'
                })
                this.$router.open({
                    name: 'home',
                    canBack: false
                })
            })
        },
        // 取消订单 => 显示popover
        handleCancelOrder() {
            // this.Show.popover = true
            this.Show.dialogCancel = true
        },
        // 为右边设置导航菜单
        setRightNav() {
            this.$navigator.setRightItem({
                text: '取消订单',
                textColor: '#333',
                fontSize: 28
            }, () => {
                this.handleCancelOrder()
            })
        },
        // 点击司机列表
        handleClick(item) {
            this.Data.driver = item
            this.Show.mask = true
        },
        // 聊天
        handleChat(item) {
            this.$router.open({
                name: 'chat.chat',
                navShow: true,
                navTitle: item.userName,
                params: {
                    otherUserId: item.driverId
                }
            })
        },
        // 订单竞价信息查询接口
        loadRace() {
            this.$fetch({
                method: 'POST',
                name: 'u/order/race/list',
                data: this.Params
            }).then(data => {
                this.$set(this.Data, 'detail', data)
                this.Timer.race = setTimeout(this.loadRace, 1000)
            })
        },
        // 接受司机竞价接口
        loadAcceptRace(item) {
            this.$fetch({
                method: 'POST',
                name: 'u/order/race/accept',
                data: {
                    ...this.Params,
                    driverId: item.driverId
                }
            }).then(data => {
                this.Show.dialogAccept = true
            })
        },
        // 接受司机竞价
        hanldeCloseDialog() {
            this.$router.open({
                name: 'order.detail',
                params: this.Params
            })
        },
        // 接受司机竞价接口
        loadRejectRace(item) {
            this.$fetch({
                method: 'POST',
                name: 'u/order/race/refuse',
                data: {
                    ...this.Params,
                    driverId: item.driverId
                }
            }).then(data => {
                this.$notice.toast({
                    message: '你已经拒绝了司机竞价'
                })
                this.$router.open({
                    canBack: false,
                    name: 'home'
                })
            })
        },
    },
    components: {
        WxcCell,
        Timer,
        WxcDialog,
        Map,
        QouteMask
        // PopoverCancel
    }
}
</script>
