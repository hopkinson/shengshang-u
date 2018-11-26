<!--
@Author: hopkinson
@Date:   2018-04-08T10:38:06+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T13:46:45+08:00
-->



<style lang="css" scoped>
.mask {
   position: absolute;
   top: 90px;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, .4);
 }

 .modal-top {
   width: 750;
 }
</style>
<template>
<bmmask class="mask" animation="transition" position="top" :duration="300" ref="bmmask" @hide="handleHide">
    <bmpop class="modal-top">
        <wxc-radio :list="item" @wxcRadioListChecked="handleChooseSeq"></wxc-radio>
    </bmpop>
</bmmask>
</template>
<script>
import {
    WxcPopup,
    WxcRadio
} from 'weex-ui'

export default {
    data: () => ({
        text: {}
    }),
    watch: {
        show(val) {
            val ? this.$refs.bmmask.show() : this.$refs.bmmask.hide()
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: String
        },
        item: {
            type: [Array]
        }
    },
    created() {},
    methods: {
        handleClose() {
            this.$emit('update:show', false)
        },
        handleChooseSeq(e) {
            this.$emit('change', e)
            setTimeout(() => {
                this.$emit('update:show', false)
            }, 600)
        },
        handleHide() {
            this.$emit('update:show', false)
        }
    },
    components: {
        WxcPopup,
        WxcRadio
    }
}
</script>
