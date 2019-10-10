<template>
	<view>
		<cu-custom >
			<block slot="content"><text style="color: #fff;">我</text></block>
			<block slot="right">
				<view @click="jumpBadge" style="padding: 20rpx 50rpx;">
					<view class="badge" style="top: 6vw;right: 4vw;" v-if="topBadge">{{ topBadge }}</view>
					<image src="/static/img/xiaoxi.png" mode="aspectFill" style="width: 40upx;height: 40upx;"></image>
				</view>
			</block>
		</cu-custom>
		<!-- <view class="popup-content ">
			<view class="flex justify-between padding align-center">
				<view style="width: 20upx;"></view>
				<view style="color: #FFFFFF; font-weight: 700;font-size: 32upx;">我</view>
				<view>
					<view @click="jumpBadge">
						<view class="badge" v-if="topBadge">{{ topBadge }}</view>
						<image src="/static/img/xiaoxi.png" mode="aspectFill" style="width: 40upx;height: 40upx;"></image>
					</view>
				</view>
			</view>
			 <view class="flex justify-between">
				<view style="width: 40upx;"></view>
				<view>我</view>
				<view>132</view>
			</view> 
		</view> -->

		<view style="height: 130upx;background-color: #3b62c3;"></view>
		<view v-if="loading">
			<mht-loader></mht-loader>
		</view>
		<view class="">
			<view class="headers" v-bind:class="{ status: isH5Plus }" @click="toUserinfo">
				<view class="userinfo">
					<view class="face">
						<image :src="userinfo.face"></image>
					</view>
					<view class="info">
						<view class="username">{{ userinfo.username }}</view>
						<view class="integral uni-ellipsis" style="max-width: 200upx ;display: block;" v-show="userinfo.company">{{ userinfo.company }}</view>
						<view class="integral" v-show="userinfo.phone">{{ userinfo.phone }}</view>
					</view>
				</view>
				<view class="setting">
					<image src="../../../static/HM-PersonalCenter/setting.png"></image>
				</view>
			</view>
			<view class="orders" style="margin-top: -2upx;">
				<view class="box">
					<view class="label " v-for="(row, index) in orderTypeLise" :key="row.name" hover-class="hover" @click="jump(index)">
						<view class="icon">
							<view v-if="index < 2">
								<view class="badge" v-if="row.badge">{{ row.badge }}</view>
								<image :src="'../../../static/HM-PersonalCenter/' + row.icon"></image>
							</view>
							<view v-else>
								<view style="font-size: 52upx;margin: -18upx 0;" :class="['icon-' + row.icon, 'text-' + row.color]"></view>
							</view>
						</view>
						<view style="width: 100%;text-align: center;font-size: 26upx;">{{ row.name }}</view>
					</view>
				</view>
			</view>
			<view class="list" v-for="(list, list_i) in severList" :key="list_i">
				<text class="listTitle">{{ list_i == 0 ? '覆盖行业' : '覆盖股票' }}</text>
				<view class="li" v-for="(li, li_i) in list" v-bind:class="{ noborder: li_i == list.length - 1 }" hover-class="hover"
				 :key="li_i">
					<view class="text">{{ list_i == 0 ? li.name : li.code }}</view>
					<view class="to" v-show="list_i == 1">{{ li.name }}</view>
				</view>
			</view>

			<!-- <view class="fab-box fab rightBottom" @click="shortFnc">
				<view class="badge">2</view>
				<image :class="sortStr == 'DESC' ? 'short-fz' : ''" src="/static/img/xiaoxi.png" mode="aspectFill" style="width: 60upx;height: 60upx;transition: all 1s;"></image>
			</view> -->
		</view>
	</view>
</template>
<script>
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	export default {
		components: {
			mhtLoader
		},
		data() {
			return {
				topBadge: 0,
				loading: true,
				user: {},
				//#ifdef APP-PLUS
				isH5Plus: true,
				//#endif
				//#ifndef APP-PLUS
				isH5Plus: false,
				//#endif
				userinfo: {},
				orderTypeLise: [
					//name-标题 icon-图标 badge-角标
					{
						name: '关注我的',
						icon: 'l1.png',
						color: 'red',
						badge: 0
					},
					{
						name: '我关注的',
						icon: 'l2.png',
						color: 'blue',
						badge: 0
					},
					{
						icon: 'picfill',
						name: '名片',
						color: 'yellow',
						badge: 0
					},
					{
						icon: 'share',
						color: 'orange',
						name: '分享  ',
						badge: 0
					}
				],
				severList: [
					[],
					[]
				]
			};
		},
		onLoad() {
			this.$http.post('/idea/api/pushMsg/msgList', {
				readFlag: '0',
				fromPlace: 'idea'
			}).then(s => {
				this.topBadge = s.totals;
			});
			//加载
			this.init();
		},
		onShow() {
			this.$http.post('/idea/api/pushMsg/msgList', {
				readFlag: '0',
				fromPlace: 'idea'
			}).then(s => {
				this.topBadge = s.totals;
				if (Number(s.totals) == 0) {
					uni.removeTabBarBadge({
						index: 4
					});
				} else {
					uni.setTabBarBadge({
						index: 4,
						text: String(s.totals)
					});
				}
			});

			this.init();
		},
		methods: {
			jumpBadge() {
				uni.navigateTo({
					url: './message/message'
				});
			},
			shortFnc() {},
			jump(index) {
				switch (Number(index)) {
					case 0:
					case 1:
						uni.navigateTo({
							url: 'meAttention/meAttention?mark=' + index
						});
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/template/businessCard/businessCard'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/zhiwen-share/zhiwen-share'
						})
						break;
					default:
						break;
				}
			},
			toUserinfo() {
				uni.navigateTo({
					url: '../../template/userInfo/userInfo'
				});
			},
			init() {
				this.user = uni.getStorageSync('user');
				this.$http.get('/idea/api/user/detail/' + this.user.userId).then(e => {
					//用户信息
					if (e.code == '0000') {
						e = e.data;
						// 设置标题
						e.company = this.$at.isEmpty(e.company) ? '---' : e.company;
						e.phone = this.$at.isEmpty(e.phone) ? '---' : e.phone;
						this.userinfo = {
							face: '../../../static/img/touxiang.png',
							username: e.user_name,
							company: e.company,
							phone: e.phone
						};
						this.orderTypeLise[0].badge = e.followed_count;
						this.orderTypeLise[1].badge = e.follow_count;
						this.severList[0] = [];
						for (var i = 0; i < e.industryGicsList.length; i++) {
							this.severList[0].push({
								name: e.industryGicsList[i]
							});
						}
						this.severList[1] = e.codeList;
					} else {
						uni.showToast({
							title: e.msg,
							icon: 'none'
						});
					}
					this.loading = false;
				});
			}
		}
	};
