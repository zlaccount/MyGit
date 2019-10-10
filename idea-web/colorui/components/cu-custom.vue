<template>
	<view>
		<view style="z-index: 99;" class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
			<view class="cu-bar fixed" style=" height: 158rpx;background-color: rgb(59, 98, 195) ;color: #fff;" :style="style" :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="icon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view v-else class="action">
					<slot name="left"></slot>
				</view>
				<view class="content" style="font-weight: 700;line-height: 60upx;color: #000000;" :style="[{ top: StatusBar + 'px' }]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style;
			}
		},
		props: {
			bgColor: {
				type: String,
				default: 'bg-white'
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			pageUrl: {
				type: String,
				default: '/pages/index/index'
			}
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style>
	@import url("../main.css");
	@import url("../icon.css");
</style>
