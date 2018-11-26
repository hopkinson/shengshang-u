/**
 * @Author: hopkinson
 * @Date:   2018-04-03T00:34:34+08:00
 * @Last modified by:   hopkinson
 * @Last modified time: 2018-11-25T20:37:20+08:00
 */



// 这里的后缀都是 .js 因为打包出来的都是js文件，而不是.vue文件，我们要告诉客户端跳转那个js

//  这里的路径和dev.json路径的区别
//  pages里面配置的是路由跳转的地址，也就是dev生成的 dist文件夹下的js bundle路径 从dist/js开始
//  dev.json 的 exports 需要打包的js地址，填入src的需要被打包成js bundle的地址   从src开始

export default {
    // 登录
    'login': {
        url: '/pages/login/login.js'
    },
    // 聊天
    'chat.chat': {
        title: '',
        url: '/pages/chat/chat.js'
    },
    'chat.messages': {
        title: '我的消息',
        url: '/pages/chat/messages.js'
    },
    // 聊天
    'setting.setting': {
        title: '设置',
        url: '/pages/setting/setting.js'
    },
    // 聊天
    'city.choose': {
        title: '选择城市',
        url: '/pages/city/choose.js'
    },
    // 聊天
    'map.choose': {
        title: '地图',
        url: '/pages/map/choose.js'
    },
    // 货品
    'product.detail': {
        title: '货品信息',
        url: '/pages/product/detail.js'
    },
    'product.qrcode': {
        title: '货品二维码',
        url: '/pages/product/qrcode.js'
    },
    // 主页
    'home': {
        url: '/pages/home/index.js'
    },
    // 合作伙伴
    'other.partner': {
        title: '合作伙伴',
        url: '/pages/other/partner.js'
    },
    // 隐私协议
    'other.agreement': {
        title: '隐私协议',
        url: '/pages/other/agreement.js'
    },
    // 开启定位权限
    'other.guide': {
        title: '开启定位权限',
        url: '/pages/other/guide.js'
    },
    // 投诉
    'other.tel': {
        title: '投诉电话',
        url: '/pages/other/tel.js'
    },
    // 系统通知
    'other.system': {
        title: '系统消息',
        url: '/pages/other/system.js'
    },
    'other.about': {
        title: '关于我们',
        url: '/pages/other/about.js'
    },
    // 实名认证
    'verified.form': {
        title: '实名认证',
        url: '/pages/verified/form.js'
    },
    'verified.finish': {
        title: '提交审核',
        url: '/pages/verified/finish.js'
    },
    'other.store': {
        title: '用户商城',
        url: '/pages/other/store.js'
    },
    // car
    'car.vehicles': {
        title: ' ',
        url: '/pages/car/vehicles.js'
    },
    'car.choose': {
        title: '选择车型',
        url: '/pages/car/choose.js'
    },
    'car.emptyInfo': {
        title: '空车信息',
        url: '/pages/car/emptyInfo.js'
    },
    // user
    'user.messages': {
        title: '我的消息',
        url: '/pages/user/messages.js'
    },
    'driver.user': {
        title: '我的司机',
        url: '/pages/driver/user.js'
    },
    'user.info': {
        title: '个人信息',
        url: '/pages/user/info.js'
    },
    'user.avatar': {
        title: '头像修改',
        url: '/pages/user/avatar.js'
    },
    'user.editName': {
        title: '修改昵称',
        url: '/pages/user/editName.js'
    },
    'user.detail': {
        title: '个人中心',
        url: '/pages/user/editName.js'
    },
    // 余额
    'money.remaining': {
        title: '我的余额',
        url: '/pages/money/remaining.js'
    },
    'money.withdraw': {
        title: '提取现金',
        url: '/pages/money/withdraw.js'
    },
    // order
    'order.finish': {
        title: ' ',
        url: '/pages/order/finish.js'
    },
    'order.detail': {
        title: '订单详情',
        url: '/pages/order/detail.js'
    },
    'order.record': {
        title: '订单记录',
        url: '/pages/order/record.js'
    },
    'order.wait': {
        title: '待接单',
        url: '/pages/order/wait.js'
    }
}
