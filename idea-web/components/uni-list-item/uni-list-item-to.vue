<style>
.input-placeholder {
	color: gainsboro !important;
}
.uni-textarea {
	width: 100%;
	background: #fff;
}
.uni-textarea textarea {
	width: 96%;
	padding: 18upx 2%;
	line-height: 1.6;
	font-size: 28upx;
	height: 150upx;
}
.title {
	width: 50%;
}
.msg {
	font-size: 28upx;
	color: rgba(100, 100, 100, 1);
}
.uni-list-cell__extra {
	width: 6% !important;
}
.ssz-msg {
	position: absolute;
	top: 50%;
	margin-top: -24upx;
	right: 72upx;
}
.ssz-width {
	width: 100% !important;
}
.textarea-ssz {
	padding: 20upx 0;
	line-height: 20upx;
}
.ssz-wrap-item {
	margin: 0 30upx;
	padding-left: 0upx;
	border-bottom: 2upx solid #eee;
}
.uni-list-cell__content-title {
	max-width: 300upx;
}
</style>
<template>
	<view @click="onClick">
		<view class="uni-list-cell__container" v-if="mark < 10">
			<view class="uni-list-cell__icon" v-if="thumb"><image class="uni-list-cell__icon-img" :src="thumb"></image></view>
			<view class="uni-list-cell__icon" v-else-if="showExtraIcon === true || showExtraIcon === 'true'">
				<uni-icon :color="extraIcon.color" :size="extraIcon.size" :type="extraIcon.type"></uni-icon>
			</view>
			<view class="uni-list-cell__content">
				<view v-if="!msg">
					<view class="uni-list-cell__content-title" style="width: 100%;">{{ title }}</view>
					<view class="uni-list-cell__content-note" v-if="note">{{ note }}</view>
					<view v-show="mark == 1" style="text-align: right;">
						<view style="width: 50%;" class="uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">
							<input :type="inputType" :placeholder="msg" @input="onInput" :value="msg" />
						</view>
					</view>
				</view>
				<view v-else class="grace-rows">
					<view class="grace-columns grace-items" style="width: 60%;">
						<view class="uni-list-cell__content-title grace-items title" style="width: 100%;">
							{{ title }}
						</view>
						<view class="uni-list-cell__content-note" v-if="note" v-html="note"></view>
					</view>
					<view style="width: 40%;text-align: right;margin-top: 20upx;" v-if="note">
						<view class="uni-list-cell__content-title grace-items msg ssz-msg" @click="onInput(arr)" :style="{ color: color }">{{ arrMsg == '' ? msg : arrMsg }}</view>
					</view>
					<view style="width: 40%;text-align: right;">
						<!-- 单行输入框 -->
						<view v-show="mark == 1">
							<view style="width: 50%;" class="uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">
								<input :type="inputType" :placeholder="msg" @input="onInput" :value="msg" v-if="msg != '请输入'" />
								<input :type="inputType" :placeholder="msg" @input="onInput" v-else />
							</view>
						</view>
						<!-- 文字 -->
						<view v-show="mark == 0">
							<view class="uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">{{ msg }}</view>
						</view>
						<!-- 单选操作菜单 -->
						<view v-show="mark == 2">
							<view @click="onInput(arr)" class="uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">
								{{ arrMsg == '' ? msg : arrMsg }}
							</view>
						</view>
						<view v-show="mark == 3">
							<picker mode="date" :start="startDate" :end="endDate" @change="bindDateChange" :fields="dateFor">
							<view  class="ssz-width uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">
								{{ arrMsg == '' ? msg : arrMsg }}
							</view>
							</picker>
						</view>
						<view v-show="mark == 4">
							<picker mode="selector" :range="arrList" @change="selectorChange">
								<view class="ssz-width uni-list-cell__content-title grace-items msg ssz-msg" :style="{ color: color }">{{ arrMsg == '' ? msg : arrMsg }}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			<view
				class="uni-list-cell__extra"
				v-if="showBadge === true || showBadge === 'true' || showArrow === true || showArrow === 'true' || showSwitch === true || showSwitch === 'true'"
			>
				<uni-badge size="small" v-if="showBadge === true || showBadge === 'true'" :type="badgeType" :text="badgeText"></uni-badge>
				<switch
					:disabled="disabled"
					v-if="showSwitch === true || showSwitch === 'true'"
					@change="onSwitchChange"
					:class="pojo.showSwitch ? 'checked' : ''"
					:checked="pojo.showSwitch ? true : false"
				></switch>
				<!-- <switch  :checked="switchChecked" @change="onSwitchChange" /> -->
				<view v-show="showArrow === true || showArrow === 'true'" class="icon-right"></view>
			</view>
		</view>
		<view v-else>
			<view v-show="mark == 10" class="ssz-wrap-item">
				<view class="cu-form-group " style="padding-left: 0upx">
					<view class="title" style="width: 70%;">
						{{ title }}
					</view>
					<switch v-if="showSwitch === true || showSwitch === 'true'" checked @change="onSwitchChange"></switch>
					<switch v-if="showSwitch === false || showSwitch === 'false'" @change="onSwitchChange"></switch>
				</view>
				<view style="color: #999;margin-right:20upx ; ">{{ note }}</view>
			</view>
			<view v-show="mark == 11 && !disabled" class="ssz-wrap-item">
				<view>
					<view class="cu-form-group " style="padding-left: 0upx">
						<view class="title" style="width: 90%;">
							{{ title }}
						</view>
					</view>
					<view style="width: 100%;"><textarea :value="msg == '请输入' ? '' : msg" :placeholder="msg == null ? '请输入' : msg" maxlength="-1" @input="onInput" /></view>
				</view>
			</view>
			<view v-show="mark == 30" style="height: 96upx; background-color: #F1F1F3; text-align: center;line-height: 96upx;">{{ title }}</view>
		</view>
		<w-picker v-if="mark == 3" mode="date" endYear="2099"  startYear="1920" @confirm="onConfirm" ref="picker" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
