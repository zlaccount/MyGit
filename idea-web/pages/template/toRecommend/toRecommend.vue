<style>
	@import url('../../../colorui/main.css');
	@import url('../../../colorui/icon.css');
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
		color: #FFFFFF;
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
		background-color: #FFFFFF
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
		border-radius: 50upx;
	
		height: 30upx;
		overflow: hidden;
	}
	.b-line5{
		border-bottom: 20upx solid #f8f8f8;
	}
	.b-line1{
		border-bottom: 2upx solid #eee;
	}
	page{
		background-color: #FFFFFF;
	}
	.page-wrapper{
		background-color: #FFFFFF;
	}
</style>

<template>
	<view class="page-wrapper page">
		<view v-show="loading">
			<mht-loader></mht-loader>
		</view>
		<view class="grace-common-bg " v-show="!loading">
			<view v-show="nullOff" style="text-align: center;color: #7F7F7F;background-color: #FFFFFF; min-width: 200upx;margin: 200upx auto;">暂无荐股</view>
			<view v-show="!nullOff">
				<!-- TOP数据汇总 -->
				<view class="grace-rows grace-padding grace-center grace-space-between bf-ff" style="margin-bottom: 20upx;">
					<view class="grace-items  rec-top ">
						<view class="grace-columns">
							<text class="top-num">{{count.trade_count}}</text>
							<text class="top-title">近一年
								荐票次数</text>
						</view>
					</view>
					<view class="grace-items  rec-top">
						<view class="grace-columns">
							<text class="top-num"><text class="ssz-red">{{count.profit_count}}</text>:<text class="ssz-green">{{count.lose_count}}</text></text>
							<text class="top-title">近一年
								盈亏次数</text>
						</view>
					</view> 
					<view class="grace-items  rec-top ">
						<view class="grace-columns">
							<text class="top-num"><text class="ssz-red">{{count.profit_total}}%</text>:<text class="ssz-green">{{count.lose_total}}%</text></text>
							<text class="top-title">近一年
								盈亏期望</text>
						</view>
					</view>
				</view>
				<!-- TOP END -->
				<view style="background-color: #fff;">
					<view class="flex justify-between" style="margin-right: 1%;">
						<view class="flex" style="width: 80%;">
							<view class="grace-items shutiao"></view>
							<view class="grace-items list-title">组合表现</view>
						</view>
						<view>
							<image  @click="showpop(0)"  src="/static/img/sx.png" mode="aspectFill" class="icon-saixuan"></image>	
						</view>
					</view>
					<view class="text-gray text-center" v-if="off.lineOff==true">暂无数据</view>
					<view>
						<canvas
							canvas-id="canvasLineA"
							id="canvasLineA"
							class="charts"
							:style="{
								width: cWidth * pixelRatio + 'px',
								height: cHeight * pixelRatio + 'px',
								transform: 'scale(' + 1 / pixelRatio + ')',
								'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
								'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
							}"
						></canvas>
					</view>
					<view class="flex justify-between" style="margin-right: 1%;">
						<view class="flex" style="width: 80%;">
							<view class="grace-items shutiao"></view>
							<view class="grace-items list-title">多维分析</view>
						</view>
						<view>
							<image  @click="showpop(1)"  src="/static/img/sx.png" mode="aspectFill" class="icon-saixuan"></image>	
						</view>
					</view>
					<view class="text-gray text-center" v-if="off.radOff==true">暂无数据</view>
					<view>
						<canvas
							canvas-id="canvasRadar"
							id="canvasRadar"
							class="charts"
							:style="{
								width: cWidth * pixelRatio + 'px',
								height: cHeight * pixelRatio + 'px',
								transform: 'scale(' + 1 / pixelRatio + ')',
								'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
								'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
							}"
						></canvas>
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
					<view  v-if="readData.star_ranking!=null && readData.star_ranking!=0" style="margin-bottom: 12rpx;" class="padding-idea flex  align-center">
						<view class="text-gray">星级评定</view>
						<view  class="filter" style="margin-left: 11%;">
							<sunui-star :defaultStar="readData.star_ranking" :disabledStar="true" class="sunui-star" />
						</view>
					</view>
					<view v-else style="text-align: center;color: #8799a3;">暂无星级评定</view>
					<view  style="margin-bottom: 12rpx;" class="padding-idea flex  align-center">
						<view class="text-gray">预估职位</view>
						<view  style="margin-left: 100rpx;">只有用户本人可见</view>
					</view>
					<view  style="margin-bottom: 12rpx;" class="padding-idea flex  align-center">
						<view class="text-gray">市场价值</view>
						<view  style="margin-left: 100rpx;">只有用户本人可见</view>
					</view>
				</view>
				
				
				
				<view class="list garce-padding bf-ff">
					<view class="b-line5" v-for="(item,index) in list" :key="index">
						<view class="grace-rows">
							<view class="grace-items  grace-rows" style="width:98%;">
								<view class="grace-items shutiao"></view>
								<view class="grace-items list-title">{{item.groupname}}</view>
							</view>
						</view>
						<view class=" list-item-wrap  b-line1" v-for="(itemTwo,indexTwo) in item.item" :key="indexTwo" @click="jump(itemTwo.id)">
							<view class=" list-item  " style="width:100%;">
								<view class="grace-rows list-item-item">
									<view class="left ">{{itemTwo.code}}</view>
									<view class="right  ">{{itemTwo.stock_name}}  <text style="margin-left: 20upx;" :class="[itemTwo.side=='Long'?'ssz-red':'ssz-green']">{{itemTwo.side=='Long'?'买入':'卖空'}}</text> </view>
								</view>
								<view class="grace-rows list-item-item">
									<view class="left ">推荐日期</view>
									<view class="right  ">{{itemTwo.trade_date}}</view>
									<!-- <view class="left ">兑现日期</view>
									<view class="right  ">{{itemTwo.liquid_date}}</view> -->
								</view>

								<view class="grace-rows list-item-item">
									<view class="left  ">最大回撤</view>
									<view class="right  ">{{itemTwo.drawback}}</view>
									<view class="left  " style="text-align: center;">波动率</view>
									<view class="right" >{{itemTwo.volatility}}</view>
								</view>
								<view class="grace-rows list-item-item">
									<view class="left">当前进度</view>
									<view class="grace-rows progress-wrap" style="width: 100%;">
										<view class="grace-items  grace-center" style="width:50%; transform: rotateY(180deg)">
											<progress :percent="itemTwo.flag<0?itemTwo.pro:0" activeColor="rgba(37,155,36,1)" active
											 style="width: 100%;" stroke-width="15" />
										</view>
										<view class="grace-items grace-center" style="width:50%;">
											<progress :percent="itemTwo.flag>=0?itemTwo.pro:0" activeColor="red" active style="width: 100%;"
											 stroke-width="15" />
										</view>
									</view>
								</view>
								<view class="grace-rows list-item-item" style="margin-top: 0;">
									<view class="left"></view>
									<view class="grace-rows " style="width: 100%;">
										<view class="grace-items grace-center" style="width:40%;font-size: 24upx;" v-html="itemTwo.schedule"></view>
										<view style="width: 20%;font-size: 24upx;" class="grace-center" v-html="itemTwo.cost"></view>
										<view class="grace-items grace-center" style="width:40%;font-size: 24upx;" v-html="itemTwo.target">
										</view>
									</view>
								</view>
								<view class="grace-rows list-item-item">
									<view class="left ">推荐理由</view>
									<view class="right  ">{{itemTwo.proposal_reason}}</view>
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
				<uni-list-item
					v-for="(item, index) in poplist[popIndex]"
					:key="item.name"
					:keys="index"
					:title="item.title"
					:arr="item.arr"
					:msg="item.msg"
					:disabled="item.disabled"
					:defaultVal="item.defaultVal"
					:note="item.note"
					:showSwitch="item.showSwitch"
					:mark="item.mark"
					@clInput="input"
				></uni-list-item>
				<!-- <view><button @click="submintPop" class="content cu-btn line- round lg shadow" style="width: 90%;margin: 100upx 5%;">确认筛选</button></view> -->
			</view>
		</popup-layer>
		
	</view>
