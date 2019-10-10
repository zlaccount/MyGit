<template>
	<view>
		<view class="grace-padding bg-white" style="border-bottom:none; margin: 0;">
			<uni-segmented-control :current="this.follow_flag" @clickItem="onClickItems" :values="tabList" style-type="text"
			 active-color="#3B62C3"></uni-segmented-control>
		</view>

		<!-- <view style="margin-right: 20rpx;font-size: 40rpx;" class="flex justify-end"> <text class="icon-question"></text></view> -->
		<view style="margin-right: 20rpx;font-size: 25rpx; padding: 20rpx 0; text-decoration:underline" @click="jumpToUrl" 
			class="text-center flex justify-end text-blue ">  神五是什么？  </view>

		<view class="bg-white">
			<!-- @click="jump(item.point_id)" -->
			<view class="padding border-bottom shadow " v-show="follow_flag == 0" :class="item.point_id == null ? '':'bg-gray'"
			 :key="index" v-for="(item,index) in list"  @click="jump(item.point_id)">
				<view style="width: 100%;" class="flex align-center justify-between">
					<view class="flex-sub ">
						<view :class="'text-'+item.color">{{ item.side  }}</view>
					</view>
					<view class="flex-sub text-center">
						<view class="">{{item.code}}</view>
					</view>
					<view class="flex-sub text-right">
						<view class=" ">{{item.stock_name}}</view>
					</view>
				</view>
				<view class="flex justify-between">
					<view class="text-sm text-gray">推荐日期 {{item.shij}}</view>
					<view class="text-sm text-gray">推荐人 {{item.user_account}}，{{item.company}}</view>
				</view>
			</view>
		</view>
		<view class="" v-show="follow_flag == 1">
			<view class="  " :key="index" v-for="(item,index) in myList" @click="jumpTo(item)">

				<view class="flex text-left align-center justify-between" style="width: 100%;padding: 5rpx 0rpx">
					<view class="flex-sub  text-center " :class="'bg-'+item.color" style="height: 140rpx;line-height: 140rpx;height: 100%; ">{{ item.side  }}</view>
					<view class="flex-sub text-left  bg-white " style="padding: 20rpx; height: 100%; ">
						<view class=" text-cut " style="width: 148rpx;">{{item.company}}</view>
						<view class="">{{item.analyst_name}}</view>
					</view>
					<view class="flex-sub   bg-white" style=" padding: 20rpx;height: 100%; ">
						<view class=" ">{{item.code}}</view>
						<view class=" text-cut " style="width: 148rpx;">{{item.stock_name}}</view>
					</view>
					<view class="flex-sub bg-white " style=" padding: 20rpx;height: 100%;">
						<view class=" ">推荐日期</view>
						<view class=" ">{{item.shij}}</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	import lineChart from "@/components/line-chart.vue"
	import pieChart from "@/components/pie-chart.vue"
	export default {
		components: {
			lineChart,
			pieChart,
			uniSegmentedControl,
		},
		onPullDownRefresh() {
			this.key = new Date().getTime();
			this.init();
		},
		data() {
			return {
				follow_flag: 0,
				tabList: ['神五智能荐股', '关注的分析师最新荐股'],
				key: '',
				current: 0,
				items: ['近三个月', '近一年', '全部'],
				list: [],
				myList: [],
				page: [{
					cPage: 1,
					pSize: '20',
				}, {
					cPage: 1,
					pSize: '20',
				}],
			}
		},
		onReachBottom() {
			console.log("sdsd")
			this.init(1);
		},
		onLoad() {
			this.key = new Date().getTime();
			uni.setNavigationBarTitle({
				title: '神五'
			})
			this.init();
		},
		methods: {
			jumpToUrl(e){
				uni.navigateTo({
					url:'question/question'
				})
			},
			jumpTo(item) {
				let _this = this;
				uni.showActionSheet({
					itemList: ['查看荐股', '查看关注人'],
					success(e) {
						switch (Number(e.tapIndex)) {
							case 0:
								uni.navigateTo({
									url: '/pages/template/toRecommend/recommendDetails/recommendDetails?id=' + item.id
								})
								break;
							case 1:
								if (_this.$at.isEmpty(item.analyst)) {
									_this.$at.toast('未获取到关注人信息~')
									return;
								}
								uni.setStorageSync('toUser', {
									analyst: item.analyst,
									analyst_name: item.analyst_name
								})
								uni.navigateTo({
									url: '/pages/template/toRecommend/toRecommend'
								})
								break;
							default:
								break;
						}
					}
				})
			},
			onClickItems(index) {
				if (this.follow_flag !== index) {
					this.follow_flag = index;
				}
			},
			init(mark = 0) {
				if (mark == 1 && this.follow_flag == 0) { //机器人翻页
					this.page[0].cPage++;
					this.holdingPage(mark)
				}
				if (mark == 1 && this.follow_flag == 1) { //关注翻页
					this.page[1].cPage++;
					this.myPage(mark)
				}
				if (mark == 0) {
					this.page[1].cPage = 1;
					this.page[1].cPage = 1;
					this.myPage(mark)
					this.holdingPage(mark)
				}
			},
			sideToName(e) {
				switch (e) {
					case 'Long':
						return '买入';
					case 'Sell':
						return '平多';
					case 'Short':
						return '卖空';
					case 'Buy Cover':
						return '平空';
					default:
					return '---';

				}
			},
			colorToName(e) {
				switch (e) {
					case 'Long':
						return 'blue';
					case 'Sell':
						return 'green';
					case 'Short':
						return 'red';
					case 'Buy Cover':
						return 'brown';
					default:
					return '---';
				}
			},
			myPage(mark = 0) {
				this.$http.post('idea/api/tradingLog/myFollowedTrading' + this.$at.pageStr(this.page[1]), {}).then(e => {
					e.data.map(s => {
						if (this.$at.isEmpty(s.trade_date)) {
							s.shij = '---'
						} else {
							s.shij = this.$at.dateFtt("yyyy-MM-dd", new Date(s.trade_date));
						}
						s.color = this.colorToName(s.side);
						s.side = this.sideToName(s.side);
						s.company = this.$at.isEmptyTo(s.company, '---');
						s.analyst_name = this.$at.isEmptyTo(s.analyst_name, '---');
						s.code = this.$at.isEmptyTo(s.code, '---');
						s.stock_name = this.$at.isEmptyTo(s.stock_name, '---');
						return s
					})
					if (this.mark == 0) {
						this.myList = e.data;
					} else {
						this.myList = this.myList.concat(e.data)
					}
					if (e.data.length == 0) {
						this.$at.toast('没有更多啦')
						return;
					}
					uni.stopPullDownRefresh();
				})
			},
			holdingPage(mark = 0) {
				this.$http.post('/idea/api/shenFive/holdingPage' + this.$at.pageStr(this.page[0]), {}).then(e => {
					e.data.map(s => {
						if (this.$at.isEmpty(s.trade_date)) {
							s.shij = '---'
						} else {
							s.shij = this.$at.dateFtt("yyyy-MM-dd", new Date(s.trade_date));
						}
						s.color = this.colorToName(s.side);
						s.side = this.sideToName(s.side);
						s.can = s.exposure ? (Number(s.exposure) * 100).toFixed(2) + '%' : '---';
						return s
					})
					if (this.mark == 0) {
						this.list = e.data;
					} else {
						this.list = this.list.concat(e.data)
					}
					if (e.data.length == 0) {
						this.$at.toast('没有更多啦')
						return;
					}
					uni.stopPullDownRefresh();
				})
			},
			jump(index) {
				if (this.$at.isEmpty(index)) {
					return;
				} else {
					uni.navigateTo({
						url: './point/point?id=' + index
					})
				}
			},

		}
	}
</script>

<style>
	@import url("../../../colorui/main.css");
	@import url("../../../colorui/icon.css");

	.shadow-blur-diy {
		color: #666 !important;
		box-shadow: 6rpx 6rpx 48rpx rgba(0, 102, 204, 0.2) !important;
	}

	.grace-padding {
		padding: 20upx 0;
		width: 100%;
		border-bottom: 1px solid #ddd;
		padding-bottom: 0;
		margin-bottom: 40upx;
	}
</style>
