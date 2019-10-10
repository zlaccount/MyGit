<script>
import Vue from 'vue';
import http from '@/common/http/';
export default {
	onLaunch: function() {
		Vue.prototype.ColorList = [
			{
				title: '嫣红',
				name: 'red',
				color: '#e54d42'
			},
			
			{
				title: '桔橙',
				name: 'orange',
				color: '#f37b1d'
			},
			{
				title: '明黄',
				name: 'yellow',
				color: '#fbbd08'
			},
			{
				title: '橄榄',
				name: 'olive',
				color: '#8dc63f'
			},
			{
				title: '森绿',
				name: 'green',
				color: '#39b54a'
			},
			{
				title: '天青',
				name: 'cyan',
				color: '#1cbbb4'
			},
			{
				title: '海蓝',
				name: 'blue',
				color: '#0081ff'
			},
			{
				title: '姹紫',
				name: 'purple',
				color: '#6739b6'
			},
			{
				title: '木槿',
				name: 'mauve',
				color: '#9c26b0'
			},
			{
				title: '桃粉',
				name: 'pink',
				color: '#e03997'
			},
			{
				title: '棕褐',
				name: 'brown',
				color: '#a5673f'
			},
			{
				title: '玄灰',
				name: 'grey',
				color: '#8799a3'
			},
			{
				title: '草灰',
				name: 'gray',
				color: '#aaaaaa'
			},
			{
				title: '墨黑',
				name: 'black',
				color: '#333333'
			},
			{
				title: '雅白',
				name: 'white',
				color: '#ffffff'
			}
		];
		uni.setStorageSync('mark', true);
		// #ifdef APP-PLUS
		var _this = this;
		plus.runtime.getProperty(plus.runtime.appid, inf => {
			this.$at.version = inf.version;
			console.log('进入请求');
			uni.request({
				url: 'https://kaizen.goldstreamfund.com/upload/appResource/version.json',
				success: e => {
					var data = e.data;
					console.log(this.$at.version + ' 对比：' + data.version);
					console.log(Number(String(data.version).replace(/\./g, '')) > Number(String(this.$at.version).replace(/\./g, '')));
					if (Number(String(data.version).replace(/\./g, '')) > Number(String(this.$at.version).replace(/\./g, ''))) {
						console.log('正在下载');
						uni.downloadFile({
							url: data.wgtUrl,
							success: downloadResult => {
								if (downloadResult.statusCode === 200) {
									plus.runtime.install(
										downloadResult.tempFilePath,
										{
											force: false
										},
										function() {
											_this.$at.showModel('更新提示', data.msg, () => {});
											plus.runtime.restart();
										},
										function(e) {}
									);
								}
							}
						});
					}
				}
			});
		});
		// #endif
	},
	onShow: function() {
		http.post('/idea/api/pushMsg/msgList', { readFlag: '0', fromPlace: 'idea' }).then(s => {
			if (Number(s.totals) == 0) {
				uni.removeTabBarBadge({
					index:4
				})
			} else {
				uni.setTabBarBadge({
					index: 4,
					text: String(s.totals)
				});
			}
		});
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
@import './graceUI/graceUI.css';
@import './common/uni.css';
@import './common/style.css';
@import './common/simplepro.css';
	.filter {
		color: transparent;
		text-shadow: 0 0 60rpx #000;
	}
		.padding-idea {
		padding: 4rpx 20rpx;
	}
.bg-screen {
	background: url('./static/img/switch__easyi.png') no-repeat;
	width: 40upx;
	height: 40upx;
}
.icon-saixuan {
	width: 66upx;
	height: 62upx;
	margin-top: 14upx;
}

.page-wrapper {
	width: 100%;
	height: 100%;
}

.ssz-red {
	color: rgb(247, 92, 89);
	margin-right: 20upx;
}

.ssz-green {
	color: rgb(125, 207, 78);
	margin-left: 20upx;
}
</style>
