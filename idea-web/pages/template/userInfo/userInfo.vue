<template>
	<view>
		<view v-if="loading">
				<mht-loader></mht-loader>
		</view>
		<view>
			<magic  text="神算子" text1="点击分享"></magic>
		</view>
		<uni-list v-if="!loading" style="background-color: #fff; margin-top: 40upx;">
			<uni-list-item @click="update('修改用户名',pojo.user_name,'/idea/api/user/updateName','name')" title="用户名" :msg="pojo.user_name"></uni-list-item>
			<uni-list-item @click="update('修改手机号码',pojo.phone,'/idea/api/user/updatePhone','phone')" title="手机号码" :msg="pojo.phone"></uni-list-item>
			<uni-list-item title="所属公司" :note="pojo.note" :msg="pojo.msg" @click="update('修改所属公司',pojo.company,'/idea/api/user/updateCompany','company')"></uni-list-item>
			<uni-list-item title="邮箱" :msg="pojo.email" @click="update('修改邮箱',pojo.email,'/idea/api/user/updateEmail','email')"></uni-list-item>
			<uni-list-item title="检查更新"  showArrow="true" :msg="toVersion" @click="toUpdate"></uni-list-item>
			<uni-list-item title="退出登录" @click="logout"></uni-list-item>
		</uni-list>
		
		<view class="padding" style="width: 100%;margin-top: 150upx;" v-if="progress > 0">
			<view class="text-gray">下载进度：</view>
			<progress :percent="progress" show-info stroke-width="3" />
		</view>
		
		<view style="color: rgb(100, 100, 100);text-align: center;margin: 0 atuo; margin-top: 200upx;">当前版本: v{{version}}</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import magic from '@/components/magic.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import mhtLoader from '@/components/mht-loader/mht-loader.vue';
	export default {
		components: {
			mhtLoader,
			uniList,magic,
			uniListItem
		},
		data() {
			return {
				loading: true,
				pojo: {},
				version:'',
				toDisabled: true,
				toVersion: '',
				progress: 0
			};
		},
		methods: {
			toUpdate() {
				uni.showLoading({
					title: '正在检查云端版本...'
				});
				uni.request({
					url: 'http://kaizen.goldstreamfund.com/upload/appResource/version.json',
					fail: e => {
						this.$at.toast(this.$at.version);
					},
					success: e => {
						var data = e.data;
						uni.hideLoading();
						let s1 = Number(String(this.$at.version).replace(/\./g, '')); //本地版本
						let s2 = Number(String(data.version).replace(/\./g, '')); //云端版本
						if (s1 == s2) {
							this.$at.toast('您已是最新版本');
						} else {
							// #ifdef APP-PLUS
							this.$at.toast('正在为您下载最新版本...');
							var downloadTask = uni.downloadFile({
								url: data.wgtUrl,
								success: downloadResult => {
									if (downloadResult.statusCode === 200) {
										plus.runtime.install(
											downloadResult.tempFilePath,
											{ force: false },
											() => {
												plus.runtime.restart();
											},
											e => {
												this.$at.toast('更新应用失败...');
											}
										);
									}
								}
							});
							downloadTask.onProgressUpdate(res => {
								this.progress = Number(res.progress);
							});
							// #endif
						}
					}
				});
				// this.$at.showModal('提示')
			},
			logout() {
				this.$util.WU.showModel('提示', '是否退出登录', (e) => {
						uni.clearStorage();
						uni.reLaunch({
							url: '../ucenter/register'
						})
				})
			},
			update(title, data, url, parameter) {
				uni.navigateTo({
					url: "updateUser/updateUser?title=" + title + "&&data=" + data + "&&url=" + url + "&&parameter=" + parameter
				})
			},
			init() {
				let userId = uni.getStorageSync('user').userId
				this.$http.get('/idea/api/user/simple/' + userId).then(e => {
					if (e.code == "0000") {
						if(String(e.data.company).length >8){
							e.data.note = e.data.company
						}else{
							e.data.msg= e.data.company
						}
						this.pojo = e.data;
					} else {
						uni.showToast({
							title: e.msg,
							icon: "none"
						})
					}
					this.loading = false;
				})
			}
		},
		onShow() {
			this.init();
			this.version = this.$at.isEmpty(this.$at.version) ? '1.0.0':this.$at.version;
			uni.request({
				url: 'http://kaizen.goldstreamfund.com/upload/appResource/version.json',
				fail: e => {
					this.$at.toast(this.$at.version);
				},
				success: e => {
					var data = e.data;
					this.toVersion = data.version;
					this.toDisabled = this.$at.version == this.toVersion;
				}
			});
			
		}
	}
</script>

<style>
 page{
	 background-color: #F1F1F1
 }
</style>
