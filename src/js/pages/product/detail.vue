<!--
@Author: hopkinson
@Date:   2018-04-06T10:51:00+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T13:55:50+08:00
-->



<!-- 货品信息 -->
<style lang="scss" scoped>
@import 'src/js/css/base';
.cs-detail__tip {
    margin: 20px;
    color: #666;
}
</style>
<template>
<div class="cs-vehicles">
    <!-- 基本信息 -->
    <wxc-cell label="货品类别" :has-arrow="!isView" @wxcCellClicked="handlegoodsType">
        <text slot="title" >{{Params.goodsType | filterDict(dict.goodsType)}}</text>
    </wxc-cell>
    <wxc-cell label="货品重量" :has-arrow="!isView" @wxcCellClicked="handlegoodsWeight">
        <text slot="title" >{{Params.goodsWeight | filterDict(dict.goodsWeight)}}</text>
    </wxc-cell>
    <wxc-cell label="其他要求" :cell-style="setCellStyle" :has-bottom-border="false">
        <textarea class="textarea" :disabled="isView" slot="title" :rows="3" v-model="Params.goodsMemo"></textarea>
    </wxc-cell>
    <!-- 上传图片 -->
    <text class="cs-detail__tip">{{setUploadTip}}</text>
    <c-upload-pic :showUpload="!isView" :maxCount="6" :width="200" :height="200" :src.sync='Params.goodsPhoto' />
    <!-- mask - 类别 -->
    <wxc-mask :show="Show.goodsType" show-close @wxcMaskSetHidden="handleHiddengoodsType">
        <scroller>
            <wxc-radio :list="dict.goodsType" @wxcRadioListChecked="handleChoosegoodsType"></wxc-radio>
        </scroller>
    </wxc-mask>
    <!-- mask - 重量 -->
    <wxc-mask :show="Show.goodsWeight" show-close @wxcMaskSetHidden="handleHiddengoodsWeight">
        <wxc-radio :list="dict.goodsWeight" @wxcRadioListChecked="handleChoosegoodsWeight"></wxc-radio>
    </wxc-mask>
</div>
</template>
<script>
import {
    WxcCell,
    WxcMask,
    WxcRadio
} from 'weex-ui'
import {
    Validator
} from 'Utils/validator'
export default {
    data: () => ({
        Show: {
            goodsType: false,
            goodsWeight: false
        },
        Data: {
            goodsType: {},
            goodsWeight: {}
        },
        Params: {
            goodsType: '',
            goodsWeight: '',
            goodsMemo: '',
            goodsPhoto: ''
        }
    }),
    computed: {
        dict() {
            return this.$storage.getSync('dict')
        },
        isView() {
            return this.Params.fromType && this.Params.fromType.includes('order.detail')
        },
        setUploadTip() {
            return this.isView ? '货品照片' : '上传货品照片（最多6张）'
        }
    },
    eros: {
        beforeAppear(params, options) {
            if (Object.keys(params).length !== 0) {
                this.Params = params
            };
            !this.isView && this.$navigator.setRightItem({
                text: '保存',
                textColor: '#333',
                fontSize: 26
            }, () => {
                this.handleConfirm()
            })
        },
    },
    watch: {
        'Params.goodsType' (val) {
            this.Data.goodsType = this.dict.goodsType.find(item => item.value === val)
        },
        'Params.goodsWeight' (val) {
            this.Data.goodsWeight = this.dict.goodsWeight.find(item => item.value === val)
        },
    },
    methods: {
        handlegoodsType() {
            if (this.isView) {
                return false
            }
            this.Show.goodsType = true
        },
        handleHiddengoodsType() {
            this.Show.goodsType = false
        },
        handlegoodsWeight() {
            if (this.isView) {
                return false
            }
            this.Show.goodsWeight = true
        },
        handleHiddengoodsWeight() {
            this.Show.goodsWeight = false
        },
        // 关闭 - 类别
        handleChoosegoodsType(e) {
            this.Params.goodsType = e.value
            setTimeout(() => {
                this.handleHiddengoodsType()
            }, 300)
        },
        // 关闭 - 重量
        handleChoosegoodsWeight(e) {
            this.Params.goodsWeight = e.value
            setTimeout(() => {
                this.handleHiddengoodsWeight()
            }, 300)
        },
        // 确认提交
        handleConfirm() {
            let errorMsg = this.validator()
            if (errorMsg) {
                this.$notice.toast({
                    message: errorMsg
                })
                return false
            }
            this.$router.setBackParams({
                ...this.Params,
                fromType: 'product.detail'
            })
            setTimeout(() => {
                this.$router.back()
                this.$tools.resignKeyboard()
            }, 400)
        },
        validator() {
            let validator = new Validator()
            validator.add(this.Params.goodsType, [{
                strategy: 'isNonEmpty',
                errorMsg: '商品类别不能为空！'
            }])
            validator.add(this.Params.goodsgoodsWeight, [{
                strategy: 'isNonEmpty',
                errorMsg: '商品重量不能为空！'
            }])
            var errorMsg = validator.start() // 获得效验结果
            return errorMsg // 返回效验结果
        }
    },
    components: {
        WxcCell,
        WxcMask,
        WxcRadio
    }
}
</script>
