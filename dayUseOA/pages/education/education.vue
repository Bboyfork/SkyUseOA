<template>
	<view>
		<form  @submit="formSubmit">
			<view class="education">
				<view class="uni-form-item uni-column">
					<view class="title">学历<text class="red">*</text></view>
					<input class="uni-input" name="educational" :value="educationInfo.educational" placeholder="请输入学历" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">学位<text class="red">*</text></view>
					<input class="uni-input" name="degree" :value="educationInfo.degree" placeholder="请输入学位,没有就填无" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业学校名称<text class="red">*</text></view>
					<input class="uni-input" name="school" :value="educationInfo.school" placeholder="请输入毕业学校名称" :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业学校类别<text class="red">*</text></view>
					<radio-group @change="setSchoolType" name="schoolType">
						<label class="radio">
							<radio value="0" :checked="educationInfo.schoolType == '0'" :disabled="type == 0" />普通高校</label>
						<label class="radio">
							<radio value="1" :checked="educationInfo.schoolType == '1'" :disabled="type == 0"  />民办学校</label>
						<label class="radio">
							<radio value="2" :checked="educationInfo.schoolType == '2'" :disabled="type == 0"  />国民高等教育</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">专业名称<text class="red">*</text></view>
					<input class="uni-input" name="specialty" :value="educationInfo.specialty" placeholder="请输入专业名称" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">专业类别<text class="red">*</text></view>
					<input class="uni-input" name="majorType" :value="educationInfo.majorType" placeholder="请输入专业类别" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业证号<text class="red">*</text></view>
					<input class="uni-input" name="certificateNo" :value="educationInfo.certificateNo" placeholder="请输入毕业证号,没有就填无" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">学位证号<text class="red">*</text></view>
					<input class="uni-input" name="degreeCertificateNumber" :value="educationInfo.degreeCertificateNumber" placeholder="请输入学位证号,没有就填无" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">入学时间<text class="red">*</text></view>
					<picker mode="date" :value="educationInfo.startDate"  name="startDate" :disabled="type == 0" :start="startDate" :end="endDate" @change="setStartDate">
						<view class="uni-input" v-model="educationInfo.startDate">{{educationInfo.startDate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">毕业时间<text class="red">*</text></view>
					<picker mode="date" :value="educationInfo.endDate" name="endDate" :disabled="type == 0"  :start="startDate" :end="endDate" @change="setEndDate">
						<view class="uni-input" v-model="educationInfo.endDate">{{educationInfo.endDate}}</view>
					</picker>
				</view>
			</view>
			<view class="button-sp-area" v-if="type != 0">
				<button class='saveBtn' type="primary" form-type="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<style>
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
	.spouse,.education{
		margin:30rpx 0;
	}
	.spouse>.title,.education .header .title{
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
	.education .header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.education .header{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.educationList{
		margin:30rpx 0;
	}
	.educationList .educationListItem{
		padding: 0 30rpx;
		background-color: #e6e6e6;
	}
	.educationListItem .uni-form-item:last-child{
		margin-bottom:20rpx;
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
	import uniCollapse from '../../components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '../../components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		components:{
			uniCollapse,
			uniCollapseItem
		},
		data(){
			return{
				type:undefined,
				userResourceInfo:{},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				educationInfo: {
					educational:'',
					degree:'',
					school:'',
					schoolType:'',
					specialty:'',
					majorType:'',
					certificateNo:'',
					degreeCertificateNumber:'',
					startDate:'请选择入学时间',
					endDate:'请选择毕业时间'
				}
			}
		},
		onLoad(e){
			if(e.type){
				this.type = e.type;
			}
			console.log(e)
			console.log(this.type);
		},
		onShow: function() {
			uni.getStorage({
			    key: 'userResourceData',
			    success: (res)=>{
					console.log('数据')
					console.log(res)
					this.userResourceInfo = res.data;
					if(res.data.educationInfo){
						this.educationInfo = res.data.educationInfo;
					}else{
						this.educationInfo = {
							educational:'',
							degree:'',
							school:'',
							schoolType:'',
							specialty:'',
							majorType:'',
							certificateNo:'',
							degreeCertificateNumber:'',
							startDate:'请选择入学时间',
							endDate:'请选择毕业时间',
						}
					}
			    }
			});
		},
		methods:{
			formSubmit(e){
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [
					{name:"educational", checkType : "string", checkRule:"1,",  errorMsg:"请输入学历!"},
					{name:"degree", checkType : "string", checkRule:"1,",  errorMsg:"请输入学位!"},
					{name:"school", checkType : "string", checkRule:"1,",  errorMsg:"请输入毕业学校名称!"},
					{name:"schoolType", checkType : "string", checkRule:"1,",  errorMsg:"请输入毕业学校类别!"},
					{name:"specialty", checkType : "string", checkRule:"1,",  errorMsg:"请输入专业名称!"},
					{name:"majorType", checkType : "string", checkRule:"1,",  errorMsg:"请输入专业类别!"},
					{name:"certificateNo", checkType : "string", checkRule:"1,",  errorMsg:"请输入毕业证号!"},
					{name:"degreeCertificateNumber", checkType : "string", checkRule:"1,",  errorMsg:"请输入学位证号!"},
					{name:"startDate", checkType : "date", checkRule:"请选择入学时间",  errorMsg:"请选择入学时间!"},
					{name:"endDate", checkType : "date", checkRule:"请选择毕业时间",  errorMsg:"请选择毕业时间!"}
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.educationInfo.startDate !== '起始时间' && this.educationInfo.endDate !== '结束时间' &&
				(this.educationInfo.startDate === this.educationInfo.endDate || new Date(this.educationInfo.startDate).getTime() > new Date(this.educationInfo.endDate).getTime())){
					uni.showToast({ title: '入学时间必须小于毕业时间', icon: "none" });
					return;
				}
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					if(this.userResourceInfo.educationInfo && this.userResourceInfo.educationInfo.eduNo){
						formData.eduNo = this.userResourceInfo.educationInfo.eduNo;
						formData.openid = this.userResourceInfo.educationInfo.openid;
						formData.eduIdcardNo = this.userResourceInfo.educationInfo.eduIdcardNo;
					}
					this.userResourceInfo.educationInfo = formData;
					console.log(this.userResourceInfo)
					uni.setStorage({
					    key: 'userResourceData',
					    data: this.userResourceInfo,
					    success: ()=>{
							uni.navigateBack({detail:1});
					    }
					});
				}else{
					uni.showToast({ title: this.$global.graceChecker.error, icon: "none" });
				}
			},
			setSchoolType (e){
				console.log(e.detail.value)
				this.educationInfo.schoolType = e.detail.value;
			},
			setStartDate(e) {
				console.log(e)
				this.educationInfo.startDate = e.detail.value;
			},
			setEndDate(e) {
				console.log(e)
				this.educationInfo.endDate = e.detail.value;
			},
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
