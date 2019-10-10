<style>
	page {
		background: #FFFFFF;
	}

	.ssz-card text {
		margin: 20upx;
	}

	.search-box {
		width: 95%;
		display: flex;
		justify-content: space-between;
		border: 1px solid #ddd;
		margin-top: 10px;
		margin: 4%;
		width: 92%;
		box-sizing: border-box;
		border-radius: 50upx;
		padding-bottom: 3upx;
		padding-right: 2upx;
	}

	.hui {
		color: rgba(100, 100, 100, 1)
	}

	.ssz-margin {
		margin: 0 4%;
		width: 92%;
		border-bottom: 1px solid rgba(232, 231, 231, 1);
	}

	.ssz-num {
		font-size: 2em;
	}

	.ssz-bc {
		height: 40upx;
		width: 40upx;
		margin-top: 6upx;
		background-size: 100% 100%;
		background-position: 0% 0%;
		background-repeat: no-repeat;
	}

	.ssz-bc-gz {
		background-image: url("../../../static/img/guanzhu.png");
	}

	.ssz-bc-gz-on {
		background-image: url("../../../static/img/guanzhuon.png");
	}

	.uni-load-more {
		margin-bottom: 100upx !important;
	}


	.segmented-control[data-v-400bab3a] {
		width: 100%;
	}

	.grace-padding {
		padding: 20upx 0;
		width: 100%;
		border-bottom: 1px solid #ddd;
		padding-bottom: 0;
		margin-bottom: 40upx;
	}

	.top-fixed {
		position: fixed;
		width: 100%;
		background: #fff;
		z-index: 9;
	}
</style>

