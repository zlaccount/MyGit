<template>
	<view class="s-page-wrapper is-100vh hie">
		<view  style="margin: 50upx 0; width: 100%;">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../../../static/img/titleicon.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="registercontent">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="text" v-model="user.userAccount" maxlength="11" placeholder="请输入您登录使用的账户名" class="is-input1 " />
				</view>
				<view class=" has-mgtb-10 ">
					<input type="number" v-model="user.phone" maxlength="11" placeholder="请输入手机号" class="is-input1 " />
				</view>
				<view class=" has-mgtb-10 ">
					<input type="number" v-model="user.verifyCode" maxlength="6" placeholder="短信验证码" class="is-input1 " />
					<view class="codeimg" @tap="getsmscode">{{smsbtn.text}}</view>
				</view>

				<view class=" has-radius has-mgtb-10">
					<input placeholder="请输入密码" :password="true" v-model="user.password" class="is-input1" />
				</view>
				<view class=" registerbtn has-radius has-mgtb-20">
					<button @click="submint" style="background-color: rgb(59, 98, 195);">注册</button>
				</view>
			</view>
		</view>
		<view class="is-20vh has-mgt-80">
			<navigator url="#" class=" has-radius is-center is-grey " hover-class="">
				<!-- <text>注册即表示同意</text><text class="is-blue">《用户协议》</text> -->
				<text>已有账户？</text><text class="is-blue" @click="login">点我登录</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					userName: '',//用户名
					verifyCode:'',//验证码
					password: '',//密码
					phone: '',//手机号码
					userAccount:'',//用户账户
					areaCode:'' //区号
				},
				phone: '',
				smsbtn: {
					text: '获取验证码',
					status: false,
					codeTime: 60
				},
				timerId: null,
			};
		},
		methods: {
			login() {
				uni.navigateBack({
					delta: 1
				});
			},
			submint() {
				
				if (this.$at.isEmpty(this.user.userAccount)) {
					this.$at.toast('请输入账户名')
					return;
				}
				
				if (this.$at.isEmpty(this.user.phone)) {
					this.$at.toast('请输入手机号码')
					return;
				}
				if (this.$at.isEmpty(this.user.verifyCode)) {
					this.$at.toast('请输入验证码')
					return;
				}
				if (this.$at.isEmpty(this.user.password)) {
					this.$at.toast('请输入密码')
					return;
				}
				this.user.areaCode = String(this.user.areaCode)
				this.$http.post('/idea/api/user/register', this.user).then(e => {
					if(e.code=='0000'){
						this.$at.showModel('提示','注册成功，是否直接登录？',()=>{
							this.$http.post('/idea/api/user/login', {userName:this.user.userAccount,password:this.user.password}).then(e => {
								if (e.code == '0000') {
									if(this.$at.isEmpty(e.data.accessToken) || this.$at.isEmpty(e.data.userId)){
										this.$at.toast("用户名密码错误")
										return;
									}
									this.$http.interceptor.request = (config) => {
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
									this.$at.toast('登录成功')
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/tabBar/recommend/recommend"
										})
									}, 1000)
								} else {
									this.$at.toast(e.msg)
								}
							})
						})
					}else{
						this.$at.toast(e.msg)
					}
				})
			},
			getsmscode: function() {
				if (this.user.phone == '') {
					this.$at.toast('请输入手机号')
					return;
				}
				console.log(' ' + this.user.phone.length)
				this.user.areaCode = 0;
				let length = this.user.phone.length;
				if (length == 8) {
					this.user.areaCode = '852';
				} else if  (length == 11) {
					this.user.areaCode = '86';
				} else {
					this.$at.toast('手机号格式不正确')
					return ;
				}
				if (this.smsbtn.text !== '获取验证码') {
					return;
				}
// 				let model = {
// 					areaCode: String(this.user.areaCode),
// 					phone: String(this.user.phone)
// 				};
				this.$http.post("/idea/api/verifyCode/send", this.user).then(e => {
					this.$at.toast(e.msg)
				})
				this.timerId = setInterval(() => {
						var codeTime = this.smsbtn.codeTime;
						codeTime--;
						this.smsbtn.codeTime = codeTime;
						this.smsbtn.text = codeTime + "S";
						if (codeTime < 1) {
							clearInterval(this.timerId);
							this.smsbtn.text = "获取验证码";
							this.smsbtn.codeTime = 60;
							this.smsbtn.status = false;
						}
					},
					1000);
				return false;
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
		height: 400upx;
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
