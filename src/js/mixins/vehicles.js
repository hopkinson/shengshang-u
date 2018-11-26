export default {
    computed: {
        userInfo() {
            return this.$storage.getSync('userInfo')
        }
    },
    methods: {
        // 普通下单用车
        goCarVehicles() {
            let route = {
                1: 'car.vehicles',
                2: 'verified.finish',
                0: 'verified.form'
            }
            this.$router.open({
                name: route[this.userInfo.isVerify],
                params: {
                    orderType: '0'
                }
            })
        },
        // 邀请司机
        goInvite() {
            let route = {
                1: 'car.vehicles',
                2: 'verified.finish',
                0: 'verified.form'
            }
            this.$router.open({
                name: route[this.userInfo.isVerify],
                params: {
                    orderType: '1',
                    type: 'invite.driver',
                    ...this.Data.detail
                }
            })
        }
    }
}
