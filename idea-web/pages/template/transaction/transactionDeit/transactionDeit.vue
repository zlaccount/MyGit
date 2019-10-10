<template>
	<view>
		<view class="padding">
			<mSearch
				:mode="1"
				class="padding "
				placeholder="搜索股票代码"
				@quxaio="quxaio"
				@confirm="searchs()"
				@search="searchs()"
				v-model="search"
				backgroundColor="#f1f1f1"
			></mSearch>
		</view>

		<view v-for="(item, index) in list" v-show="search == ''" :key="index" @click="sel(index)">
			<view class="padding-left padding-right padding-top border-bottom " :class="item.id == retid ? 'bg-gray' : ''">
				<view class="flex padding-bottom justify-between align-center">
					<view style="width: 100vw;" class="flex justify-between">
						<view class="flex-sub ">
							<view class="text-green ">{{ item.side }}</view>
							<view class=" ">{{ item.shares }}@{{ item.limit }}</view>
						</view>
						<view class="flex-sub ">
							<view class=" ">{{ item.code }}</view>
							<view class=" ">{{item.status}}</view>
						</view>
						<view class="flex-sub text-right">
							<view class=" ">{{ item.stock_name }}</view>
							<view class=" ">{{ item.filled_qty }} @ {{ item.avg_price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-for="(item, index) in searchList" v-show="search != ''" :key="index" @click="sel(index)">
			<view class="padding-left padding-right padding-top  border-bottom" :class="item.id == retid ? 'bg-gray' : ''">
				<view class="flex  padding-bottom justify-between align-center">
					<view style="width: 100vw;" class="flex justify-between">
						<view class="flex-sub ">
							<view class="text-green ">{{ item.side }}</view>
							<view class=" ">{{ item.shares }}@{{ item.limit }}</view>
						</view>
						<view class="flex-sub ">
							<view class=" ">{{ item.code }}</view>
							<view class=" ">{{item.status}}</view>
						</view>
						<view class="flex-sub text-right">
							<view class=" ">{{ item.stock_name }}</view>
							<view class=" ">{{ item.filled_qty }} @ {{ item.avg_price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center text-gray margin-top" v-if="list.length==0">暂无数据</view>
		<view style="height: 130upx;"></view>
		<view class="bottom-flex flex shadow justify-end align-center" style="display: flex;flex-flow: row;">
			<view class="cu-btn bg-red" style="width: 200upx; height: 100upx;" @click="cancel(0)">撤单</view>
			<view class="cu-btn bg-blue" style="width: 200upx;height: 100upx;" @click="cancel(1)">改单</view>
		</view>
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
import wPicker from '@/components/w-picker/w-picker2.vue';
export default {
	components: {
		wPicker,
		mSearch
	},
	data() {
		return {
			search:'',
			list: [],
			searchList:[],
			id:'',
			retIndex:'',
			retid:'',
		};
	},
	onLoad(e) {
		this.id = e.id;
		uni.setNavigationBarTitle({
			title: '详情'
		});
	},
	onShow() {
		this.init();
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: './transactionAdd/transactionAdd'
		});
	},
	methods: {
		dist(val){
			switch (val){
				case 'NEW':
				return '新建';
					case 'AMENDED':
				return '已修改';
					case 'CANCELLED':
				return '已取消';
					case 'CLOSED':
				return '已关闭';
					case 'CREATED':
				return '新建';
					case 'DELETED':
				return '已删除';
					case 'PARTIALLY_FILLED':
				return '部分成交';
					case 'FILLED':
				return '全部成交';
				default:
				return '---';
					break;
			}
		},
		sel(index){
			this.retIndex = index ;
			let item = this.search == '' ? this.list[index] : this.searchList[index];
			this.retid = item.id;
		},
		init(){
			this.$http.gets('/idea/api/orderManagement/getOrderByFund/'+this.id).then(e=>{
				e.forEach(s=>{
					s.status = this.dist(s.status)
				})
				this.list = e;
			})
		},
		cancel(mark) {
			if(this.retid == ''){
				this.$at.toast('请先点选一项')
				return;
			}
			if (mark == 0) {
				this.$at.showModel('提示', '确定撤单？', () => {
					this.$http.posts('/idea/api/orderManagement/cancelOrder?id='+this.retid,{}).then(e=>{
						let index = null;
						let list = this.search == '' ? this.list : this.searchList;
						for (var i = 0; i < list.length; i++) {
							let s= list[i]
							if(s.id == this.retid){
								index = i;
							}
						}
						list.splice(index,1);
						this.$at.toast('撤单成功');
					})
				}, () => {});
			} else {
				uni.setStorageSync("retIndex",this.list[this.retIndex])
				uni.navigateTo({
					url:'/pages/template/transaction/transactionUpdate/transactionUpdate?id='+this.retid
				})
			}
		},
		quxaio(){
			this.search == '';
			this.searchList=[];

		},
		searchs() {
			if(this.search == ''){
				return	;
			}
			this.searchList=[];
			this.list.forEach(s=>{
				if(String(s.code).indexOf(this.search) > -1){
					this.searchList.push(s);
				}
			})
		},
	}
};
</script>

<style>
@import url('../../../../colorui/main.css');
@import url('../../../../colorui/icon.css');
.item-pad text {
	margin-right: 6upx;
}
.bg-gray {
	border-bottom: 5upx solid var(--blue) !important;
}
.border-bottom {
	border-bottom: 2upx solid #f1f1f1;
}
page {
	background-color: #ffffff;
}
.round {
}
.bottom-flex {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100vw;
	background-color: #fff;
	height: 100upx;
}
</style>
