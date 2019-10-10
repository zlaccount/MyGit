<style lang="scss">
	page{
		background-color: #f1f1f1
	}
	@mixin list-hover {
		background-color: $uni-bg-color-hover;
	}

	@mixin list-disabled {
		opacity: 0.3;
	}

	$list-cell-pd:$uni-spacing-col-lg $uni-spacing-row-lg;

	.uni-list-cell {
		margin-top: 40upx;
		background-color: #fff;
		font-size: $uni-font-size-lg;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		&--disabled {
			@include list-disabled;
		}

		&--hover {
			@include list-hover;
		}

		&__container {
			padding: $list-cell-pd;
			width: 100%;
			box-sizing: border-box;
			flex: 1;
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			&:after {
				position: absolute;
				z-index: 3;
				right: 0;
				bottom: 0;
				left: 30upx;
				height: 1px;
				content: '';
				-webkit-transform: scaleY(.5);
				transform: scaleY(.5);
				background-color: $uni-border-color;
			}
		}

		&__content {
			flex: 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			&-title {
				font-size: $uni-font-size-lg;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: inherit;
				line-height: 1.5;
				overflow: hidden;
			}

			&-note {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-base;
				white-space: normal;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		&__extra {
			width: 25%;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
		}

		&__icon {
			margin-right: 18upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			&-img {
				height: $uni-img-size-base;
				width: $uni-img-size-base;
			}
		}
	}

	.uni-list>.uni-list-cell:last-child .uni-list-cell-container:after {
		height: 0px;
	}
</style>

<template>
	<view>
		<view v-if="parameter=='phone'">
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" @click="area" style="width: 100%;">{{areaCode}}</view>
							</view>
							<view style="width: 40%;text-align: right;">
								<input maxlength="11" v-model="phone" type="digit" placeholder="请输入手机号码" class="uni-list-cell__content-title grace-items msg "></input>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-rows grace-items" style="width: 60%; margin-top: 10upx;">
								<view class="uni-list-cell__content-title grace-items title " style="width: 50%;">验证码</view>
								<view class="uni-list-cell__content-title grace-items title " style="width: 50%;">
									<input type="number" maxlength="6" v-model="verifyCode" @confirm="submint" placeholder="请输入验证码" />
								</view>
							</view>
							<view style="width: 40%;text-align: right;">
								<button type="primary" size="mini" @click="verCodes">{{smsbtn.text}}</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<!--  -->
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" style="width: 100%;">{{title}}</view>
							</view>
						</view>
						<input style="margin-top: 20upx;" v-model="data" @confirm="update" maxlength="64" placeholder="请输入" v-if="title!='修改邮箱'"></input>
						<input style="margin-top: 20upx;" v-model="data" @confirm="update" maxlength="140" v-if="title=='修改邮箱'"
						 placeholder="请输入"></input>
					</view>
				</view>
			</view>
			<!-- <input type="text" v-model="data" :value="data" focus="true" @confirm="update" /> -->
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

	export default {
		data() {
			return {
				title: '',
				data: '',
				url: '',
				parameter: '',
				// 验证码
				phone: '',
				areaCode: '86',
				verifyCode: '',
				smsbtn: {
					text: '获取验证码',
					status: false,
					codeTime: 60
				},
				timerId: null,

			};
		},
		methods: {
			 checkEmail(str) {
				let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
				if (re.test(str)) {
					return false ;
				} else {
					return true;
				}
			},
			area() {
				uni.showActionSheet({
					itemList: ['大陆', '香港'],
					success: (res) => {
						if (res.tapIndex == 0) {
							this.areaCode = '86'
						} else {
							this.areaCode = '852'
						}
					},
				})
			},
			submint() {
				console.log("修改手机号")
				if (this.verify(1)) {
					return;
				}
				let model = {
					areaCode: String(this.areaCode),
					phone: String(this.phone),
					verifyCode: String(this.verifyCode)
				};
				this.$http.post('/idea/api/user/updatePhone', model).then(e => {
					if (e.code == '0000') {
						uni.navigateBack({
							delta: 1
						});
					} else {
						this.$util.WU.toast(e.msg);
					}
				})
			},
			verCodes() {
				if (this.verify()) {
					return;
				}
				let model = {
					areaCode: String(this.areaCode),
					phone: String(this.phone)
				};

				if (this.smsbtn.text !== '获取验证码') {
					return;
				} else {
					this.$http.post('/idea/api/verifyCode/send', model).then(e => {
						if (e.code == '0000') {
							this.timerId = setInterval(() => {
									var codeTime = this.smsbtn.codeTime;
									codeTime--;
									this.smsbtn.codeTime = codeTime;
									this.smsbtn.text = codeTime + "S";
									if (codeTime < 1) {
										clearInterval(this.timerId);
										this.smsbtn.text = "重新获取";
										this.smsbtn.codeTime = 60;
										this.smsbtn.status = false;
									}
								},
								1000);
						} else {
							this.$at.toast(e.msg);
						}
					})
				}
				return false;
			},
			verify(mark) {
				if (this.$util.WU.isEmpty(this.phone)) {
					this.$util.WU.toast("手机号不可为空")
					return true;
				}
				let length = this.phone.length;
				if (this.areaCode == '852' && length != 8) {
					this.$util.WU.toast("手机号码格式错误");
					return true;
				} else if (length != 11 && this.areaCode == '86') {
					this.$util.WU.toast("手机号码格式错误");
					return true;
				}
				if (mark == 1) {
					if (this.$util.WU.isEmpty(this.verifyCode)) {
						this.$util.WU.toast("验证码不可为空");
						return true;
					}
				}

				return false;
			},
			update() {
				// 参数转为对象key
				let parStr = String(this.parameter);
				let data = String(this.data);
				if(this.$at.isEmpty(data)){
					this.$util.WU.toast("不可为空")
					return;
				}
				if (parStr == 'name' && data.length > 10) {
					this.$util.WU.toast("姓名不可超过10个字")
					return;
				}
				if (parStr == 'company' && data.length > 30) {
					this.$util.WU.toast("公司不可超过30个字")
					return;
				}
				if (parStr == 'email' && data.length > 64) {
					this.$util.WU.toast("邮箱不可超过64个字")
					return;
				}
				if (parStr == 'email' && this.checkEmail(data)) {
					this.$util.WU.toast("请输入正确的邮箱格式")
					return;
				}
				let par = '{' + this.parameter + ':"' + this.data + '"}';
				let obj = eval("(" + par + ")")
				this.$http.post(this.url, obj).then(e => {
					if (e.code = '0000') {
						uni.navigateBack({
							delta: 1
						});
					} else {
						this.$util.WU.toast(e.msg)
					}
				})
			}
		},
		onLoad(e) {
			this.title = e.title
			if (this.$at.isEmpty) {
				e.data = ''
			}
			this.data = e.data
			this.url = e.url
			this.parameter = String(e.parameter)
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		onNavigationBarButtonTap(e) {
			if (this.parameter == 'phone') {
				this.submint();
			} else {
				this.update();
			}
		}

	}
</script>
