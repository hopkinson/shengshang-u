<!--
@Author: hopkinson
@Date:   2018-04-06T11:13:42+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-27T12:48:46+08:00
-->



<!-- 用车 & 邀请 -->
<style lang="scss" scoped>
@import 'src/js/css/base';
.cs-vehicles__card {
    margin-top: 20px;
    margin-bottom: 20px;
}
.cs-vehicles__card--input {
    border-bottom-width: 1px;
    border-bottom-color: #eaeaea;
    border-bottom-style: solid;
}
.cs-vehicles__contactsSelf {
    padding: 10 20px;
    border-radius: 20px;
    border-width: 1px;
    border-style: solid;
    border-color: #eaeaea;
}
</style>
<template>
<div class="cs-vehicles">
    <!-- 创建成功 -->
    <wxc-dialog title="创建订单成功" content="请耐心等待司机接单" :show="Show.dialog" single @wxcDialogConfirmBtnClicked="handleSuccessDialog">
    </wxc-dialog>
    <!--  起末位置 -->
    <scroller>
        <div class="cs-vehicles__card">
            <place-info :data="Form"></place-info>
        </div>
        <wxc-cell label="货品信息" :has-arrow="true" @wxcCellClicked="go('product.detail')">
            <text>{{Form.goodsType | filterDict(dict.goodsType)}}</text>
            <text>{{Form.goodsWeight | filterDict(dict.goodsWeight)}}</text>
        </wxc-cell>
        <wxc-checkbox title="是否联系本人" :checked="Form.contactsSelf" :config="setCheckboxStyle" @wxcCheckBoxItemChecked="handleChangeContact"></wxc-checkbox>
        <wxc-cell :cell-style="setCellStyle" v-if="!Form.contactsSelf">
            <input slot="title" placeholder="联系人姓名" class="input" v-model="Form.contactsUserName">
        </wxc-cell>
        <wxc-cell :cell-style="setCellStyle" v-if="!Form.contactsSelf">
            <input slot="title" placeholder="联系人电话" class="input" v-model="Form.contactsMobile">
        </wxc-cell>
        <wxc-cell label="费用预算" v-if="isInviteType">
            <input class="input" type="number" slot="title" v-model="Form.preFee" placeholder="输入费用预算（选填）" />
            <text>元</text>
        </wxc-cell>
        <wxc-checkbox title="是否跟车" :checked="Form.follow" :config="setCheckboxStyle" @wxcCheckBoxItemChecked="handleChangeFollow"></wxc-checkbox>
        <wxc-cell label="跟车人数" v-if="Form.follow">
            <wxc-stepper :default-value="Form.followNum" max="100" min="1" @wxcStepperValueChanged="handleFollowNum"></wxc-stepper>
        </wxc-cell>
        <wxc-cell label="指定车型" :has-arrow="true" @wxcCellClicked="go('car.choose')" v-if="!isInviteType">
            <text>{{Form.preCarType | filterDict(dict.carType)}}</text>
        </wxc-cell>
        <wxc-cell label="其他要求" :has-bottom-border="false">
            <textarea slot="title" class="textarea" :rows="3" v-model="Form.memo" placeholoder="可填写其它要求说明，如：车辆信息"></textarea>
        </wxc-cell>
        <div class="footer-center cs-vehicles__card">
            <wxc-button :text="confirmText" type="yellow" @wxcButtonClicked="handleConfirm"></wxc-button>
        </div>
    </scroller>
