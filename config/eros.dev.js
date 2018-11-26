/**
 * @Author: hopkinson
 * @Date:   2018-04-03T00:34:34+08:00
 * @Last modified by:   hopkinson
 * @Last modified time: 2018-11-25T20:37:17+08:00
 */

// appBoard，mediator 不建议进行修改 如果修改了 也请对应修改
module.exports = {
    'eslint': false,
    'webpackWarnings': false,
    'exports': [
        // appBoard
        'js/config/index.js',
        // mediator
        'js/mediator/index.vue',
        // 主页面
        'js/pages/home/index.vue',
        // 城市选择
        'js/pages/city/choose.vue',
        'js/pages/map/choose.vue',
        // 登录
        'js/pages/login/login.vue',
        // 聊天
        'js/pages/chat/chat.vue',
        'js/pages/chat/messages.vue',
        // 聊天
        'js/pages/setting/setting.vue',
        // 货品信息
        'js/pages/product/detail.vue',
        'js/pages/product/qrcode.vue',
        // 车
        'js/pages/car/vehicles.vue',
        'js/pages/car/choose.vue',
        'js/pages/car/emptyInfo.vue',
        // 其他
        'js/pages/other/tel.vue',
        'js/pages/other/partner.vue',
        'js/pages/other/system.vue',
        'js/pages/other/store.vue',
        'js/pages/other/about.vue',
        'js/pages/other/guide.vue',
        'js/pages/other/agreement.vue',
        // 订单
        'js/pages/order/detail.vue',
        'js/pages/order/record.vue',
        'js/pages/order/wait.vue',
        'js/pages/order/finish.vue',
        // 余额
        'js/pages/money/remaining.vue',
        'js/pages/money/withdraw.vue',
        // 司机
        'js/pages/driver/user.vue',
        // 实名认证
        'js/pages/verified/form.vue',
        'js/pages/verified/finish.vue',
        // user
        'js/pages/user/info.vue',
        'js/pages/user/detail.vue',
        'js/pages/user/avatar.vue',
        'js/pages/user/editName.vue'
    ],
    'alias': {
        'Components': 'js/components',
        'Common': 'js/common',
        'Config': 'js/config',
        'Mixins': 'js/mixins',
        'Const': 'js/const',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils'
    },
    'diff': {
        'pwd': '/Users/yangmingzhe/Work/opensource/eros-diff-folder',
        'proxy': 'https://app.weex-eros.com/source'
    },
    'server': {
        'path': './',
        'port': 8889
    },
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'socketServer': {
        'port': 8890,
        'switch': true
    }
}
