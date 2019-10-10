<template>
	<view class="content">
		<view class="top"></view>
		<view class="banner">
			<dl>
				<dt><image src="../../static/img/LOGO.png" mode=""></image></dt>
				<dd>金涌神算子</dd>
			</dl>
			<view class="img"><image src="../../static/img/ssz.jpg" mode=""></image></view>
			<view class="tgtit">
				推广链接：
				<text class="tugurl">https://fir.im/hse8</text>
			</view>
			<view class="sharbuttn">
				<view class="btn" @click="save">保存二维码</view>
				<view class="btn" @click="fuzhi('https://fir.im/hse8')">复制推广链接</view>
			</view>

			<!-- <button class="btn" @click="share">分享</button> -->
			<view class="shartitle"><view>分享</view></view>
			<view class="sharapk">
				<view @click="share(0)"><image src="../../static/img/weact.png"></image></view>
				<view @click="share(1)"><image src="../../static/img/shar.png"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			providerList: [],
			sourceLink: 'http://yunzhujiao.cn/bind_pub/index.html',
			type: 0
		};
	},
	onLoad() {
		// #ifdef APP-PLUS
		this.version = plus.runtime.version;
		uni.getProvider({
			service: 'share',
			success: e => {
				let data = [];
				for (let i = 0; i < e.provider.length; i++) {
					switch (e.provider[i]) {
						case 'weixin':
							data.push({
								name: '分享到微信好友',
								id: 'weixin'
							});
							data.push({
								name: '分享到微信朋友圈',
								id: 'weixin',
								type: 'WXSenceTimeline'
							});
							break;
						default:
							break;
					}
				}
				this.providerList = data;
			},
			fail: e => {
				console.log('获取登录通道失败' + JSON.stringify(e));
			}
		});
		// #endif
	},
	methods: {
		fuzhi(text = '') {
			uni.setClipboardData({
				data: text,
				success: function() {
					uni.showModal({
						title: '复制成功',
						content: '内容已复制到粘贴板，可前往其他应用粘贴查看。',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								//console.log('用户点击确定');
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				}
			});
		},
		//复制分享链接
		sharurl() {
			uni.setClipboardData({
				data: 'http://sishuquan.com?id=3228969',
				success: function() {
					console.log('success');
					uni.showModal({
						title: '复制成功',
						content: '内容已复制到粘贴板，可前往其他应用粘贴查看。',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								//console.log('用户点击确定');
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				}
			});
		},
		//保存图片到相册
		save() {
			uni.showActionSheet({
				itemList: ['保存图片到相册'],
				success: () => {
					plus.gallery.save(
						'https://kaizen.goldstreamfund.com//app/banner/1563433257431_head.jpg',
						function() {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							});
						},
						function() {
							uni.showToast({
								title: '保存失败，请重试！',
								icon: 'none'
							});
						}
					);
				}
			});
		},
		share(index) {
			let res = { tapIndex: index };
			if (this.providerList.length === 0) {
				uni.showModal({
					title: '当前环境无分享渠道!',
					showCancel: false
				});
				return;
			}
			let itemList = this.providerList.map(function(value) {
				return value.name;
			});
			if (this.providerList[res.tapIndex].id == 'qq') {
				this.type = 1;
			} else {
				this.type = 0;
			}
			uni.share({
				provider: this.providerList[res.tapIndex].id,
				scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession',
				type: this.type,
				title: '金涌神算子',
				summary: '投资，需要好主意！金涌神算子，是您贡献和发现好主意的地方！点击后请在浏览器中打开下载安装！',
				imageUrl: 'https://kaizen.goldstreamfund.com//app/banner/1563433229119_head.jpg',
				href: 'https://fir.im/hse8',
				success: res => {
					console.log('success:' + JSON.stringify(res));
				},
				fail: e => {
					uni.showModal({
						content: e.errMsg,
						showCancel: false
					});
				}
			});
		},
		openLink() {
			plus.runtime.openWeb(this.sourceLink);
		}
	}
};
</script>

<style>
.tugurl {
	color: #999;
}
.sharbuttn {
	display: flex;
	justify-content: center;
}
.shartitle {
	width: 80%;
	text-align: center;
	margin-left: 10%;
	border-bottom: 1px solid #dddddd;
	position: relative;
	height: 60upx;
}
.tgtit {
	text-align: center;
}
.shartitle view {
	height: 50upx;
	line-height: 50upx;
	font-size: 28upx;
	color: #999;
	width: 120upx;
	margin: 32upx auto;
	position: absolute;
	background: #fff;
	left: 50%;
	margin-left: -60upx;
}
.sharapk {
	display: flex;
	justify-content: center;
	margin: 20upx auto;
}
.sharapk view {
	margin: 40upx;
}
.sharapk view image {
	height: 80upx;
	width: 80upx;
}
.content {
	width: 100%;
	background-color: #ffffff;
}
.top {
	width: 100%;
	height: 400upx;
	background: url(/static/img/banner.png) no-repeat;
	background-size: 100%;
	background-position: center center;
}
.banner {
	width: 100%;
	background-color: #ffffff;
	border-radius: 60upx 60upx 0 0;
	margin-top: -60upx;
}
.banner dl {
	margin-top: -80upx;
}
.banner dl dt {
	text-align: center;
}
.banner dl dt image {
	width: 160upx;
	height: 160upx;
	border-radius: 50%;
}
.banner dl dd {
	text-align: center;
}
.img {
	width: 300upx;
	height: 300upx;
	background-color: red;
	margin: 0 auto;
	margin-top: 60upx;
}
.img image {
	width: 100%;
	height: 100%;
}
.btn {
	width: 260upx;
	height: 60upx;
	line-height: 60upx;
	margin: 0 auto;
	margin-top: 60upx;
	border-radius: 40upx;
	border: 0;
	font-size: 26upx;
	outline: 0;
	background: #33b17b;
	color: #ffffff;
	text-align: center;
}
.bottom {
	width: 100%;
	height: 400upx;
	/* 	background: url(../../static/img/beij.png) no-repeat; */
	background-position: left bottom; /* 设置背景图片位置 */
	background-size: 20%;
}
.bottom ul {
	padding-left: 40upx;
	box-sizing: border-box;
}
.bottom ul li {
	width: 100%;
	height: 60upx;
}
</style>