</script>
<style>
	@import url('../../../colorui/icon.css');
	@import url('../../../colorui/main.css');
</style>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.flex-sub {
		flex: 1;
	}

	.flex {
		display: flex;
	}

	.justify-start {
		justify-content: flex-start;
	}

	.justify-end {
		justify-content: flex-end;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.justify-around {
		justify-content: space-around;
	}

	.headers {
		&.status {
			padding-top: var(--status-bar-height);
		}

		background-color: rgb(59, 98, 195);

		height: 30vw;
		padding: 0 4%;
		display: flex;
		align-items: center;

		.userinfo {
			width: 90%;
			display: flex;

			.face {
				flex-shrink: 0;
				width: 15vw;
				height: 15vw;

				image {
					width: 100%;
					height: 100%;
					border-radius: 100%;
				}
			}

			.info {
				display: flex;
				flex-flow: wrap;
				padding-left: 30upx;

				.username {
					width: 100%;
					color: #fff;
					font-size: 40upx;
				}

				.integral {
					display: flex;
					align-items: center;
					padding: 0 20upx;
					height: 40upx;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
					font-size: 24upx;
				}
			}
		}

		.setting {
			flex-shrink: 0;
			width: 6vw;
			height: 6vw;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.hover {
		background-color: #eee;
	}

	.orders {
		background-color: rgb(59, 98, 195);

		height: 11vw;
		padding: 0 4%;
		margin-bottom: calc(11vw + 40upx);
		display: flex;
		align-items: flex-start;
		border-radius: 0 0 100% 100%;

		.box {
			width: 98%;
			padding: 0 1%;
			height: 22vw;
			background-color: #fefefe;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			margin-bottom: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.label {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-flow: wrap;
				width: 100%;
				height: 16vw;
				color: #666666;
				font-size: 26upx;

				.icon {
					position: relative;
					width: 7vw;
					height: 7vw;
					margin: 0 1vw;

					.badge {
						position: absolute;
						width: 4vw;
						height: 4vw;
						background-color: #ec6d2c;
						top: -1vw;
						right: -1vw;
						border-radius: 100%;
						font-size: 20upx;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 10;
					}

					image {
						width: 7vw;
						height: 7vw;
						z-index: 9;
					}
				}
			}
		}
	}

	.list {
		width: 100%;
		border-bottom: solid 26upx #f1f1f1;

		.li {
			height: 100upx;
			padding: 0 4%;
			border-bottom: solid 1upx #e7e7e7;
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0;
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx;
				}
			}

			.text {
				padding-left: 20upx;
				width: 40%;
				color: #666;
			}

			.to {
				flex-shrink: 0;
				text-align: right;
				width: 50%;
				height: 40upx;
				color: #666;
			}
		}
	}
</style>
<style>
	.align-center {
		align-items: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.flex {
		display: flex;
	}

	.padding {
		padding-right: 50upx;
		padding-left: 50upx;
		padding-bottom: 10upx;
	}

	.popup-content {
		position: fixed;
		top: 0;
		z-index: 99;
		background: #3b62c3;
		width: 100%;
		min-width: 100vw;
		transition: all 0.3s ease;
	}

	.badge {
		position: absolute;
		background-color: #ec6d2c;
		top: 11vw;
		right: 4vw;
		border-radius: 100%;
		font-size: 20upx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}
</style>
<style scoped>
	.listTitle {
		padding: 20upx;
		display: block;
		font-size: 30upx;
	}

	.fab-box {
		position: fixed;
		z-index: 999;
	}

	.fab-box.fab.rightBottom {
		right: 0;
		top: 0;
		background-color: rgb(59, 98, 195);
		color: rgb(255, 255, 255);
		width: 100%;
		height: 88upx;
		font-size: 32upx;
	}

	.rightBottom .badge {
		position: absolute;
		width: 4vw;
		height: 4vw;
		background-color: #ec6d2c;
		top: 1vw;
		right: 1vw;
		border-radius: 100%;
		font-size: 20upx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.short-fz {
		transform: rotate(180deg);
	}
</style>
