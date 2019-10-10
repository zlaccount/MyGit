<template>
	<view>
		<view class="grace-rows" style="margin-top:15px;">
                <view class="grace-items grace-bg-red grace-rows-demo grace-center">
                    1/3 自动缩放
                </view>
                <view class="grace-items grace-bg-blue grace-rows-demo grace-center">
                    1/3 自动缩放
                </view>
            </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props: {
			direction:{
				type: Boolean,
				default: true
			}
		}

	}
</script>

<style>
	.grace-rows-demo{height:118upx; color:#FFFFFF; width:100%; line-height:118upx;}
	.animation-element-wrapper {
		display: flex;
		width: 100%;
		overflow: hidden;
		background-color: #ffffff;
	}
	.animation-element {
		width: 100%;
	}
	.animation-buttons {
		padding:30upx 0;
		width: 100%;
		height: 360upx;
	}
	.animation-button {
		float: left;
		line-height: 2;
		width: 44%;
		margin: 15upx 3%;
	}
	.animation-button-reset {
		width: 94%;
	}
</style>