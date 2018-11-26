<template>
<wxc-result type="errorPage" :custom-set="customSet" :show="true" padding-top="232" @wxcResultButtonClicked="wxcResultButtonClicked"></wxc-result>
</template>
<script>
import {
    WxcResult
} from 'weex-ui';
export default {
    components: {
        WxcResult
    },
    eros: {
        beforeAppear(params) {
            if (Object.keys(params).length) {
                this.customSet.errorPage = Object.assign({}, this.customSet.errorPage, params)
            }
        }
    },
    data: () => ({
        customSet: {
            errorPage: {
                button: '',
                content: '',
                pic: ''
            }
        }
    }),
    methods: {
        wxcResultButtonClicked(e) {
            if (!this.customSet.errorPage.orderId) {
                this.$router.open({
                    name: 'home',
                    canBack: false
                })
            } else {
                this.$router.setBackParams(this.customSet.errorPage)
                this.$router.back()
            }
        }
    }
};
</script>
