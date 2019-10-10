<template>
	<view class="bg-white" >
		<view class="qiun-charts" >
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" 
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
			this.cHeight=uni.upx2px(600);
			this.getServerData();
		},
		methods: {
			getServerData(){
				uni.showLoading({
					title: '加载中...',
				});
				this.$http.gets('/idea/api/shenFive/pieData').then(e=>{
					uni.hideLoading();
					if(e.series.length > 0 ){
						_self.showPie("canvasPie",e);
					}
				})

			},
			showPie(canvasId,chartData){
				canvaLineA=new wxCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'pie',
					fontSize:11,
					padding:[15,15,0,15],
					legend:{
						show:true,
						padding:5,
						lineHeight:11,
						margin:0,
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
						}
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
