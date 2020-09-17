<template>
	<view>
		<scroll-view :scroll-top="scrollTop.now" class="scrollBox" scroll-y @scroll="scroll">
			<view class="uni-common-mt">
				<view class="uni-form-item uni-column">
					<view class="title view-margin">应聘职位<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input input-color" focus v-model="userInfo.position" placeholder="请输入应聘职位" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">填表日期<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userInfo.writeDate" :start="startDate" :end="endDate" @change="bindDateChange" :disabled="type == 0" >
						<view class="uni-input" v-model="userInfo.writeDate">{{userInfo.writeDate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">姓名<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.userName"  placeholder="请输入姓名" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">性别<text class="red" v-if="type != 0">*</text></view>
					<radio-group @change="sexChange">
						<label class="radio">
							<radio value="1" :checked="userInfo.sex == '1'" :disabled="type == 0" />男</label>
						<label class="radio">
							<radio value="0" :checked="userInfo.sex == '0'" :disabled="type == 0"  />女</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">出生年月<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userInfo.birthday" :start="startDate" :end="endDate" @change="birthdayChange" :disabled="type == 0" >
						<view class="uni-input" v-model="userInfo.birthday">{{userInfo.birthday}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">民族<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.nation" placeholder="请输入民族"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">籍贯<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.nativePlace " placeholder="请输入籍贯" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">政治面貌<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.politicalStatus" placeholder="请输入政治面貌" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">文化程度<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.educational" placeholder="请输入文化程度"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">所学专业<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.specialty" placeholder="请输入所学专业"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">技术职称</view>
					<input class="uni-input" v-model="userInfo.academicTitle" placeholder="请输入技术职称"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">身份证号码<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" type="idcardNo" v-model="userInfo.idcardNo" placeholder="请输入身份证号码"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">婚姻状况<text class="red" v-if="type != 0">*</text></view>
					<radio-group @change="marry">
						<label class="radio">
							<radio value="1"  :checked="userInfo.marryStatus == '1'" :disabled="type == 0" />已婚</label>
						<label class="radio">
							<radio value="0" :checked="userInfo.marryStatus == '0'" :disabled="type == 0" />未婚</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业学校<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.school" placeholder="请输入毕业学校"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业时间<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userInfo.graduation" :start="startDate" :end="endDate" @change="graduationChange" :disabled="type == 0" >
						<view class="uni-input">{{userInfo.graduation}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业证书编号<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.certificateNo" placeholder="请输入毕业证书编号,没有填无"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">学位证书编号<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.degreeCertificateNumber" placeholder="请输入学位证书编号,没有填无"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">家庭住址<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.address" placeholder="请输入家庭住址"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">邮编</view>
					<input class="uni-input" type="number" v-model="userInfo.postalCode" placeholder="请输入邮编"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">通讯地址<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.addressNow" placeholder="请输入通讯地址"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">户口所在地<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.residence" placeholder="请输入户口所在地"  :disabled="type == 0" />
				</view>
				<view class="uni-title">是否自购电脑<text class="red" v-if="type != 0">*</text></view>
				<view>
					<radio-group @change="computer">
						<label class="radio">
							<radio value="1"  :checked="userInfo.computerType == '1'" :disabled="type == 0" />是</label>
						<label class="radio">
							<radio value="0" :checked="userInfo.computerType == '0'" :disabled="type == 0" />否</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">联系电话<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" type="number" v-model="userInfo.telephone" placeholder="请输入联系电话"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">常用E-Mail<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.email" placeholder="请输入常用E-Mail"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">QQ号码</view>
					<input class="uni-input" type="number" v-model="userInfo.qq" placeholder="请输入QQ号码"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">现工作部门</view>
					<input class="uni-input" v-model="userInfo.section" placeholder="请输入现工作部门"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">现任职务</view>
					<input class="uni-input" v-model="userInfo.job" placeholder="请输入现任职务"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">入职日期<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userInfo.entryDate" :start="startDate" :end="endDate" @change="entryDateChange" :disabled="type == 0" >
						<view class="uni-input">{{userInfo.entryDate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">转正日期<text class="red" v-if="type != 0">*</text></view>
					<picker mode="date" :value="userInfo.turnoverDate" :start="startDate" :end="endDate" @change="turnoverDateChange" :disabled="type == 0" >
						<view class="uni-input">{{userInfo.turnoverDate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">期望薪资<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.expectedSalary" placeholder="请输入期望薪资" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">拟定试用薪资<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.trialSalary"  placeholder="请输入拟定试用薪资" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">拟定转正薪资<text class="red" v-if="type != 0">*</text></view>
					<input class="uni-input" v-model="userInfo.positiveSalary" placeholder="请输入拟定转正薪资" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">工作母地</view>
					<input class="uni-input" v-model="userInfo.workingMotherland" placeholder="请输入工作母地" :disabled="type == 0"  />
				</view>
				<view class="uni-title">兴趣爱好</view>
				<view class="uni-textarea">
					<textarea maxlength="-1" v-model="userInfo.hobbies" placeholder="请输入兴趣爱好" :disabled="type == 0"  />
					</view>
				<view class="uni-title uni-common-pl">特长</view>
				<view class="uni-textarea">
					<textarea  maxlength="-1" v-model="userInfo.speciality"  placeholder="请输入特长" :disabled="type == 0" />
				</view>
				<view class="header">
					<view class="title">学习及培训情况</view>
					<view class="addbtn" @click="add('study',true)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>
				<uni-collapse v-if="userInfo.studyList.length != 0">
				    <uni-collapse-item  :title="item.studyUnit"  v-for="(item,index) in userInfo.studyList" :key="index">
						<view class="list">
							<view class="time"><text>{{item.studyStartDate}}</text> 至 <text>{{item.studyEndDate}}</text></view>
							<view>学习及培训内容</view>
							<view class="describe">{{item.studyContent}}</view>
							<view>结果</view>
							<view class="describe">{{item.studyResult}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="header">
					<view class="title">工作经历</view>
					<view class="addbtn" @click="add('workUndergo',true)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>
				<uni-collapse v-if="userInfo.workList.length != 0">
				    <uni-collapse-item  :title="item.workUnit"  v-for="(item,index) in userInfo.workList" :key="index">
						<view class="list">
							<view class="time"><text>{{item.workStartDate}}</text> 至 <text>{{item.workEndDate}}</text></view>
							<view>从事何种工作</view>
							<view class="describe">{{item.workContent}}</view>
							<view>任何职</view>
							<view class="describe">{{item.workJob}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="header">
					<view class="title">项目经历</view>
					<view class="addbtn" @click="add('itemUndergo',true)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>	
				<uni-collapse v-if="userInfo.itemList.length != 0">
				    <uni-collapse-item   :title="item.itemName"  v-for="(item,index) in userInfo.itemList" :key="index">
						<view class="list">
							<view class="time"><text>{{item.itemStartDate}}</text> 至 <text>{{item.itemEndDate}}</text></view>
							<view>运用技能</view>
							<view class="describe">{{item.itemSkill}}</view>
							<view>主要工作</view>
							<view class="describe">{{item.itemUndergo}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="header">
					<view class="title">社会关系情况</view>
					<view class="addbtn" @click="add('socialRelations',true,userInfo.marryStatus)" v-if="type != 0">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>	
				<uni-collapse v-if="userInfo.memberList.length != 0">
				    <uni-collapse-item   :title="item.memberName"  v-for="(item,index) in userInfo.memberList" :key="index">
						<view class="list">
							<view>与本人关系</view>
							<view class="describe">{{item.memberRelation}}</view>
							<view>籍贯</view>
							<view class="describe">{{item.memberNativePlace}}</view>
							<view>出生年月</view>
							<view class="describe">{{item.memberBrithday}}</view>
							<view>单位</view>
							<view class="describe">{{item.workUnit}}</view>
							<view>职务</view>
							<view class="describe">{{item.memberJob}}</view>
							<view>电话</view>
							<view class="describe">{{item.memberPhone}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view class="view-notext"></view>
				<uni-collapse class="declare-title">
				    <uni-collapse-item title="员工入职申明" :type="type">
						<view class="text-color">
							<view class="text-style">1、公司已如实告知本人工作需要出差、工作内容、工作条件、工作地点、职业危害、安全生产状况、劳动报酬，以及本人要求了解的其他情况。本人已充分知晓本公司本岗位工作相关工作内容和要求，并愿意服从公司工作安排。</view>
							<view class="text-style">2、本人已如实填写员工基本资料表，并保证所填写内容信息的真实、准确、完整。本人保证向公司提供的个人身份证、毕业证学历证、各种资格证、暂住证等证件均为真实有效的，本人陈述的任何有关本人自身情况包括但不限于本人的学历、学位、技能，工作经历、家庭情况、婚姻状况、身体状况等等都是真实的，若本人就上述自身情形为不实陈述或证件不真实，则视为本人的欺诈行为，公司可以据此解除与本人的劳动合同，并且不负担任何赔偿和补偿责任。因本人的不实陈述给公司造成的损害，由本人承担。</view>
							<view class="text-style">3、在此之前，公司已向本人出示和解释了公司现有的各项规章制度，本人已阅读公司下发的《员工手册》及各项规章制度并理解规定的内容、对其没有任何异义。经过公开，公示，我认为程序是公正的，内容是公平的，我承诺将遵守员工手册及公司的各项规章制度，包括手册和各项制度的后续更新修订内容，都会严格遵守执行，如有违反，公司可以据此解除与本人的劳动合同，并且不负担任何赔偿和补偿责任。</view>
							<view class="text-style">特别强调，本人理解公司的商业秘密保护政策，本人将严格保守公司的商业秘密。</view>
							<view class="text-style">4、本人承诺，对个人所支领之薪资,津贴及奖金与业务机密等,负完全保密责任,不向他人透露,也不向他人询问。</view>
							<view class="text-style">5、本人承诺，于本声明签署之日起，本人与任何其他单位不存在任何劳动关系。并且，本人受聘于公司不会违反本人对前雇主的任何竞业限制义务，本人承诺不将任何涉及第三方的商业秘密带入公司。公司不会因雇佣本人而引发任何诉讼，公司因雇佣本人而引发的任何法律责任由本人承担。</view>
							<view class="text-style">6、 本人承诺若提出辞职，将提前三十日以书面形式通知用人单位，如果未能按该约定执行，本人将承担因此给企业造成的经济损失。</view>
							<view class="text-style">7、本人承诺，如被解聘或自动请求离职,经核准，应及时将经手之文件资料、经管财物,相关业务交代清楚,如有遗失或拒交,愿意负上法律责任。</view>
							<view class="text-style">以上声明均为本人真实意思的表示。本声明书作为本人与公司签订《劳动合同》前的承诺保证，与《劳动合同》具有同等法律效力。</view>
						</view>
						<view class="uni-form-item uni-column">
							<view class="title">声明人<text class="red" v-if="type != 0">*</text></view>
							<input class="uni-input" v-model="userInfo.userName" placeholder="请输入声明人" :disabled="type == 0" />
						</view>
						<view class="uni-form-item uni-column">
							<view class="title">身份证号码<text class="red" v-if="type != 0">*</text></view>
							<input class="uni-input" type="idcardNo" v-model="userInfo.idcardNo" placeholder="请输入身份证号码"  :disabled="type == 0" />
						</view>
						<view class="uni-form-item uni-column">
							<view class="title">声明日期<text class="red" v-if="type != 0">*</text></view>
							<picker mode="date" :value="userInfo.declarationDate" :start="startDate" :end="endDate" @change="declarationDateChange" :disabled="type == 0" >
								<view class="uni-input">{{userInfo.declarationDate}}</view>
							</picker>
						</view>
				    </uni-collapse-item>
				</uni-collapse>
				 <button type="primary" class="button-margin" @click="submit" v-if="type != 0">保存</button>
			</view>
		</scroll-view>
	</view>
</template>

<style>
	page{
		padding:0;
	}
	.uni-common-mt{
		padding:0 30rpx;
		width:calc(100vw - 60rpx);
	}
	.scrollBox{
		width:100%;
		height:100vh;
	}
	.view-notext{
		height:30rpx;
		width:100%;
	}
	.uni-common-mt{
		margin:30rpx 0;
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
	.header{
		margin:30rpx 0 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
	}
	/* .header .title{
		font-size:34rpx;
	} */
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
	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data(){
			return{
				userInfo:{
					openid:'',
					position:"",
					writeDate:'',
					userName:"",
					sex:"",
					birthday: '',
					nation:"",
					nativePlace:"",
					politicalStatus:"",
					educational:"",
					specialty:"",
					academicTitle:"",
					idcardNo:"",
					marryStatus:'',
					school:"",
					certificateNo:"",
					degreeCertificateNumber:"",
					address:"",
					postalCode:"",
					addressNow:"",
					residence:"",
					computerType:"",
					telephone:"",
					email:"",
					qq:"",
					section:"",
					job:"",
					graduation: '',
					entryDate: '',
					turnoverDate: '',
					expectedSalary:"",
					trialSalary:"",
					positiveSalary:"",
					workingMotherland:"",
					hobbies:"",
					speciality:"",
					declarationDate:this.$global.getDate(),
					itemList:[],
					studyList:[],
					memberList:[],
					workList:[],
				},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				scrollTop:{
					now:0,
					old:0
				},
				type:1,
			}
		},
		onLoad(e){
			console.log(e)
			if(e.idcardNo){
				this.userInfo.idcardNo = e.idcardNo;
				this.userInfo.userName = e.userName;
			}
			//详情
			if(e.type === '0'){
				this.type = e.type;
				uni.showLoading({
					title:'loading...'
				})
				this.getMyRegisterInfo(e.openid);
			}
			this.userInfo.openid = uni.getStorageSync('openid');
		},
		onShow() {
			uni.getStorage({
				key: 'checkInData',
				success: (res)=>{
					console.log(res)
					console.log(res.data)
					if(res.data){
						this.userInfo = res.data;
						
					}
				}
			})
		},
		methods:{
			scroll(e){
				this.scrollTop.old = e.detail.scrollTop;
			},
			getMyRegisterInfo(openid){
				return new Promise((resolve,reject)=>{
					uni.request({
						url: `${this.$global.url}/getMyRegisterInfo?openid=${openid}`, 
						method:'GET',
						success: (res)=> {
							uni.hideLoading();
							console.log(res);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								this.userInfo = res.data.data;
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
			add(name,type,index){
				this.scrollTop.now = this.scrollTop.old;
				uni.setStorage({
				    key: 'checkInData',
				    data: this.userInfo,
				    success: ()=>{
						let url = '';
						if(type){
							url = `../${name}/${name}?type=${type}`
						}else{
							url = `../${name}/${name}?type=${type}&index=${index}`
						}
				       uni.navigateTo({url});
				    }
				});
			},
			bindDateChange: function(e) {
				console.log(e);
				this.userInfo.writeDate = e.target.value;
			},
			birthdayChange: function(e) {
				this.userInfo.birthday = e.target.value;
			},
			entryDateChange: function(e) {
				this.userInfo.entryDate = e.target.value;
			},
			declarationDateChange:function(e){
				this.userInfo.declarationDate = e.target.value;
			},
			turnoverDateChange(e) {
				this.userInfo.turnoverDate = e.target.value;
			},
			graduationChange(e) {
				this.userInfo.graduation = e.target.value;
			},
			sexChange(e){
				this.userInfo.sex = e.detail.value;
			},
			computer(e){
				console.log(e)
				this.userInfo.computerType = e.detail.value;
			},
			marry(e){
				this.userInfo.marryStatus = e.detail.value;
			},
			submit(){
				for(let i in this.userInfo){
					console.log(i);
					console.log(this.userInfo[i]);
					//表单选填名单
					let whiteArr = ['speciality','hobbies','workingMotherland','job','section','qq','postalCode','academicTitle','itemList','studyList','memberList','workList',]
					if(i != 'itemList' && i != 'studyList' && i != 'memberList' && i != 'workList'){
						this.userInfo[i] = this.userInfo[i].trim();
					}
					if(whiteArr.indexOf(i) > -1){
						continue;
					}else if(this.userInfo[i] === ""){
						uni.showToast({
						    title: '请完整填写必填项！',
							icon:"none",
							mask:true
						});
						return
					}
				};
				console.log(this.userInfo);
				uni.showLoading({
					title: 'loading...'
				})
				this.addNewWorker();
			},
			addNewWorker(){
				return new Promise((resolve,reject)=>{
					uni.request({
					    url: `${this.$global.url}/newWorkRegister`, 
						method:'POST',
					    data: this.userInfo ,
					    success: (res)=> {
							uni.hideLoading();
					        console.log(res);
							if(res.data.errCode === '0' || res.data.errCode === ''){
								uni.showToast({
									title:'提交成功,1秒后前往首页。',
									icon:'none',
									duration:1000,
								})
								uni.removeStorageSync('scrollTop');
								uni.removeStorageSync('checkInData');
								uni.setStorage({
									key: 'idcardNo',
									data:this.userInfo.idcardNo,
									success: () => {
										setTimeout(function(){
											uni.redirectTo({
												url:`../index/index`
											})
										},1000)
									},
								});
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
			}
		},
	}
</script>
