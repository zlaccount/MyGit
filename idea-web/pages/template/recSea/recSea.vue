<template>
	<view>
		<view style="padding: 20rpx;">
			<mSearch :focusDiy="true" backgroundColor="#f1f1f1" placeholder="搜索" :mode="2" button="inside" v-model="seaVal"></mSearch>
			<view v-show="seaVal!=''">
				<view @click="jump(0)" class="padding flex justify-between align-center">
					<view>在个股热度中 搜股票: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
				<view @click="jump(1)" class="padding flex justify-between align-center">
					<view>在个股排名中 搜股票: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
				<view @click="jump(2)" class="padding flex justify-between align-center">
					<view>在行业排名中 搜公司: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
				<view @click="jump(3)" v-show="off == true" class="padding flex justify-between align-center">
					<view>在个人排名中 搜公司: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
				<view @click="jump(4)" class="padding flex justify-between align-center">
					<view>在已关注的研究员中 搜人名: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
				
				<view @click="jump(5)" class="padding flex justify-between align-center">
					<view>在未关注的研究员中 搜人名: {{seaVal}}</view>
					<view class="icon-right"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	export default {
		components: {
			mSearch
		},
		data() {
			return {
				seaVal: '',
				off: false,
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: "搜索"
			})
			// 两种权限  长度3 无个人排名   4 有；
			this.$http.get('/idea/api/rank/rankAuthority').then(e => {
				this.off = e.data.length == 4 ? true : false;
			});
		},
		onUnload() {
			uni.removeStorageSync("seaVal");
		},
		methods: {
			pageStr() {
				return "?cPage=1&&pSize=10";
			},
			jump(mark = 0) {
				uni.setStorageSync("seaVal", this.seaVal);
				switch (mark) {
					case 0:
						uni.navigateTo({
							url: '/pages/component/HM-search/HM-search?mark=2&=&=&queryType=0&selIndex=1'
						})
						break;
					case 1:
						uni.navigateTo({
							url: '/pages/component/HM-search/HM-search?mark=1&=&=&queryType=0&selIndex=0'
						})
						break;
					case 2:
						this.$at.gics = this.seaVal;
						uni.setStorageSync("selIndex", 3);
						uni.switchTab({
							url: '/pages/tabBar/ranking/ranking'
						})
						break;
					case 3:
						this.$at.profit = this.seaVal;
						uni.setStorageSync("selIndex", 2);
						uni.switchTab({
							url: '/pages/tabBar/ranking/ranking'
						})
						break;
					case 4:
							uni.setStorageSync("selIndex",  0 );
							uni.setStorageSync("seaVals", this.seaVal);
							uni.switchTab({
								url: '/pages/tabBar/attention/attention'
							})
						break;
					case 5:
							uni.setStorageSync("selIndex",  1 );
							uni.setStorageSync("seaVals", this.seaVal);
							uni.switchTab({
								url: '/pages/tabBar/attention/attention'
							})
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style>
	@import url('../../../colorui/main.css');
	@import url('../../../colorui/icon.css');

	page {
		background: #FFFFFF;
	}

	.page {
		background: #FFFFFF;
	}
</style>
