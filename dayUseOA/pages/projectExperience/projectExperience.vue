<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-form-item uni-column">
				<view class="title">项目名称<text class="red">*</text></view>
				<view class="example-body">
					<view class="uni-combox__input-box">
						<input class="uni-combox__input" type="text" placeholder="请输入项目名称" name="itemName" :disabled="type == 3" v-model="itemInfo.itemName" @input="itemManagerChange" @focus="onFocus"/>
						<uni-icons class="uni-combox__input-arrow" type="arrowdown" size="20" @click="toggleSelector"></uni-icons>
						<view class="uni-combox__selector" v-if="showSelector">
							<scroll-view scroll-y="true" class="uni-combox__selector-scroll">
								<view class="uni-combox__selector-empty" v-if="staffChangeList.length == 0">
									<text>这里啥都没有</text>
								</view>
								<view class="uni-combox__selector-item" v-for="(item,index) in staffChangeList" :key="index" @click="onSelectorClick(index)">
									<text>{{item.itemName}}</text>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否建行项目<text class="red">*</text></view>
				<radio-group @change="constructionRadio" name="construction">
					<label class="radio">
						<radio value="1" :checked="itemInfo.construction === '1'" :disabled="type == 0"  />是</label>
					<label class="radio">
						<radio value="0" :checked="itemInfo.construction === '0'" :disabled="type == 0"  />否</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否中农工交银行项目<text class="red">*</text></view>
				<radio-group @change="fourBankRadio" name="fourBank">
					<label class="radio">
						<radio value="1" :checked="itemInfo.fourBank === '1'" :disabled="type == 0"  />是</label>
					<label class="radio">
						<radio value="0" :checked="itemInfo.fourBank === '0'" :disabled="type == 0"  />否</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否中农工交以外其他银行<text class="red">*</text></view>
				<radio-group @change="otherBankRadio" name="otherBank">
					<label class="radio">
						<radio value="1" :checked="itemInfo.otherBank === '1'" :disabled="type == 0"  />是</label>
					<label class="radio">
						<radio value="0" :checked="itemInfo.otherBank === '0'" :disabled="type == 0"  />否</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">使用建行新一代框架</view>
				<!-- <input class="uni-input" name="framework" v-model="itemInfo.framework" placeholder="请输入使用建行新一代框架" :disabled="type == 0"  /> -->
				<view class="boxWrap">
					<input class="uni-input" disabled="true" @click="setMultiple" v-model="itemInfo.framework"  placeholder="请选择建行新一代框架(可多选)" />
					<text class="triangle" v-show="isMultiple"></text>
					<view class="fixedBox" v-show="isMultiple">
						<view class="fixedList" v-for="(item,index) in frameList" @click="setChecked(item)" :key="index">
							<text>{{item.name}}</text>
							<uni-icons type="trash" size="16" color="#1A8AFA" v-if="item.checked"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目业务类别<text class="red">*</text></view>
				<picker @change="typeServiceChange"  name="typeService" v-model="itemInfo.typeService" :disabled="type == 0"  :range="typeServiceArray">
					<view class="uni-input">{{typeServiceArray[itemInfo.typeService]}}</view>
				</picker>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目时间<text class="red">*</text></view>
				<view class="dateRange">
					<picker mode="date" v-model="itemInfo.itemStartDate" name="itemStartDate" :start="startDate" :end="endDate" @change="bindDateChange" :disabled="type ==3" >
						<view class="uni-input">{{itemInfo.itemStartDate}}</view>
					</picker>
					<view> - </view>
					<picker mode="date" v-model="itemInfo.itemEndDate" name="itemEndDate" :start="startDate" :end="endDate" @change="bindDateChange2" :disabled="type ==3">
						<view class="uni-input">{{itemInfo.itemEndDate}}</view>
					</picker>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目角色<text class="red">*</text></view>
				<input class="uni-input" name="role" v-model="itemInfo.role" placeholder="请输入项目角色" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">证明人<text class="red">*</text></view>
				<input class="uni-input" name="reterence" v-model="itemInfo.reterence" placeholder="请输入证明人" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">证明人电话<text class="red">*</text></view>
				<input class="uni-input" type="number" name="telNo" v-model="itemInfo.telNo" placeholder="请输入证明人电话" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目职责<text class="red">*</text></view>
				<input class="uni-input" name="duty" v-model="itemInfo.duty" placeholder="请输入项目职责" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">使用工具/技能<text class="red">*</text></view>
				<input class="uni-input" name="tools" v-model="itemInfo.tools" placeholder="请输入使用工具/技能" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目简述<text class="red">*</text></view>
				<view class="uni-textarea">
					<textarea class="uni-input" name="itemUndergo" v-model="itemInfo.itemUndergo" placeholder="请输入项目描述,字数限制300字"
					 maxlength="300" />
					</view>
			</view>
			<view class="button-sp-area" v-if="type != 0">
				<button class='addBtn' type="primary" form-type="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<style>
	page{
		margin:30rpx 0;
	}
	.boxWrap{
		position:relative;
		z-index: 9999;
	}
	.fixedBox{
		position: relative;
		height:400rpx;
		overflow-y: scroll;
		width:100%;
		box-sizing: border-box;
		position:absolute;
		top:100rpx;
		border-radius: 4px;
		padding:0 20rpx;
		background-color: white;
	}
	.triangle{
		position:absolute;
		z-index: 99;
		top:90rpx;
		left:50%;
		margin-left:-5rpx;
		width:0;
		height:0;
		border-right:10rpx solid transparent;
		border-left:10rpx solid transparent;
		border-bottom:10rpx solid white;
	}
	.fixedList{
		height:60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:10rpx 0;
	}
	.fixedList .uni-icons{
		margin-right:20rpx;
	}
	.fixedBox .fixedList:not(:last-child){
		border-bottom: 1rpx solid #e6e6e6;
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
	.uni-input{
		color:#999;
	}
	.dateRange picker{
		width:calc((100% - 60rpx) / 2);
	}
	form textarea.uni-input{
		height:300rpx;
	}
	.button-sp-area{
		margin:60rpx auto;
	}
	.addBtn,.delBtn,.editBtn{
		width:50%;
	}
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
</style>

<script>
	export default {
		data(){
			return{
				userResourceInfo:{},
				itemInfo:{
					itemName:'',
					itemId:'',
					itemStartDate: '起始时间',
					itemEndDate: '结束时间',
					itemUndergo: '',
					construction:"",
					fourBank:"",
					otherBank:"",
					framework:'',
					typeService:'',
					role:"",
					reterence:"",
					telNo:"",
					duty:"",
					tools:"",
				},
				idcardNo: '111',
				typeServiceArray:['请输入项目业务类别','客户关系管理','存款','信贷','贸易融资','信用卡','投资理财','支付结算','代理业务','电子银行业务','托管及监管业务','渠道','投行业务','金融市场业务','运营支持','IT支持','资产负责管理','财务管理','管理分析','风险及内控合规','其他'],
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				type: '',
				index:undefined,
				itemList:[],
				showSelector: false,
				isMultiple:false,
				frameList:[{name: 'P1',checked: false},{name: 'P2',checked: false},{name: 'P3',checked: false},{name: 'P4',checked: false},
				{name: 'P5',checked: false},{name: 'P6',checked: false},{name: 'P7',checked: false},{name: 'P8',checked: false},
				{name: 'P9',checked: false},{name: 'P10',checked: false},{name: 'P11',checked: false},{name: 'P12',checked: false}],
				itemData:undefined
			}
		},
		computed:{
			staffChangeList(){
				return this.itemList.filter((item)=>{
					return item.itemName.indexOf(this.itemInfo.itemName) > -1
				})
			}
		},
		onLoad: function(e) {
			console.log(e);
			console.log(e.type === '2')
			if(e.type){
				this.type = e.type;
				if(e.type == 1){
					uni.getStorage({
						key: 'userResourceData',
						success: (res)=>{
							console.log(res)
							this.userResourceInfo = res.data;
						}
					});
				}else if(e.type == 2){
					//修改进来
					console.log('//修改进来')
					this.itemInfo = JSON.parse(e.item);
					this.index = e.index;
					console.log(this.itemInfo)
					this.getItemList(this.itemInfo.idcardNo);
					this.defaultChecked();
				} else if(e.type == 3){
					console.log('项目成员列表进来添加项目经验');
					console.log(e.itemData);
					this.itemData = JSON.parse(e.itemData);
					this.getResourceInfo(this.itemData.imIdcardNo);
					
				}
			}
		},
		onShow: function(e) {
			console.log('App Show')
			
			uni.getStorage({
			    key: 'userResourceData',
			    success: (res)=>{
					console.log('数据')
					console.log(res)
					this.userResourceInfo = res.data;
			    }
			});
			console.log('App Show')
		},
		methods:{
			defaultChecked(){
				this.itemInfo.framework.split(',').forEach(item =>{
					for(let key in this.frameList){
						if(this.frameList[key].name === item){
							this.frameList[key].checked = true;
							break;
						}
					}
				})
			},
			getResourceInfo(idcardNo){
				uni.showLoading({
					title:'loading...'
				})
				let url = `${this.$global.url}/getResourceInfo?idcardNo=${idcardNo}`
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log('资源池详情');
						console.log(res);
						console.log(res.data.resourceDate);
						console.log(res.data.resourceDate.itemList.length);
						if(res.data.errCode === '0' || res.data.errCode === ''){
							if(res.data.resourceDate.itemList.length != 0){
								this.itemInfo = res.data.resourceDate.itemList[res.data.resourceDate.itemList.length - 1];
								this.defaultChecked();
							}else{
								this.itemInfo.idcardNo = res.data.resourceDate.idcardNo;
								this.itemInfo.openid = res.data.resourceDate.openid;
								this.itemInfo.userName = res.data.resourceDate.userName;
							}
							this.itemInfo.itemStartDate = this.itemData.imInDate;
							this.itemInfo.itemEndDate = this.itemData.imOutDate;
							this.itemInfo.itemName = this.itemData.itemName;
							this.itemInfo.itemId = this.itemData.itemId;
							this.getItemList(this.itemData.imIdcardNo);
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
			setMultiple(){
				if(this.type){
					this.isMultiple = !this.isMultiple;
				}
			},
			setChecked(item){
				item.checked = !item.checked;
				let addressCheckedArray = [];
				this.frameList.forEach((item)=>{
					if(item.checked){
						addressCheckedArray.push(item.name);
					}
				});
				this.itemInfo.framework = addressCheckedArray.join(',')
			},
			getItemList(idcardNo){
				uni.showLoading({
					title:'loading...'
				})
				let url = `${this.$global.url}/getItemList?idcardNo=${idcardNo}&type=3`;
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log('包含自己的项目列表')
						console.log(res)
						if(res.data.errCode === '0' || res.data.errCode === ''){
							this.itemList = res.data.itemList;
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
						});
					},
				});
			},
			itemManagerChange(e){
				this.itemInfo.itemId = '';
			},
			toggleSelector() {
				if(this.type != 3){
					this.showSelector = !this.showSelector;
				}
			},
			onFocus() {
				this.showSelector = true;
			},
			addResourceItem(){
				uni.showLoading({
					title:'loading...'
				})
				let url = `${this.$global.url}/addResourceItem`;
				uni.request({
					url: url,
					method: 'POST',
					data:[this.itemInfo],
					success: (res) => {
						uni.hideLoading();
						console.log('添加个人项目经验');
						console.log(res)
						if(res.data.errCode === '0' || res.data.errCode === ''){
							uni.showToast({
								title:'项目经验添加成功，1秒后返回!',
								icon:'none',
								duration:1000
							})
							let time = setTimeout(()=>{
								uni.navigateTo({
									url:`../projectMembers/projectMembers?itemId=${this.itemData.itemId}`
								});
							},1000);
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
			onSelectorClick(index) {
				let isFalse = false;
				if(this.type == 1){
					this.userResourceInfo.itemList.forEach(item =>{
						 if(this.staffChangeList[index].itemId.indexOf(item.itemId) > -1){
							 uni.showToast({
								title:'该项目的额项目经验已创建!',
								icon:'none',
								duration:3000
							 })
							 isFalse = true;
						 }
					})
				}
				if(!isFalse){
					this.showSelector = false;
					this.itemInfo.itemId = this.staffChangeList[index].itemId;
					this.itemInfo.itemName = this.staffChangeList[index].itemName;
				}
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			    //定义表单规则
			    var rule = [
			        {name:"itemName", checkType : "string",  checkRule:"1,", errorMsg:"请输入项目名称！"},
					{name:"construction", checkType : "in", checkRule:"0,1",  errorMsg:"请选择是否建行项目！"},
					{name:"fourBank", checkType : "in", checkRule:"1,0",  errorMsg:"请选择是否中农工交银行项目！"},
					{name:"otherBank", checkType : "in", checkRule:"1,0",  errorMsg:"请选择是否中农工交以外其他银行！"},
					{name:"typeService", checkType : "notsame", checkRule:"0",  errorMsg:"请选择项目业务类别！"},
			        {name:"itemStartDate", checkType : "date", checkRule:"起始时间",  errorMsg:"请选择项目起始时间！"},
			        {name:"itemEndDate", checkType : "date", checkRule:"结束时间",  errorMsg:"请选择项目结束时间！"},
					{name:"role", checkType : "string", checkRule:"1,",  errorMsg:"请输入项目角色！"},
					{name:"reterence", checkType : "string", checkRule:"1,",  errorMsg:"请输入证明人！"},
					{name:"telNo", checkType : "phone", checkRule:"1,",  errorMsg:"证明人电话有误，请重新输入！"},
					{name:"duty", checkType : "string", checkRule:"1,",  errorMsg:"请输入项目职责！"},
					{name:"tools", checkType : "string", checkRule:"1,",  errorMsg:"请输入使用工具/技能！"},
					{name:"itemUndergo", checkType : "string", checkRule:"1,",  errorMsg:"请输入项目简述！"},
			    ];
			    //进行表单检查
			    var formData = e.detail.value;
			    var checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.itemInfo.itemStartDate !== '起始时间' && this.itemInfo.itemEndDate !== '结束时间' && 
				(this.itemInfo.itemStartDate === this.itemInfo.itemEndDate || new Date(this.itemInfo.itemStartDate).getTime() > new Date(this.itemInfo.itemEndDate).getTime())){
					uni.showToast({ title: '起始时间必须小于结束时间', icon: "none" });
					return;
				}
				if(this.itemInfo.itemId === ''){
					uni.showToast({title:"请选择项目名称", icon:"none"});
					return;
				}
			    if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					if(this.type != 3){
						if(!this.index){
							this.userResourceInfo.itemList.unshift(this.itemInfo);
						}else{
							formData.itemNo = this.userResourceInfo.itemList[this.index].itemNo;
							formData.openid = this.userResourceInfo.itemList[this.index].openid;
							formData.idcardNo = this.userResourceInfo.itemList[this.index].idcardNo;
							this.userResourceInfo.itemList[this.index] = this.itemInfo;
						}
						uni.setStorage({
							key: 'userResourceData',
							data: this.userResourceInfo,
							success: ()=>{
								uni.navigateBack({detail:1});
							}
						});
					}else{
						this.addResourceItem();
					}
				}else{
			        uni.showToast({ title: this.$global.graceChecker.error, icon: "none" });
			    }
			},
			bindDateChange: function(e) {
				this.itemInfo.itemStartDate = e.detail.value;
			},
			bindDateChange2: function(e) {
				this.itemInfo.itemEndDate = e.detail.value;
			},
			typeServiceChange:function(e){
				this.itemInfo.typeService = e.detail.value;
			},
			constructionRadio(e) {
				this.itemInfo.construction = e.target.value;
			},
			fourBankRadio(e) {
				this.itemInfo.fourBank = e.target.value;
			},  
			otherBankRadio(e) {
				this.itemInfo.otherBank = e.target.value;
			},
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
