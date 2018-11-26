<!--
@Author: hopkinson
@Date:   2018-04-13T22:32:13+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T13:51:19+08:00
-->



<!-- 司机列表  -->
<style lang="scss" scoped>
@import 'src/js/css/base';
.cs-dirver {
    flex: 1;
}
.cs-home__hover {
    position: absolute;
    right: 20px;
    bottom: 120px;
}
.cs-navbar__item {
    align-items: center;
    padding: 6px;
}
.cs-navbar__item--text {
    font-size: 26px;
    padding-right: 4px;
}
</style>
<template>
<div class="cs-dirver">
    <c-mini-bar :title="Const.Company.name" textColor="#333" backgroundColor="#ffd000">
        <div slot="right" class="cs-navbar__item row" @click="handleShowSeq">
            <text class="cs-navbar__item--text" @click="handleShowSeq">{{Data.rightNav.title}}</text>
            <wxc-icon :name="setArrow" size="xs" @wxcIconClicked="handleShowSeq"></wxc-icon>
        </div>
        <div slot="left" class="cs-navbar__item row" @click="goCity">
            <text class="cs-navbar__item--text" @click="goCity">{{setTitle}}</text>
            <wxc-icon name="more_unfold" size="xs" @wxcIconClicked="goCity"></wxc-icon>
        </div>
    </c-mini-bar>
    <c-scroll-list :emptySet="Empty" emptyType="errorLocation" @refresh="handleRefresh" @loadmore="handleLoadMore" :data="Data.driverList">
        <driver-list slot-scope="props" :data="props.row" @click="handleClick(props.row)"></driver-list>
    </c-scroll-list>
    <menu-hover class="cs-home__hover" @click="goCarVehicles"></menu-hover>
    <popup-seq :show.sync="Popup.seq" :data="Params.orderBy" :item="Const.OrderBy" @change="handleChangeSequence"></popup-seq>
</div>
</template>
<script>
import {
    OrderBy,
    Company
} from 'Const'
import PopupSeq from './modules/PopupSeq'
import DriverList from './components/BlockList'
import MenuHover from './modules/Hover'
import {
    WxcIcon
} from 'weex-ui'
import {
    unRepeatObject
} from 'Utils/utils'
import cache from 'Mixins/cache'
import vehicles from 'Mixins/vehicles'
export default {
    mixins: [cache, vehicles],
    data: () => ({
        Data: {
            driverList: [],
            rightNav: {}
        },
        Const: {
            OrderBy: OrderBy,
            Company: Company
        },
        Params: {
            areaCode: '',
            orderBy: '',
            pageNo: 1,
            pageSize: 10
        },
        Popup: {
            menu: false,
            city: false,
            seq: false
        },
        Empty: {
            errorLocation: {
                button: null,
                pic: 'bmlocal://assets/empty-driver.png',
                content: '抱歉，附近没有司机'
            }
        },
        User: {},
    }),
    computed: {
        setArrow() {
            return this.Popup.seq ? 'less' : 'more_unfold'
        },
        setTitle() {
            return this.customGeo ? this.customGeo.areaName : ''
        }
    },
    watch: {
        Params: {
            handler(val) {
                this.$notice.loading.show('加载司机中...')
                this.$fetch({
                    method: 'POST',
                    name: 'u/driver/online/list',
                    data: val
                }).then(data => {
                    this.Data.driverList = val.pageNo === 1 ? data.driverList : unRepeatObject(this.Data.driverList.concat(data.driverList), 'id')
                    this.$notice.loading.hide()
                })
            },
            deep: true
        },
        'Params.orderBy' (val) {
            let orderBy = this.Const.OrderBy.find(item => item.value === val)
            this.Data.rightNav = orderBy
        }
    },
    methods: {
        //显示城市
        goCity() {
            this.$router.open({
                name: `city.choose`
            })
        },
        // 改变排序方式
        handleChangeSequence(e) {
            this.Params.orderBy = e.value
            setTimeout(() => {
                this.Popup.seq = false
            }, 500)
        },
        //显示筛选条件
        handleShowSeq() {
            this.Popup.seq = true
        },
        handleClick(item) {
            this.$router.open({
                name: 'car.emptyInfo',
                params: item
            })
        },
        handleLoadMore() {
            this.Params.pageNo++
        },
        handleRefresh(e) {
            this.Params.pageNo = 1
            e.done()
        }
    },
    created() {
        // 用户信息
        this.Params = Object.assign({}, this.Params, {
            areaCode: this.customGeo ? this.customGeo.areaCode : '',
            orderBy: this.Const.OrderBy[0].value
        })
        // 选中排序方式
        this.Const.OrderBy = OrderBy.map(item => {
            return {
                checked: item.value === this.Params.orderBy,
                ...item
            }
        })
    },
    components: {
        DriverList,
        WxcIcon,
        PopupSeq,
        MenuHover
    }
}
</script>
