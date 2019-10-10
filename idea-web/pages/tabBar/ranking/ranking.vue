<style scoped>
	.fab-box {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.fab-box.fab.rightBottom {
		right: 30upx;
		bottom: 100upx;
	}

	.short-fz {
		transform: rotate(180deg);
	}
</style>
<style>
	@import url('../../../colorui/main.css');
	@import url('../../../colorui/icon.css');

	.list-title {
		background-color: #ffffff;
		color: #000000;
	}

	page {
		background-color: #fff;
	}

	.grace-items uni-button {
		font-size: 24upx;
		margin-top: 10upx;
	}

	.grace-rows {
		margin-top: 20upx;
	}

	.uni-input {
		background: none;
	}

	.list-search {}

	.list-search input {}

	.item-radius {
		margin-bottom: 10upx;
		border-bottom: 2upx solid rgb(167, 179, 182);
		width: 100%;
		border-radius: 15upx;
		color: rgb(167, 179, 182);
		font-size: 28upx;
	}

	.item-radius text {
		margin-left: 1em;
	}

	.grace-search-icon {
		width: 80upx;
		height: 80upx;
		line-height: 80upx;
	}

	.listTitle {
		padding: 0 20upx;
		display: block;
		font-size: 30upx;
	}

	.segmented-control[data-v-400bab3a] {
		width: 100%;
	}

	.grace-padding {
		padding: 20upx 0;
		width: 100%;
		border-bottom: 1px solid #ddd;
		padding-bottom: 0;
	}

	.uni-list-cell__content-note[data-v-1a38dfba] {
		color: #666;
	}

	.top-fixed {
		position: fixed;
		width: 100%;
		background: #fff;
		z-index: 99;
	}

	.c333 {
		color: #333 !important;
		font-size: 32upx;
	}
</style>
<template>
	<view v-if="loadingPage">
		<mht-loader></mht-loader>
	</view>
	<view v-else class="page-wrapper">
		<view class="top-fixed">
			<view class="grace-padding">
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#3B62C3"></uni-segmented-control>
			</view>
			<view class="flex justify-between text-center" style="margin-top: 40upx;">
				<view style="width: 50%;">
					<picker mode="date" @change="selectData">
						<button class="cu-btn round shadow  " style="color: #fff;background-color: #f37b1d;">
							{{ seldata[current].start_date == '' ? '开始时间' : seldata[current].start_date }}
						</button>
					</picker>
				</view>
				<view style="width: 50%;">
					<picker mode="date" @change="selectDatas">
						<button class="cu-btn round shadow  " style="color: #fff;background-color:#f37b1d;">
							{{ seldata[current].end_date == '' ? '结束时间' : seldata[current].end_date }}
						</button>
					</picker>
				</view>
			</view>
		</view>
		<view style="height: 200upx;"></view>
		<view class="content">
			<view class="c-top1" v-show="currentName === '行业排名'">
				<view class="grace-padding">
					<uni-list>
						<uni-list-item v-for="(item, index) in gics.list" :key="index" show-arrow="false" :title="item.industry_gics"
						 :msg="'盈利金额：' + item.total_result" @click="jump(index)"></uni-list-item>
					</uni-list>
					<view class="grace-padding" v-if="gics.list.length == 0" style="text-align: center;margin: 0 atuo;min-width: 400upx;color: #7F7F7F;border-bottom:none">
						暂无数据
					</view>
				</view>
			</view>
			<view class="c-top2" v-show="currentName === '个股排名'">
				<view class="grace-padding" v-if="rank.name == ''" style="text-align: center;margin: 0 atuo;min-width: 400upx;color: #7F7F7F;border-bottom:none">
					请搜索个股查看排名
				</view>
				<view class="item-body">
					<text class="listTitle">{{ rank.name }}</text>
					<view class="grace-padding" v-if="rank.name != ''">
						<uni-list>
							<uni-list-item v-for="(item, index) in rank.list" :key="index" :title="item.analyst_name" :note="item.company"
							 show-arrow="false" :msg="item.profit_total" :color="item.color" @click="jumpTo(index)"></uni-list-item>
							<uni-load-more :status="rank.loading"></uni-load-more>
						</uni-list>
					</view>
				</view>
			</view>
			<view class="c-top3" v-show="currentName === '个股热度'">
				<view class="item-body">
					<view class="grace-padding">
						<uni-list>
							<uni-list-item class="crib" v-for="(item, index) in hot.list" :key="index" :title="item.title" :note="item.msg"
							 :msg="item.hot" color="#FF0000" show-arrow="false"></uni-list-item>
							<uni-load-more :status="hot.loading"></uni-load-more>
						</uni-list>
					</view>
				</view>
			</view>
			<view class="c-top4" v-show="currentName === '个人排名'">
				<uni-list>
					<uni-list-item v-for="(item, index) in profit.list" :key="index" :title="item.analyst_name" :msg="'盈利金额：' + item.profit_total"
					 :note="item.company" show-arrow="false" @click="jumpTree(index)"></uni-list-item>
					<uni-load-more :status="profit.loading" :content-text="profit.text"></uni-load-more>
					<view class="grace-padding" v-if="profit.list.length == 0" style="text-align: center;margin: 0 atuo;min-width: 400upx;color: #7F7F7F;border-bottom:none">
						暂无数据
					</view>
				</uni-list>
			</view>
		</view>
		<view class="fab-box fab rightBottom" @click="shortFnc">
			<image :class="sortStr == 'DESC' ? 'short-fz' : ''" src="/static/img/icon-test.png" mode="aspectFill" style="width: 80upx;height: 80upx;transition: all 1s;"></image>
		</view>
		<!-- <uni-fab
            :content="content"
            horizontal="right"
            @trigger="trigger"
        ></uni-fab> -->
		<view>
			<!-- <w-picker mode="date" startYear="2000" :defaultVal="defaultVal" @confirm="onConfirm" ref="picker" themeColor="#f00"></w-picker> -->
		</view>
	</view>
</template>

<script>
	import wPicker from '@/components/w-picker/w-picker.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniSegmentedControl,
			uniFab,
			wPicker,
			uniList,
			mhtLoader,
			uniListItem,
			uniLoadMore
		},
		onPullDownRefresh() {
			switch (this.currentName) {
				case '行业排名':
					this.$at.gics = '';
					this.init();
					break;
				case '个股排名':
					this.rank.page.cPage = 1;
					this.rankInit();
					break;
				case '个股热度':
					this.hot.page.cPage = 1;
					this.hotInit();
					break;
				case '个人排名':
					this.$at.profit = '';
					this.profit.page.cPage = 1;
					this.profitInit();
					break;
				default:
					uni.stopPullDownRefresh();
					break;
			}
		},
		onReachBottom() {
			switch (this.currentName) {
				case '个股排名':
					this.rank.loading = 'loading';
					this.rank.page.cPage++;
					this.rankInit();
					break;
				case '个股热度':
					this.hot.loading = 'loading';
					this.hot.page.cPage++;
					this.hotInit();
					break;
				case '个人排名':
					this.profit.loading = 'loading';
					this.profit.page.cPage++;
					this.profitInit();
					break;
				default:
					uni.stopPullDownRefresh();
					break;
			}
		},
		onLoad() {
			this.$http.get('/idea/api/rank/rankAuthority').then(e => {
				this.items = e.data.map(s => s.tab_name);
				this.currentName = this.items[0];
			});
			switch (this.currentName) {
				case '个股排名':
					this.selIndex = 0;
					break;
				case '个股热度':
					this.selIndex = 1;
					break;
				case '个人排名':
					this.selIndex = 2;
					break;
				case '行业排名':
					this.selIndex = 3;
					break;
			}
		},
		onShow() {
			let code1 = uni.getStorageSync('code1');
			let selIndex = uni.getStorageSync('selIndex');
			let code2 = uni.getStorageSync('code2');
			if (this.$at.isNotEmpty(selIndex)) {
				this.onClickItem(Number(selIndex))
				// this.current = Number(selIndex	);
			}
			console.log(this.current + "  " + selIndex);
			this.init();
			if (!this.$at.isEmpty(code1)) {
				this.rank.code = code1.code;
				this.rank.name = code1.name;
				this.rank.list = [];
				this.rankInit();
			}
			if (!this.$at.isEmpty(code2)) {
				this.hot.code = code2.code;
				this.hot.name = code2.name;
				this.hot.list = [];
			}
			this.hotInit();
			this.profitInit();
		},
		onHide() {
			uni.removeStorageSync('code2');
			this.hot.code = '';
			this.hot.name = '';
		},
		data() {
			return {
				draggable: {
					trigger: '#button', // 设置能触发拖动的元素的CSS选择器
					body: '#button' // 设置需要移动的元素的CSS选择器
				},
				dateIndex: 0,
				selIndex: 0,
				seldata: [{
						start_date: '',
						end_date: ''
					},
					{
						start_date: '',
						end_date: ''
					},
					{
						start_date: '',
						end_date: ''
					},
					{
						start_date: '',
						end_date: ''
					}
				],
				content: [{
						iconPath: '/static/img/jieshushijian.png',
						selectedIconPath: '/static/img/jieshushijian.png',
						text: '开始时间',
						active: false
					},
					{
						iconPath: '/static/img/kaishishijian.png',
						selectedIconPath: '/static/img/kaishishijian.png',
						text: '结束时间',
						active: false
					}
				],
				keyGics: '',
				keyword: '',
				loadingPage: true,
				items: ['行业排名', '个股排名', '个股热度'],
				current: 0,
				currentName: '行业排名',
				queryType: 0, //0 近三个月 ， 1 近一年
				gics: {
					list: []
				}, //行业
				rank: {
					code: '',
					list: [],
					name: '',
					page: {
						cPage: 1,
						pSize: 10
					},
					loading: 'more'
				}, //个股排名
				hot: {
					code: '',
					list: [],
					name: '',
					page: {
						cPage: 1,
						pSize: 10
					},
					loading: 'more'
				}, //热度
				profit: {
					text: {
						contentdown: '下拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					},
					code: '',
					list: [],
					name: '',
					page: {
						cPage: 1,
						pSize: 10
					},
					loading: 'more'
				}, //个人排名
				sortStr: 'ASC'
			};
		},
		computed: {
			defaultVal() {
				const date = new Date();
				let yearXb = this.getDate('the') - 2000;
				let yearArr = [2000];
				let year = date.getFullYear();
				let month = date.getMonth();
				let day = date.getDate() - 1;
				let h = date.getHours();
				let m = date.getMinutes();
				let s = date.getSeconds();
				return [yearXb, month, day, h, m, s];
			}
		},
		methods: {
			shortFnc() {
				this.sortStr = this.sortStr == 'ASC' ? 'DESC' : 'ASC';
				this.init();
				this.rankInit();
				this.hotInit();
				this.profitInit();
			},
			getSortStr() {
				return `?sort=` + this.sortStr;
			},
			getAndSortStr(mark) {
				return `&&sort=` + this.sortStr;
			},
			moveHandle() {
				return true;
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				} else if (type === 'the') {}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return Number(`${year}`);
			},
			selectData(e) {
				this.dateIndex = 0;
				this.seldata[this.current].start_date = e.target.value;
				this.onConfirm(e.target.value, this.seldata[this.current].end_date);
			},
			selectDatas(e) {
				this.dateIndex = 1;
				this.seldata[this.current].end_date = e.target.value;
				this.onConfirm(this.seldata[this.current].start_date, e.target.value);
			},
			onConfirm(sd = '', ed = '') {
				switch (this.currentName) {
					case '行业排名':
						this.init(sd, ed);
						break;
					case '个股排名':
						this.rankInit(sd, ed);
						break;
					case '个股热度':
						this.hotInit(sd, ed);
						break;
					case '个人排名':
						this.profitInit(sd, ed);
						break;
				}
			},
			jumpTree(index) {
				uni.setStorageSync('toUser', this.profit.list[index]);
				uni.navigateTo({
					url: '/pages/template/toRecommend/toRecommend'
				});
			},

			jumpTo(index) {
				uni.setStorageSync('toUser', this.rank.list[index]);
				uni.navigateTo({
					url: '/pages/template/toRecommend/toRecommend'
				});
			},
			butClick(e) {
				this.queryType = e;
				this.init();
				this.hotInit();
				this.rankInit();
				this.profitInit();
			},
			jump(index) {
				switch (Number(this.current)) {
					case 0:
						uni.navigateTo({
							url: 'gics/gics?industry_gics=' + this.gics.list[index].industry_gics + '&&queryType=' + this.queryType +
								'&&company=' + this.$at.gics
						});
						break;
					default:
						break;
				}
			},
			init(sd = '', ed = '') {
				// 行业排名
				this.$http
					.post('/idea/api/rank/industryGicsList/' + this.queryType + this.getSortStr(), {
						company: this.$at.gics,
						start_date: sd,
						end_date: ed
					})
					.then(e => {
						if (e.code == '0000') {
							this.gics.list = e.data;
							for (var i = 0; i < e.data.length; i++) {
								e.data[i].total_result = this.$util.WU.reservedDecimalOnAbs(e.data[i].total_result, 2);
							}
						} else {
							this.$util.WU.toast('错误：' + e.msg);
						}
						uni.stopPullDownRefresh();
						this.loadingPage = false;
					});
			},
			// 个人排名
			profitInit(sd = '', ed = '') {
				this.profit.text.contentdown = '下拉显示更多';
				this.$http
					.post('/idea/api/rank/industryGicsRank' + this.$at.pageStr(this.profit.page) + this.getAndSortStr(3), {
						industry_gics: '',
						start_date: this.seldata[3].start_date,
						start_date: sd,
						end_date: ed
					})
					.then(e => {
						if (e.data.length > 0) {
							if (this.profit.page.cPage == 1) {
								this.profit.list = [];
							}
						}
						e.data.forEach(s => {
							s.profit_total = this.$at.isEmpty(s.profit_total) ? '0' : this.$util.WU.reservedDecimalOnAbs(s.profit_total,
								2);
							if (!this.$at.isEmpty(s.analyst_name)) {
								this.profit.list.push(s);
							}
						});
						uni.stopPullDownRefresh();
						if (e.data.length < 10) {
							this.profit.loading = 'noMore';
							return;
						}
						if (e.data.length == 0 && this.profit.page.cPage > 1) {
							this.profit.loading = 'noMore';
							return;
						}
						if (e.data.length == 0) {
							this.profit.list = [];
							this.profit.loading = 'noMore';
							return;
						}
					});
			},
			// 个股热度
			hotInit(sd = '', ed = '') {
				this.$http
					.post('/idea/api/rank/singleStockHot' + this.$at.pageStr(this.hot.page) + this.getAndSortStr(2), {
						code: this.hot.code,
						start_date: sd,
						end_date: ed
					})
					.then(e => {
						if (e.data.length > 0) {
							if (this.hot.page.cPage == 1) {
								this.hot.list = [];
							}
						}
						e.data.forEach(s => {
							s.title = s.stock_name + ` <span style='color:#888;font-size:14px'>(` + s.code + `)</span> `;
							s.msg =
								'买入' +
								`<span style='color:#333'>` +
								s.long_count +
								`</span>` +
								'次  卖空' +
								`<span style='color:#333'>` +
								s.short_count +
								`</span>` +
								'次  交易分析师' +
								`<span style='color:#333'>` +
								s.analyst_count +
								`</span>` +
								'位';
							this.hot.list.push(s);
						});
						uni.stopPullDownRefresh();
						if (e.data.length < 10) {
							this.hot.loading = 'noMore';
							return;
						}
						if (e.data.length == 0 && this.hot.page.cPage > 1) {
							this.hot.loading = 'noMore';
							return;
						}
						if (e.data.length == 0) {
							this.hot.list = [];
							this.hot.loading = 'noMore';
							return;
						}
					});
			},
			// 个股排名
			rankInit(sd = '', ed = '') {
				this.$http
					.post('/idea/api/rank/singleStockRank' + this.$at.pageStr(this.rank.page) + this.getAndSortStr(1), {
						code: String(this.rank.code),
						start_date: sd,
						end_date: ed
					})
					.then(e => {
						if (e.data.length > 0) {
							if (this.rank.page.cPage == 1) {
								this.rank.list = [];
							}
						}
						e.data.forEach(s => {
							s.color = Number(s.profit_total) >= 0 ? 'red' : 'green';
							s.profit_total = this.$at.reservedDecimalOnAbs(s.profit_total * 100, 2) + '%';
							this.rank.list.push(s);
						});
						uni.stopPullDownRefresh();
						if (e.data.length < 10) {
							this.rank.loading = 'noMore';
							return;
						}
						if (e.data.length == 0 && this.rank.page.cPage > 1) {
							this.rank.loading = 'noMore';
							return;
						}
						if (e.data.length == 0) {
							this.rank.list = [];
							this.rank.loading = 'noMore';
							return;
						}
					});
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				this.currentName = this.items[this.current];
				uni.removeStorageSync("selIndex")
			}
		},
		onNavigationBarButtonTap(e) {
			console.log('单击');
			let mark = 0;
			let selIndex = 0;
			switch (this.currentName) {
				case '个股排名':
					mark = 1;
					selIndex = 0;
					break;
				case '个股热度':
					mark = 2;
					selIndex = 1;
					break;
				case '个人排名':
					mark = 4;
					selIndex = 2;
					break;
				case '行业排名':
					mark = 5;
					selIndex = 3;
					break;
			}
			uni.navigateTo({
				url: '../../component/HM-search/HM-search?mark=' + mark + '&&queryType=' + this.queryType + '&&selIndex=' +
					selIndex
			});
		}
	};
</script>
