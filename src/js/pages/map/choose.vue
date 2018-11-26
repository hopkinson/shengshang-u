<!--
@Author: hopkinson
@Date:   2018-04-13T01:34:07+08:00
@Last modified by:   hopkinson
@Last modified time: 2018-11-25T14:30:37+08:00
-->
<style>
.cs-map,
.map {
    flex: 1;
}

.map {
    flex: 1;
}
</style>
<template>
<div class="cs-map">
    <!-- <weex-amap class="map" ref="map" :zoom="zoom" :center="pos" @dragend="dragend">
        <weex-amap-marker :position="pos" :icon="icon">
        </weex-amap-marker>
    </weex-amap> -->
    <web :style="Size" ref="webview" @pagestart="onPageStart" @pagefinish="onPageFinish" :src="`bmlocal://assets/ssumapchoose.html?x=${pos[0]}&y=${pos[1]}&userId=${userToken.userId}`"></web>
</div>
</template>
<script>
import {
    Utils
} from 'weex-ui'
import {
    gaode_android_key,
    gaode_icon
} from 'Const/key'
import cache from 'Mixins/cache'
var amap = weex.requireModule('amap')
export default {
    mixins: [cache],
    data() {
        return {
            icon: gaode_icon,
            pos: [122, 34],
            zoom: 13,
            Size: {
                width: 750,
                height: Utils.env.getPageHeight() - 40
            },
            Show: {
                loading: false
            },
            Type: {}
        };
    },
    eros: {
        beforeAppear(params) {
            if (params.hasOwnProperty('page')) {
                this.Type = params.page
                if (this.Type.readOnly && this.Type.fromType.includes('end')) {
                    this.pos = [params.destinationX, params.destinationY]
                }
                if (this.Type.readOnly && this.Type.fromType.includes('start')) {
                    this.pos = [params.originX, params.originY]
                }
                // 如果 只读 => 不显示右导航条
                if (!this.Type.readOnly) {
                    this.handleGetGEO()
                }
            }
        }
    },
    created() {
        amap.initAmap(gaode_android_key)
    },
    computed: {
        readOnly() {
            return Object.keys(this.Type).length && this.Type.readOnly
        }
    },
    methods: {
        // 获取当前位置
        handleGetGEO() {
            this.$geo.get().then(
                data => {
                    let {
                        locationLng,
                        locationLat
                    } = data
                    this.pos = [locationLng, locationLat]
                },
                error => {
                    this.$notice.toast({
                        message: "获取位置失败"
                    })
                    error()
                }
            )
        },
        onPageStart() {
            this.$notice.loading.show('正在加载中')
        },
        onPageFinish() {
            this.$notice.loading.hide()
            this.$navigator.setRightItem({
                text: '确定地点',
                fontSize: '28',
                textColor: '#333'
            }, () => {
                this.loadPlace((data) => {
                    this.$router.setBackParams({
                        ...data,
                        ...this.Type
                    })
                    this.$router.back()
                })
            })
        },
        // 读取webview存的地理信息
        loadPlace(callback) {
            this.$fetch({
                method: 'POST',
                data: {
                    id: this.userToken.userId
                },
                name: 'sys/map'
            }).then(data => {
                callback(data)
            })
        },
    }
}
</script>
