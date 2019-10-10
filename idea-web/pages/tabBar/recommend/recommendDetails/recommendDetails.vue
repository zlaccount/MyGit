<style>
	uni-button[type=primary]{
		width: 48%;
		float: left;
	}
	uni-button[type=default]{
		margin-left: 4%;
		width: 48%;
		float: left;
	}
	.bottom-felx{
		position: fixed;
		width: 96%;
		margin-left: 2%;
		background: #fff;
		z-index: 99;
		bottom:0;
	}
	page{
		margin-bottom: 190upx;
	}
</style>

<template>
	<view>
		<uni-list>
			<uni-list-item title="推荐日期" :msg="model.trade_date" showArrow="false"></uni-list-item>
			<uni-list-item title="股票代码" :msg="model.code" :note="model.codeMsg" showArrow="false"></uni-list-item>
			<uni-list-item title="方向" :msg="model.side" showArrow="false"></uni-list-item>
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" style="width: 100%;">目标价</view>
								<view class="uni-list-cell__content-note" style="color: #999999;">{{model.msg}}</view>
							</view>
							<view style="width: 40%;text-align: right;padding-right: 40upx;">
								<input maxlength="10" v-model="model.target" type="digit" placeholder="请输入" class="uni-list-cell__content-title grace-items msg "></input>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" style="width: 100%;margin-top: 14upx;">高度确信</view>
							</view>
							<view style="width: 40%;text-align: right;">
								<switch :checked="model.off" disabled />
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" style="width: 100%;margin-top: 14upx;">公开</view>
							</view>
							<view style="width: 40%;text-align: right;">
								<switch :checked="model.off2" @change="switch1ChangeOpen"  />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell__container">
				<view class="uni-list-cell">
					<uni-view class="uni-list-cell__content">
						<uni-view>
							<uni-view class="uni-list-cell__content-title" style="width: 100%;">推荐理由</uni-view>
							<uni-view style="color: #999999;display: block;">{{model.proposal_reason}}</uni-view>
						</uni-view>
					</uni-view>
				</view>
			</view>


			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view>
							<view class="uni-list-cell__content-title" style="width: 100%;">调价/结单理由</view>
							<textarea class="uni-list-cell__content-note" style="margin: 20upx 0;" v-model="model.return_analysis"
							 placeholder="请输入调价/结单理由"></textarea>
						</view>
					</view>
				</view>
			</view>
		</uni-list>
		<view style="height: 200upx;"></view>
		<view v-show="model.closed=='0'" class="garce-padding b-btn bottom-felx">
			<button type="primary" style="background-color: rgb(59, 98, 195)" @click="update">调价</button>
			<view style="height: 20upx;"></view>
			<button type="default" @click="close">结单</button>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				id: '',
				model: {
					off: '',
					codeMsg: '',
					msg: '潜在收益率：---',
					target: '',
					proposal_reason: ''
				}
			};
		},
		onLoad(e) {
			this.id = e.id
			this.$http.get("/idea/api/tradingLog/detail/" + this.id).then(e => {
				e.data.trade_date = this.$at.dateFtt("yyyy-MM-dd", new Date(Number(e.data.trade_date)))
				this.model = e.data
				let industry_gics = this.$at.isEmpty(this.model.industry_gics) ? '其他' : this.model.industry_gics
				this.model.cost = this.$at.isEmpty(this.model.cost) ? 0 : this.model.cost;
				this.model.codeMsg = industry_gics + '  ' + this.model.stock_name + ' 成本价 ' + this.model.cost;
				this.model.side = this.model.side == 'Long' ? '买入' : '卖空';
				this.model.off = this.model.high_conviction == '1' ? true : false;
				this.model.off2 = this.model.open_flag == '1' ? true : false;
				this.model.return_analysis = this.$at.isEmpty(this.model.return_analysis) ? '' : this.model.return_analysis;
				this.model.target = this.$at.isEmpty(this.model.target)? 0: this.$at.reservedDecimalOnAbs(this.model.target);
			})
		},
		methods: {
			switch1ChangeOpen(e) {
				// 0否定 1 是
				let open_flag= e.target.value ? '1' : '0' ;
				console.log(open_flag);
				uni.showLoading({
					title:'修改成功'
				})
				this.$http.posts('/idea/api/tradingLog/openUpdate/'+this.id,{open_flag}).then(e=>{
					uni.hideLoading();
					this.$at.toast(open_flag==1?'修改为可见成功':'修改为不可见成功')
				})
			},
			update() {
				if (this.$at.isEmpty(this.model.return_analysis)) {
					this.$at.toast('请输入调价理由')
					return;
				}
				this.$at.toast('正在申请调价')
				this.$http.post("/idea/api/tradingLog/update/" + this.id, {
					target: String(this.model.target),
					return_analysis: this.model.return_analysis
				}).then(e => {
					if (e.code == '0000') {
						this.$at.toast('调价成功')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 800)
					} else {
						this.$at.toast(e.msg)
					}
				})
			},
			close() {
				if (this.$at.isEmpty(this.model.return_analysis)) {
					this.$at.toast('请输入结单理由')
					return;
				}
				this.$at.toast('正在申请结单')
				this.$http.post("/idea/api/tradingLog/close/" + this.id, {
					target: String(this.model.target),
					return_analysis: this.model.return_analysis
				}).then(e => {
					if (e.code == '0000') {
						this.$at.toast('结单成功')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 800)
					} else {
						this.$at.toast(e.msg)
					}
				})
			},
			/**
			 * 计算潜在收益率  
			 * 买入 ： 目标价/成本价 - 1   卖空 1- 目标价/成本价
			 * *100   + ‘%’
			 */
			inputTarget(e) {
				if (this.$at.isEmpty(uni.getStorageSync("code3"))) {
					this.$at.toast("请先选择股票代码")
					this.model.target = null
					return;
				}
				let target = e.detail.value;
				let last = Number(uni.getStorageSync("code3").last);
				if (this.$at.isEmpty(last)) {
					this.$at.toast("成本价为空，无法计算潜在收益率")
					return;
				}
				if (this.$at.isEmpty(target)) {
					this.model.msg = '潜在收益率： ---'
					return;
				}
				target = Number(e.detail.value);
				let sim = target / last
				if (this.model.index == 0) {
					this.model.msg = '潜在收益率：' + this.$at.reservedDecimalOnAbs((sim - 1) * 100, 2) + '%'
				} else {
					target = Number(e.detail.value);
					this.model.msg = '潜在收益率：' + this.$at.reservedDecimalOnAbs((1 - sim) * 100, 2) + '%'
				}
				console.log()
			},
		}
	}
