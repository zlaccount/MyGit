<style>
	@import url('../../../colorui/main.css');
	@import url('../../../colorui/icon.css');


	.rightBottom {
		z-index: 10;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 1;
		right: 30upx;
		bottom: 176upx;
	}

	.rec-top {
		width: 100%;
		line-height: 60upx;
	}

	.wrap-read button {
		margin: 10upx;
		font-size: 20upx;
	}

	.top-num {
		color: #101010;
		font-size: 2em;
	}

	.top-title {
		color: rgb(100, 100, 100);
		font-size: 24upx;
	}

	.grace-rows-demo {
		height: 200upx;
		color: #ffffff;
		width: 100%;
		line-height: 118upx;
	}

	.list-title {
		height: 80upx;
		line-height: 80upx;
		font-size: 36upx;
		color: rgb(59, 98, 195);
		margin-left: 12upx;
	}

	.list-item-wrap {
		padding: 1% 4%;
		width: 92%;
		font-size: 20upx;
	}

	.list-item {
		margin: 10upx auto;
		font-size: 15upx;
		color: rgb(100, 100, 100);
	}

	.list-item-wrap .left-title {
		font-size: 32upx;
		color: #000000;
	}

	.list-item-wrap .list-item .left {
		min-width: 140upx;
		color: rgba(0, 0, 0, 1);
		font-size: 28upx;
	}

	.list-item-wrap .list-item .right {
		margin-left: 10upx;
		margin-right: 10upx;
	}

	.list-item-item {
		margin: 10upx auto;
	}

	.bf-ff {
		background-color: #ffffff;
	}

	.shutiao {
		width: 10upx;
		background-color: rgb(59, 98, 195);
		height: 40upx;
		margin-top: 20upx;
		margin-left: 2%;
	}

	.progress-wrap {
		margin-top: 10upx;
		height: 30upx;
		overflow: hidden;
	}

	.b-line5 {
		border-bottom: 20upx solid #f8f8f8;
	}

	.b-line1 {
		border-bottom: 2upx solid #eee;
	}

	/* 通用样式 */
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
	}

	page {
		background-color: #ffffff;
	}

	.page-wrapper {
		background-color: #ffffff;
	}
</style>

