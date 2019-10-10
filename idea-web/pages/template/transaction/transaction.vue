<template>
	<view>
		<view class="padding border-bottom bg-white" 
		style="border-bottom: 2rpx solid #F1F1F1;" @click="jump(index)" :key="index" v-for="(item,index) in list">
			{{item.fund_name}}
		</view>
		<view class="text-center text-gray margin-top" v-if="list.length==0">暂无数据</view>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
import wPicker from '@/components/w-picker/w-picker2.vue';
export default {
	components: {
		wPicker,uniListItem
	},
	data() {
		return {
			list:[],
			fundList: [],
			fundListTme: [],
			navList: []
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '交易列表'
		});
		
	},
	onShow() {
		this.$http.gets('/idea/api/orderManagement/getOrderFundGroup').then(e=>{
			this.list = e ;
		})
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: './transactionAdd/transactionAdd'
		});
	},
	methods: {
		jump(index) {
			uni.navigateTo({
				url:'transactionDeit/transactionDeit?id='+this.list[index].paladyne_id
			})
		}
	}
};
</script>

<style>
@import url('../../../colorui/main.css');
@import url('../../../colorui/icon.css');
.item-pad text {
	margin-right: 6upx;
}
page {
	background-color: #ffffff;
}
.round {
}
</style>
