<template>
	<view>
		<view class="padding ">
			<view class="border-bottom  flex align-center justify-between " style="">
				<view style="width: 10%;">基金</view>
				<view style="width: 70%;background-color: #f1f1f1; max-width: 60vw;" class="text-cut text-gray round text-center" @click="showPic(3)">
					{{ pojo.fund_name == '' ? '请选择' : pojo.fund_name }}
				</view>
				<view :class="pojo.fund_name != '' ? 'text-blue' : 'text-gray'" class=" text-right  " style="width: 20%;min-width: 132upx;" @click="jump(0)">查看持仓</view>
			</view>

			<view class="border-bottom justify-between  flex align-center text-gray" style="margin: 20upx 0;">
				<view class="text-left">
					<view>{{ pojo.fund_nav_name }}</view>
					<view>净值</view>
				</view>
				<view class="text-right">
					<view>USD</view>
					<view>货币</view>
				</view>
			</view>

			<view class="border-bottom  flex align-center " style="">
				<view style="width: 10%;">股票</view>
				<view style="width: 90%" class="text-gray round text-right" @click="jump(1)">{{ pojo.sharesName }}</view>
			</view>

			<view v-show="sharesIndex == 1">
				<view class="border-bottom  flex  text-center align-center text-gray" style="margin-top: 20upx;">
					<view class="text-left flex-sub">
						<view>{{ model.position }}</view>
						<view style="margin: 0;">持股</view>
					</view>
					<view class="flex-sub text-center">
						<view>{{ model.order_stock_exp_name }}</view>
						<view>头寸</view>
					</view>
					<view class="flex-sub text-right">
						<view class="text-right">{{ model.stock_price }}</view>
						<view>股价</view>
					</view>
				</view>

				<view class="border-bottom  flex align-center text-gray" style="margin-top: 20upx;">
					<view class="text-left flex-sub">
						<view>{{ model.avg_volume_20 }}</view>
						<view>均量</view>
					</view>
					<view class="flex-sub text-center">
						<view>{{ model.trade_currency }}</view>
						<view>货币</view>
					</view>
					<view class="text-right flex-sub">
						<view>{{ model.stock_fx }}</view>
						<view>汇率</view>
					</view>
				</view>
			</view>
			<view class="border-bottom flex align-center justify-around margin-top">
				<view
					class="cu-btn round "
					:class="pojo.side == item.value ? 'bg-blue' : 'bg-gray'"
					:key="index"
					v-for="(item, index) in sharesList[sharesIndex]"
					@click="sharesTap(item.value)"
				>
					{{ item.name }}
				</view>
			</view>

			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 10%;">方式</view>
				<view style="width: 90%;" class="text-gray round text-right" @click="showPic(modeIndex)">{{ modeMsg }}</view>
			</view>
			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 20%;">{{ tarMsg }}</view>
				<view style="width: 80%;"><input @input="sharesFun" v-model="pojo.target_exposure" type="number" placeholder="加减百分比,1%请输入1" /></view>
			</view>
			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 10%;">股数</view>
				<view style="width: 90%;"><input v-model="pojo.shares" type="number" placeholder="请输入" /></view>
			</view>
			<view class="border-bottom  flex align-center margin-top" style="">
				<view style="width: 10%;">限价</view>
				<view style="width: 90%;"><input v-model="pojo.limit" type="number" placeholder="输入0表示Market Order" /></view>
			</view>
			<view class="margin-top" style="margin-bottom: 20upx;">备注</view>
			<view class="border-bottom "><textarea placeholder-class="textarea-diy" placeholder="请输入" v-model="pojo.remark" maxlength="-1" /></view>

			<view class="border-bottom  align-center flex align-center justify-between margin-top" style="">
				<view>复制下单</view>
				<view><switch  @change="checkedTap" /></view>
			</view>
		</view>
		<!-- 基金下拉框 -->
		<w-picker v-if="fundList.length != 0" mode="selector" @confirm="onConfirm" ref="picker3" themeColor="#f00" :selectList="fundListTme"></w-picker>
		<!-- 方式下拉框 -->
		<w-picker mode="selector" @confirm="onConfirmMode" ref="picker0" themeColor="#f00" :selectList="modeList[0]"></w-picker>
		<w-picker mode="selector" @confirm="onConfirmMode" ref="picker1" themeColor="#f00" :selectList="modeList[1]"></w-picker>
		<view style="height: 120upx;"></view>
		<view class="bottom-flex flex  justify-end align-center" style="display: flex;flex-flow: row;">
			<view class="cu-btn bg-blue" style="width: 300upx;height: 100upx;" @click="submit(0)">下单</view>
		</view>
	</view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker2.vue';
