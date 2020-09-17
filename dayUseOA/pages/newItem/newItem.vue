<template>
	<view>
		<form  @submit="formSubmit">
			<view class="education">
				<view class="uni-form-item uni-column">
					<view class="title">项目名称<text class="red">*</text></view>
					<input class="uni-input" name="itemName" v-model="itemInfo.itemName" placeholder="请输入项目名称"/>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">项目时间<text class="red">*</text></view>
					<view class="dateRange">
						<picker mode="date" :value="itemInfo.itemStartDate" name="itemStartDate" :start="startDate" :end="endDate" @change="changeStartDate">
							<view class="uni-input">{{itemInfo.itemStartDate}}</view>
						</picker>
						<view> - </view>
						<picker mode="date" :value="itemInfo.itemEndDate" name="itemEndDate" :start="startDate" :end="endDate" @change="changeEndDate">
							<view class="uni-input">{{itemInfo.itemEndDate}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">公司项目经理<text class="red">*</text></view>
					<view class="example-body">
						<view class="uni-combox__input-box">
							<input class="uni-combox__input" type="text" placeholder="请输入项目经理姓名" name="itemManager" v-model="itemInfo.itemManager" :disabled="itemId" @input="itemManagerChange" @focus="onFocus"/>
							<uni-icons class="uni-combox__input-arrow" type="arrowdown" size="20" @click="toggleSelector"></uni-icons>
							<view class="uni-combox__selector" v-if="showSelector">
								<scroll-view scroll-y="true" class="uni-combox__selector-scroll">
									<view class="uni-combox__selector-empty" v-if="staffChangeList.length == 0">
										<text>这里啥都没有</text>
									</view>
									<view class="uni-combox__selector-item" v-for="(item,index) in staffChangeList" :key="index" @click="onSelectorClick(index)">
										<text>{{item.userName}}</text>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">行方项目经理<text class="red">*</text></view>
					<input class="uni-input" name="bankItemManager" v-model="itemInfo.bankItemManager" placeholder="请输入行方项目经理"/>
				</view>
			</view>
			<view class="button-sp-area">
				<button class='saveBtn' type="primary" form-type="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<style>
	.uni-combox__input-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		height: 40px;
		flex-direction: row;
		align-items: center;
		// border-bottom: solid 1px #DDDDDD;
		background-color: white;
		padding:0 24rpx;
		position:relative;
	}
	
	.uni-combox__input {
		flex: 1;
		font-size: 14px;
		height: 22px;
		line-height: 22px;
	}
	
	.uni-combox__selector {
		box-sizing: border-box;
		position: absolute;
		top: 42px;
		left: 0;
		width: calc(100vw - 30px);
		background-color: #FFFFFF;
		border-radius: 6px;
		box-shadow: #DDDDDD 4px 4px 8px, #DDDDDD -4px -4px 8px;
		z-index: 999;
	}
	
	.uni-combox__selector-scroll {
		max-height: 200px;
		box-sizing: border-box;
		position:relative;
	}
	
	.uni-combox__selector::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: solid 6px #FFFFFF;
		border-right: solid 6px transparent;
		border-left: solid 6px transparent;
		left: 50%;
		top: -6px;
		margin-left: -6px;
	}
	
	.uni-combox__selector-empty,
	.uni-combox__selector-item {
		/* #ifdef APP-NVUE */
		display: flex;
		/* #endif */
		line-height: 36px;
		font-size: 14px;
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		margin: 0px 10px;
	}
	.shadow{
		height:100%;
		width:100%;
		position:absolute;
		top:0;
		left:0;
		z-index: 999;
		background-color: rgba(0,0,0,.5);
	}
	.uni-combox__selector-empty:last-child,
	.uni-combox__selector-item:last-child {
		border-bottom: none;
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
	.button-sp-area{
		margin:60rpx 0;
		display: flex;
		justify-content: center;
	}
	.saveBtn{
		width:50%;
	}
</style>

<script>
	export default {
		data() {
			return {
				itemInfo:{
					itemName: '',
					itemStartDate:'',
					itemEndDate: '',
					itemManager: '',
					bankItemManager: '',
					managerOpenid:'',
					managerIdcardNo:'',
				},
				itemId:undefined,
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				showSelector: false,
				staffList:[],
			}
		},
		computed:{
			staffChangeList(){
				return this.staffList.filter((item)=>{
					return item.userName.indexOf(this.itemInfo.itemManager) > -1
				})
			}
		},
		onLoad: function(e) {
			if(e.itemId){
				this.itemId = e.itemId;
				this.getItemInfo();
			}
			this.getResourceList();
		},
		methods: {
			getItemInfo(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					let url = `${this.$global.url}/getItemInfo?itemId=${this.itemId}`;
					uni.request({
						url: url,
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							if(res.data.errCode === '0' || res.data.errCode === ''){
								this.itemInfo = res.data.itemInfo;
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
			getResourceList(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					let url = `${this.$global.url}/getResourceList?isEntrance=2`;
					uni.request({
						url: url,
						method: 'GET',
						success: (res) => {
							uni.hideLoading();
							console.log('项目列表');
							console.log(res.data);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								this.staffList = res.data.resourceList;
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
			addNewItem(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					let url = `${this.$global.url}/newItem`;
					uni.request({
						url: url,
						data: this.itemInfo,
						method: 'POST',
						success: (res) => {
							uni.hideLoading();
							console.log('项目列表');
							console.log(res.data);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								uni.showToast({
									title:'提交成功',
									icon:'none',
									duration:3000,
									success: () => {
										uni.navigateTo({
											url:`../itemList/itemList`
										})
									}
								})
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
			editItem(){
				return new Promise((resolve,reject)=>{
					uni.showLoading({
						title:'loading...'
					})
					this.itemInfo.itemId = this.itemId;
					let url = `${this.$global.url}/updateItem`;
					uni.request({
						url: url,
						data: this.itemInfo,
						method: 'POST',
						success: (res) => {
							uni.hideLoading();
							console.log('项目列表');
							console.log(res.data);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								uni.showToast({
									title:'提交成功',
									icon:'none',
									duration:3000,
									success: () => {
										uni.navigateTo({
											url:`../itemList/itemList`
										})
									}
								})
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
			formSubmit(e){
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				console.log(this.itemInfo)
				//定义表单规则
				var rule = [
					{name:"itemName", checkType:"string", checkRule:"1,",  errorMsg:"请输入项目名称"},
					{name:"itemStartDate", checkType:"date", checkRule:"开始时间",  errorMsg:"请选择项目开始时间"},
					{name:"itemEndDate", checkType:"date", checkRule:"结束时间",  errorMsg:"请选择项目结束时间"},
					{name:"itemManager", checkType:"string", checkRule:"1,",  errorMsg:"请输入公司项目经理名称!"},
					{name:"bankItemManager", checkType:"string", checkRule:"1,",  errorMsg:"请输入行方项目经理!"},
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.itemInfo.itemStartDate !== '起始时间' && this.itemInfo.itemEndDate !== '结束时间' &&
				(this.itemInfo.itemStartDate === this.itemInfo.itemEndDate || new Date(this.itemInfo.itemStartDate).getTime() > new Date(this.itemInfo.itemEndDate).getTime())){
					uni.showToast({ title: '起始时间必须小于结束时间', icon: "none" });
					return;
				}
				if(this.itemInfo.managerOpenid === ''){
					uni.showToast({title:"请选择公司项目经理", icon:"none"});
					return;
				}
				if(checkRes){
					console.log(formData);
					//是否是修改
					if(this.itemId){
						this.editItem();
					}else{
						this.addNewItem();
					}
				}else{
					uni.showToast({ title: this.$global.graceChecker.error, icon: "none" });
				}
			},
			changeStartDate(e) {
				this.itemInfo.itemStartDate = e.detail.value;
			},
			itemManagerChange(e){
				this.itemInfo.managerOpenid = '';
			},
			changeEndDate(e) {
				this.itemInfo.itemEndDate = e.detail.value;
			},
			toggleSelector() {
				if(!this.itemId){
					this.showSelector = !this.showSelector;
				}
			},
			onFocus() {
				this.showSelector = true;
			},
			onSelectorClick(index) {
				this.showSelector = false;
				this.itemInfo.managerOpenid = this.staffChangeList[index].openid;
				this.itemInfo.managerIdcardNo = this.staffChangeList[index].idcardNo;
				this.itemInfo.itemManager = this.staffChangeList[index].userName;
			},
		}
	}
</script>

