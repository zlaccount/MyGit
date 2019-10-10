<style lang="scss">
    page {
        background-color: #f1f1f1
    }

    .list {
        width: 100%;
        background-color: #fff;
        border-bottom: solid 26upx #f1f1f1;

        .listTitle {
            background-color: #f1f1f1;
            color: #BEBEBE;
            padding-left: 2%;
            padding: 20upx;
            display: block;
            font-size: 30upx;
        }

        .li {
            width: 92%;
            min-height: 100upx;
            padding: 0 4%;
            border-bottom: solid 1upx #e7e7e7;
            display: flex;
            flex-direction: column;

            &.noborder {
                border-bottom: 0
            }

            .text {
                /* padding-left: 20upx;
				width: 70%; */
                color: black;
                font-size: 32upx;
                line-height: 80upx;
            }

            .to {
                flex-shrink: 0;
                min-height: 40upx;
                color: #666;
                margin-bottom: 20upx
            }
        }
    }

    .time .item {
        min-width: 50%;
        display: inline-block;

    }

    .time .item {
        min-width: 50%;
        display: inline-block;

    }

    .c333 {
        color: #333 !important;

    }

    .title-num {
        color: #888;
        font-size: 14px;
        margin-left: 6upx
    }
</style>

<template>
    <view class="page ">
        <view class="list" v-for="(list,list_i) in severList" :key="list_i">
            <view class="listTitle" style="display: flex;flex-direction:row ;">
                <text style="width: 70%;">{{list.groupname}}</text>
                <navigator :url="openUrl+list.groupname" 
				hover-class="none"
				style="width: 30%; text-align: right;color: rgb(59, 98, 195)">查看更多</navigator>
            </view>
            <view class="li" v-for="(li,li_i) in list.item" v-bind:class="{'noborder':li_i==list.length-1}" hover-class="hover"
                :key="li_i">
                <view class="text">{{li.stock_name==null ?'---':li.stock_name}} <text class="title-num">( {{li.code}} )</text></view>
                <view class="to">
                    <view class="time">
                        <text class="item">
                            <text class="c333">推荐日期：</text>
                            <text>{{li.trade_date}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">兑现日期：</text>
                            <text>{{li.liquid_date}}</text>
                        </text>
                    </view>
					
                    <view class="time">
                        <text class="item">
                            <text class="c333">成本价：</text>
                            <text>{{li.cost==null?'---':li.cost}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">目标价：</text>
                            <text>{{li.target==null?'---':li.target}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">结单价：</text>
                            <text>{{li.liquid_price==null?'---':li.liquid_price}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">结单收益率：</text>
                            <text>{{li.real_return==null?'---':li.real_return}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">波动率：</text>
                            <text>{{li.volatility==null?'---':li.volatility}}</text>
                        </text>
                        <text class="item">
                            <text class="c333">最大回撤：</text>
                            <text>{{li.drawback==null?'---':li.drawback}}</text>
                        </text>
                    </view>
                </view>
                <view class="to" v-if="li.proposal_reason" style="margin-top: -20upx;">{{li.proposal_reason}}</view>
            </view>
        </view>
        <view v-show="nullOff" style="text-align: center;color: #7F7F7F; min-width: 200upx;margin: 200upx auto;">
            暂无荐股历史</view>
    </view>
</template>

<script>
    import mhtLoader from '@/components/mht-loader/mht-loader.vue';
    import uniList from '@/components/uni-list/uni-list.vue'
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
    export default {
        components: {
            mhtLoader,
            uniList,
            uniListItem
        },
        onLoad(e) {
            this.userId = e.userId;
            this.init(e.userId)
            if (!this.$at.isEmpty(e.userName)) {
                uni.setStorageSync("toUser", {
                    id: e.userId,
                    user_name: e.userName
                })
                uni.setNavigationBarTitle({
                    title: e.userName + '的荐股'
                });
            }
        },
        data() {
            return {
                severList: [],
                nullOff: false,
                userId: ''
            };
        },
        computed: {
            openUrl() {
                return '/pages/template/recommendHistory/recommendHistoryMore/recommendHistoryMore?userId='+this.userId+'&&name='
            }
        },
        methods: {
            init(userId) {
                if (this.$at.isEmpty(userId)) {
                    userId = this.$at.user().userId;
                }
                this.$http.get("/idea/api/tradingLog/historyData/" + userId).then(e => {
                    if (e.code == '0000') {
                        e.data.map(s => {
                            s.long_count = s.long_count == null ? '0' : s.long_count
                            s.short_count = s.short_count == null ? '0' : s.short_count
                            s.analyst_count = s.analyst_count == null ? '0' : s.analyst_count
                            s.target = this.$at.isEmpty(s.target) ? '--' : s.target;
                            s.trade_date = this.$at.dateFtt("yyyy-MM-dd", new Date(Number(s.trade_date)));
                            s.liquid_date = this.$at.dateFtt("yyyy-MM-dd", new Date(Number(s.liquid_date)))
							s.target   = this.$at.reservedDecimalOnAbs(s.target,2) 
							s.cost   = this.$at.reservedDecimalOnAbs(s.cost,2) 
							s.liquid_price   = this.$at.reservedDecimalOnAbs(s.liquid_price,2) 
							s.real_return   = this.$at.reservedDecimalOnAbs(s.real_return*100,2) + '%'
							s.volatility    = this.$at.reservedDecimalOnAbs(s.volatility*100,2) + '%'
							s.drawback = this.$at.reservedDecimalOnAbs(s.drawback*100,2) + '%'
							
                            return s;
                        })
                        this.severList = this.$at.group(e.data, "industry_gics");
                        this.nullOff = this.severList.length == 0 ? true : false;
                    } else {
                        this.$at.toast(e.msg)
                    }
                })
            }
        },

    }
</script>
