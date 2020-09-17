<template>
	<view>
		<view class="header">
			<view class="title-text">项目成员信息</view>
		</view>
		<uni-collapse v-if="membersInfo.length !== 0">
			<uni-collapse-item :title="item.imUserName" v-for="(item,index) in membersInfo" :key="index" >
				<form @submit="formSubmit($event,index)">
					<view class="uni-form-item uni-column">
						<view class="title">项目名称<text class="red">*</text></view>
						<input class="uni-input" :value="resItemMsg.itemName" placeholder="请输入项目名称" disabled="true"/>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">入场人<text class="red">*</text></view>
						<input class="uni-input" name='imUserName' :value="item.imUserName" placeholder="请输入入场人" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">实际使用人<text class="red">*</text></view>
						<input class="uni-input" name="imActualUsers" :value="item.imActualUsers" placeholder="请输入实际使用人" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">账号<text class="red">*</text></view>
						<input class="uni-input" name="imAccountNumber" :value="item.imAccountNumber" placeholder="请输入账号" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">门禁卡号<text class="red">*</text></view>
						<input class="uni-input" type="number"  :value="item.imAccessCard" name="imAccessCard" placeholder="请输入门禁卡号" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">出入场时间<text class="red">*</text></view>
						<view class="dateRange">
							<picker mode="date" :value="item.imInDate" name="imInDate" :start="startDate" :end="endDate" @change="startDateChange($event,index)">
								<view class="uni-input" >{{item.imInDate}}</view>
							</picker>
							<view> - </view>
							<picker mode="date" :value="item.imOutDate" name="imOutDate" :start="startDate" :end="endDate" @change="endDateChange($event,index)">
								<view class="uni-input">{{item.imOutDate}}</view>
							</picker>
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">行方负责人<text class="red">*</text></view>
						<input class="uni-input" name="imFunctionary" :value="item.imFunctionary" placeholder="请输入行方负责人" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">公司项目经理<text class="red">*</text></view>
						<input class="uni-input"  :value="resItemMsg.itemManager" placeholder="请输入公司项目经理" disabled="true"/>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">出入场状态<text class="red">*</text></view>
						<radio-group  name="imType">
							<label class="radio">
								<radio value="1" :checked="item.imType === '1'" />入场</label>
							<label class="radio">
								<radio value="2" :checked="item.imType === '2'" />出场</label>
						</radio-group>
					</view>
					<view class="button-sp-area">
						<button class='addBtn' type="primary" form-type="submit">保存</button>
					</view>
				</form>
			</uni-collapse-item>
		</uni-collapse>
		<view class="noData" v-if="membersInfo.length === 0">暂无数据</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resItemMsg:{},
				membersInfo:[],
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				myProjectInfo: {},
				itemId: '',
			}
		},
		onLoad: function(e) {
			//请求getProjectMembersInfo接口获取成员信息
			console.log(e.itemId);
			this.itemId = e.itemId
		},
		onShow() {
			uni.showLoading({
				title:'loading...'
			});
			this.getProjectMembersInfo(this.itemId)
		},
		methods: {
			getProjectMembersInfo(itemId){
				uni.request({
					url: `${this.$global.url}/getProjectMembersInfo?itemId=${itemId}`,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log(res);
						if (res.data.errCode === '0' || res.data.errCode === '') {
							this.membersInfo = res.data.membersInfo;
							this.resItemMsg = res.data.itemMsg;
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
			},
			startDateChange: function(e,index) {
				let imInDate=new Date(e.detail.value).getTime();
				let itemStartDate=new Date(this.resItemMsg.itemStartDate).getTime();
				if(imInDate<itemStartDate){
					uni.showModal({
						title: '提示',
						content:"入场时间不能小于项目开始时间！",
						showCancel:false
					});
					this.membersInfo[index].imInDate = this.resItemMsg.itemStartDate.split(" ")[0];
				}else{
					this.membersInfo[index].imInDate = e.detail.value;
				}
			},
			endDateChange: function(e,index) {
				let imOutDate=new Date(e.detail.value).getTime();
				let itemEndDate=new Date(this.resItemMsg.itemEndDate).getTime();
				if(imOutDate>itemEndDate){
					uni.showModal({
						title: '提示',
						content:"出场时间不能大于项目结束时间！",
						showCancel:false,
					});
					this.membersInfo[index].imOutDate = this.resItemMsg.itemEndDate.split(" ")[0];
				}else{
					this.membersInfo[index].imOutDate = e.detail.value;
				}
			},
			outResource(item){
				let url = `${this.$global.url}/outResource?idcardNo=${item.imIdcardNo}&imNo=${item.imNo}`;
				uni.request({
					url: url,
					method:'GET',
					success: (res) => {
						uni.hideLoading();
						console.log(res+"修改资源池出场成功");
						if(res.data.errCode === '0' || res.data.errCode === ''){
							uni.showToast({
								title:'修改成功,1秒后前往添加项目经验',
								icon:'none',
								duration:1000,
							});
							let timer = setTimeout(()=>{
								clearTimeout(timer);
								let url = `../projectExperience/projectExperience?type=3&itemData=${JSON.stringify(item)}`;
								uni.navigateTo({url});
							},1000)
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
			updateProjectMembersInfo(index,formData){
				let url = `${this.$global.url}/updateProjectMembersInfo`;
				uni.showLoading({
					title:'loading...'
				});
				if(formData.imType == '1'){
					formData.imNo = this.membersInfo[index].imNo;
				}
				uni.request({
					url: url,
					method:'POST',
					data: formData.imType == '2' ? this.membersInfo[index] : formData,
					success: (res) => {
						console.log(res);
						if(res.data.errCode === '0' || res.data.errCode === ''){
							if(formData.imType == '1'){
								uni.showToast({
									title:'修改成功',
									icon:'none',
									duration:1000,
								});
								let timer = setTimeout(()=>{
									clearTimeout(timer);
									uni.navigateBack({delta:1});
								},1000)
							}else{
								this.outResource(this.membersInfo[index]);
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
			formSubmit: function(e,index) {
				console.log(this.membersInfo[index])
				console.log(e.detail.value);
				var rule = [{
						name: "imActualUsers",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入实际使用人！"
					},
					{
						name: "imAccountNumber",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入账号！"
					},
					{
						name: "imAccessCard",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入门禁卡号！"
					},
					{
						name: "imFunctionary",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入行方负责人！"
					},
					{
						name: "imType",
						checkType: "in",
						checkRule: "1,2",
						errorMsg: "请选择出入场状态！"
					},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = this.$global.graceChecker.check(formData, rule);
				if (checkRes) {
					uni.showModal({
						title:'提示',
						content:'确认修改项目成员信息？',
						success: () => {
							this.membersInfo[index].itemId = this.resItemMsg.itemId;
							this.membersInfo[index].itemName = this.resItemMsg.itemName;
							if(formData.imType == "1"){
								formData.imNo = this.membersInfo[index].imNo;
							}
							if(this.resItemMsg.managerIdcardNo === this.membersInfo[index].imIdcardNo){
								uni.showModal({
									title:'提示',
									content:'确认修改项目经理信息？',
									success: () => {
										this.updateProjectMembersInfo(index,formData);
									}
								})
							}else{
								this.updateProjectMembersInfo(index,formData);
							}
						}
					})
				} else {
					uni.showToast({
						title: this.$global.graceChecker.error,
						icon: "none"
					});
				}
			},
		},
	}
</script>

<style>
	.dateRange {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.dateRange>view {
		width: 60rpx;
		text-align: center;
	}

	.dateRange picker {
		width: calc((100% - 60rpx) / 2);
	}

	.button-sp-area {
		margin: 60rpx auto;
		display: flex;
		justify-content: center;
	}

	.addBtn {
		width: 50%;
	}

	.title-text {
		font-size: 30rpx;
		margin: 20rpx 0;
		font-weight: bold;
	}

	.uni-form-item .title {
		padding-left: 20rpx;
	}
</style>