</script>

<style lang="scss">
	@mixin list-hover {
		background-color: $uni-bg-color-hover;
	}

	@mixin list-disabled {
		opacity: 0.3;
	}

	$list-cell-pd:$uni-spacing-col-lg $uni-spacing-row-lg;

	.uni-list-cell {
		font-size: $uni-font-size-lg;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		&--disabled {
			@include list-disabled;
		}

		&--hover {
			@include list-hover;
		}

		&__container {
			padding: $list-cell-pd;
			width: 100%;
			box-sizing: border-box;
			flex: 1;
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			&:after {
				position: absolute;
				z-index: 3;
				right: 0;
				bottom: 0;
				left: 30upx;
				height: 1px;
				content: '';
				-webkit-transform: scaleY(.5);
				transform: scaleY(.5);
				background-color: $uni-border-color;
			}
		}

		&__content {
			flex: 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			&-title {
				font-size: $uni-font-size-lg;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: inherit;
				line-height: 1.5;
				overflow: hidden;
			}

			&-note {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-base;
				white-space: normal;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		&__extra {
			width: 25%;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
		}

		&__icon {
			margin-right: 18upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			&-img {
				height: $uni-img-size-base;
				width: $uni-img-size-base;
			}
		}
	}

	.uni-list>.uni-list-cell:last-child .uni-list-cell-container:after {
		height: 0px;
	}
</style>
