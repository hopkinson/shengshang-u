<!-- 我的司机 -->
<style lang="css" scoped>
</style>
<template>
<c-scroll-list :emptySet="Empty" @emptyClick="goCarVehicles" emptyType="errorLocation" @refresh="handleRefresh" @loadmore="handleLoadMore" :data="Data.driverList">
    <driver-list slot-scope="props" :data="props.row" @click="handleClick(props.row)"></driver-list>
</c-scroll-list>
</template>
<script>
import vehicles from 'Mixins/vehicles'
export default {
    mixins: [vehicles],
    data: () => ({
        Empty: {
            errorLocation: {
                button: null,
                pic: 'bmlocal://assets/empty-driver.png',
                content: '司机列表为空',
                button: '立刻用车'
            }
        },
        Params: {
            pageNo: '',
            pageSize: 10
        },
        Data: {
            driverList: []
        }
    }),
    watch: {
        Params: {
            handler(val) {
                this.$notice.loading.show('加载司机中...')
                this.$fetch({
                    method: 'POST',
                    name: 'u/mydriver',
                    data: val
                }).then(data => {
                    this.Data.driverList = val.pageNo === 1 ? data.driverList : this.Data.driverList.concat(data.driverList)
                    this.$notice.loading.hide()
                })
            },
            deep: true
        }
    },
    created() {
        this.Params.pageNo = 1
    },
    methods: {
        handleLoadMore() {
            this.Params.pageNo++
        },
        handleRefresh(e) {
            this.Params.pageNo = 1
            e.done()
        },
        handleClick(item) {
            this.$router.open({
                name: 'chat.chat',
                navShow: true,
                navTitle: item.userName,
                params: {
                    otherUserId: item.userId
                }
            })
        }
    },
    components: {

    }
}
</script>
