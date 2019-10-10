<template>
    <view class="page ">
        <view style="height: 30upx;"></view>
        <view class="list">
            <view class="li" v-for="(li,li_i) in list" v-bind:class="{'noborder':li_i==list.length-1}" hover-class="hover" :key="li_i">
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
        <uni-load-more :status="loading"></uni-load-more>

    </view>
</template>

<script>
    import {
    	uniLoadMore
    } from '@dcloudio/uni-ui'
    export default {
        components:{
            uniLoadMore
        },
        data() {
            return {
                page: {
                    cPage: 1,
                    pSize: 10
                },
				userId:"",
				name:'',
                list: [],
                loading: 'more',

            };
        },
        
        onReachBottom() {
        	if (this.loading != 'noMore') {
        		this.loading = 'loading';
        		this.page.cPage++;
        		this.init();
        	}
        },
        onLoad(e) {
            uni.setNavigationBarTitle({
                title: '历史荐股 - ' + e.name
            });
            if (this.$at.isEmpty(e.userId)) {
                this.userId = null;
            }else{
				this.userId  = e.userId ;
			}
			this.name = e.name;
            this.init(e.name, e.userId);
        },
        methods: {
            init(name, userId) {
                if (this.$at.isEmpty(this.userId)) {
                    this.userId = this.$at.user().userId
                }
                this.$http.post("/idea/api/tradingLog/historyPage/" + this.userId + this.pageStr(), {
                    industry_gics: this.name
                }).then(e => {

                    if (e.data.length > 0) {
                        if (this.page.cPage == 1) {
                            this.list = []
                        }
                        e.data.forEach(s => {
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
							
                            this.list.push(s)
                        })
                    }
                    if (e.data.length < 10) {
                        this.loading = 'noMore'
                    }
                    if (e.data.length == 0 ) {
                        this.loading = 'noMore'
                    }
                    uni.stopPullDownRefresh();
                })
            },
            pageStr() {
                return "?cPage=" + this.page.cPage + "&&pSize=" + this.page.pSize;
            }
        }
    }
</script>

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
