<template>
	<view>
		<form  @submit="formSubmit">
			<view class="study">
				<view class="uni-form-item uni-column">
					<view class="title">公司名称<text class="red">*</text></view>
					<input class="uni-input" name="corporateName" :value="workInfo.corporateName" placeholder="请输入公司名称" :disabled="type == 0"  />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">工作时间<text class="red">*</text></view>
					<view class="dateRange">
						<picker mode="date" :value="workInfo.workStartDate" fields="month" name="workStartDate"  :disabled="type == 0" :start="startDate" :end="endDate" @change="changeStartDate">
							<view class="uni-input">{{workInfo.workStartDate}}</view>
						</picker>
						<view> - </view>
						<picker mode="date" :value="workInfo.workEndDate" fields="month" name="workEndDate"  :disabled="type == 0" :start="startDate" :end="endDate" @change="changeEndDate">
							<view class="uni-input">{{workInfo.workEndDate}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">职位描述<text class="red">*</text></view>
					<input class="uni-input" name="job" :value="workInfo.job" placeholder="请输入职位"  :disabled="type == 0" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">工作职责<text class="red">*</text></view>
					<view class="uni-textarea">
						<textarea class="uni-input" name="content" :value="workInfo.content" placeholder="请输入工作职责,字数限制300字"
						maxlength="300" :disabled="type == 0"  />
					 </view>
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
		width:calc((100% - 60rpx) / 2);
	}
	.spouse,.study{
		margin-top:30rpx;
	}
	.spouse>.title,.study .header .title{
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
	.study .header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.study .header{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.studyList{
		margin:30rpx 0;
	}
	.studyList .studyListItem{
		padding: 0 30rpx;
		background-color: #e6e6e6;
	}
	.studyListItem .uni-form-item:last-child{
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
				type: 1,
				index:undefined,
				userResourceInfo:{},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				workInfo: {
					corporateName:"",
					workStartDate:'起始时间',
					workEndDate:'结束时间',
					content:'',
					job:'',
				}
			}
		},
		onLoad: function(e) {
			if(e.type){
				this.type = e.type;
			}
			if(e.item){
				this.workInfo = JSON.parse(e.item);
				this.index = e.index;
			}
			console.log(e);
			console.log(this.type);
		},
		onShow:function(){
			uni.getStorage({
			    key: 'userResourceData',
			    success:(res)=>{
					console.log('数据')
					console.log(res)
					this.userResourceInfo = res.data;
					
			    }
			})
		},
		methods:{
			formSubmit(e){
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [
					{name:"corporateName", checkType : "string", checkRule:"1,",  errorMsg:"请输入公司名称!"},
					{name:"workStartDate", checkType : "date", checkRule:"起始时间",  errorMsg:"请选择起始时间"},
					{name:"workEndDate", checkType : "date", checkRule:"结束时间",  errorMsg:"请选择结束时间"},
					{name:"job", checkType : "string", checkRule:"1,",  errorMsg:"请输入职位描述!"},
					{name:"content", checkType : "string", checkRule:"1,",  errorMsg:"请输入工作职责!"}
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.workInfo.workStartDate !== '起始时间' && this.workInfo.workEndDate !== '结束时间' &&
				(this.workInfo.workStartDate === this.workInfo.workEndDate || new Date(this.workInfo.workStartDate).getTime() > new Date(this.workInfo.workEndDate).getTime())){
					uni.showToast({ title: '起始时间必须小于结束时间', icon: "none" });
					return;
				}
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					if(!this.index){
						this.userResourceInfo.workList.unshift(formData);
					}else{
						formData.workNo = this.userResourceInfo.workList[this.index].workNo;
						formData.openid = this.userResourceInfo.workList[this.index].openid;
						formData.idcardNo = this.userResourceInfo.workList[this.index].idcardNo;
						this.userResourceInfo.workList[this.index] = formData;
					}
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
			changeStartDate(e,index) {
				console.log(e)
				this.workInfo.workStartDate = e.detail.value;
			},
			changeEndDate(e) {
				console.log(e)
				this.workInfo.workEndDate = e.detail.value;
			},
		}
	}
</script>