</div>
</template>
<script>
import {
    WxcDialog,
    WxcCell,
    WxcGridSelect,
    WxcButton,
    WxcStepper,
    WxcCheckbox
} from 'weex-ui'
import {
    Validator
} from 'Utils/validator'
import PlaceInfo from 'Pages/map/modules/PlaceInfo'
export default {
    data: () => ({
        setCellStyle: {
            height: 'auto'
        },
        setCheckboxStyle: {
            checkedColor: '#666666'
        },
        Show: {
            aboutInvite: false,
            dialog: false
        },
        Data: {
            detail: {}
        },
        Form: {
            orderType: '',
            goodsType: '',
            goodsWeight: '',
            goodsMemo: '',
            goodsPhoto: [],
            contactsSelf: 1,
            contactsUserName: '',
            contactsMobile: '',
            follow: 0,
            followNum: 1,
            preCarType: '',
            originAreaCode: '',
            originDistrict: '',
            originName: '',
            originAddress: '',
            originX: '',
            originY: '',
            destinationAreaCode: '',
            destinationDistrict: '',
            destinationName: '',
            destinationAddress: '',
            destinationX: '',
            destinationY: '',
            driverId: '',
            preFee: '',
            memo: ''
        }
    }),
    eros: {
        beforeAppear(params) {
            if (Object.keys(params).length) {
                // 邀请司机所需参数
                this.Form = Object.assign({}, this.Form, {
                    orderType: params.orderType,
                    driverId: params.driverId
                })
                this.$navigator.setCenterItem({
                    textColor: '#333',
                    text: params.orderType === '1' ? `邀请${params.userName || ''}` : '确定订单'
                })
            }
        },
        beforeBackAppear(params) {
            if (Object.keys(params).length !== 0) {
                // 货品信息 车型选择
                if (['product.detail', 'car.choose'].includes(params.fromType)) {
                    this.Form = Object.assign({}, this.Form, params, {
                        preCarType: params.carType
                    })
                }
                // 2.起点选择
                if (params.fromType.includes('start')) {
                    this.Form = Object.assign({}, this.Form, {
                        originAreaCode: params.areaCode,
                        originDistrict: params.district,
                        originName: params.name,
                        originAddress: params.address,
                        originX: params.x,
                        originY: params.y
                    })
                }
                // 3.终点选择
                if (params.fromType.includes('end')) {
                    this.Form = Object.assign({}, this.Form, {
                        destinationAreaCode: params.areaCode,
                        destinationDistrict: params.district,
                        destinationName: params.name,
                        destinationAddress: params.address,
                        destinationX: params.x,
                        destinationY: params.y
                    })
                }
            }
        }
    },
    computed: {
        dict() {
            return this.$storage.getSync('dict')
        },
        isInviteType() {
            return this.Form.orderType === '1'
        },
        confirmText() {
            return this.isInviteType ? '邀请' : '提交订单'
        }
    },
    methods: {
        // 去往
        go(route, extra) {
            this.$router.open({
                name: route,
                params: {
                    fromType: route + extra,
                    ...this.Form
                }
            })
        },
        handleChangeContact(e) {
            this.Form.contactsSelf = Number(e.checked)
        },
        handleChangeFollow(e) {
            this.Form.follow = Number(e.checked)
        },
        handleFollowNum(e) {
            this.Params.followNum = e.value
        },
        // 提交订单
        handleConfirm() {
            let errorMsg = this.validator()
            if (errorMsg) {
                this.$notice.toast({
                    message: errorMsg
                })
                return false
            }
            this.$notice.loading.show("正在提交中...")
            this.$fetch({
                method: 'POST',
                name: 'u/order/create',
                data: {
                    ...this.Form,
                    goodsPhoto: this.Form.goodsPhoto.join(',')
                }
            }).then(data => {
                this.Show.dialog = true
                this.Data.detail = data
            })
        },
        handleSuccessDialog() {
            this.$notice.loading.hide()
            setTimeout(() => {
                !this.isInviteType ? this.$router.open({
                    name: 'order.wait',
                    params: {
                        ...this.Form,
                        ...this.Data.detail
                    }
                }) : this.$router.open({
                    name: 'order.detail',
                    params: {
                        ...this.Data.detail
                    }
                })
            }, 500)
        },
        // 普通订单 - 用车
        validator() {
            let validator = new Validator()
            validator.add(this.Form.orderType, [{
                strategy: 'isNonEmpty',
                errorMsg: '订单类型不能为空'
            }])
            validator.add(this.Form.originAreaCode, [{
                strategy: 'isNonEmpty',
                errorMsg: '起点不能为空'
            }])
            validator.add(this.Form.destinationAreaCode, [{
                strategy: 'isNonEmpty',
                errorMsg: '终点不能为空'
            }])
            validator.add(this.Form.goodsType + this.Form.goodsWeight, [{
                strategy: 'isNonEmpty',
                errorMsg: '请选择货品信息（货品类别和货品重量）'
            }])
            validator.add(this.Form.contactsSelf, [{
                strategy: 'isNonEmpty',
                errorMsg: '联系人不能为空'
            }])
            validator.add(this.Form.follow, [{
                strategy: 'isNonEmpty',
                errorMsg: '请选择是否跟车'
            }])
            validator.add(this.Form.follow, [{
                strategy: 'isNonEmpty',
                errorMsg: '请选择是否跟车'
            }])
            var errorMsg = validator.start() // 获得效验结果
            return errorMsg // 返回效验结果
        }
    },
    components: {
        WxcCell,
        PlaceInfo,
        WxcDialog,
        WxcCheckbox,
        WxcGridSelect,
        WxcButton,
        WxcStepper
    }
}
</script>
