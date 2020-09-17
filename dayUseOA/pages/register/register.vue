<template>
	<view>
		<view class="header">
			<view>
				<image :src="userInfo.avatarUrl" mode="widthFix" ></image>
				<view>{{userInfo.nickName}}</view>
			</view>
		</view>
		<view class="content">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column">
					<view class="title">姓名<text class="red">*</text></view>
					<input  class="uni-input" type="text" name="userName" v-model="userName" placeholder="请输入姓名">
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">身份证号码<text class="red">*</text></view>
					<input  class="uni-input" type="idcard" name="idcardNo" v-model="idcardNo"  placeholder="身份证号">
				</view>
				<view class="button-sp-area">
					<button class='getUserBtn' type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">用户登录</button>
				</view>
			</form>
		</view>
	</view>
</template>

<style>
	.header{
		display: flex;
		justify-content: center;
		margin-top:150rpx;
	}
	.header view{
		width:200rpx;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.header image{
		width:200rpx;
		border-radius: 50%;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top:30rpx;
	}
	.button-sp-area{
		margin-top:60rpx;
	}
	.button-sp-area button{
		margin:0 auto;
		width:50%;
	}
	.getLocaBtn{
		opacity: 0;
		height:0;
	}
</style>

<script>
	export default {
		data() {
			return {
				userInfo:{
					avatarUrl:'../../static/image/photo.jpg',
					nickName: '***'
				},
				openid:'',  //openid 用户唯一标识
				userName: '',
				idcardNo:''
			}
		},
		onLoad(){
			uni.showLoading({
			    title: 'loading...'
			});
			uni.getStorage({
				key:'openid',
				success:(res)=>{
					uni.hideLoading();
					this.openid = res.data;
				},
				fail: () => {
					uni.hideLoading();
					this.login();
				}
			})
		},
		methods: {
			//登录
			login(){
				return new Promise((resolve,reject)=>{
					uni.login({
					    provider: 'weixin',
					    success: (loginRes) => {
							if(loginRes.code){
								resolve(this.getOpenId(loginRes.code));
							}else{
								console.log('登录失败'+ res.errMsg);
							}
					    }
					});
				})
			},
			//获取openId
			getOpenId(code){
				return new Promise((resolve,reject)=>{
					// 'http://api.weixin.qq.com/sns/jscode2session?appid=wx9834a99d90b1dea6&secret=f3ff7e2ea4af97887afbd5daa8e406a3&grant_type=authorization_code&js_code=' + code, 
					uni.request({
						url: this.$global.url + '/getOpenid?code=' + code,  
						method: "GET",
						success: (cts) => {
							uni.hideLoading();
							console.log('获取openid结果');
							console.log(cts);
							if(cts.data.errCode === '0' || cts.data.errCode === ''){
								if(cts.data){
									this.openid = cts.data.openid;     //openid 用户唯一标识  
								}else{
									uni.showModal({
										title: '提示',
										content: `状态码:${cts.statusCode},错误信息:${cts.errMsg}`,
										showCancel:false
									})
								}
							}else{
								uni.showModal({
									title: '提示',
									content: cts.data.errMsg,
									showCancel:false
								});
							}
						},
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel:false
							})
						},
					});
				})
			},
			editOlderWorkerOpenid(){
				return new Promise((resolve,reject)=>{
					let url = `${this.$global.url}/editOlderWorker?openid=${this.openid}&userName=${this.userName}&idcardNo=${this.idcardNo}`
					uni.request({
						url: url,
						method: 'POST',
						success: (cts) => {
							console.log('获取openid结果')
							console.log(cts)
							if(cts.data.errCode === '0' || cts.data.errCode === ''){
								this.setOpenid();
							}else{
								uni.showModal({
									title: '提示',
									content: cts.data.errMsg,
									showCancel:false
								});
							}
						},
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel:false
							})
						},
					});
				})
			},
			setOpenid(){
				uni.setStorageSync('openid',this.openid)
				uni.setStorageSync('idcardNo',this.idcardNo)
				uni.showToast({
					title:'验证成功,1秒后前往首页。'
				})
				setTimeout(()=>{
					uni.redirectTo({
						url:'../index/index'
					})
				},1000)
			},
			getIsOlderWorker(){
				if(this.userName === ''){
					uni.showToast({
						title:'请输入姓名！',
						icon:'none'
					})
					return;
				}else if(this.idcardNo === ''){
					uni.showToast({
						title:'请输入身份证号！',
						icon:'none'
					})
					return;
				}
				return new Promise((resolve,reject)=>{
					let url = `${this.$global.url}/isOlderWorker?openid=${this.openid}&userName=${this.userName}&idcardNo=${this.idcardNo}`
					uni.request({
						url: url,
						method: 'POST',
						success: res => {
							console.log('接口')
							console.log(res)
							if(res.data.errCode === '0' || res.data.errCode === ''){
								if(res.data.isOlderWork){
									if(res.data.isRegister){
										this.setOpenid();
									}else{
										resolve(this.editOlderWorkerOpenid())
									}
								}else{
									uni.showModal({
										title: '提示',
										content: '你是新员工,请点击确认前往人员登记页进行登记注册!',
										showCancel:false,
										success: (res)=> {
											uni.setStorage({
												key:'openid',
												data:this.openid,
												success: () => {
													uni.redirectTo({
														url:`../checkIn/checkIn?idcardNo=${this.idcardNo}&userName=${this.userName}`
													})
												}
											})
										}
									});
								}
							}else{
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel:false
								});
							}
						},
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel:false
							})
						},
					})
				})
			},
			//获取用户信息
			getUserInfo(){
				uni.getUserInfo({
					provider: 'weixin', 
					success: (res) => {
						console.log('用户信息');
						console.log(res)
						this.userInfo = res.userInfo;
						uni.setStorage({
							key:'userInfo',
							data:res.userInfo,
							success:()=>{
								console.log('初始授权')
							}
						})
					}
				});
				this.getIsOlderWorker();
			},
		}
	}
</script>
