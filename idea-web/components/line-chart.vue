<template>
	<view class="bg-white" >
		<view class="qiun-charts" >
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" 
				:style="{
					width: cWidth * pixelRatio + 'px',
					height: cHeight * pixelRatio + 'px',
					transform: 'scale(' + 1 / pixelRatio + ')',
					'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
					'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
				}"></canvas>
		</view>
	</view>
</template>

<script>
	import wxCharts from '@/components/wx-charts/wxcharts.js';
		var _self;
	var canvaLineA=null;
	export default {
		props: {
			current: {
				type: Number,
				default: 0
			},
		},
		computed: {
			currents() {
				return this.current;
			}
		},
		watch: {
			currents(newValue, oldValue) {
				this.getServerData(newValue);
			}
		},
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:''
			};
		},
		mounted() {
			console.log("1qwe");
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData(mark = 0){
				uni.showLoading({
					title: '加载中...'
				}); 
				this.$http.gets('/idea/api/shenFive/lineData/'+mark).then(e=>{
					uni.hideLoading();
					if(e.categories.length > 0 ){
						e.series[0].color = '#e54d42';
						e.series[1].color = '#0081ff';
						_self.showLineA("canvasLineA",e);
					}
				})
				setTimeout(()=>{
					uni.hideLoading();
				},1000)
			},
			showLineA(canvasId,chartData){
				canvaLineA=new wxCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					legend: true,
					background: '#FFFFFF',
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
						lineStyle: 'curve'
					},
				});
				
			},
			touchLineA(e) {
				canvaLineA.touchLegend(e);
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			changeData(){
				if(isJSON(_self.textarea)){
					let newdata=JSON.parse(_self.textarea);
					canvaLineA.updateData({
						series: newdata.series,
						categories: newdata.categories
					});
				}else{
					uni.showToast({
						title:'数据格式错误',
					})
				}
			}
		}
		
	}
</script>

<style>
</style>
