<template name="sunui-star">
	<view class="flex ">
		<view class="mg " v-for="item in foolNum">
			<image src="/static/img/xingxing.png" mode="aspectFit" style="width: 40upx;height: 40upx;"></image>
		</view>
		<view class="mg " v-if="foolNum != defaultStar" style="    margin-top: 16upx;">
			<image src="/static/img/bankexing.png" mode="aspectFit" style="width: 35upx;height: 35upx;"></image>
		</view>
		<view class="mg " v-for="item in  klength">
			<image src="/static/img/xingxingk.png" mode="aspectFit" style="width: 32upx;height: 40upx;"></image>
		</view>
	</view>
</template>
<script>
	export default {
		name: "sunui-star",
		props: {
			defaultStar: {
				type: Number,
				default: 3
			},
			defaultSize: {
				type: Number,
				default: 5
			},
		},
		computed: {
			foolNum() {
				return Math.floor(this.defaultStar) 
			},
			klength(){
				let tepm = this.foolNum == this.defaultStar ? this.foolNum:this.foolNum+1;
				return  this.defaultSize - tepm ;
			}
			
		},
		data() {
			return {
			}
		},
		methods: {
		}
	}
</script>
<style>
	.mg{
			margin: 14upx 10upx 10upx 10upx;
	}
</style>