export default {
	components: {
		wPicker
	},
	computed: {
		tarMsg() {
			if (this.modeMsg == '请选择') {
				return '头寸';
			}
			if (this.modeMsg == '变动量') {
				return '头寸';
			}
			if (this.modeMsg == '目标量') {
				return '目标';
			}
			if (this.modeMsg == 'Notional') {
				return 'Notional';
			}
		}
	},
	data() {
		return {
			modeOff: true,
			// 方式 - 常量
			modeList: [
				[{ value: 'exposure', label: '变动量' }, { value: 'goal', label: '目标量' }, { value: 'notional', label: 'Notional' }],
				[{ value: 'exposure_long', label: 'Exposure变动量-长仓' }, { value: 'exposure_short', label: 'Exposure变动量-短仓' }]
			],
			modeMsg: '请选择', //提示语
			modeIndex: 0, //当前选择的下标 根据股票方式所得 - 0 股票 1 现有持仓
			sharesIndex: 1,
			sharesList: [
				[{ name: '加仓', value: 'Add' }, { name: '减仓', value: 'Sell' }],
				[{ name: 'Long', value: 'Long' }, { name: 'LongSell', value: 'LongSell' }, { name: 'Short', value: 'Short' }, { name: 'ShortCover', value: 'ShortCover' }]
			],
			model: {
				position: '0', //持股
				order_stock_exp_name: '0', //头寸
				order_stock_exp: '0', //头寸
				stock_price: '0', //股价
				stock_fx: '0', // baseinfo 汇率
				avg_volume_20: '0', //baseinfo 均量
				trade_currency: '---' //货币
			},
			fundList: [],
			fundListTme: [],
			navList: [],
			pojo: {
				mirrorFlag: '0',
				comfirmFlag: '0',
				fund_name: '',
				fund_code: '',
				fund_nav_name: '---',
				side: '',
				shares: '',
				sharesName: '请选择'
			},
			code: {
				code: ''
			}
		};
	},
	onShow() {
		let code = uni.getStorageSync('code-1');
		if (this.$at.isNotEmpty(code)) {
			this.code = code;
			this.pojo.code = code.code;
			this.pojo.sharesName = `${code.code}(${code.name})`;
		}
		this.getExposureAndBasicInfo();
	},
	onUnload() {
		uni.removeStorageSync('code-1');
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '交易'
		});
		this.init();
	},
	methods: {
		sharesFun(e) {
			let val = e.detail.value;
			
			// 如果选了单只股票，并且，是Long sell或者short cover，目标量是0，那么股数直接取持仓的股数取绝对值
			if( this.pojo.code != 'all' 
				&& (this.pojo.side=='ShortCover' || this.pojo.side=='LongSell') 
				&& this.tarMsg == '目标'
				&& val == 0  ){
					this.pojo.shares = Math.abs(this.model.position_num)
				return ;
			}
			if(this.$at.isEmpty(this.model.lotsize) || this.model.lotsize == 0){
				this.model.lotsize = 100;
			}
			if (val == 0) {
				this.pojo.shares =  this.$at.reservedDecimal(this.model.position_num,2);
				// 现在在计算出来的股数，全部要加一个逻辑，股数/lotsize ,向下取整，然后乘以lotsize
				this.pojo.shares = Math.floor(Number(this.pojo.shares)/Number(this.model.lotsize)) * this.model.lotsize;
			} else if (this.pojo.stock_price > 0 && this.model.stock_fx > 0) {
				// 当前股价 和 汇率 不为空并且不为0  cur_exp:头寸暴露
				this.pojo.stock_price = this.$at.reservedDecimalOnAbs(this.pojo.stock_price, 2);
				this.pojo.fund_nav = this.$at.reservedDecimalOnAbs(this.pojo.fund_nav, 2);
				val = this.$at.reservedDecimalOnAbs(val, 2);
				this.model.stock_fx = this.$at.reservedDecimalOnAbs(this.model.stock_fx, 4);
				this.model.order_stock_exp = this.$at.reservedDecimalOnAbs(this.model.order_stock_exp, 2);
				if (this.tarMsg == '头寸') {
					this.pojo.shares = Math.floor((this.pojo.fund_nav * val) / (this.pojo.stock_price * this.model.stock_fx * 100));
				} else if (this.tarMsg == '目标') {
					this.pojo.shares = Math.floor(
						(this.pojo.fund_nav * Math.abs(Math.abs(this.model.order_stock_exp) - val)) / (this.pojo.stock_price * this.model.stock_fx * 100)
					);
				} else if (this.tarMsg == 'Notional') {
					this.pojo.shares = Math.floor(val / (this.pojo.stock_price * this.model.stock_fx));
				}
				// 现在在计算出来的股数，全部要加一个逻辑，股数/lotsize ,向下取整，然后乘以lotsize
				this.pojo.shares = Math.floor(Number(this.pojo.shares)/Number(this.model.lotsize)) * this.model.lotsize;
			} else {
				console.log('不计算');
			}
		},
		submit(comfirmFlag) {
			if (this.$at.isEmpty(this.pojo.fund_name)) {
				this.$at.toast('请选择基金');
				return;
			}
			if (this.pojo.sharesName == '请选择') {
				this.$at.toast('请选择股票');
				return;
			}
			if (this.modeMsg == '请选择') {
				this.$at.toast('请选择方式');
				return;
			}
			if (this.$at.isEmpty(this.pojo.side)) {
				this.$at.toast('请点选方向');
				return;
			}
			if (this.$at.isEmpty(this.pojo.target_exposure)) {
				this.$at.toast('请输入头寸');
				return;
			}
			if (this.$at.isEmpty(this.pojo.shares)) {
				this.$at.toast('请输入股数');
				return;
			}
			if (this.$at.isEmpty(this.pojo.limit)) {
				this.$at.toast('请输入限价');
				return;
			}

			uni.showLoading({ title: '下单中...' });
			this.pojo.paladyne_id = this.pojo.fund_code;
			this.pojo.comfirmFlag = String(comfirmFlag);
			this.$http.post('/idea/api/orderManagement/createOrder', this.pojo).then(e => {
				uni.hideLoading();
				if (e.code == '0000') {
					this.$at.toast('新增成功');
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 800);
				} else if (e.code == '8888') {
					this.$at.showModel(
						'警告',
						String(e.msg),
						() => {
							this.submit(1);
						},
						() => {}
					);
				} else {
					this.$at.toast(e.msg);
				}
			});
		},
		checkedTap() {
			this.pojo.mirrorFlag = this.pojo.mirrorFlag == '0' ? '1' : '0';
		},
		getExposureAndBasicInfo() {
			try {
				if (this.pojo.fund_nav_name == '---' || this.$at.isEmpty(this.pojo.fund_nav_name) || this.$at.isEmpty(this.code.code)) {
					return;
				}
			} catch (e) {
				return;
			}
			this.$http.posts('/idea/api/orderManagement/getExposureAndBasicInfo', { code: this.code.code, fund_id: this.pojo.fund_code }).then(e => {
				if (this.$at.isNotEmpty(e.exposure)) {
					this.model.position_num = e.exposure.position
					this.model.position = this.$at.numberFormat(e.exposure.position, '0');
					if (this.$at.isNotEmpty(e.exposure.my_exposure) && e.exposure.my_exposure != 0) {
						this.pojo.order_stock_exp = this.$at.reservedDecimalOnAbs(e.exposure.my_exposure, 2);
						this.model.order_stock_exp_name = this.$at.reservedDecimalOnAbs(e.exposure.my_exposure, 4) * 100 + '%';
					} else {
						this.pojo.order_stock_exp = 0;
						this.model.order_stock_exp_name = 0;
					}
				}
				if (this.$at.isNotEmpty(e.basicInfo)) {
					this.model.lotsize = this.$at.numberFormat(e.basicInfo.last, '100');
					this.model.stock_price = this.$at.numberFormat(e.basicInfo.last, '0');
					this.pojo.stock_price = e.basicInfo.last;
					this.model.stock_fx = this.$at.isEmpty(e.basicInfo.to_dollar_rate) ? '0' : e.basicInfo.to_dollar_rate;
					this.pojo.stock_fx = e.basicInfo.to_dollar_rate;
					this.model.avg_volume_20 = this.$at.numberFormat(e.basicInfo.avg_volume_20, 2, '0');
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
			this.pojo.shares = '';
			this.pojo.target_exposure = '';
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
input {
	text-align: right;
	background-color: #ffffff !important;
}
.border-bottom {
	border-bottom: 2upx solid #c8c7cc;
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
.leftw {
	width: 88upx;
}
.msg-item > view {
	margin-left: 10upx;
}
</style>
