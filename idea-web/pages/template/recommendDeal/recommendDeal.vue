<template>
	<view>
		<uni-list style="margin-top: 0;">
			<uni-list-item title="推荐日期" :msg="model.trade_date" showArrow="false"></uni-list-item>
			<uni-list-item title="股票代码" :msg="model.code" :note="model.codeMsg" @click="navigate"></uni-list-item>
			<uni-list-item title="方向" :msg="array[index]" showArrow="false" @click="bindPickerChange"></uni-list-item>
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view class="grace-rows">
							<view class="grace-columns grace-items" style="width: 60%;">
								<view class="uni-list-cell__content-title grace-items title" style="width: 100%;">目标价</view>
								<view class="uni-list-cell__content-note">{{model.msg}}</view>
							</view>
							<view style="width: 40%;text-align: right;margin-top: 20upx;">
								<input maxlength="10" @input="inputTarget" v-model="model.target" type="digit" placeholder="请输入" class="uni-list-cell__content-title grace-items msg "></input>
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
								<switch checked @change="switch1Change" />
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
								<switch @change="switch1ChangeOpen" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell__container">
					<view class="uni-list-cell__content">
						<view>
							<view class="uni-list-cell__content-title" style="width: 100%;">推荐理由</view>
							<textarea class="uni-list-cell__content-note" style="margin-top: 20upx;" v-model="model.proposal_reason"
							 placeholder="请输入推荐理由"></textarea>
						</view>
					</view>
				</view>
			</view>

		</uni-list>
	</view>
</template>

<script>
	// 123
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components: {
			uniList,
			uniListItem
		},
		// 监听导航栏自定义按钮事件
		onNavigationBarButtonTap() {
			this.submit()
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				model: {
					code: '请选择',
					codeMsg: '',
					trade_date: currentDate,
					side: 'Long',
					msg: '潜在收益率：---',
					target: '',
					open_flag: '0',
					high_conviction: '1',
					proposal_reason: ''
				},
				array: ['买入', '卖空'],
				index: 0,
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onUnload() {
			uni.removeStorageSync("code3")
		},
		onLoad() {
			this.$http.gets('/idea/api/tradingLog/queryRecommendAuthority/' + this.$at.user().userId).then(e => {
				if (this.$at.isEmpty(e) || e.length <= 0) {
					uni.showModal({
						title: '权限不足',
						content: '尊敬的用户，您尚未开通荐股权限，烦请联系神算子客服专员。',
						showCancel: false,
						confirmText: '确定',
						success: res => {
							uni.navigateBack();
						},
						fail: () => {
							uni.navigateBack();
						},
						complete: () => {
							uni.navigateBack();
						}
					});
				}
			})
		},

		onShow() {
			let code = uni.getStorageSync("code3")
			if (!this.$at.isEmpty(code)) {
				this.model.code = code.code;
				let industry_gics = this.$at.isEmpty(code.industry_gics) ? '其他' : code.industry_gics;
				this.$http.post("/idea/api/tradingLog/getCodeCost", {
					code: code.code,
					time: this.model.trade_date
				}).then(e => {
					this.model.codeMsg = industry_gics + '  ' + code.name + ' 成本价 ' + this.$at.reservedDecimalOnAbs(e.data.cost);
					code.last = e.data.cost;
					uni.setStorageSync("code3", code)
				})
			}
		},
		methods: {

			switch1Change(e) {
				// 0否定 1 是
				this.model.high_conviction = e.target.value ? '1' : '0'
			},
			switch1ChangeOpen(e) {
				// 0否定 1 是
				this.model.open_flag = e.target.value ? '1' : '0'
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
				if (this.$at.isEmpty(target)) {
					this.model.msg = '潜在收益率： ---'
					return;
				}
				target = Number(e.detail.value);
				if (Number(last) == 0) {
					this.model.msg = '成本价为0，无法计算潜在收益率'
					return;
				}
				let sim = target / last
				if (this.index == 0) {
					this.model.msg = '潜在收益率：' + this.$at.reservedDecimalOnAbs((sim - 1) * 100, 2) + '%'
				} else {
					target = Number(e.detail.value);
					this.model.msg = '潜在收益率：' + this.$at.reservedDecimalOnAbs((1 - sim) * 100, 2) + '%'
				}
			},
			navigate() {
				uni.navigateTo({
					url: "/pages/component/HM-search/HM-search?mark=3"
				})
			},
			submit() {
				let model = this.model;

				if (model.code == '请选择') {
					this.$at.toast('请选择股票代码')
					return;
				}
				if (this.$at.isEmpty(model.proposal_reason)) {
					this.$at.toast('请输入推荐理由')
					return;
				}
				if (this.$at.isEmpty(model.target)) {
					this.$at.toast('请输入目标价')
					return;
				}
				model.side = this.index == 0 ? 'Long' : 'Short';
				this.$at.showModel('提示', '是否创建交易', () => {
					this.$at.toast("正在创建...")
					this.$http.post('/idea/api/tradingLog/insert', model).then(e => {
						if (e.code == '0000') {
							this.$at.toast("创建成功")
							uni.navigateBack({
								delta: 1
							});
						} else {
							this.$at.toast(e.msg)
						}
					})
				})
			},
			bindPickerChange(e) {
				uni.showActionSheet({
					itemList: this.array,
					success: (res) => {
						this.index = res.tapIndex
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
				this.model.target = null
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #F1F1F1;
	}

	.uni-list {
		background-color: #fff;
		margin-top: 40upx;
	}

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
