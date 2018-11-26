<style lang="scss" scoped>
@import 'src/js/css/base';
.spread {
    justify-content: space-between;
    padding: 10px;
}
.cs-qoute__center {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
}
.cs-qoute--money {
    font-size: 60px;
}
</style>
<template>
<div>
    <wxc-mask show-close duration="150" :show="show" @wxcMaskSetHidden="wxcMaskSetHidden">
        <block-list :data="data" hideRight :hasArrow="false">
            <c-icon slot="value" value="&#xe69b;" @click="handleSendMess" size="60" class="cs-detail--icon"></c-icon>
        </block-list>
        <c-slider :data="data.carPhoto"></c-slider>
        <div class="cs-qoute__center">
            <text>报价：</text>
            <text class="cs-qoute--money">{{data.racePrice | filterMoney}}</text>
        </div>
        <div class="row spread">
            <wxc-button text="拒绝" size="big" type="white" @wxcButtonClicked="handleReject"></wxc-button>
            <wxc-button text="接受" size="big" type="yellow" @wxcButtonClicked="handleAccept"></wxc-button>
        </div>
    </wxc-mask>
</div>
</template>

<script>
import {
    WxcMask,
    WxcButton
} from 'weex-ui'
import BlockList from 'Pages/driver/components/BlockList'
export default {
    components: {
        WxcMask,
        WxcButton,
        BlockList
    },
    data: () => ({

    }),
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object
        }
    },
    methods: {
        wxcMaskSetHidden() {
            this.$emit('update:show', false)
        },
        handleSendMess() {
            this.$emit('chat', this.data)
        },
        handleReject() {
            this.$emit('reject', this.data)
        },
        handleAccept() {
            this.$emit('accept', this.data)
        }
    }
};
</script>
