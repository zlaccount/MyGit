<template>
	<view>
		<view class="search-box"><mSearch :mode="2" placeholder="公司名搜索" button="inside" @confirm="searchs()" @search="searchs()"  v-model="name"></mSearch></view>
		<view v-for="(item, index) in list" v-show="name==''" :key="index" @click="jump(item)" class="padding border">{{ item }}</view>
		<view v-for="(item, index) in searchList" 
			  v-show="name!=''"  :key="index" @click="jump(item)" class="padding border">{{ item }}</view>
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';

export default {
	components: {
		mSearch
	},
	data() {
		return {
			list: [],
			name: '',
			searchList:[]
		};
	},
	watch: {
		name(newValue) {
			if(newValue == ''){
				this.searchList = [];
			}
		}
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '公司列表'
		});
		this.$http.gets('/goldstream/dict/findDictByType/company_dict').then(e=>{
			this.list = e.map(s=>s.value)
		})
	},
	methods: {
		searchs() {
			this.searchList=[];
			this.list.forEach(s=>{
				if(String(s).indexOf(this.name) > -1){
					this.searchList.push(s);
				}
			})
		},
		jump(name) {
			uni.setStorageSync("companyName",name);
			uni.navigateBack({delta:1})
		}
	}
};
</script>

<style>
@import url('../../../../colorui/main.css');
@import url('../../../../colorui/icon.css');

page {
	background-color: #fff;
}
.search-box {
	width: 95%;
	display: flex;
	justify-content: space-between;
	border: 1px solid #ddd;
	margin-top: 10px;
	margin: 4%;
	width: 92%;
	box-sizing: border-box;
	border-radius: 50upx;
	padding-bottom: 3upx;
	padding-right: 2upx;
}
.border {
	border-bottom: 2upx solid #f1f1f1;
	border-top: 2upx solid #f1f1f1;
}
</style>
