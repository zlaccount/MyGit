<template>
	<view class="s-page-wrapper is-100vh hie">
		<view style="margin: 100upx 0;">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../../static/img/titleicon.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="registercontent">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="text" v-model="user.userName" placeholder="请输入账户名" class="is-input1 " />
				</view>
				<view class=" has-radius has-mgtb-10">
					<input placeholder="请输入登录密码" v-model="user.password" :password="true" class="is-input1" />
				</view>
				<view class=" registerbtn has-radius has-mgtb-20">
					<button @click="submint" style="background-color: rgb(59, 98, 195);">登 录</button>
				</view>
			</view>
		</view>
		<view class="is-20vh has-mgt-80">
			<navigator url="#" class=" has-radius is-center is-grey " hover-class="">
				<!-- <text>注册即表示同意</text><text class="is-blue">《用户协议》</text> -->
				<text>还没有账户？</text><text class="is-blue" @click="login">点我注册</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import http from '@/common/http/'
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				user: {},
				smsbtn: {
					text: '获取验证码',
					status: false,
					codeTime: 60
				},
				timerId: null,
			};
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen()
			// #endif
			var user = uni.getStorageSync("user")
			console.log(user)
			if(user==null || user==''){
			}else{
				uni.switchTab({url:"/pages/tabBar/recommend/recommend"})
			} 
		},
		methods: {
			submint() {
				if (util.WU.isEmpty(this.user.userName)) {
					util.WU.toast('请输入账户名')
					return;
				}
				if (util.WU.isEmpty(this.user.password)) {
					util.WU.toast('请输入密码')
					return;
				}
				this.$http.post('/idea/api/user/login', this.user).then(e => {
					if (e.code == '0000') {
						if(util.WU.isEmpty(e.data.accessToken) || util.WU.isEmpty(e.data.userId)){
							util.WU.toast("用户名或密码不正确")
							return;
						}
						http.interceptor.request = (config) => {
							//添加通用参数
							config.header = {
								"accessToken": e.data.accessToken,
								"userId": e.data.userId
							}
							uni.setStorageSync('user', {
								"accessToken": e.data.accessToken,
								"userId": e.data.userId
							})
						}
						uni.showToast({
							title: '登录成功'
						})
						setTimeout(() => {
							uni.switchTab({
								url: "../../tabBar/recommend/recommend"
							})
						}, 800)
					} else {
						util.WU.toast("用户名或密码不正确")
					}
				})
			},
			login() {
				uni.navigateTo({
					url: '/pages/template/ucenter/login/login'
				})
			}

		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.hie {
		height: 100%;
		width: 100%;
	}

	.registercontent {
		width: 85%;
		margin: 0 auto;
	}

	.logoimg {
		width: 400upx;
		height: 100upx;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}

	.iconfont {
		position: absolute;
		font-size: 40rpx;
		right: 12%;
		z-index: 999;
		width: 105rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.codeimg {
		position: absolute;
		font-size: 28rpx;
		right: 12%;
		z-index: 999;
		width: 200rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.registerbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #f35;
		opacity: 0.8;
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}
</style>
