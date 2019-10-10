<template>
	<view>
		<view class="uni-common-mt" style="background:#FFF; padding:20upx;">
			<view class="solid-bottom text-xl padding">{{pojo.title}}</view>
			<view class="vimgs" >
				<image :src='bathPath+pojo.img' mode="aspectFill" class="vimg" style="width: 100%;height: 450upx;"></image>
			</view>
			<u-parse :content="pojo.main" v-if="pojo.main" ></u-parse>
			<!-- <rich-text :nodes="pojo.main"></rich-text> -->
		</view>
	</view>
</template>

<script>
	 
import uParse from '@/components/un-parse/u-parse.vue'//由于插件上传命名问题在目录上加了一个n
	export default {
		components:{
			 uParse
		},
		data() {
			return {
				bathPath: "https://kaizen.goldstreamfund.com/",
				pojo: {}
			};
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title:'观点详情'
			})
			this.$http.get("goldstream/point/detail/"+e.id).then(e => {
				this.pojo = e.data;
			})
		}
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
</style>