</template>

<script>
	import datas from "../../../common/data.js"
	import util from "@/common/util.js"
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item-to.vue';
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	import sunuiStar  from '@/components/sunui-star/sunui-star.vue';
	import wxCharts from '@/components/wx-charts/wxcharts.js';
	var LineA = { categories: [], series: [{ name: '研究员净值', data: [] ,color:'rgb(247, 92, 89)'}, { name: '对标指数净值', data: [] } ] };
	var Radar = { categories: ['Alpha能力', '波动性', '大胆度', '精确度', '盈利能力'], series: [{ data: [] }] };
	var _self;
	export default {
		components: {
			mhtLoader,popupLayer,wxCharts,uniListItem,sunuiStar
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				readData: {},
				popIndex: -1,
				poplist: [
					[
						{
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
					[
						{
							title: '类型',
							arr: [],
							msg: 'AVG',
							mark: 2,
							name: 'model_type'
						}
					]
				],
				userId:'',
				userName:'',
				nullOff: false,
				msg: 'hello',
				data: datas.recommend,
				list: [],
				// 顶部统计数据
				count: {},
				user: {},
				loading: true,
				pojo:{},
				off:{
					radOff:false,
					lineOff:false,
				}
			};
		},
		methods: {
			initLog() {
				// 折线
				this.$http.post('/idea/api/tradingLog/lineChart', this.pojo).then(e => {
					let data = e.data;
					if (data.benchmark_dtd_chg.length>0) {
						LineA.categories = data.categories;
						LineA.series[0].data = data.dtd_chg;
						LineA.series[1].data = data.benchmark_dtd_chg;
						this.loading = false;
						_self.showLineA('canvasLineA', LineA);
						uni.hideLoading();
					} else {
						this.off.lineOff = true;
						this.$at.toast('暂无数据..');
						uni.hideLoading();
					}
				});
			},
			initRadar() {
				// 雷达
				this.$http.post('/idea/api/tradingLog/radar', this.pojo).then(e => {
					if(e.code=='0000' && this.$at.isNotEmpty(e.data)){
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
					}else{
						this.off.radOff = true;
						this.$at.toast('暂无数据')
					}
					uni.hideLoading();
				});
			},
			initChars() {
				this.pojo.analyst_id = this.userId;
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
			},
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
			initPopAll() {
				this.$http.get('/goldstream/dict/findDictByType/portfolio_model_type').then(e => {
					this.poplist[0][0].arr = e.data.map(s => {
						return { name: s.name, value: s.value };
					});
					this.poplist[1][0].arr = e.data.map(s => {
						return { name: s.name, value: s.value };
					});
					uni.hideLoading();
				});
			},
			input(e) {
				let name = this.poplist[this.popIndex][e.index].name;
				this.pojo[name] = e.value;
				this.initChars();
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
					url: "recommendDetails/recommendDetails?id=" + id 
				})
			},
			init(userId) {
				this.initChars();
				this.$http.get('/idea/api/tradingLog/userTradingStatistics/' + userId).then(e => {
					if (e.code = '0000') {
						this.nullOff = e.data.trade_count == 0 ? true : false
						
						if(this.$at.isEmpty(e.data.profit_total )){
							e.data.profit_total = 0;
						}
						if(this.$at.isEmpty(e.data.lose_total )){
							e.data.lose_total = 0;
						}
						e.data.profit_total = Math.abs(e.data.profit_total);
						e.data.lose_total = Math.abs(e.data.lose_total);
						this.count = e.data
					} else {
						util.WU.toast(e.msg)
					}
				})
				this.$http.get('/idea/api/tradingLog/tradingLogData/' + userId).then(e => {
					if (e.code = '0000') {
						e.data.map(s => {
							s.trade_date = this.$at.dateFtt("yyyy-MM-dd", new Date(Number(s.trade_date)))
							s.drawback = util.WU.reservedDecimal(s.drawback*100 , 2)  +'%';
							s.volatility = util.WU.reservedDecimal(s.volatility*100, 2) +'%' ;
							s.pro=this.$at.reservedDecimalOnAbs(Math.abs(s.schedule) * 100, 2);
							s.flag=s.schedule ;
							s.schedule = this.$at.reservedDecimalOnAbs(Number(s.schedule) * 100, 2)+'% <br/>当前进度' ;
							s.cost = this.$at.reservedDecimalOnAbs(s.cost, 2)+"<br/>成本价" ;
							s.target = this.$at.reservedDecimalOnAbs(s.target, 2)+"<br/>目标价" ;
							return s;
						})
						this.list = util.WU.group(e.data, 'industry_gics')
					} else {
						util.WU.toast(e.msg)
					}
					setTimeout(() => {
						this.loading = false;
					}, 300)
				})

			}
		},
		// 监听导航栏自定义按钮事件
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: "/pages/template/recommendHistory/recommendHistory?userId="+this.userId+"&&userName="+this.userName
			})
		},
		onLoad() {
			_self = this;
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
			// 临时user对象
			let toUser = uni.getStorageSync("toUser");
			if (!this.$at.isEmpty(toUser)) {
				this.userId=toUser.analyst;
				this.userName=toUser.analyst_name;
				uni.setNavigationBarTitle({
					title: toUser.analyst_name + '的荐股'
				});
				this.init(toUser.analyst)
			} 
		},
		onHide() {
		}
	}
</script>
