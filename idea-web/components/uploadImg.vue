<template>
	<view :class="classOff?'content':''">
		<view class="cu-bar bg-white margin-top ">
			<view class="action">{{ msg }}</view>
			<view class="action">{{ defs?'1':imgList.length }}/{{ size }}</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view v-show="defs" class="padding-xs bg-img" :style="'background-image:url(' + defs + ')'" @tap="ViewImage" :data-url="defs">
					<view class="cu-tag bg-red" @tap.stop="DelImg"><text class="icon-close"></text></view>
				</view>
				<view
					v-show="!defs"
					class="padding-xs bg-img"
					:style="'background-image:url(' + imgList[index] + ')'"
					v-for="(item, index) in imgList"
					:key="index"
					@tap="ViewImage"
					:data-url="imgList[index]"
				>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="icon-close"></text></view>
				</view>
				<view class="padding-xs solids" @tap="ChooseImage" v-show="imgList.length < size && !defs"><text class="icon-cameraadd"></text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'upload-img',
	props: {
		def: String,
		keys:{
			type: Number,
			default: 0
		},
		msg: {
			type: String,
			default: '图片上传'
		},
		classOff:{
			type: Boolean,
			default: true
		},
		size: {
			type: Number,
			default: 1
		},
		name: {
			type: String,
			default: 'img'
		}
	},
	data() {
		return {
			imgList: [],
			defs: this.def
		};
	},
	computed: {},
	watch: {
		imgList(e) {
			if(this.classOff){
				let ret = { name: this.name, img: this.imgList[0] };
				this.$emit('onChange', ret);
			}else{
				this.$emit('onChange', this.imgList);
			}
		}
	},
	methods: {
		ChooseImage() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				success: res => {
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths);
						this.imgList.push('');
						this.imgList.pop(); 
					} else {
						this.imgList = res.tempFilePaths;
					}
				}
			});
		},
		ViewImage(e) {
			if (this.$at.isNotEmpty(this.defs)) {
				let img = [];
				img[0] = this.defs;
				uni.previewImage({
					urls: img
				});
			} else {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			}
		},
		DelImg(e) {
			this.$at.showModel('提示','确定要删除？',()=>{
				if (this.$at.isNotEmpty(this.defs)) {
					this.defs = '';
				}else{
					this.imgList.splice(e.currentTarget.dataset.index, 1);
				}
				this.$emit('delImg', this.keys);

			},()=>{})
		}
	}
};
</script>

<style>
	@import url('../colorui/main.css');
	@import url('../colorui/icon.css');
</style>
