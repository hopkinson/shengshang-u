/**
 * @Author: hopkinson
 * @Date:   2018-05-21T19:47:56+08:00
 * @Last modified by:   hopkinson
 * @Last modified time: 2018-11-25T20:22:03+08:00
 */



import {sortOut} from 'Utils/utils'
export default {
    data: () => ({
        number: 5,
        timer: null,
        imgUrl: '',
        Show: {
            ad: false,
            first: true
        }
    }),
    methods: {
        // 设备信息
        loadDevice(callback) {
            let {
                deviceId
            } = weex.config.eros
            let {
                deviceModel,
                deviceWidth,
                deviceHeight,
                platform,
                osVersion
            } = weex.config.env
            this.$fetch({
                method: 'POST',
                name: 'device/register',
                data: {
                    clientId: 'U',
                    deviceId: deviceId,
                    deviceModel: deviceModel,
                    deviceWidth: deviceWidth,
                    deviceHeight: deviceHeight,
                    systemModel: platform + osVersion
                },
                ignore: 'all'
            }).then(data => {
                //  写入存储
                this.$storage.setSync('device', data)
                callback()
            })
        },
        // 获取个人信息
        loadUserInfo(callback) {
            this.$fetch({
                method: 'POST',
                name: 'user/info'
            }).then(data => {
                //  写入存储
                // 4.保存信息 并 跳转
                let userInfo = Object.assign({}, data)
                this.$storage.set('userInfo', userInfo)
                callback(userInfo)
            })
        },
        // 隐式登录
        login() {
            this.$fetch({
                method: 'POST',
                name: 'user/login'
            }).then(data => {
                //  用户存储到本地
                this.$storage.set('userToken', data)
            })
        },
        // 数据字典
        loadDict() {
            this.$fetch({
                method: 'POST',
                name: 'sys/dict/list',
                ignore: ['userId', 'token']
            }).then(data => {
                let sorted_dict = sortOut(data.dictList, 'type')
                this.$storage.setSync('dict', sorted_dict)
                let {dictList} = data
                // 2. 货主端广告
                this.imgUrl = dictList.find(item => item.type === 'startPage-U').extVariable.url
            })
        }
    }
}
