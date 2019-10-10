<template>
	<view class="container">
		<view class="canvasView">
			<view class="canvas-bar"><view class="title">饼图示例</view></view>
			<mpvue-echarts :echarts="echarts" :onInit="pieInit" canvasId="pie" ref="pieChart" />
		</view>
		<view class="canvasView">
			<view class="title">折线图示例</view>
			<mpvue-echarts :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
		</view>
	</view>
</template>

<script>
import * as echarts from '@/components/echarts/echarts.simple.min.js';
import mpvueEcharts from '@/components/mpvue-echarts/src/echarts.vue';

const cityList = [
	{
		value: 55,
		name: '北京'
	},
	{
		value: 38,
		name: '上海'
	},
	{
		value: 20,
		name: '广州'
	}
];

let pieOption = {
	title: {
		text: '基础雷达图'
	},
	tooltip: {},
	legend: {
		data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
	},
	radar: {
		// shape: 'circle',
		name: {
			textStyle: {
				color: '#fff',
				backgroundColor: '#999',
				borderRadius: 3,
				padding: [3, 5]
			}
		},
		indicator: [
			{ name: '销售（sales）', max: 6500 },
			{ name: '管理（Administration）', max: 16000 },
			{ name: '信息技术（Information Techology）', max: 30000 },
			{ name: '客服（Customer Support）', max: 38000 },
			{ name: '研发（Development）', max: 52000 },
			{ name: '市场（Marketing）', max: 25000 }
		]
	},
	series: [
		{
			name: '预算 vs 开销（Budget vs spending）',
			type: 'radar',
			// areaStyle: {normal: {}},
			data: [
				{
					value: [4300, 10000, 28000, 35000, 50000, 19000],
					name: '预算分配（Allocated Budget）'
				},
				{
					value: [5000, 14000, 28000, 31000, 42000, 21000],
					name: '实际开销（Actual Spending）'
				}
			]
		}
	]
};

let lineOption = {
	animation: false,
	color: ['#37A2DA', '#9FE6B8'],
	grid: {
		x: 35,
		x2: 10,
		y: 30,
		y2: 25
	},
	calculable: false,
	xAxis: [
		{
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}
	],
	yAxis: [
		{
			type: 'value',
			splitArea: {
				show: true
			}
		}
	],
	series: [
		{
			name: '蒸发量',
			type: 'line',
			data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		},
		{
			name: '降水量',
			type: 'line',
			data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		}
	]
};

export default {
	data() {
		return {
			echarts: echarts,
			updateStatus: false
		};
	},
	onLoad() {
		pieOption.series[0].data = cityList.slice(0);
	},
	methods: {
		goBrowser() {
			// #ifdef APP-PLUS
			plus.runtime.openURL('https://github.com/F-loat/mpvue-echarts');
			// #endif
			// #ifdef MP-WEIXIN
			uni.showModal({
				content: '请复制链接在浏览器里打开',
				showCancel: false
			});
			// #endif
		},
		pieInit(canvas, width, height) {
			let pieChart = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			canvas.setChart(pieChart);
			pieChart.setOption(pieOption);
			return pieChart;
		},
		lineInit(canvas, width, height) {
			let lineChart = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			canvas.setChart(lineChart);

			lineChart.setOption(lineOption);
			return lineChart;
		}
	},
	components: {
		mpvueEcharts
	}
};
</script>

<style>
page,
view {
	display: flex;
	font-size: 28upx;
}

page {
	min-height: 100%;
}

.page-section-title {
	padding: 0 30upx;
}

.title {
	margin-left: 30upx;
	line-height: 1.5;
	color: #8f8f94;
}

.container {
	padding-bottom: 30upx;
	box-sizing: border-box;
}

.container,
.canvasView {
	flex: 1;
	flex-direction: column;
}

.navigate {
	color: #007aff;
}

.canvas-bar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.update-btn {
	margin-right: 30upx;
}
</style>