<template>
	<view class="page-wrapper page">
		<view v-show="loading">
			<mht-loader></mht-loader>
		</view>
		<view v-if="jiyiOff == true" class="rightBottom flex ">
			<navigator url="/pages/template/transaction/transaction" hover-class="none">
				<view class="icon icon-refund " style="font-size: 90upx;color: rgb(59, 98, 195);display: block;"></view>
			</navigator>
		</view>

		<view style="padding: 20rpx;">
			<navigator url="/pages/template/recSea/recSea">
				<view class="bg-gray text-grey  text-center" style="border-radius: 60px;height: 60rpx;line-height: 60rpx;">搜索</view>
			</navigator>
		</view>

		<view class="grace-common-bg " v-show="!loading">
			<view v-show="nullOff" style="text-align: center;color: #7F7F7F;background-color: #FFFFFF; min-width: 200upx;margin: 200upx auto;">暂无荐股</view>
			<view v-show="!nullOff">
				<!-- TOP数据汇总 -->

				<view class="grace-rows grace-padding grace-center grace-space-between bf-ff">
					<view class="grace-items  rec-top ">
						<view class="grace-columns">
							<text class="top-num">{{ count.trade_count }}</text>
							<text class="top-title">近一年
								荐股次数</text>
						</view>
					</view>
					<view class="grace-items  rec-top">
						<view class="grace-columns">
							<text class="top-num">
								<text class="ssz-red">{{ count.profit_count }}</text>
								:
								<text class="ssz-green">{{ count.lose_count }}</text>
							</text>
							<text class="top-title">近一年
								盈亏次数</text>
						</view>
					</view>
					<view class="grace-items  rec-top ">
						<view class="grace-columns">
							<text class="top-num">
								<text class="ssz-red">{{ count.profit_total }}%</text>
								:
								<text class="ssz-green">{{ count.lose_total }}%</text>
							</text>
							<text class="top-title">近一年
								盈亏期望</text>
						</view>
					</view>
				</view>
				<!-- <view class="cu-list grid col-4 no-border" style="border-bottom: 20upx solid #F1F1F1;border-top: 20upx solid #F1F1F1;">
					<view class="cu-item" v-for="(item, index) in iconList" :key="index">
						<navigator :url="item.url" open-type="navigate" hover-class="none">
							<view :class="['icon-' + item.icon, 'text-' + item.color]"></view>
							<view :class="['text-' + item.color]">{{ item.name }}</view>
						</navigator>
					</view>
				</view> -->
				<!-- canvas -->
				<view style="background-color: #fff;">
					<view class="flex justify-between" style="margin-right: 1%;">
						<view class="flex" style="width: 80%;">
							<view class="grace-items shutiao"></view>
							<view class="grace-items list-title">组合表现</view>
						</view>
						<view>
							<image @click="showpop(0)" src="/static/img/sx.png" mode="aspectFill" class="icon-saixuan"></image>
							<!-- <view class="icon-filter " style="margin-top: 10upx;font-size: 40upx;"></view> -->
						</view>
					</view>
					<view>
						<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :style="{
								width: cWidth * pixelRatio + 'px',
								height: cHeight * pixelRatio + 'px',
								transform: 'scale(' + 1 / pixelRatio + ')',
								'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
								'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
							}"></canvas>
					</view>
					<view class="flex justify-between" style="margin-right: 1%;">
						<view class="flex" style="width: 80%;">
							<view class="grace-items shutiao"></view>
							<view class="grace-items list-title">多维分析</view>
						</view>
						<view>
							<image @click="showpop(1)" src="/static/img/sx.png" mode="aspectFill" class="icon-saixuan"></image>
						</view>
					</view>
					<view>
						<canvas canvas-id="canvasRadar" id="canvasRadar" class="charts" :style="{
								width: cWidth * pixelRatio + 'px',
								height: cHeight * pixelRatio + 'px',
								transform: 'scale(' + 1 / pixelRatio + ')',
								'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
								'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
							}"></canvas>
					</view>
					<view style="width: 96%;margin-left: 2%;" class="wrap-read">
						<view class="flex justify-center">
							<button class="cu-btn round shadow bg-blue sm" style="background-color: #3b62c3;color: #fff;">Alpha能力:{{ readData.alpha }}</button>
							<button class="cu-btn round shadow bg-blue sm" style="background-color: #3b62c3;color: #fff;">波动性:{{ readData.volatility }}</button>
						</view>
						<view class="flex justify-center">
							<button class="cu-btn round shadow bg-blue sm" style="background-color: #3b62c3;color: #fff;">大胆度:{{ readData.boldness }}</button>
							<button class="cu-btn round shadow bg-blue sm" style="background-color: #3b62c3;color: #fff;">精确度:{{ readData.accuracy }}</button>
							<button class="cu-btn round shadow bg-blue sm" style="background-color: #3b62c3;color: #fff;">盈利能力:{{ readData.profit_total }}</button>
						</view>
					</view>

					<view class="padding-idea flex  align-center" v-if="readData.star_ranking != null">
						<view class="text-gray">星级评定</view>
						<view class="" style="margin-left: 11%;">
							<sunui-star :defaultStar="readData.star_ranking" :disabledStar="true" class="sunui-star" />
						</view>
					</view>
					<view v-else style="text-align: center;">暂无星级评定</view>

					<view v-if="tsModel.title" style="margin-bottom: 12rpx;" class="padding-idea flex  align-center">
						<view class="text-gray">预估职位</view>
						<view style="margin-left: 21%;">
							{{tsModel.title}}
						</view>
					</view>
					<view v-if="tsModel.salary" style="margin-bottom: 12rpx;" class="padding-idea flex  align-center">
						<view class="text-gray">市场价值</view>
						<view style="margin-left: 21%;">
							{{tsModel.salary}}
						</view>
					</view>

				</view>

				<!-- TOP END -->
				<view class="list garce-padding bf-ff">
					<view class="b-line5" v-for="(item, index) in list" :key="index">
						<view class="grace-rows">
							<view class="grace-items  grace-rows" style="width:98%;">
								<view class="grace-items shutiao"></view>
								<view class="grace-items list-title">{{ item.groupname }}</view>
							</view>
						</view>

						<view class=" list-item-wrap b-line1" v-for="(itemTwo, indexTwo) in item.item" :key="indexTwo" @click="jump(itemTwo.id)">
							<view class=" list-item  " style="width:100%;">
								<view class="grace-rows list-item-item">
									<view class="left ">{{ itemTwo.code }}</view>
									<view class="right  ">
										{{ itemTwo.stock_name }}
										<text style="margin-left: 20upx;" :class="[itemTwo.side == 'Long' ? 'ssz-red' : 'ssz-green']">
											{{ itemTwo.side == 'Long' ? '买入' : '卖空' }}
										</text>
									</view>
								</view>
								<view class="grace-rows list-item-item">
									<view class="left ">推荐日期</view>
									<view class="right  ">{{ itemTwo.trade_date }}</view>
									<!-- <view class="left ">兑现日期</view>
									<view class="right  ">{{itemTwo.liquid_date}}</view> -->
								</view>

								<view class="grace-rows list-item-item">
									<view class="left ">最大回撤</view>
									<view class="right" :class="[itemTwo.drawback >= 0 ? 'ssz-red' : 'ss-green']">{{ itemTwo.drawback }}</view>
									<view class="left  " style="text-align: center;">波动率</view>
									<view class="right">{{ itemTwo.volatility }}</view>
								</view>
								<view class="grace-rows list-item-item" style="margin-bottom: 0;">
									<view class="left">当前进度</view>
									<view class="grace-rows progress-wrap" style="width: 100%;">
										<view class="grace-items  grace-center" style="width:50%; transform: rotateY(180deg)">
											<progress :percent="itemTwo.flag < 0 ? itemTwo.pro : 0" activeColor="rgba(37,155,36,1)" active style="width: 100%;"
											 stroke-width="15" />
										</view>
										<view class="grace-items grace-center" style="width:50%;">
											<progress :percent="itemTwo.flag >= 0 ? itemTwo.pro : 0" activeColor="red" active style="width: 100%;"
											 stroke-width="15" />
										</view>
									</view>
								</view>

								<view class="grace-rows list-item-item" style="margin-top: 0;">
									<view class="left"></view>
									<view class="grace-rows " style="width: 100%;">
										<view class="grace-items grace-center" style="width:40%;font-size: 24upx;" v-html="itemTwo.schedule"></view>
										<view style="width: 20%;font-size: 24upx;" class="grace-center" v-html="itemTwo.cost"></view>
										<view class="grace-items grace-center" style="width:40%;font-size: 24upx;" v-html="itemTwo.target"></view>
									</view>
								</view>
								<view class="grace-rows list-item-item">
									<view class="left ">推荐理由</view>
									<view class="right  ">{{ itemTwo.proposal_reason }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<popup-layer ref="popupRef" :direction="'left'">
			<view>
				<view style="margin-left: 10upx;font-size: 25upx;color: #959595">请选择筛选条件</view>
				<uni-list-item v-for="(item, index) in poplist[popIndex]" :key="item.name" :keys="index" :title="item.title" :arr="item.arr"
				 :msg="item.msg" :disabled="item.disabled" :defaultVal="item.defaultVal" :note="item.note" :showSwitch="item.showSwitch"
				 :mark="item.mark" @clInput="input"></uni-list-item>
				<!-- <view><button @click="submintPop" class="content cu-btn line- round lg shadow" style="width: 90%;margin: 100upx 5%;">确认筛选</button></view> -->
			</view>
		</popup-layer>
		<popup-layer ref="popupDate" :direction="'left'">
			<view>
				<view style="margin-left: 20upx;font-size: 36upx;color: #000000">获取研究员报告</view>
				<view style="margin-top:30upx;margin-left: 35upx;font-size: 25upx;color: #959595">请选择报告日期</view>
				<uni-list-item v-for="(item, index) in datelist[0]" :key="item.name" :title="item.title" :msg="item.msg" :mark="item.mark"
				 @clInput="dateinput"></uni-list-item>
				<view><button @click="submintDate" class="content cu-btn line- round lg shadow" style="width: 90%;margin: 100upx 5%;">确认选择</button></view>
			</view>
		</popup-layer>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue';
	import sunuiStar from '@/components/sunui-star/sunui-star.vue';
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	import wxCharts from '@/components/wx-charts/wxcharts.js';
	import datas from '../../../common/data.js';
	import util from '@/common/util.js';
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item-to.vue';
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	var _self;
	var LineA = {
		categories: [],
		series: [{
			name: '研究员净值',
			data: [],
			color: 'rgb(247, 92, 89)'
		}, {
			name: '对标指数净值',
			data: []
		}]
	};
	var Radar = {
		categories: ['Alpha能力', '波动性', '大胆度', '精确度', '盈利能力'],
		series: [{
			data: []
		}]
	};
	export default {
		components: {
			popupLayer,
			uniRate,
			sunuiStar,
			mSearch,
			uniListItem,
			mhtLoader
		},
		data() {
			return {
				seaVal: '',
				tsModel: {},
				jiyiOff: false,
				iconList: [{
						icon: 'cardboardfill',
						color: 'red',
						badge: 120,
						name: '神五',
						url: '/pages/template/customer/customer'
					},

					{
						icon: 'picfill',
						color: 'yellow',
						badge: 0,
						name: '上传名片'
					},
					{
						icon: 'noticefill',
						color: 'olive',
						badge: 22,
						name: '下单改单'
					},
					{
						icon: 'share',
						color: 'orange',
						badge: 1,
						name: '分享',
						url: '/pages/zhiwen-share/zhiwen-share'
					}
				],
				starConfig: {
					defaultStar: 2,
					maxStar: 5,
					starSize: '1.2em',
					isTips: true,
					type: 'love'
				},
				readData: {},
				popIndex: -1,
				datelist: [
					[{
						title: '报告时间',
						msg: '请选择',
						mark: 3,
						name: 'report_date'
					}]
				],
				poplist: [
					[{
							title: '类型',
							arr: [],
							msg: 'AVG',
							mark: 2,
							name: 'model_type'
						},
						{
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
					[{
						title: '类型',
						arr: [],
						msg: 'AVG',
						mark: 2,
						name: 'model_type'
					}]
				],
				userId: '',
				userName: '',
				nullOff: false,
				msg: 'hello',
				data: datas.recommend,
				list: [],
				// 顶部统计数据
				count: {},
				user: {},
				loading: true,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				pojo: {},
				inputdate: '',
				AnalystReportModel: {}
			};
		},
		methods: {
			submintPop() {
				for (var i = 0; i < this.poplist[this.popIndex].length; i++) {
					let s = this.poplist[this.popIndex][i];
					if (this.$at.isEmpty(this.pojo[s.name])) {
						this.$at.toast('请先选择' + s.title);
						return;
					}
				}
				this.initChars();
			},
			submintDate() {
				console.log(this.$at.user().userId);
				if (this.$at.isEmpty(this.inputdate)) {
					this.$at.toast('请先选择日期');
					return;
				}
				uni.showLoading({
					title: '加载中'
				});

				this.$http.get('/goldstream/newsletter/analyst_report/' + this.$at.user().userId + '/' + this.inputdate).then(e => {
					this.AnalystReportModel = e.data.AnalystReportModel;
					if (this.$at.isEmpty(this.AnalystReportModel)) {
						uni.hideLoading();
						uni.showToast({
							title: '该月份报告不存在！',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					var url_link = 'https://kaizen.goldstreamfund.com/upload/document_file/analyst_report/' + this.AnalystReportModel
						.file_name;
					uni.downloadFile({
						url: url_link,
						success: function(re2s) {
							var filePath = re2s.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								success: function(res) {
									uni.hideLoading();
								},
								fail: function(res) {
									uni.hideLoading();
									uni.showToast({
										title: '打开文档失败！',
										icon: 'none',
										duration: 2000
									});
								}
							});
						},
						fail: function(re2s) {
							uni.hideLoading();
							uni.showToast({
								title: '打开文档失败！',
								icon: 'none',
								duration: 2000
							});
						}
					});
				});
			},
			initPopAll() {
				this.$http.get('/goldstream/dict/findDictByType/portfolio_model_type').then(e => {
					this.poplist[0][0].arr = e.data.map(s => {
						return {
							name: s.name,
							value: s.value
						};
					});
					this.poplist[1][0].arr = e.data.map(s => {
						return {
							name: s.name,
							value: s.value
						};
					});
					uni.hideLoading();
				});
			},
			input(e) {
				let name = this.poplist[this.popIndex][e.index].name;
				this.pojo[name] = e.value;
				this.initChars();
			},
			dateinput(e) {
				let name = this.datelist[0][0].name;
				// this.pojo[name] = e.value;
				this.inputdate = e.value;
			},
			showpop(index) {
				this.pojo = {};
				if (this.poplist[0][0].arr.length == 0) {
					uni.showLoading({
						title: '加载中...'
					});
					this.initPopAll();
				}
				this.popIndex = index;
				this.$refs.popupRef.show(); // 弹出
			},
			showLineA(canvasId, chartData) {
				new wxCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					legend: true,
					background: '#FFFFFF',
					dataPointShape: false,
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: false,
					enableScroll: false, //开启图表拖拽功能
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: false,
					dataPointShape: false,
					extra: {
						lineStyle: 'straight'
					}
				});
			},
			showRadar(canvasId, chartData) {
				new wxCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'radar',
					fontSize: 11,
					legend: false,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: false,
					dataLabel: true,
					categories: chartData.categories,
					series: chartData.series,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						radar: {
							max: 1 //雷达数值的最大值
						}
					}
				});
			},
			jump(id) {
				uni.navigateTo({
					url: 'recommendDetails/recommendDetails?id=' + id
				});
			},
			// 初始化ajax交互
			init(userId) {
				this.user = this.$at.user();
				if (this.$at.isEmpty(userId)) {
					userId = this.user.userId;
				}
				this.$http.get('/idea/api/tradingLog/userTradingStatistics/' + userId).then(e => {
					if ((e.code = '0000')) {
						this.nullOff = e.data.trade_count == 0 ? true : false;
						e.data.profit_total = Math.abs(e.data.profit_total);
						e.data.lose_total = Math.abs(e.data.lose_total);
						this.count = e.data;
					} else {
						util.WU.toast(e.msg);
					}
				});
				this.$http.get('/idea/api/tradingLog/tradingLogData/' + userId).then(e => {
					if ((e.code = '0000')) {
						e.data.map(s => {
							s.trade_date = this.$at.dateFtt('yyyy-MM-dd', new Date(Number(s.trade_date)));
							s.drawback = util.WU.reservedDecimal(s.drawback * 100, 2) + '%';
							s.volatility = util.WU.reservedDecimal(s.volatility * 100, 2) + '%';
							s.pro = this.$at.reservedDecimalOnAbs(Math.abs(s.schedule) * 100, 2);
							s.flag = s.schedule;
							s.schedule = this.$at.reservedDecimalOnAbs(Number(s.schedule) * 100, 2) + '% <br/>当前进度';
							s.cost = this.$at.reservedDecimalOnAbs(s.cost, 2) + '<br/>成本价';
							s.target = this.$at.reservedDecimalOnAbs(s.target, 2) + '<br/>目标价';
							return s;
						});
						this.list = util.WU.group(e.data, 'industry_gics');
					} else {
						util.WU.toast(e.msg);
					}
					this.initChars();
					setTimeout(() => {
						this.loading = false;
					}, 300);
				});
			},
			initLog() {
				// 折线
				this.$http.post('/idea/api/tradingLog/lineChart', this.pojo).then(e => {
					let data = e.data;
					if (data.benchmark_dtd_chg.length > 0) {
						LineA.categories = data.categories;
						LineA.series[0].data = data.dtd_chg;
						LineA.series[1].data = data.benchmark_dtd_chg;
						this.loading = false;
						_self.showLineA('canvasLineA', LineA);
						uni.hideLoading();
					} else {
						this.$at.toast('组合表现暂无数据..');
						uni.hideLoading();
					}
				});
			},
			initRadar() {
				// 雷达
				this.$http.post('/idea/api/tradingLog/radar', this.pojo).then(e => {
					e.data.boldness = this.$at.reservedDecimalOnAbs(e.data.boldness, 2);
					e.data.alpha = this.$at.reservedDecimalOnAbs(e.data.alpha, 2);
					e.data.volatility = this.$at.reservedDecimalOnAbs(e.data.volatility, 2);
					e.data.accuracy = this.$at.reservedDecimalOnAbs(e.data.accuracy, 2);
					e.data.profit_total = this.$at.reservedDecimalOnAbs(e.data.profit_total, 2);
					e.data.boldness_bl = this.$at.reservedDecimalOnAbs(e.data.boldness_bl, 2);
					e.data.alpha_bl = this.$at.reservedDecimalOnAbs(e.data.alpha_bl, 2);
					e.data.volatility_bl = this.$at.reservedDecimalOnAbs(e.data.volatility_bl, 2);
					e.data.accuracy_bl = this.$at.reservedDecimalOnAbs(e.data.accuracy_bl, 2);
					e.data.profit_total_bl = this.$at.reservedDecimalOnAbs(e.data.profit_total_bl, 2);
					let arr = e.data;
					this.readData = e.data;
					this.readData.star_ranking = Number(this.readData.star_ranking);
					let daAlin = [arr.alpha_bl, arr.volatility_bl, arr.boldness_bl, arr.accuracy_bl, arr.profit_total_bl];
					Radar.series[0].data = daAlin;
					this.loading = false;
					_self.showRadar('canvasRadar', Radar);
					uni.hideLoading();
				});
			},
			initChars() {
				this.pojo.analyst_id = this.$at.user().userId;
				uni.showLoading({
					title: '正在加载...'
				});
				switch (this.popIndex) {
					case -1:
						uni.hideLoading();
						this.initRadar();
						this.initLog();
						break;
					case 0:
						this.initLog();
						break;
					case 1:
						this.initRadar();
						break;
				}
			}
		},
		// 监听导航栏自定义按钮事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 1:
					uni.navigateTo({
						url: '../../template/recommendHistory/recommendHistory?userId=' + this.userId + '&&userName=' + this.userName
					});
					break;
				case 2:
					uni.navigateTo({
						url: '../../template/recommendDeal/recommendDeal'
					});
					break;
				case 0:
					this.pojo = {};
					this.$refs.popupDate.show();
					break;
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: '荐股'
			});
			this.init(null);
		},
		onLoad() {

			this.$http.posts('/idea/api/tradingLog/getTitleSalary', {
				analyst_id: uni.getStorageSync("user").userId
			}).then(e => {
				if (this.$at.isNotEmpty(e)) {
					this.tsModel.title = e.Title;
					this.tsModel.salary = e.Salary;
				}
			})

			this.$http.gets('/idea/api/orderManagement/queryrTradingAuthority').then(e => {
				try {
					this.jiyiOff = e.length > 0 ? true : false;
				} catch (e) {
					this.jiyiOff = false;
				}
			})
			if (this.$at.isEmpty(this.$at.user().userId)) {
				uni.clearStorageSync()
			}
			this.initPopAll();
			_self = this;
			//#ifdef H5 || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 1;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
		}
	};
</script>
