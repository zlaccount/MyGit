<template>
	<view>
		<view class="padding"><uni-segmented-control :current="current" :values="tagList" @clickItem="onClickItem" activeColor="rgb(59, 98, 195)"></uni-segmented-control></view>
		<view class="flex justify-end"><button style="margin-right: 28upx;" class="cu-btn round shadow line-blue " @click="readAll">一键已读</button></view>
		<view class="padding item-msg" :key="index" v-for="(item, index) in list[current]">
			<view class="flex justify-around " @click="read(item, index)">
				<view>{{ item.msg }}</view>
				<view class=" badge " :class="current == 0 ? 'bg-red' : 'bg-blue'"></view>
			</view>
		</view>
		<!-- <uni-list-item :title="item.msg" :key="index" v-for="(item, index) in list[current]"></uni-list-item> -->
		<view v-show="totalsList[current] == list[current].length" class="text-center padding text-gray">没有更多{{ current == 0 ? '未读' : '已读' }}数据啦</view>
	</view>
</template>

<script>
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem,
		uniSegmentedControl
	},
	onReachBottom() {
		if (this.totalsList[this.current] != this.list[this.current].length) {
			this.readinit(); //翻页
		}
	},
	data() {
		return {
			current: 0,
			tagList: ['未读', '已读'],
			list: [[], []],
			totalsList: [0, 0],
			pageList: [
				{
					cPage: 1,
					pSize: 10
				},
				{
					cPage: 1,
					pSize: 10
				}
			]
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '消息提醒'
		});
		this.init();
	},
	methods: {
		read(item, index) {
			// 只允许已读序列进入
			if(this.current!=0){
				return;
			}
			this.$http.get('/idea/api/pushMsg/msgDetail/' + item.id).then(e => {
				let tem = this.list[0][index]
				this.list[1].unshift(tem);//已读序列新增
				this.list[0].splice(index, 1);//未读序列删除
				this.totalsList[0]--;
				this.totalsList[1]++;
				uni.navigateTo({
					url:'/pages/template/toRecommend/recommendDetails/recommendDetails?id='+item.link_id
				})
			});
		},
		onClickItem(index) {
			if (this.current !== index) {
				this.current = index;
			}
		},
		init() {
			Promise.all([
				this.$http.post('/idea/api/pushMsg/msgList' + this.$at.pageStr(this.pageList[0]), { readFlag: '0', fromPlace: 'idea' }),
				this.$http.post('/idea/api/pushMsg/msgList' + this.$at.pageStr(this.pageList[1]), { readFlag: '1', fromPlace: 'idea' })
			]).then(e => {
				this.list = e.map(s => s.data);
				this.totalsList = [e[0].totals, e[1].totals];
			});
		},
		readAll() {
			this.$http.post('/idea/api/pushMsg/msgRead', { fromPlace: 'idea' }).then(e => {
				this.$at.toast('已全部设为已读');
				this.init();
			});
		},
		readinit() {
			uni.showLoading({
				title: '加载中...'
			});
			this.pageList[this.current].cPage++;
			this.$http.post('/idea/api/pushMsg/msgList' + this.$at.pageStr(this.pageList[this.current]), { readFlag: String(this.current), fromPlace: 'idea' }).then(e => {
				let s = e.data;
				if (s.length == 0) {
					this.pageList[this.current].cPage--;
				} else {
					s.forEach(q => {
						this.list[this.current].push(q);
					});
				}
				uni.hideLoading();
			});
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
.item-msg {
	border-bottom: 2upx solid #eee;
}
.badge {
	width: 2.5vw;
	height: 1.8vw;
	background-color: #ec6d2c;
	border-radius: 100%;
	font-size: 20upx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}
.bg-red{
	
}
.line-blue{
	color: rgb(59, 98, 195) ;
}
.bg-blue {
	background-color: rgb(59, 98, 195) !important;
	color: #FFFFFF;
}
.text-gray{
	color: #8799a3;
}
</style>
