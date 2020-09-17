<template>
	<view class="view-top">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="rgb(0, 122, 255)"></uni-segmented-control>
		<view class="content view-top">
			<view v-if="current === 0">
				<uni-collapse v-if="itemListInfo.length !== 0">
					<uni-collapse-item :title="item.itemName" v-for="(item,index) in itemListInfo" :key="index">
						<view class="list">
							<view>项目名称</view>
							<view class="describe">{{item.itemName}}</view>
							<view>公司项目经理</view>
							<view class="describe">{{item.itemManager}}</view>
							<view>行方项目经理</view>
							<view class="describe">{{item.bankItemManager}}</view>
							<view>开始时间--结束时间</view>
							<view class="time"><text>{{item.itemStartDate.split(" ")[0]}}</text> 至 <text>{{item.itemEndDate.split(" ")[0]}}</text></view>
							<button v-if="item.itemType!='2'" type="primary" class="mini-button" size="mini" @click="update(item)">修改</button>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-if="current === 1">
				<uni-collapse v-if="myProjectInfo.length !== 0">
					<uni-collapse-item :title="item.itemName" v-for="(item,index) in myProjectInfo" :key="index">
						<view class="list">
							<view>项目名称</view>
							<view class="describe">{{item.itemName}}</view>
							<view>公司项目经理</view>
							<view class="describe">{{item.itemManager}}</view>
							<view>行方项目经理</view>
							<view class="describe">{{item.bankItemManager}}</view>
							<view>开始时间--结束时间</view>
							<view class="time"><text>{{item.itemStartDate.split(" ")[0]}}</text> 至 <text>{{item.itemEndDate.split(" ")[0]}}</text></view>
							<view class="header" v-if="item.itemType!='2'">
								<view class="addbtn" @click="addMembers">
									<image src="../../static/image/add.png" mode="widthFix"></image>
									<view>添加成员</view>
								</view>
								<view class="addbtn" @click="membersInfo(item.itemId)">
									<view>成员信息</view>
								</view>
								<!-- <view class="addbtn" @click="OutMembers(item)">
									<view>申请出场</view>
								</view> -->
							</view>
							<view v-show="isAddMembers">
								<view class="uni-form-item uni-column">
									<view class="boxWrap">
										<input class="uni-input" disabled="true" @click="isMultiple = !isMultiple" v-model="projectMembersName"
										 placeholder="请选择人员(可多选)" />
										<text class="triangle" v-show="isMultiple"></text>
										<view class="fixedBox" v-show="isMultiple">
											<view class="fixedList" v-for="(item1,num) in membersDatas" @click="setChecked(item1)" :key="num">
												<text>{{item1.userName}}</text>
												<uni-icons type="trash" size="16" color="#1A8AFA" v-if="item1.checked"></uni-icons>
											</view>
										</view>
									</view>
								</view>
								<button type="primary" class="button-margin" @click="submitAdd(item)">确认添加</button>
							</view>
							<view v-show="isOutMembers">
								<view class="uni-form-item uni-column">
									<view class="boxWrap">
										<input class="uni-input" disabled="true" @click="isMultiple = !isMultiple" v-model="projectMembersName"
										 placeholder="请选择人员(可多选)" />
										<text class="triangle" v-show="isMultiple"></text>
										<view class="fixedBox" v-show="isMultiple">
											<view class="fixedList" v-for="(item2,ident) in membersDatas" @click="setChecked(item2)" :key="ident">
												<text>{{item2.imUserName}}</text>
												<uni-icons type="trash" size="16" color="#1A8AFA" v-if="item2.checked"></uni-icons>
											</view>
										</view>
									</view>
								</view>
								<button type="primary" class="button-margin" @click="submitOut(item)">确认出场</button>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view v-else class="noData">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue"
	import uniIcons from "../../components/uni-icons/uni-icons.vue"
	export default {
		components: {
			uniSegmentedControl,
			uniIcons
		},
		data() {
			return {
				membersDatas:[],
				outMembersDatas:[],
				projectMembersName: "",
				addMembersName: [],
				isAddMembers: false,
				isMultiple: false,
				isOutMembers: false,
				items: ['项目列表', '我的项目'],
				current: 0,
				itemListInfo: [],
				myProjectInfo: [],
				userIdcardNo:""
			}
		},
		onShow: function() {
			// uni.getStorage({
			// 	key: 'membersData',
			// 	success: (res) => {
			// 		console.log(res.data)
			// 		if (res.data) {
			// 			this.myProjectInfo.projectMembersInfo.push(res.data);
			// 		}
			// 	}
			// })
		},
		onLoad() {
			uni.getStorage({
				key: 'idcardNo',
				success: (res) => {
					if (res.data) {
						this.userIdcardNo=res.data;
					}
				}
			});
			this.getResourceInfo();
		},
		methods: {
			getResourceInfo(){
				uni.showLoading({
					title:'loading...'
				});
				let url = `${this.$global.url}/getItemList?type=0`;
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log(res);
						if (res.data.errCode === '0' || res.data.errCode === '') {
							this.itemListInfo = res.data.itemList;
						} else {
							uni.showModal({
								title: '提示',
								content: res.data.errMsg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: JSON.stringify(err),
							showCancel: false
						})
					},
				});
			},
			setChecked(item) {
				let membersName="";
				item.checked = !item.checked;
				this.addMembersName = [];
				this.membersDatas.forEach((item) => {
					if (item.checked) {
						this.addMembersName.push(item);
						membersName+=(item.userName?item.userName:item.imUserName)+",";
					}
				});
				this.projectMembersName = membersName;
			},
			update(item) {
				let url = `../newItem/newItem?itemId=${item.itemId}`;
				uni.navigateTo({url});
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				};
				if (this.current == "1" && this.myProjectInfo.length == 0) {
					uni.showLoading({
						title:'loading...'
					});
					uni.request({
						url: `${this.$global.url}/getItemList?type=3&idcardNo=${this.userIdcardNo}`,//当前用户IDcard
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							console.log(res);
							if (res.data.errCode === '0' || res.data.errCode === '') {
								this.myProjectInfo = res.data.itemList;
							} else {
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel: false
								});
							}
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel: false
							})
						},
					});
				}
			},
			addMembers(){
				this.getResourceList();
				
			},
			OutMembers(data){
				this.projectMembersName = "";
				this.isAddMembers = false;
				this.isOutMembers = !this.isOutMembers;
				//申请出场，获取项目成员信息
				console.log(data);
				if(this.isOutMembers==true){
					uni.showLoading({
						title:'loading...'
					});
					uni.request({
						url: `${this.$global.url}/getProjectMembersInfo?itemId=${data.itemId}`,
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							console.log(res);
							if (res.data.errCode === '0' || res.data.errCode === '') {
								this.membersDatas= res.data.membersInfo;
								this.membersDatas.forEach((item) => {
									item.checked = false;
								});
								if(this.membersDatas.length==0){
									uni.showModal({
										title: '提示',
										content: "暂无可添加成员",
										showCancel:false
									});
								};
							} else {
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel: false
								});
							}
						},
						fail: (err) => {
							console.log(res);
							uni.hideLoading();
							uni.showModal({
								title: '提示',
								content: JSON.stringify(err),
								showCancel: false
							})
						},
					});
				}
			},
			submitAdd(data) {
				//提交添加成员数据,通知制单人，调用projectMembersInfo接口
				console.log(this.addMembersName);
				console.log(data);
				let membersInfo=[];
				for(let item of this.addMembersName){
					let arr={
						itemId:data.itemId,
						imIdcardNo:item.idcardNo,
						imUserName:item.userName,
						imAccessCard:"",
						imAccountNumber:"",
						imActualUsers:"",
						imInDate:data.itemStartDate,
						imOutDate:data.itemEndDate,
						imFunctionary:"",
						imType:"1",
					};
					membersInfo.push(arr);
				};
				console.log(membersInfo);
				let url = `${this.$global.url}/projectMembersInfo`;
				uni.showLoading({
					title:'loading...'
				});
				uni.request({
					url: url,
					method:'POST',
					data:membersInfo,
					success: (res) => {
						uni.hideLoading();
						console.log(res);
						if(res.data.errCode === '0' || res.data.errCode === ''){
							uni.showToast({
								title:'提交成功',
								icon:'none',
								duration:1000,
							});
							this.projectMembersName="";
							this.isAddMembers =false;
						}else{
							uni.showModal({
								title: '提示',
								content: res.data.errMsg,
								showCancel:false
							});
						}
					},
					fail: (err) => {
						console.log(res);
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: JSON.stringify(err),
							showCancel:false
						})
					},
				});
			},
			submitOut(data) {
				//提交出场成员数据，通知制单人，调用getProjectMembersInfo接口
				console.log(data);
				
			},
			membersInfo(data) {
				let url = `../projectMembers/projectMembers?itemId=${data}`;
				uni.navigateTo({url});
			},
			getResourceList(){
				return new Promise((resolve,reject)=>{
					this.projectMembersName = "";
					this.isOutMembers = false;
					this.isAddMembers = !this.isAddMembers;
					if(this.isAddMembers==true){
						uni.showLoading({
							title:'loading...'
						});
						let url = `${this.$global.url}/getResourceList?isEntrance=2`;
						uni.request({
							url: url,
							method: 'GET',
							success: (res) => {
								uni.hideLoading();
								console.log(res);
								if(res.data.errCode === '0' || res.data.errCode === ''){
									this.membersDatas = res.data.resourceList;
									this.membersDatas.forEach((item) => {
										item.checked = false;
									});
									if(this.membersDatas.length==0){
										uni.showModal({
											title: '提示',
											content: "暂无可添加成员",
											showCancel:false
										});
									};
									console.log(this.membersDatas);
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
					}
				})
			},
		}
	}
</script>

<style>
	.view-top{
		margin-top: 20rpx;
	}
	.mini-button {
		margin-top: 40rpx;
	}

	.button-margin {
		margin: 40rpx auto;
		width: 50%;
	}

	.header {
		margin: 30rpx 0 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
	}

	.addbtn {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: #1A8AFA;
	}

	.header image {
		width: 22rpx;
		margin: 0 10rpx 0 0;
	}

	.list {
		padding: 20rpx 30rpx;
		background-color: #e6e6e6;
	}

	.list>view {
		margin-top: 20rpx;
	}

	.list .header {
		padding: 0;
	}

	.list .header .title {
		font-size: 32rpx;
		max-width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.list .addbtn image,
	.list .title image {
		width: 34rpx;
		margin: 0;
	}

	.list .title image {
		margin: 0 10rpx -4rpx 0;
	}

	.list .time {
		font-size: 30rpx;
		color: #A5A5A5;
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

	.boxWrap {
		position: relative;
		z-index: 9999;
	}

	.fixedBox {
		position: relative;
		height: auto;
		overflow-y: scroll;
		width: 100%;
		box-sizing: border-box;
		top: 30rpx;
		border-radius: 4px;
		padding: 0 20rpx;
		background-color: white;
	}

	.triangle {
		position: absolute;
		z-index: 99;
		top: 90rpx;
		left: 50%;
		margin-left: -5rpx;
		width: 0;
		height: 0;
		border-right: 10rpx solid transparent;
		border-left: 10rpx solid transparent;
		border-bottom: 10rpx solid white;
	}

	.fixedList {
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 0;
	}

	.fixedList .uni-icons {
		margin-right: 20rpx;
	}

	.fixedBox .fixedList:not(:last-child) {
		border-bottom: 1rpx solid #e6e6e6;
	}
	.noData{
		text-align: center;
	}
</style>
