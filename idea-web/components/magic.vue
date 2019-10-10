<template>
	<view class="container" @click="jump">
		<view class="tui-flex">
			<view class="tui-cube-box" >
				<view class="tui-cube tui-cube-1">{{ text }}</view>
				<view class="tui-cube tui-cube-2">{{ text1 }}</view>
				<view class="tui-cube tui-cube-3">{{ text }}</view>
				<view class="tui-cube tui-cube-4">{{ text1 }}</view>
				<view class="tui-cube tui-cube-5">{{ text }}</view>
				<view class="tui-cube tui-cube-6">{{ text1 }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			text: String,
			text1: String,
		},
		data() {
			return {
			}
		},
		methods: {
			jump(){
				uni.navigateTo({
					url:'/pages/zhiwen-share/zhiwen-share'
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 0 50upx 40upx 50upx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-flex {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 100px;
	}

	.tui-cube-box {
		width: 120upx;
		height: 120upx;
		position: relative;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		animation: tui-go 4s linear infinite;
	}

	@keyframes tui-go {
		0% {
			-webkit-transform: rotateX(0) rotateY(0);
			transform: rotateX(0) rotateY(0);
		}

		100% {
			-webkit-transform: rotateX(360deg) rotateY(360deg);
			transform: rotateX(360deg) rotateY(360deg);
		}
	}

	.tui-cube {
		width: 120upx;
		height: 120upx;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10upx;
		box-sizing: border-box;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		word-break: break-all;
		word-wrap: break-word;
	}

	.tui-cube-1 {
		background: #fff;
		-webkit-transform: rotateY(90deg) translateZ(-60upx);
		transform: rotateY(90deg) translateZ(-60upx);
		color: #333 !important;
	}

	.tui-cube-2 {
		background: #8a5966;
		-webkit-transform: rotateY(90deg) translateZ(60upx);
		transform: rotateY(90deg) translateZ(60upx);
	}

	.tui-cube-3 {
		background: linear-gradient(-90deg, #5677fc, #5c8dff);
		-webkit-transform: rotateX(90deg) translateZ(60upx);
		transform: rotateX(90deg) translateZ(60upx);
	}

	.tui-cube-4 {
		background: #ed3f14;
		-webkit-transform: rotateX(90deg) translateZ(-60upx);
		transform: rotateX(90deg) translateZ(-60upx);
	}

	.tui-cube-5 {
		background: #ff7900;
		-webkit-transform: translateZ(60upx);
		transform: translateZ(60upx);
	}

	.tui-cube-6 {
		background: #19be6b;
		-webkit-transform: translateZ(-60upx);
		transform: translateZ(-60upx);
	}

	.tui-content-box {
		width: 100%;
		margin-top: 50px;
		padding: 30upx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 10upx;
		box-shadow: 0 0 10upx #eee;
	}

	.tui-content {
		color: #333;
		font-size: 30upx;
		line-height: 44upx;
		padding: 10upx 0;
		text-align: justify;
	}

	.tui-content-email {
		color: #5677fc !important;
	}

	.tui-footer {
		display: flex;
		align-items: center;
		padding-top: 30upx;
	}

	.tui-applets {
		width: 80px;
		height: 80px;
		display: block;
	}

	.tui-footer-text {
		font-size: 24upx;
		color: #999;
		padding-left: 20upx;
		width: 300upx;
	}
</style>
