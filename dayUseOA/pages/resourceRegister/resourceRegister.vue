<template>
	<view>
		<scroll-view :scroll-top="scrollTop.now" class="scrollBox" scroll-y @scroll="scroll" >
			<view class="uni-common-mt">
				<view class="uni-form-item uni-column">
					<view class="title">姓名<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userResourceInfo.userName" :disabled="type == 0" placeholder="请输入姓名" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">性别<text class="red" v-if="type != 0">*</text></view>
					<radio-group @change="sexChange">
						<label class="radio">
							<radio value="1" :checked="userResourceInfo.sex == '1'" :disabled="type == 0" />男</label>
						<label class="radio">
							<radio value="0" :checked="userResourceInfo.sex == '0'"  :disabled="type == 0" />女</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">身份证号<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" type="idcard" v-model="userResourceInfo.idcardNo" placeholder="请输入证件号码" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">现住址<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userResourceInfo.addressNow" placeholder="请输入现住址"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">电话<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" type="number" v-model="userResourceInfo.telephone" placeholder="请输入电话"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">邮箱<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userResourceInfo.email" placeholder="请输入邮箱"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">公司名称<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userResourceInfo.companyName" placeholder="请输入公司名称"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">人员所在地名称<text class="red" v-if="type != 0">*</text></view>
					<view class="boxWrap">
						<input class="uni-input" disabled="true" @click="setMultiple" v-model="userResourceInfo.addressCheckedName"  placeholder="请输入选择人员所在地名称(可多选)" />
						<view class="fixedBox" v-show="isMultiple">
							<text class="triangle"></text>
							<view class="fixedList" v-for="(item,index) in memberAddressArray" @click="setChecked(item)" :key="index">
								<text>{{item.name}}</text>
								<uni-icons type="trash" size="16" color="#1A8AFA" v-if="item.checked"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">专业技能描述<text class="red" v-if="type != 0">*</text></view>
					<view class="uni-textarea">
						<textarea class="uni-input" v-model="userResourceInfo.expertise" placeholder="请输入专业技能描述" :disabled="type == 0"  v-show="!isMultiple"/>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">劳动合同开始日期<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userResourceInfo.laborStartDate" :disabled="type == 0"  :start="startDate" :end="endDate" @change="laborStartDateChange">
						<view class="uni-input" v-model="userResourceInfo.laborStartDate">{{userResourceInfo.laborStartDate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">劳动合同结束日期<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userResourceInfo.laborEndDate" :disabled="type == 0"  :start="startDate" :end="endDate" @change="laborEndDateChange">
						<view class="uni-input">{{userResourceInfo.laborEndDate}}</view>
					</picker>
				</view>
				<view class="header">
					<view class="title">教育经历<text class="red" v-if="type != 0">*</text></view>
					<view class="addbtn" @click="goDetail('education',type)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"  v-if="userResourceInfo.educationInfo === ''"></image>
						<image src="../../static/image/edit.png" mode="widthFix" v-else></image>
						<view v-if="userResourceInfo.educationInfo === ''">添加</view>
						<view v-else>修改</view>
					</view>
				</view>
				<uni-collapse v-if="userResourceInfo.educationInfo">
				    <uni-collapse-item  :title="userResourceInfo.educationInfo.school" >
						<view class="list">
							<view class="time"><text>{{userResourceInfo.educationInfo.startDate}}</text> 至 <text>{{userResourceInfo.educationInfo.endDate}}</text></view>
							<view>学历</view>
							<view class="describe">{{userResourceInfo.educationInfo.educational}}</view>
							<view>学位</view>
							<view class="describe">{{userResourceInfo.educationInfo.degree}}</view>
							<view>毕业学校类别</view>
							<view class="describe">
								<text v-if="userResourceInfo.educationInfo.schoolType == '0'">普通高校</text>
								<text v-if="userResourceInfo.educationInfo.schoolType == '1'">民办学校</text>
								<text v-if="userResourceInfo.educationInfo.schoolType == '2'">国民高等教育</text>
							</view>
							<view>专业名称</view>
							<view class="describe">{{userResourceInfo.educationInfo.specialty}}</view>
							<view>专业类别</view>
							<view class="describe">{{userResourceInfo.educationInfo.majorType}}</view>
							<view>毕业证号</view>
							<view class="describe">{{userResourceInfo.educationInfo.certificateNo}}</view>
							<view>学位证号</view>
							<view class="describe">{{userResourceInfo.educationInfo.degreeCertificateNumber}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="header">
					<view class="title">工作经历<text class="red" v-if="type != 0">*</text></view>
					<view class="addbtn" @click="goDetail('workExperience',type)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>
				<uni-collapse v-if="userResourceInfo.workList.length != 0">
				    <uni-collapse-item  :title="item.corporateName"  v-for="(item,index) in userResourceInfo.workList" :key="index">
						<view class="list">
							<view class="time"><text>{{item.workStartDate}}</text> 至 <text>{{item.workEndDate}}</text></view>
							<view>职位描述</view>
							<view class="describe">{{item.job}}</view>
							<view>工作职责</view>
							<view class="describe">{{item.content}}</view>
							<view class="handle" v-if="type != 0">
								<button type="primary" size="mini" @click="editWork(item,index)">修改</button>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="header">
					<view class="title">项目经历</view>
					<view class="addbtn" @click="goDetail('projectExperience',1)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>
				<uni-collapse v-if="userResourceInfo.itemList.length != 0">
				    <uni-collapse-item  :title="item.itemName"  v-for="(item,index) in userResourceInfo.itemList" :key="index">
						<view class="list">
							<view class="time"><text>{{item.itemStartDate}}</text> 至 <text>{{item.itemEndDate}}</text></view>
							<view>是否建行项目</view>
							<view class="describe">
								<text v-if="item.construction == '1'">是</text>
								<text v-if="item.construction == '0'">否</text>
							</view>
							<view>是否中农工交银行项目</view>
							<view class="describe">
								<text v-if="item.fourBank === '1'">是</text>
								<text v-if="item.fourBank === '0'">否</text>
							</view>
							<view>是否中农工交以外其他银行</view>
							<view class="describe">
								<text v-if="item.otherBank === '1'">是</text>
								<text v-if="item.otherBank === '0'">否</text>
							</view>
							<view>使用建行新一代框架</view>
							<view class="describe">{{item.framework}}</view>
							<view>项目业务类别</view>
							<view class="describe">{{typeServiceArray[item.typeService]}}</view>
							<view>项目角色</view>
							<view class="describe">{{item.role}}</view>
							<view>证明人</view>
							<view class="describe">{{item.reterence}}</view>
							<view>证明人电话</view>
							<view class="describe">{{item.telNo}}</view>
							<view>项目职责</view>
							<view class="describe">{{item.duty}}</view>
							<view>使用工具/技能</view>
							<view class="describe">{{item.tools}}</view>
							<view>项目简述</view>
							<view class="describe">{{item.itemUndergo}}</view>
							<view class="handle" v-if="type != 0">
								<button type="primary" size="mini" @click="editItem(item,index)">修改</button>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				 <button type="primary" class="button-margin" @click="submit" v-if="type != 0">保存</button>
			</view>
		</scroll-view>
	</view>
</template>

<style>
	.handle button{
		margin-right:20rpx;
	}
	.uni-common-mt{
		margin:0;
		padding:30rpx 0;
	}
	.uni-textarea{
		height:200rpx;
	}
	.boxWrap{
		position:relative;
		z-index: 9999;
	}
	.fixedBox{
		position: relative;
		width:100%;
		box-sizing: border-box;
		position:absolute;
		top:100rpx;
		border-radius: 4px;
		padding:0 20rpx;
		background-color: white;
		box-shadow: 1px 1px 5px #e6e6e6;
	}
	.triangle{
		position:absolute;
		z-index: 99;
		top:-10rpx;
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
	.declare-title{
		margin-top: 30rpx;
	}
	.require{
		color:red;
	}
	.uni-title text{
		color:red;
	}
	.button-margin{
		margin: 40rpx auto;
		width: 50%;
	}
	.uni-list-cell{
		padding-left:0px
	}
	.text-style{
		text-indent:40rpx;
	}
	.text-color{
		padding:20rpx;
		background-color: #fff;
	}
	.view-notext{
		 height: 40rpx;
	}
	.header{
		margin:30rpx 0 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
	}
	.addbtn{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color:#1A8AFA;
	}
	.header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.list{
		padding:20rpx 30rpx;
		background-color: #e6e6e6;
	}
	.list>view{
		margin-top:20rpx;
	}
	.list .header{
		padding:0;
	}
	.list .header .title{
		font-size:32rpx;
		max-width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
	}
	.list .addbtn image,.list .title image{
		width:34rpx;
		margin:0;
	}
	.list .title image{
		margin: 0 10rpx -4rpx 0;
	}
	.list .time{
		font-size:30rpx;
		color:#A5A5A5;
	}
	.describe{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;/*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
		-webkit-line-clamp: 2;/*用来限制在一个块元素显示的文本的行数。*/
		-webkit-box-orient: vertical;
		color:#757575;
	}
</style>

<script>
	import uniCollapse from '../../components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '../../components/uni-collapse-item/uni-collapse-item.vue'
	import uniIcons from "../../components/uni-icons/uni-icons.vue"
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniIcons
		},
		data(){
			return{
				type: undefined,
				isMultiple: false,
				typeServiceArray:['投行业务','金融市场业务','运营支持','IT支持','资产负责管理','财务管理','管理分析','风险及内控合规','其他'],
				memberAddressArray:[
					{
						name: '北京事业群',
						checked: false
					},{
						name: '上海事业群',
						checked: false
					},{
						name: '厦门事业群',
						checked: false
					},{
						name: '广州事业群',
						checked: false
					},{
						name: '成都事业群',
						checked: false
					},{
						name: '武汉事业群',
						checked: false
					},{
						name: '深圳事业群',
						checked: false
					},
				],
				userResourceInfo: {
					userName:"",
					sex:"",
					idcardNo:'',
					addressNow:'',
					telephone: '',
					companyName: '',
					email:'',
					addressCheckedName:'',
					expertise: '',
					laborStartDate: '',
					laborEndDate: '',
					educationInfo:undefined,
					workList:[],
					itemList:[]
				},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				scrollTop:{
					now:0,
					old:0
				},
				openid: '',
			}
		},
		onLoad(e){
			if(e.type){
				this.type = e.type;
				uni.setStorageSync('resourceType',e.type)
			}
			console.log(e);
			let title = '';
			if(this.type === '0'){
				console.log('详情')
				title = '资源池详情';
				this.getResourceInfo(e.idcardNo);
			}else if(this.type === '1'){
				console.log('入职')
				title = '资源池新增';
			}else if(this.type === '2'){
				// 修改
				this.userResourceInfo.openid = e.openid;
				this.getResourceInfo(e.idcardNo);
			}
			uni.setNavigationBarTitle({
			    title: title
			});
		},
		onShow: function() {
			uni.getStorage({
				key:'resourceType',
				success: res =>{
					this.type = res.data;
				}
			})
			uni.getStorage({
				key: 'userResourceData',
				success: res => {
					console.log('userResourceData')
					console.log(res.data)
					this.userResourceInfo = res.data;
				},
				fail: () => {
					if(this.type == 1){
						if(!uni.getStorageSync('isAdd')){
							this.userResourceInfo = {
								userName:"",
								sex:"",
								idcardNo:'',
								addressNow:'',
								telephone: '',
								companyName: '',
								email:'',
								addressCheckedName:'',
								expertise: '',
								laborStartDate: '',
								laborEndDate: '',
								educationInfo:undefined,
								workList:[],
								itemList:[]
							}
							this.userResourceInfo.openid = uni.getStorageSync('openid');
							uni.setStorageSync('isAdd','1');
						}
					}
				}
			});
			this.userResourceInfo.addressCheckedName.split(',').forEach(item =>{
				for(let key in this.memberAddressArray){
					if(this.memberAddressArray[key].name === item){
						this.memberAddressArray[key].checked = true;
						break;
					}
				}
			})
		},
		methods:{
			scroll(e){
				this.scrollTop.old = e.detail.scrollTop;
			},
			//修改项目经验
			editItem(item,index){
				uni.setStorage({
				    key: 'userResourceData',
				    data: this.userResourceInfo,
				    success: ()=>{
						let url = `../projectExperience/projectExperience?type=2&item=${JSON.stringify(item)}&&index=${index}`;
						uni.navigateTo({url});
				    }
				});
			},
			// 修改工作经历
			editWork(item,index){
				uni.setStorage({
				    key: 'userResourceData',
				    data: this.userResourceInfo,
				    success: ()=>{
						let url = `../workExperience/workExperience?item=${JSON.stringify(item)}&&index=${index}`;
						uni.navigateTo({url});
				    }
				});
			},	
			//获取资源池信息进行修改合同日期
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
						if(res.data.errCode === '0' || res.data.errCode === ''){
							if(this.type == 2){
								this.userResourceInfo = res.data.resourceDate;
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
				if(this.type !== '0'){
					this.isMultiple = !this.isMultiple;
				}
			},
			setChecked(item){
				item.checked = !item.checked;
				let addressCheckedArray = [];
				this.memberAddressArray.forEach((item)=>{
					if(item.checked){
						addressCheckedArray.push(item.name);
					}
				});
				this.userResourceInfo.addressCheckedName = addressCheckedArray.join(',')
			},
			sexChange(e){
				this.userResourceInfo.sex = e.detail.value;
			},
			laborStartDateChange(e){
				this.userResourceInfo.laborStartDate = e.detail.value;
			},
			laborEndDateChange(e){
				this.userResourceInfo.laborEndDate = e.detail.value;
			},
			bindDateChange: function(e) {
				this.userResourceInfo.date = e.target.value;
			},
			submit(){
				for(let i in this.userResourceInfo){
					console.log(this.userResourceInfo[i]);
					console.log(i);
					if(i != 'itemList' && i != 'educationInfo' && i != 'workList'){
						this.userResourceInfo[i] = this.userResourceInfo[i].trim();
					}
					if(this.userResourceInfo[i] === "" || this.userResourceInfo.workList.length === 0){
						console.log(i)
						uni.showToast({
						    title: '请完整填写必填项！',
							icon:"none",
							mask:true
						});
						return
					}
				};
				console.log(this.userResourceInfo);
				console.log(JSON.stringify(this.userResourceInfo));
				uni.showLoading({
					title:'loading...'
				})
				if(this.type == 2){
					//修改
					this.updateResourceRegister();
				}else if(this.type == 1){
					// 添加资源池
					this.addResource();
				}
			},
			updateResourceRegister(){
				return new Promise((resolve,reject)=>{
					uni.request({
					    url: `${this.$global.url}/updateResourceRegister`,
						method:'POST',
					    data: this.userResourceInfo ,
					    success: (res)=> {
							uni.hideLoading();
					        console.log(res);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								uni.showToast({
									title:'修改成功,1秒后跳转到资源池列表',
									icon:'none',
									duration:1000,
								})
								uni.removeStorageSync('resourceType');
								uni.removeStorageSync('userResourceData');
								uni.removeStorageSync('isAdd');
								setTimeout(()=>{
									uni.navigateTo({
									    url: '../resourceList/resourceList'
									});
								},1000)
							}else{
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel:false
								})
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
			addResource(){
				return new Promise((resolve,reject)=>{
					uni.request({
					    url: `${this.$global.url}/resourceRegister`,
						method:'POST',
					    data: this.userResourceInfo ,
					    success: (res)=> {
							uni.hideLoading();
					        console.log(res);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								uni.showToast({
									title:'提交成功,1秒后跳转到资源池列表',
									icon:'none',
									duration:1000,
								})
								uni.removeStorageSync('resourceType');
								uni.removeStorageSync('userResourceData');
								setTimeout(()=>{
									uni.navigateTo({
									    url: '../resourceList/resourceList'
									});
								},1000)
							}else{
								uni.showModal({
									title: '提示',
									content: res.data.errMsg,
									showCancel:false
								})
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
			goDetail(name,type,index){
				this.scrollTop.now = this.scrollTop.old;
				 //type 默认1添加，0详情  index 修改数据的下标
				uni.setStorage({
				    key: 'userResourceData',
				    data: this.userResourceInfo,
				    success: ()=>{
						let url = '';
						if(!index){
							url = `../${name}/${name}?type=${type}`;
						}else{
							url = `../${name}/${name}?type=${type}&index=${index}`;
						}
				       uni.navigateTo({url});
				    }
				});
			},
		},
	}
</script>
