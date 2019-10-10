<template>
	<view v-if="loadingPage">
		<mht-loader></mht-loader>
	</view>
	<view v-else>
		<uni-list>
			<uni-list-item v-for="(item,index) in gics.list" :key="index" :title="item.analyst_name" :msg="item.profit_total"
			 :note="item.company" show-arrow="false"  @click="jumpTo(index)" ></uni-list-item>
			 <uni-load-more :status="loading"></uni-load-more>
		</uni-list>
	</view>
</template>

<script>
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui'

	export default {
		components: {
			mhtLoader,
			uniLoadMore,
			uniList,
			uniListItem
		},
		data() {
			return {
				loadingPage:true,
				loading: 'more',
				gics: {
					industry_gics: '',
					queryType: '',
					list: []
				},
				page: {
					cPage: 1,
					pSize: 10
				},
			};
		},
		onReachBottom() {
			if (this.loading != 'noMore') {
				this.loading = 'loading';
				this.page.cPage++;
				this.init();
			}
		},
		methods: {
			jumpTo(index) {
				uni.setStorageSync('toUser', this.gics.list[index])
				uni.navigateTo({
					url: '/pages/template/toRecommend/toRecommend'
				})
			},
			pageStr() {
				return "?cPage=" + this.page.cPage + "&&pSize=" + this.page.pSize;
			},
			init() {
				this.$http.post('/idea/api/rank/industryGicsRank'+this.pageStr(), this.gics).then(e => {
					if (e.data.length > 0) {
						if (this.page.cPage == 1) {
							this.list = []
						}
						for (var i = 0; i < e.data.length; i++) {
							e.data[i].profit_total = this.$util.WU.reservedDecimalOnAbs(e.data[i].profit_total, 2)
							if (e.data[i].profit_total == 'NaN') {
								e.data[i].profit_total = '0'
							}
							if(this.$at.isEmpty(e.data[i].analyst_name)){
								e.data.splice(i,1);
							}
							this.gics.list.push(e.data[i]);
						}
					}
					if (e.data.length < 10) {
						this.loading = 'noMore'
					}
					uni.stopPullDownRefresh();
					this.loadingPage = false;
					this.loading = false
				})
			}

		},
		onLoad(e) {
			this.gics.industry_gics = e.industry_gics
			this.gics.queryType = e.queryType
			this.gics.company = e.company
			uni.setNavigationBarTitle({
				title:  e.industry_gics
			});
			this.init();
		}
	}
</script>

<style>

</style>
