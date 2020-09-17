<template>
	<view style="margin-top: 20rpx;">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="rgb(0, 122, 255)"></uni-segmented-control>
		<view class="content">
			<uni-collapse v-if="staffList.length !== 0">
				<uni-collapse-item :title="item.userName" v-for="(item,index) in staffList" :key="index">
					<view class="list">
						<view>性别</view>
						<view class="describe">
							<text v-if="item.sex == 1">男</text>
							<text v-else>女</text>
						</view>
						<view>身份证</view>
						<view class="describe">{{item.idcardNo}}</view>
						<view>入离职状态</view>
						<view class="describe">
							<text v-if="item.state == 1">在职</text>
							<text v-else>离职</text>
						</view>
						<view class="handle">
							<button type="primary" size="mini" @click="detail(item)">详情</button>
							<button type="primary" class="button-style" size="mini" @click="editAccessLevel(item,'1')" v-if="accessLevel != 1">修改为管理员</button>
							<button type="primary" class="button-style" size="mini" @click="editAccessLevel(item,'2')" v-if="accessLevel == 1">修改为项目经理</button>
							<button type="primary" class="button-style" size="mini" @click="editAccessLevel(item,'3')" v-if="accessLevel == 1">修改为开发人员</button>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<view class="noData" v-else>暂无数据</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue"
	import uniCollapse from "../../components/uni-collapse/uni-collapse.vue"
	import uniCollapseItem from "../../components/uni-collapse-item/uni-collapse-item.vue"
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniSegmentedControl
		},
		data() {
			return {
				items: ['在职', '离职'],
				current: 0,
				staffList:[],
				leaveMembers:[],
				openid:'',
				accessLevel:0,
				userIdcardNo: '',
			}
		},
		onLoad() {
			this.getStaffInfoList();
		},
		onShow(){
			this.accessLevel = uni.getStorageSync('accessLevel');
			this.userIdcardNo = uni.getStorageSync('accessLevel');
		},
		methods: {
			// 修改权限
			editAccessLevel(item,accessLevel){
				uni.showLoading({
					title:'loading...'
				});
				let url = `${this.$global.url}/editJurisdiction`;
				uni.request({
					url: url,
					method: 'POST',
					data:{
						userIdcardNo: this.userIdcardNo,
						editIdcardNo: item.idcardNo,
						accessLevel: accessLevel,
					},
					success: (res) => {
						uni.hideLoading();
						if(res.data.errCode === '0' || res.data.errCode === ''){
							this.staffList = res.data.workerList;
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
			},
			addResource(item){
				let url = `../resourceRegister/resourceRegister?type=1&openid=${item.openid}`;
				uni.navigateTo({url});
			},
			getStaffInfoList(){
				uni.showLoading({
					title:'loading...'
				});
				let url = `${this.$global.url}/getWorkerList?state=${this.current+1}`;
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						if(res.data.errCode === '0' || res.data.errCode === ''){
							this.staffList = res.data.workerList;
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
			},
			onClickItem(e){
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
				this.getStaffInfoList();
			},
			detail(item) {
				let url = `../checkIn/checkIn?type=0&openid=${item.openid}`;
				uni.navigateTo({
					url
				});
			},
			
			download(data) {
				uni.downloadFile({
					url: 'http://down.sandai.net/thunderx/XunLeiWebSetup10.1.34.800gw.exe',
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						}
					}
				});
			},

		}
	}
</script>

<style>
	.handle button{
		margin-right:20rpx;
	}
	.content{
		padding:20rpx 0;
	}
	.list {
		padding: 20rpx 30rpx;
		background-color: #e6e6e6;
	}

	.list>view {
		margin-top: 20rpx;
	}

	.describe {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
		-webkit-line-clamp: 2;
		/*用来限制在一个块元素显示的文本的行数。*/
		-webkit-box-orient: vertical;
		color: #757575;
	}
</style>
