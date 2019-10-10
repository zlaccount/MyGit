<template>
	<view>
		<upload-img v-if="pojo.business_card" :def="pojo.business_card" key="上传名片3" @delImg="onChange" msg="上传名片" name="business_card" @onChange="onChange"></upload-img>
		<upload-img  v-else key="上传名片" @delImg="onChange" msg="上传名片" name="business_card" @onChange="onChange"></upload-img>
		<uni-list>
			<view class="flex align-center padding justify-between" style="border-bottom: 2rpx solid #F1F1F1;">
				<view >
					<input type="text" placeholder="请输入公司名" v-model="pojo.company" />
				</view>
				<view>
					<view style="width: 20vw;min-width: 160upx;" class="cu-btn round" @click="jump">选择</view>
				</view>
				
			</view>
			<view class="flex align-center padding justify-between" 
					style="border-bottom: 2rpx solid #F1F1F1;">
				<view >
					<!-- start_year -->
					入行时间 
				</view>
				<picker mode="date" fields="year" @change="changeDate" start="1950" :end="getYear" >
					<view style="margin-right: 40rpx;">
						{{start_year}}
					</view>
				</picker>
			</view>
		</uni-list>
		<view class="cu-btn round padding bg-blue" style=" width: 90vw; margin: 100upx 5vw;" @click="submit">提交</view>

	</view>
</template>

<script>
import uniListItem from '@/components/uni-list-item/uni-list-item-to.vue';
import uniList from '@/components/uni-list/uni-list.vue';
import uploadImg from '@/components/uploadImg.vue';
export default {
	components: {
		uploadImg,
		uniListItem,
		uniList
	},
	computed: {
		getYear(){
			return this.$at.dateFtt('yyyy');
		},
		start_year() {
			return this.$at.isEmpty(this.pojo.start_year) ?'请输入':this.pojo.start_year
		}
	},
	data() {
		return {
			pojo: { company: '',business_card:'', start_year:''}
		};
	},
	onUnload() {
		uni.removeStorageSync("companyName")
	},
	onShow() {
		let companyName = uni.getStorageSync("companyName");
		if(this.$at.isNotEmpty(companyName) && JSON.stringify(companyName) != '{}'){
			this.pojo.company = companyName;
		}
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '修改名片'
		});
		this.$http.gets('/idea/api/user/simple/'+uni.getStorageSync("user").userId).then(e=>{
			this.pojo = Object.assign(this.pojo,e);
		})
	},
	methods: {
		changeDate(e){
			this.pojo.start_year = String(e.detail.value).substring(0,4)
		},
		jump(){
			uni.navigateTo({
				url:'/pages/template/businessCard/companyList/companyList'
			})
		},
		submit(){
			if(this.$at.isEmpty(this.pojo.business_card)){
				this.$at.toast('请上传图片')
				return ;
			}
			if(this.$at.isEmpty(this.pojo.company)){
				this.$at.toast('请输入公司名')
				return ;
			}
			uni.showLoading({
				title:'提交中...'
			})
			this.$http.posts('/idea/api/user/updateBusinessCard',this.pojo).then(e=>{
				uni.hideLoading()
				this.$at.toast('修改成功')
				setTimeout(()=>{
					uni.navigateBack({delta:1})
				},800)
			})
			
			
		},
		input(e){
			this.pojo.start_year  = e.value
		},
		delImg(e) {
		},
		onChange(e) {
			if(e == 0){
				this.pojo.business_card = '' ;
				return;
			}
			this.$at.uploadFile('/goldstream/attachUpload/upload',e.img,(s)=>{
				this.pojo[e.name] = s.httpUrl ;
			})
		}
	}
};
</script>

<style>
@import url('../../../colorui/main.css');
@import url('../../../colorui/icon.css');
</style>
