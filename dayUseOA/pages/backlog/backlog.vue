<template>
	<view>
		<view class="backlog">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#1A8AFA"></uni-segmented-control>
			<view class="backlogList" v-if="backlogList.length !== 0">
				<uni-collapse :accordion="true">
					<uni-collapse-item :title="item.title"  v-for="(item,index) in backlogList" :key="index">
						<view class="backlogListItem" v-if="item.msType != 7">
							<view class="uni-form-item uni-column">
								<view class="title">身份证号</view>
								<view class="describe">{{item.msCreateUserNo}}</view>
							</view>
						</view>
						<view class="backlogListItem" v-if="item.msType == 7">
							<view class="uni-form-item uni-column">
								<view class="title">项目到期时间</view>
								<view class="describe">{{item.msCreateTime}}</view>
							</view>
						</view>
						<view class="backlogListItem">
							<view class="uni-form-item uni-column">
								<view class="title">待办类型</view>
								<view class="describe">
									<text v-if="item.msType == 1">入职</text>
									<text v-else-if="item.msType == 2">离职</text>
									<text v-else-if="item.msType == 3">转正</text>
									<text v-else-if="item.msType == 4">合同到期</text>
									<text v-else-if="item.msType == 5">出场人员信息修改</text>
									<text v-else-if="item.msType == 6">场人员信息修改</text>
									<text v-else-if="item.msType == 7">项目到期</text>
								</view>
							</view>
							<view class="handle" v-if="current !== 1">
								<button type="primary" size="mini" v-if="item.msType != 2" @click="goTransaction(item)">前往办理</button>
								<button type="primary" size="mini" v-if="item.msType != 2" @click="submit(item)">办理完成</button>
								<button type="warn" size="mini" v-if="item.msType != 1 && item.msType != 5 && item.msType != 6 && item.msType != 7" @click="dimission(item.openid)">办理离职</button>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view class="noData" v-else>暂无数据</view>
		</view>
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
				items: ['全部','待处理','已处理'],
				current: 0,
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				contractStartDate: this.$global.getDate(),
				contractEndDate: this.$global.getDate('weeked'),
				typeList:['入职','离职','转正','合同到期','出场人员信息修改','入场人员信息修改','项目到期'],
				backlogList:[],
			}
		},
		onShow(){
			this.getBacklogList();
		},
		methods: {
			setTitle(){
				this.backlogList.forEach((item,index)=>{
					if(item.backlogType != 4 && item.backlogType != 5 ){
						item.title = `${item.msHeader} - ${this.typeList[item.msType - 1]}`;
					}else{
						item.title = `${item.msHeader} - ${this.typeList[item.msType - 1]}`;
					}
				})
			},
			// 获取待办列表
			getBacklogList(){
				uni.showLoading({
					title:'loading...'
				});
				let url = `${this.$global.url}/getBacklogList?type=${this.current}&idcardNo=${uni.getStorageSync('idcardNo')}`;
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						if(res.data.errCode === '0' || res.data.errCode === ''){
							this.backlogList = res.data.backlogList;
							this.setTitle();
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
			// 离职
			dimission(){
				uni.showModal({
					title: '提示',
					content:'是否需要办理离职',
					success: (res) => {
						if(res.confirm){
							
						}
					},
				})
			},
			goTransaction(item){
				let url = '';
				let title = '';
				if(item.msType == 0){
					title = `是否前往资源池进行添加`;
					url = `../resourceRegister/resourceRegister?type=1`;
				}else if(item.msType == 2 || item.msType == 3){
					title = `是否前往资源池进行修改合同日期`;
					url = `../resourceRegister/resourceRegister?type=1&openid=${item.openid}`;
				}else if(item.msType == 4){
					title = `是否前往项目成员列表`;
					url = `../projectMembers/projectMembers?itemId=${item.itemId}`
				}else if(item.msType == 5){
					title = `是否需要项目延期`;
					url = `../newItem/newItem?itemId=${item.itemId}`;
				}
				if(item.msType != 5){
					uni.showModal({
						title: this.typeList[item.msType]+'提示',
						content:title,
						showCancel:false,
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:url
								})
							}
						},
					})
				}else{
					uni.showModal({
						title: this.typeList[item.msType]+'提示',
						content:title,
						cancelText:'否',
						confirmText:'是',
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:url
								})
							}
						},
					})
				}
			},
			submit(item){
				uni.showModal({
					title: '提示',
					content:'是否已办理完成',
					success: (res) => {
						if(res.confirm){
							
						}
					},
				})
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
				this.getBacklogList();
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
	.spouse,.backlog{
		margin-top:30rpx;
	}
	.spouse>.title,.backlog .header .title{
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
	.backlog .header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.backlog .header{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.backlogList{
		margin:30rpx 0;
	}
	.backlogList .backlogListItem{
		padding: 0 30rpx;
		background-color: #e6e6e6;
	}
	.dateRange{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.dateRange>view{
		width:60rpx;
		text-align: center;
	}
	.dateRange picker{
		width: 45%;
	}
</style>
