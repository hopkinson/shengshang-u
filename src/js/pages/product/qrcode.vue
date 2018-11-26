<!--
@Author: hopkinson
@Date:   2018-04-21T16:43:45+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T11:44:33+08:00
-->



<!-- 二维码 -->
<style lang="css" scoped>
.cs-qrcode{
  justify-content: center;
  align-items: center;
}
.cs-qrcode__name{
  font-size: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.cs-qrcode__tip{
  font-size: 36px;
  color: orange;
}
.cs-qrcode--img{
  border-width: 1px;
  border-style: dotted;
  border-color: #eaeaea;
  background-color: #fff;
  width: 600px;
  height: 600px;
}
</style>
<template>
<div class="cs-qrcode">
    <image class="cs-qrcode--img" :src="Qrcode.pic"></image>
    <text class="cs-qrcode__name">货品二维码</text>
    <text class="cs-qrcode__tip">请将此二维码提供给司机</text>
</div>
</template>
<script>
const qrCodeUrl = 'http://qr.liantu.com/api.php?text='
export default {
    data: () => ({
        Qrcode: {
            pic: ''
        },
        Params: {},
        Timer: {
            status: null
        }
    }),
    eros: {
        beforeAppear(params, options) {
            if (Object.keys(params).length) {
                let result = {
                    goodsQrcode: params.goodsQrcode,
                    orderId: params.orderId
                }
                this.Params = params
                this.Qrcode.pic = qrCodeUrl + encodeURIComponent(JSON.stringify(result))
                this.loadStatus()
            }
        },
        beforeDisappear() {
            clearTimeout(this.Time.status)
        }
    },
    methods: {
        loadStatus() {
            this.$fetch({
                method: 'POST',
                name: '/u/order/statusMonitor',
                data: this.Params
            }).then(data => {
                if (data.change !== '1') {
                    this.Time.status = setTimeout(this.loadStatus, 10)
                } else {
                    this.alertOrder()
                }
            })
        },
        // alert
        alertOrder() {
            this.$notice.alert({
                title: '接货成功',
                message: '车主已经成功扫描二维码',
                okTitle: '好的',
                callback() {
                    this.$router.setBackParams(this.Params)
                    this.$router.back()
                }
            })
        }
    }
}
</script>
