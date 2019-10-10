
<style lang="scss">
.h1 {
	text-align: left;
	font-size: 30upx;
	font-weight: bold;
	padding: 10upx 0;
}
.wrap {
	margin: 20upx;
}
$div-table-border-color: #eee;
$div-table-border-width: 1upx;

.div-table {
	display: table;
	width: 100%;
	height: 100%;
	border: $div-table-border-width solid $div-table-border-color;
	box-sizing: border-box;
	table-layout: fixed;
	position: relative;
	.celspan {
		display: table;
		width: 100%;
		height: 100%;
		.td {
			display: table-cell;
			border: none !important;
		}
		.td + .td {
			border-left: $div-table-border-width solid $div-table-border-color !important;
		}
	}
	.rowspan {
		display: table;
		width: 100%;
		height: 100%;
		.tr {
			display: table-row;
			border: none !important;
		}
	}

	&.fixed-thead {
		.tbody,
		.thead,
		.tr,
		.th,
		.td {
			display: block;
		}
		.tr,
		.th {
			&:after {
				content: '';
				display: block;
				visibility: hidden;
				clear: both;
				height: 0;
			}
		}
		.td {
			float: left;
			width: 33.33%;
		}
		.tbody {
			height: 400upx;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}

	.tr,
	.th {
		display: table-row;
		& + .tr,
		& + .th {
			.td,
			.th {
				border-top: $div-table-border-width solid $div-table-border-color;
				word-break: break-word;
			}
		}
	}
	.rowspan {
		.tr,
		.th {
			display: table-row;
			.td,
			.th {
				border: none;
			}
			& + .tr,
			& + .th {
				.td,
				.th {
					border-top: $div-table-border-width solid $div-table-border-color;
				}
			}
		}
	}
	.td {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		box-sizing: border-box;
		padding: 10upx;
		&.noPadding {
			padding: 0;
		}
		& + .td {
			border-left: $div-table-border-width solid $div-table-border-color;
		}
	}
	.th .td {
		font-weight: bold;
	}
	.tbody {
		display: table-row-group;
	}
	.thead {
		display: table-header-group;
		.tr,
		.th {
			.td,
			.th {
				border-bottom: $div-table-border-width solid $div-table-border-color;
			}
		}
	}
	.tfoot {
		display: table-footer-group;
		.tr,
		.th {
			.td,
			.th {
				border-top: $div-table-border-width solid $div-table-border-color;
			}
		}
	}
	.colgroup {
		display: table-column-group;
	}
	.col {
		display: table-column;
	}
	.caption {
		display: table-caption;
	}
}
</style>

<template>
	<view class="" style="background-color: #FFFFFF;">
		
		<view class="div-table" style="border-bottom: none; margin-top: 20upx;background: #F7F6F9;color: #999;margin-top: 34upx;">
			<view class="td">股票代码</view>
			<view class="td">股票名称</view>
			<view class="td">百分比</view>
			<view class="td">
				<view>position</view>
				<view>@</view>
				<view>cost</view>
				</view>
		</view>
		<view class="bg-white">
			<view class="div-table">
				<view class="tr" :key="item.code" v-for="item in list">
					<view class="td" >{{item.code}}</view>
					<view class="td" >{{item.secName}}</view>
					<view class="td" >{{item.position}}</view>
					<view class="td" >
						<view>{{item.position}}</view>
						<view>@</view>
						<view>{{item.cost}}</view>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title:'持仓列表'
			})
			this.$http.gets('/idea/api/orderManagement/getFundExposure/'+e.id).then(e => {
				this.list = e;
				this.list.forEach(s=>{
					s.cost = this.$at.numberFormat(s.cost,2,0)
				})
			})

		},
		methods: {
			
		}
	}
</script>

<style>

@import url('../../../../colorui/main.css');
@import url('../../../../colorui/icon.css');
</style>
