import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/common/http/'
import util from '@/common/util.js'

import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
//设置baseUrl  192.168.0.51:8083   http://121.41.112.100:8099/hyas/    http://kaizen.goldstreamfund.com/
// http.config.baseUrl = "http://192.168.0.199:8083/hyas/"
http.config.baseUrl = "http://kaizen.goldstreamfund.com/"
//设置请求前拦截器
http.interceptor.request = (config) => {
	//添加通用参数 
	config.header = {
		"accessToken":  uni.getStorageSync("user").accessToken,
		"userId": uni.getStorageSync("user").userId
	}
} 
//设置请求结束后拦截器
http.interceptor.response = (response) => {
	// uni.getStorageSync("user").accessToken
	if(response.errMsg =='request:fail'){
		this.$at.toast('权限验证失败，请重新登录。')
		uni.clearStorageSync();
		setTimeout(()=>{
			uni.reLaunch({
				url: '/pages/template/ucenter/register'
			})
		},800)
	}else if (response.data.code == '4003') {
		this.$at.toast('权限验证失败，请重新登录。')
		uni.clearStorageSync();
		setTimeout(()=>{
			uni.reLaunch({
				url: '/pages/template/ucenter/register'
			})
		},800)
	}else{
		return response.data;
	} 
}

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$util = util
// $util 写起来太繁琐了，  $at  等价于 $util.WU 
Vue.prototype.$at = util.WU

App.mpType = 'app'

Vue.directive('draggable', {
	
		    inserted: (el, binding, vnode) => {
		      let triggerDom = document.querySelector(binding.value.trigger)
		      triggerDom.style.cursor = 'move'
		      let bodyDom = document.querySelector(binding.value.body)
		      let pageX = 0
		      let pageY = 0
		      let transformX = 0
		      let transformY = 0
		      let canMove = false
		      const handleMousedown = e => {
		        let transform = /\(.*\)/.exec(bodyDom.style.transform)
		        if (transform) {
		          transform = transform[0].slice(1, transform[0].length - 1)
		          let splitxy = transform.split('px, ')
		          transformX = parseFloat(splitxy[0])
		          transformY = parseFloat(splitxy[1].split('px')[0])
		        }
		        pageX = e.pageX
		        pageY = e.pageY
		        canMove = true
		      }
		      const handleMousemove = e => {
		        let xOffset = e.pageX - pageX + transformX
		        let yOffset = e.pageY - pageY + transformY
		        if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`
		      }
		      const handleMouseup = e => {
		        canMove = false
		      }
		    },
		    update: (el, binding, vnode) => {
		      if (!binding.value.recover) return
		      let bodyDom = document.querySelector(binding.value.body)
		      bodyDom.style.transform = ''
		    }
})


const app = new Vue({
	store,
	...App
})
app.$mount()
