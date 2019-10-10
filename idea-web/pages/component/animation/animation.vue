<template>
	<view>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'createAnimation',
				animationData: ''
			}
		}
	}
</script>

<style>
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
