<template>
	<view>
		<view class="padding ">
			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 10%;">股数</view>
				<view style="width: 90%;"><input v-model="pojo.shares" type="number" placeholder="请输入" /></view>
			</view>
			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 10%;">限价</view>
				<view style="width: 90%;"><input v-model="pojo.limit" type="number" placeholder="请输入" /></view>
			</view>
			<view class="border-bottom   flex   margin-top">
				<view style="width: 72upx;">备注</view>
				<textarea placeholder="请输入" v-model="pojo.remark" maxlength="-1" />
			</view>
		</view>
		<view style="height: 120upx;"></view>
		<view class="bottom-flex flex  justify-end align-center" style="display: flex;flex-flow: row;">
			<view class="cu-btn bg-blue" style="width: 300upx;height: 100upx;" @click="submit(0)">改单</view>
		</view>
	</view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker2.vue';
export default {
	components: {
		wPicker
	},
	data() {
		return {
			pojo: {},
			model:{},
			code: {
				code: ''
			}
		};
	},
	onLoad(e) {
		this.pojo.id = e.id;
		uni.setNavigationBarTitle({
			title: '改单'
		});
	},
	onUnload() {
		uni.removeStorageSync("retIndex");
	},
	onShow() {
		this.pojo = uni.getStorageSync("retIndex")
	},
	methods: {
		submit(comfirmFlag) {
			if (this.$at.isEmpty(this.pojo.shares)) {
				this.$at.toast('请输入股数');
				return;
			}
			if (this.$at.isEmpty(this.pojo.limit)) {
				this.$at.toast('请输入限价');
				return;
			}
			uni.showLoading({ title: '改单中...' });
			this.$http.posts('/idea/api/orderManagement/amendOrder', this.pojo).then(e => {
				uni.hideLoading();
				this.$at.toast('改单成功');
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 800);
			});
		},
		checkedTap() {
			this.pojo.mirrorFlag = this.this.pojo.mirrorFlag == '0' ? '1' : '0';
		},
		getExposureAndBasicInfo() {
			try {
				if (this.pojo.fund_nav_name == '---' || this.$at.isEmpty(this.pojo.fund_nav_name) || this.$at.isEmpty(this.code.code)) {
					return;
				}
			} catch (e) {
				return;
			}
			this.$http.posts('/idea/api/orderManagement/getExposureAndBasicInfo', { code: this.code.code, fund_id: this.pojo.fund_nav_name }).then(e => {
				if (this.$at.isNotEmpty(e.exposure)) {
					this.model.position = this.$at.numberFormat(e.exposure.position);
					let order_stock_exp = this.$at.numberFormat(e.exposure.my_exposure);
					// my_exposure
					this.pojo.order_stock_exp = e.exposure.my_exposure;
					this.model.order_stock_exp = order_stock_exp != '---' ? order_stock_exp + '%' : order_stock_exp;
				}
				if (this.$at.isNotEmpty(e.basicInfo)) {
					this.model.stock_price = this.$at.numberFormat(e.basicInfo.last);
					this.pojo.stock_price = e.basicInfo.last;

					this.model.stock_fx = this.$at.isEmpty(e.basicInfo.to_dollar_rate) ? '---' : e.basicInfo.to_dollar_rate;
					this.pojo.stock_fx = e.basicInfo.to_dollar_rate;

					this.model.avg_volume_20 = this.$at.numberFormat(e.basicInfo.avg_volume_20);
					this.model.trade_currency = e.basicInfo.trade_currency;
				}
			});
		},
		sharesTap(value) {
			this.pojo.side = value;
		},
		init() {
			this.$http.gets('/idea/api/orderManagement/getFundList').then(e => {
				this.fundList = e;
				this.fundListTme = this.fundList.map(s => {
					// market_value_usd
					s.fund_nav_name = this.$at.numberFormat(s.market_value_usd, 2, '---');
					return { label: s.fund_name, value: s.paladyne_id + '==' + s.fund_nav_name + '==' + s.market_value_usd };
				});
				console.log(this.fundListTme);
			});
		},
		showPic(index) {
			this.$refs['picker' + index].show();
		},
		onConfirmMode(e) {
			this.modeMsg = e.result;
			this.pojo.order_method = e.checkArr.value;
		},
		onConfirm(e) {
			let arr = e.checkArr.value.split('==');
			this.pojo.fund_code = arr[0];
			this.pojo.fund_name = e.checkArr.label;
			this.pojo.fund_nav_name = arr[1];
			this.pojo.fund_nav = arr[2];
			this.getExposureAndBasicInfo();
			// this.applyFund(arr[0]);
		},
		jump(mark = 0) {
			let _this = this;
			switch (mark) {
				case 0:
					if (this.$at.isEmpty(this.pojo.fund_code)) {
						this.$at.toast('请先选择基金');
						return;
					}
					uni.navigateTo({
						url: '../fundExposure/fundExposure?id=' + this.pojo.fund_code
					});
					break;
				case 1:
					uni.showActionSheet({
						itemList: ['全部现有持仓', '搜索股票'],
						success(e) {
							_this.sharesIndex = e.tapIndex;
							_this.modeIndex = e.tapIndex == 0 ? 1 : 0;
							if (e.tapIndex == 0) {
								_this.pojo.sharesName = '全部现有持仓';
								_this.pojo.code = 'all';
							} else {
								uni.navigateTo({
									url: '/pages/component/HM-search/HM-search?mark=-1&queryType=0&selIndex=3'
								});
							}
						}
					});

					break;
				default:
					break;
			}
		}
	}
};
</script>

<style>
@import url('../../../../colorui/main.css');
@import url('../../../../colorui/icon.css');
.border-bottom {
	border-bottom: 2upx solid #f1f1f1;
	padding-bottom: 20upx;
}

.bottom-flex {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100vw;
	background-color: #fff;
	height: 100upx;
}
page {
	background-color: #fff;
	max-width: 100vw;
}
.margin-top {
	margin-top: 20upx;
}
input,
textarea {
	background-color: #f1f1f1;
	border-radius: 20upx;
	padding: 4upx 20upx;
}
.leftw {
	width: 88upx;
}
.msg-item > view {
	margin-left: 10upx;
}
</style>
