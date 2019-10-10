<template>
	<view>
		<view class="padding-left padding-right padding-top border-bottom shadow " v-for="(item,index) in list" :key="index">
			<view style="width: 100%;" class="flex align-center justify-between">
				<view class="flex-sub">
					<view class="text-blue ">{{item.code}}</view>
					<view class=" ">{{item.stock_name?item.stock_name:'---'}}</view>
				</view>
				<view class="flex-sub text-left">
					<view class="text-blue text-left">{{item.side}}</view>
					<view class=" text-left">方向</view>
				</view>
				
				<view class="text-right flex-sub">
					<view class=" ">{{item.date}}</view>
					<view class=" ">交易日期</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: {
					cPage: 1,
					pSize: 50
				},
				list: []
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '持仓历史'
			})
			this.init();
		},
		onReachBottom() {
			this.init(1);
		},
		methods: {
			init(mark = 0) {
				if (mark == 1) {
					this.page.cPage++;
				}
				uni.showLoading({
					title: '加载中...'
				})
				this.$http.post('/idea/api/shenFive/tradingData' + this.$at.pageStr(this.page), {}).then(e => {
					if (e.data.length == 0) {
						this.$at.toast('到底啦')
					}
					e.data.forEach(s => {
						s.date = String(s.date).substring(0, 10)
						this.list.push(s);
					})
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style>
	@import url("../../../../colorui/main.css");
	@import url("../../../../colorui/icon.css");

	page {
		background: #FFFFFF;
	}
</style>