import uniIcon from '../uni-icon/uni-icon.vue';
import uniBadge from '../uni-badge/uni-badge.vue';
import wPicker from '../w-picker/w-picker.vue';

export default {
	name: 'uni-list-item',
	components: {
		uniIcon,
		wPicker,
		uniBadge
	},
	data() {
		return {
			arrMsg: '',
			value: '',
			pojo: {
				index: '',
				value: '',
				showSwitch: false
			}
		};
	},
	props: {
		inputType: {
			type: String,
			default: 'text'
		},
		ifMsg: String,
		listItem: Object, //其他参数：开始时间，结束时间
		keys: Number, //下标
		arr: Array, //操作菜单list
		mark: {
			type: Number,
			default: 0
		},
		title: String, //列表标题
		note: String, //列表描述
		dateFor: String,
		msg: {
			type: [Number, String]
		}, //右侧列表描述
		color: {
			type: String,
			default: 'rgba(100,100,100,1)'
		}, //msg是否展示颜色
		disabled: {
			//是否禁用
			type: [Boolean, String],
			default: false
		},
		showArrow: {
			//是否显示箭头
			type: [Boolean, String],
			default: false
		},
		showBadge: {
			//是否显示数字角标
			type: [Boolean, String],
			default: false
		},
		showSwitch: {
			//是否显示Switch
			type: [Boolean, String],
			default: false
		},
		switchChecked: {
			//Switch是否被选中
			type: [Boolean, String],
			default: false
		},
		badgeText: String, //badge内容
		badgeType: {
			//badge类型
			type: String,
			default: 'default'
		},
		thumb: String, //缩略图
		showExtraIcon: {
			//是否显示扩展图标
			type: [Boolean, String],
			default: false
		},
		extraIcon: {
			type: Object,
			default() {
				return {
					type: 'contact',
					color: '#000000',
					size: '20'
				};
			}
		}
	},
	computed: {
		defaultVal() {
			if (this.mark != 3) {
				return;
			}
			if (this.$at.isNotEmpty(this.testData(this.msg))) {
				let arr = String(this.msg).split('-');
				return [Number(arr[0]) - 1920, Number(arr[1]) - 1, Number(arr[2]) - 1, 0, 0, 0];
			} else {
				let arr = this.getDate('the').split('-');
				return [Number(arr[0]) - 1920, Number(arr[1]) - 1, Number(arr[2]) - 1, 0, 0, 0];
			}
		},
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		},
		arrList() {
			if (this.$at.isNotEmpty(this.arr)) {
				return this.arr;
			}
			return [];
		}
	},
	methods: {
		testData(value) {
			var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
			var regExp = new RegExp(reg);
			if (!regExp.test(value)) {
				return '';
			}
			return value;
		},
		ondate() {
			this.$refs.picker.show();
		},
		onConfirm(e) {
			this.arrMsg = e.result;
			this.toPojo(e.result);
			this.$emit('clInput', this.pojo);
		},
		selectorChange(e) {
			this.arrMsg = this.arr[e.detail.value];
			this.toPojo(this.arr[e.detail.value]);
			this.$emit('clInput', this.pojo);
		},
		bindDateChange(e) {
			this.arrMsg = e.target.value;
			this.toPojo(e.target.value);
			this.$emit('clInput', this.pojo);
		},
		onInput(e) {
			if (this.mark == 2) {
				if (e[0].name && this.$at.isNotEmpty(e[0].name)) {
					uni.showActionSheet({
						itemList: e.map(s => s.name),
						success: res => {
							this.arrMsg = e[res.tapIndex].name;
							this.toPojo(e[res.tapIndex].value);
							this.$emit('clInput', this.pojo);
							return;
						}
					});
				} else {
					uni.showActionSheet({
						itemList: e,
						success: res => {
							this.arrMsg = e[res.tapIndex];
							this.toPojo(e[res.tapIndex]);
							this.$emit('clInput', this.pojo);
							return;
						}
					});
				}
			} else {
				this.toPojo(e.detail.value);
				this.$emit('clInput', this.pojo);
			}
		},
		toPojo(value) {
			this.pojo.value = value;
			this.pojo.index = this.keys;
		},
		onClick() {
			this.$emit('click');
		},
		onSwitchChange(e) {
			this.pojo.showSwitch = e.detail.value;
			e.detail.value = e.detail.value ? 1 : 0;
			this.toPojo(e.detail.value);
			this.$emit('clInput', this.pojo);
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
			} else if (type === 'the') {
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		}
	}
};
</script>

<style lang="scss">
@mixin list-hover {
	background-color: $uni-bg-color-hover;
}

@mixin list-disabled {
	opacity: 0.3;
}

$list-cell-pd: $uni-spacing-col-lg $uni-spacing-row-lg;

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
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
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

.uni-list > .uni-list-cell:last-child .uni-list-cell-container:after {
	height: 0px;
}
</style>
