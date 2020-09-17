<template>
	<view>
		<view class="operateWrap">
			<view class="title">智慧办公</view>
			<view class="operateList">
				<view class="operateItem" v-for="(item,index) in list" :key="index" v-show="item.isShow" @click="go(item.url)">
					<image mode="widthFix" :src="item.image"></image>
					<view>{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style>
	.operateWrap{
		margin: 30rpx 0;
	}
	.operateWrap .title{
		font-size:30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.operateList{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.operateItem{
		text-align: center;
		width:25%;
		margin-bottom:20rpx;
	}
	.operateItem>view>text{
		font-size:32rpx;
	}
	.operateItem image{
		width:80rpx;
	}
</style>

<script>
	export default {
		data() {
			return {
				accessLevel:undefined,
				openid: '',
				list:[
					{
						image: '../../static/image/registerList.png',
						name:'登记列表',
						isShow:false,
						url:'staffInfoList'
					},
					{
						image: '../../static/image/resourceRegister.png',
						name:'资源池添加',
						isShow:false,
						url:'resourceRegister'
					},
					{
						image: '../../static/image/resourceList.png',
						name:'资源池列表',
						isShow:false,
						url:'resourceList'
					},
					{
						image: '../../static/image/itemList.png',
						name:'项目列表',
						isShow:false,
						url:'itemList'
					},
					{
						image: '../../static/image/newItem.png',
						name:'新建项目',
						isShow:false,
						url:'newItem'
					},
					{
						image: '../../static/image/backlog.png',
						name:'待办',
						isShow:false,
						url:'backlog'
					}
				]
			}
		},
		onShow(){
			this.openid = uni.getStorageSync('openid');
			this.getJurisdiction();
			uni.removeStorageSync('scrollTop');
			uni.removeStorageSync('resourceType');
			uni.removeStorageSync('userResourceData');
			uni.removeStorageSync('checkInData');
			uni.removeStorageSync('isAdd');
		},
		methods: {
			showModule(){
				this.list.forEach((item)=>{
					item.isShow = false;
					if(this.accessLevel === '1'){
						if(item.name !== '新建项目'){
							item.isShow = true;
						}
					}else if(this.accessLevel == '2'){
						if(item.name === '新建项目' || item.name === '登记列表' || item.name === '项目列表'){
							item.isShow = true;
						}
					}else if(this.accessLevel == '3'){
						if(item.name === '登记列表' || item.name === '项目列表'){
							item.isShow = true;
						}
					}
				})
			},
			getJurisdiction(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					let url = `${this.$global.url}/getJurisdiction?openid=${this.openid}`
					uni.request({
						url: url,
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							console.log('包含自己的项目列表');
							console.log(res);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								this.accessLevel = res.data.accessLevel;
								uni.setStorageSync('accessLevel',this.accessLevel)
								this.showModule();
							}else{
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel:false
								});
							}
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel:false
							})
						},
					});
				})
			},
			go(name){
				let url = `../${name}/${name}`;
				if(name === 'resourceRegister'){
					url += `?type=1`;
				}
				uni.navigateTo({url});
			}
		}
	}
</script>