<template>
	<view v-if="loadingPage">
		<mht-loader></mht-loader>
	</view>
	<view v-else>

		<view class="top-fixed">
			<view class="search-box">
				<mSearch :mode="2" placeholder="请输入人名搜索" button="inside" @search="searchs()" v-model="search.user_name"></mSearch>
			</view>
			<view class="grace-padding">
				<uni-segmented-control :current="this.search.follow_flag" :values="items" @clickItem="onClickItem" style-type="text"
				 active-color="#3B62C3"></uni-segmented-control>
			</view>
		</view>
		<view style="height: 250upx;"></view>
		<view class="ssz-margin " v-for="(item , index) in list" :key="item.id">
			<view class="grace-rows grace-space-between">
				<view style="width: 93%;" @click="jump(index)">
					<text style="font-size: 1.2em;">{{item.user_name}}</text>
					<text class="hui" style="margin-left: 20upx;;">{{item.company}}</text>
				</view>
				<view class="ssz-bc ssz-bc-gz" v-show="item.follow_flag=='0'" @click="follow(index)"></view>
				<view class="ssz-bc ssz-bc-gz-on" v-show="item.follow_flag=='1'" @click="follow(index)"></view>
			</view>
			<view class="grace-rows grace-center" style="margin-bottom: 20upx;" @click="jump(index)">
				<view class="grace-columns" style="width: 50%;">
					<text class="ssz-num">
						<text class="ssz-red">{{item.profit_count}}</text>
						:
						<text class="ssz-green">{{item.lose_count}}</text>
					</text>
					<text class="hui">近一年盈亏次数</text>
				</view>
				<view class="grace-columns" style="width: 50%;">
					<text class="ssz-num">
						<text class="ssz-red">{{item.profit_total}}</text>
						:
						<text class="ssz-green">{{item.lose_total}}</text>
					</text>
					<text class="hui">近一年盈亏金额</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	import util from "@/common/util.js";
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import {
		uniCard,
		uniLoadMore
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniCard,
			uniSegmentedControl,
			mhtLoader,
			mSearch,
			uniLoadMore
		},
		computed: {
			searchValue() {
				return this.search.user_name;
			}

		},
		watch: {
			searchValue(e) {
				if (e == '') {
					this.page.cPage = 1
					this.loading = 'loading'
					this.search.user_name = '';
					this.init()
				}
			}
		},
		onReachBottom() {
			this.onReachBottoms();
		},
		data() {
			return {
				current: 0,
				loadingPage: true,
				items: ['我关注的', '未关注的'],
				loading: 'more',
				list: [],
				user: {},
				page: {
					cPage: 1,
					pSize: 60
				},
				search: {
					user_name: "",
					follow_flag: 0
				}
			};
		},
		methods: {
			onReachBottoms() {
				if (this.loading != 'noMore') {
					this.loading = 'loading';
					this.page.cPage++;
					this.init();
				}
			},
			onClickItem(index) {
				if (this.search.follow_flag !== index) {
					this.search.follow_flag = index;
				}
				this.list = []
				this.page.cPage = 1;
				this.loading = 'loading'
				this.search.user_name = ''
				this.init();
			},
			jump(index) {
				this.list[index].analyst = this.list[index].id
				this.list[index].analyst_name = this.list[index].user_name
				uni.setStorageSync('toUser', this.list[index])
				uni.navigateTo({
					url: '/pages/template/toRecommend/toRecommend'
				})
			},
			// 关注
			follow(index) {
				var relut = {
					follow_user_id: this.user.userId,
					followed_user_id: this.list[index].id
				};
				if (this.list[index].follow_flag == 0) {
					this.$http.post('/idea/api/follow/addFollow', relut).then(e => {
						if (e.code == '0000') {
							this.list[index].follow_flag = '1';
							this.list.splice(index, 1);
						}
						util.WU.toast(e.msg)
					})
				} else {
					this.$http.post('/idea/api/follow/cancleFollow', relut).then(e => {
						if (e.code == '0000') {
							this.list[index].follow_flag = '0';
							this.list.splice(index, 1);
						}
						util.WU.toast(e.msg)
					})
				}
			},
			searchs() {
				this.page.cPage = 1
				this.loading = 'loading'
				this.init()
			},
			init() {
				if (this.loading != 'noMore') {
					let url = '';
					let model = {
						user_name: this.search.user_name,
						follow_flag: 0
					}
					if (this.search.follow_flag == 0) {
						url = '/idea/api/follow/myFollowed' + this.pageStr();
						model = {
							user_name: this.search.user_name,
							follow_flag: 1
						}
					} else {
						url = '/idea/api/follow/pageData/' + this.user.userId + this.pageStr()
						model = {
							user_name: this.search.user_name,
							follow_flag: 0
						}
					}
					this.$http.post(url, model).then(e => {
						if (e.data.length > 0) {
							if (this.page.cPage == 1) {
								this.list = []
							}
							e.data.forEach(s => {
								s.follow_flag = this.search.follow_flag == 0 ? 1 : 0;
								s.profit_total = util.WU.reservedDecimal(s.profit_total, 2)
								s.lose_total = util.WU.reservedDecimal(s.lose_total, 2)
								s.company = this.$at.isEmpty(s.company) ? '' : s.company;
								this.list.push(s)
							});
						}
						if (e.data.length < 10) {
							this.loading = 'noMore'
						}
						if (e.data.length == 0 && this.search.user_name != '') {
							this.list = []
							this.loading = 'noMore'
						}
						uni.stopPullDownRefresh();
						this.loadingPage = false;
					})
				}
			},
			pageStr() {
				return "?cPage=" + this.page.cPage + "&&pSize=" + this.page.pSize;
			}
		},

		onLoad() {
			this.user = uni.getStorageSync("user");
			if (this.list.length == 0) {
				this.page.cPage = 1;
				this.init();
			} else {
				this.loading = 'loading'
				this.onReachBottoms();
			}
		},
		onShow() {
			// this.search.user_name
			setTimeout(() => {
				let seaVal = uni.getStorageSync("seaVals");
				let selIndex = uni.getStorageSync("selIndex");
				if (this.$at.isNotEmpty(selIndex) && JSON.stringify(selIndex) != '{}') {
					this.search.follow_flag = Number(selIndex);
				}
				if (this.$at.isNotEmpty(seaVal) && JSON.stringify(seaVal) != '{}') {
					this.search.user_name = seaVal;
					this.searchs();
				}
			}, 500)

		},
		onHide() {
			uni.removeStorageSync("seaVals")
			uni.removeStorageSync("selIndex")
		},
		onUnload() {
			uni.removeStorageSync("seaVals")
			uni.removeStorageSync("selIndex")
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page.cPage = 1;
			this.search.user_name = '';
			this.loading = 'loading'
			this.init();
		}
	}
</script>
