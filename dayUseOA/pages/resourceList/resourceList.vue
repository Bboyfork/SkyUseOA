<template>
	<view>
		<form  @submit="formSubmit">
			<view class="resource">
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickResouce" style-type="button" active-color="rgb(0, 122, 255)"></uni-segmented-control>
				<view class="resourceList">
					<uni-collapse :accordion="true" v-if="resourceList.length !== 0">
						<uni-collapse-item :title="item.userName"  v-for="(item,index) in resourceList" :key="index">
							<view class="resourceListItem">
								<view class="uni-form-item uni-column">
									<view class="title">性别</view>
									<view class="describe">
										<text v-if="item.sex == 1">男</text>
										<text v-else>女</text>
									</view>
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">证件号码</view>
									<view class="describe">{{item.idcardNo}}</view>
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">出入场状态</view>
									<view class="describe">
										<text v-show="item.isEntrance == 2">出场</text>
										<text v-show="item.isEntrance == 1">入场</text>
									</view>
								</view>
								<view class="handle" v-if="accessLevel == 1">
									<button type="primary" size="mini" @click="go('resourceRegister',0,item)">详情</button>
									<button type="primary" size="mini" @click="go('resourceRegister',2,item)">修改</button>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
					<view v-else class="noData">暂无数据</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {
			uniSegmentedControl,
		},
		data() {
			return {
				accessLevel: '',
				items: ['全部','出场','入场'],
				current: 0,
				resourceList:[]
			}
		},
		onLoad() {
			this.accessLevel = uni.getStorageSync('accessLevel');
			this.getResourceList();
		},
		methods: {
			onClickResouce(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
				this.getResourceList();
			},
			getResourceList(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					let url = `${this.$global.url}/getResourceList?isEntrance=${this.current}`;
					uni.request({
						url: url,
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							console.log('项目列表');
							console.log(res.data);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								this.resourceList = res.data.resourceList;
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
			go(name,type,item){
				console.log(item)
				let url = `../${name}/${name}`
				if(name === 'resourceRegister'){
					url += `?type=${type}&idcardNo=${item.idcardNo}`;
				}
				console.log(url)
				uni.navigateTo({url})
			}
		}
	}
</script>

<style>
	.handle{
		padding: 20rpx 0;
	}
	.handle button{
		margin-right:20rpx;
	}
	.spouse,.resource{
		margin-top:30rpx;
	}
	.spouse>.title,.resource .header .title{
		font-size:36rpx;
		font-weight: bold;
	}
	.addbtn{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color:#1A8AFA;
		font-weight: bold;
	}
	.resource .header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.resource .header{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.resourceList{
		margin:30rpx 0;
	}
	.resourceList .resourceListItem{
		padding: 0 30rpx;
		background-color: #e6e6e6;
	}
	.resourceListItem .uni-form-item:last-child{
		margin-bottom:20rpx;
	}
	.noData{
		height:200px;
		line-height:200px;
		text-align: center;
	}
</style>
