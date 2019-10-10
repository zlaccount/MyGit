<style>
	@import url('../../../colorui/main.css');
	@import url('../../../colorui/icon.css');

	.search-box {
		background-color: #fff !important;
		display: flex;
		justify-content: space-between;
		border: 1px solid #ddd;
		margin-top: 10px;
		box-sizing: border-box;
		border-radius: 50upx;
		padding-bottom: 3upx;
		padding: 0;
		width: 90%;
		margin-left: 8upx;
	}

	.top-fixed {
		position: fixed;
		width: 94%;
		margin-left: 4%;
		background: #fff;
		z-index: 9;
	}

	.ssz-filter {
		margin-left: 10upx;
		padding-top: 10upx;
		height: 20upx;
	}

	page {
		background: #fff;
	}

	.content {
		background: #fff;
	}
</style>

<template>
	<view class="content">
		<view class="top-fixed ">
			<view class="search-box">
				<!-- mSearch组件 如果使用原样式，删除组件元素-->
				<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange"
				 @confirm="inputChange" v-model="keyword"></mSearch>
			</view>
			<!-- <image  @click="showpop"  src="/static/img/sx.png" mode="aspectFill" class="icon-saixuan"></image>	 -->
		</view>
		<view style="height: 120upx;"></view>
		<view class="search-keyword" @touchstart="blur">
			<view v-show="keyword != ''">
				<uni-list v-show="isShowKeywordList">
					<uni-list-item :note="item.note" @click="jump(index)" v-for="(item, index) in keywordList" :key="index" :title="item.name"
					 :msg="item.code"></uni-list-item>
					<uni-load-more :status="loading"></uni-load-more>
				</uni-list>
			</view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length > 0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
					</view>
					<view class="keyword">
						<view v-for="key in oldKeywordList" @tap="doSearch(key)" :key="key">{{ key }}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<popup-layer ref="popupRef" :direction="'left'">
			<view>
				<view style="margin-left: 10upx;font-size: 25upx;color: #959595">请选择筛选条件</view>
				<uni-list-item @click="selectData(index)" v-for="(item, index) in popLists" :key="index" :title="item.title" :msg="item.msg"></uni-list-item>
				<!-- <view><button @click="submintPop" class="content cu-btn line- round lg shadow" style="width: 90%;margin: 100upx 5%;">确认筛选</button></view> -->
			</view>
		</popup-layer>
		<w-picker mode="date" startYear="2000" :defaultVal="defaultVal" @confirm="onConfirm" ref="picker" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
	var _self;
	//引用mSearch组件，如不需要删除即可
	import wPicker from '@/components/w-picker/w-picker.vue';
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui';
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	export default {
		components: {
			mhtLoader,
			wPicker,
			popupLayer,
			uniList,
			mSearch,
			uniLoadMore,
			uniListItem
		},

		onReachBottom() {
			this.loading = 'loading';
			this.page.cPage++;
			this.pageInit(this.keyword);
		},
		data() {
			return {
				selIndex: '',
				seldata: {
					start_date: '',
					end_date: ''
				},
				dateIndex: 0,
				popLists: [{
						title: '开始时间',
						msg: '请选择',
						mark: 3,
						name: 'start_date'
					},
					{
						title: '结束时间',
						msg: '请选择',
						mark: 3,
						name: 'end_date'
					}
				],
				loading: 'more',
				defaultKeyword: '',
				keyword: '',
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				mark: 0,
				queryType: 0,
				page: {
					cPage: 1,
					pSize: 10
				}
			};
		},
		onLoad(e) {
			_self = this;
			this.selIndex = e.selIndex;
			this.mark = e.mark;
			this.queryType = e.queryType;
			let msg = Number(this.queryType) == 0 ? ' - 近三个月' : ' - 近一年';
			switch (e.mark) {
				case '1':
					uni.setNavigationBarTitle({
						title: '个股排名搜索'
					});
					break;
				case '2':
					uni.setNavigationBarTitle({
						title: '个股热度搜索'
					});
					break;
				case '3':
					uni.setNavigationBarTitle({
						title: '选择个股'
					});
					break;
				case '4':
					uni.setNavigationBarTitle({
						title: '个人排名' + msg
					});
					break;
				case '5':
					uni.setNavigationBarTitle({
						title: '行业排名' + msg
					});
					break;
				default:
					uni.setNavigationBarTitle({
						title: '搜索股票'
					});
					break;

			}
			this.init();
		},
		computed: {
			defaultVal() {
				const date = new Date();
				let yearXb = this.getDate("the") - 2000;
				let yearArr = [2000];
				let year = date.getFullYear();
				let month = date.getMonth();
				let day = date.getDate() - 1;
				let h = date.getHours();
				let m = date.getMinutes();
				let s = date.getSeconds();
				return [yearXb, month, day, h, m, s]
			}
		},
		onUnload() {
			uni.setStorageSync("selIndex", this.selIndex);
		},
		onShow() {
			// keyword
			let seaVal = uni.getStorageSync("seaVal");
			if (this.$at.isNotEmpty(seaVal) && JSON.stringify(seaVal) != '{}') {
				setTimeout(() => {
					this.keyword = seaVal;
					this.doSearch(false);
				}, 500)
			}
		},
		methods: {
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
			onConfirm(e) {
				this.popLists[this.dateIndex].msg = e.result;
				switch (this.dateIndex) {
					case 0:
						this.seldata.start_date = e.result;
						break;
					case 1:
						this.seldata.end_date = e.result;
						break;
					default:
						break;
				}
			},
			showpop() {
				this.$refs.popupRef.show(); // 弹出
			},
			selectData(index) {
				this.dateIndex = index;
				this.$refs.picker.show();
			},
			jump(index) {
				let model = this.keywordList[index];
				// 跳转路由tebar   返回上一页不能带入参数,故存入本地缓存
				uni.setStorageSync('code' + this.mark, model);
				if (this.$at.isNotEmpty(this.selIndex)) {
					uni.setStorageSync("selDate" + this.selIndex, this.seldata);
				}
				console.log(this.selIndex);
				uni.setStorageSync("selIndex", this.selIndex);
				if(this.mark == -1){
					uni.navigateBack({
						delta:1
					})
				}else{
					uni.switchTab({
						url: '/pages/tabBar/ranking/ranking'
					})
				}
			},
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
				this.loadHotKeyword();
			},
			blur() {
				uni.hideKeyboard();
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				if (Number(this.mark) > 3) {
					this.defaultKeyword = '请输入公司名';
				} else {
					this.defaultKeyword = '股票代码/股票名';
				}
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
			},
			//监听输入
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				this.page.cPage = 1;
				if (this.mark < 4) {
					this.pageInit(keyword);
				}
			},
			profitInit(keyword) {
				this.$http
					.post('/idea/api/rank/industryGicsRank' + this.$at.pageStr(this.page), {
						industry_gics: '',
						company: keyword,
						queryType: String(this.queryType)
					})
					.then(e => {
					});
			},
			pageInit(keyword) {
				if (!this.$at.isEmpty(keyword) && keyword != '' && keyword != ' ') {
					this.saveKeyword(keyword); //保存为历史
				}
				this.$http
					.post('/idea/api/tradingLog/getStockCodes' + this.$at.pageStr(this.page), {
						code: keyword
					})
					.then(e => {
						if (e.data.length > 0) {
							if (this.page.cPage == 1) {
								this.keywordList = [];
							}
						}
						e.data.forEach(s => this.keywordList.push(s));
						if (e.data.length < 10) {
							this.loading = 'noMore';
							return;
						}
						if (e.data.length == 0 && this.page.cPage > 1) {
							this.loading = 'noMore';
							return;
						}
						if (e.data.length == 0) {
							this.keywordList = [];
							this.loading = 'noMore';
							return;
						}
						uni.stopPullDownRefresh();
					});
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: res => {
						if (res.confirm) {
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				uni.setStorageSync("selIndex", this.selIndex);
				if (!this.$at.isEmpty(key) && key != '' && key != ' ') {
					this.saveKeyword(key); //保存为历史
				}
				if (key == '股票代码/股票名') {
					this.$at.toast('股票代码/股票名');
				} else if (this.mark == 4) {
					this.$http
						.post('/idea/api/rank/industryGicsRank' + this.$at.pageStr(this.page), {
							industry_gics: '',
							company: key,
							queryType: String(this.queryType)
						})
						.then(e => {
							if (e.data.length == 0) {
								this.$at.toast('暂无数据');
							} else if (e.data.length > 0) {
								this.$at.profit = key;
								uni.setStorageSync("selDate", this.seldata);
								uni.navigateBack({
									delta: 1
								});
							}
						});
				} else if (this.mark == 5) {
					this.$at.gics = key;
					uni.setStorageSync("selDate", this.seldata);
					uni.navigateBack({
						delta: 1
					});
				} else {
					this.isShowKeywordList = true;
					this.page.cPage = 1;
					this.pageInit(key);
				}
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: e => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	};
</script>
<style>
	.search-box {
		width: 95%;
		background-color: rgb(59, 98, 195);
		padding: 7.5px 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.search-box .search-btn {
		width: 15%;
		margin: 0 0 0 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 14px;
		color: #fff;
		background: linear-gradient(to right, #ff9801, #ff570a);
		border-radius: 30px;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 30px;
		font-size: 16px;
		border: 0;
		border-radius: 30px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #ffffff;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

	.search-keyword {
		width: 100%;
		background-color: rgb(242, 242, 242);
	}

	.keyword-list-box {
		height: calc(100vh - 55px);
		padding-top: 5px;
		border-radius: 10px 10px 0 0;
		background-color: #fff;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.keyword-entry {
		width: 94%;
		height: 40px;
		margin: 0 3%;
		font-size: 15px;
		color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1px #e7e7e7;
	}

	.keyword-entry image {
		width: 30px;
		height: 30px;
	}

	.keyword-entry .keyword-text,
	.keyword-entry .keyword-img {
		height: 40px;
		display: flex;
		align-items: center;
	}

	.keyword-entry .keyword-text {
		width: 90%;
	}

	.keyword-entry .keyword-img {
		width: 10%;
		justify-content: center;
	}

	.keyword-box {
		height: calc(100vh - 55px);
		border-radius: 10px 10px 0 0;
		background-color: #fff;
	}

	.keyword-box .keyword-block {
		padding: 5px 0;
	}

	.keyword-box .keyword-block .keyword-list-header {
		width: 94%;
		padding: 5px 3%;
		font-size: 13.5px;
		color: #333;
		display: flex;
		justify-content: space-between;
	}

	.keyword-box .keyword-block .keyword-list-header image {
		width: 20px;
		height: 20px;
	}

	.keyword-box .keyword-block .keyword {
		width: 94%;
		padding: 3px 3%;
		display: flex;
		flex-flow: wrap;
		justify-content: flex-start;
	}

	.keyword-box .keyword-block .hide-hot-tis {
		display: flex;
		justify-content: center;
		font-size: 14px;
		color: #6b6b6b;
	}

	.keyword-box .keyword-block .keyword>view {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		padding: 0 10px;
		margin: 5px 10px 5px 0;
		height: 30px;
		font-size: 14px;
		background-color: rgb(242, 242, 242);
		color: #6b6b6b;
	}
</style>
