<template>
	<view>
		<form  @submit="formSubmit">
			<view class="study">
				<view class="uni-form-item uni-column">
					<view class="title">工作时间<text class="red">*</text></view>
					<view class="dateRange">
						<picker mode="date" :value="workInfo.workStartDate" fields="month" name="workStartDate" :start="startDate" :end="endDate" @change="changeStartDate">
							<view class="uni-input">{{workInfo.workStartDate}}</view>
						</picker>
						<view> - </view>
						<picker mode="date" :value="workInfo.workEndDate" fields="month" name="workEndDate" :start="startDate" :end="endDate" @change="changeEndDate">
							<view class="uni-input">{{workInfo.workEndDate}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">在何单位何部门<text class="red">*</text></view>
					<input class="uni-input" name="workUnit" :value="workInfo.workUnit" placeholder="请输入在何单位何部门" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">从事何种工作<text class="red">*</text></view>
					<input class="uni-input" name="workContent" :value="workInfo.workContent" placeholder="请输入从事何种工作" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">任何职<text class="red">*</text></view>
					<input class="uni-input" name="workJob" :value="workInfo.workJob" placeholder="请输入任何职" />
				</view>
			</view>
			<view class="button-sp-area">
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
				type:'',
				index:0,
				userInfo:{},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				workInfo: {
					workStartDate:'起始时间',
					workEndDate:'结束时间',
					workUnit:'',
					workContent:'',
					workJob:'',
				}
			}
		},
		onload(e){
			if(e.type === 'true'){
				this.type = e.type;
			}else{
				this.index = Number(e.index);
				this.workInfo = this.userInfo.workList[this.index];
			}
		},
		onShow() {
			uni.getStorage({
			    key: 'checkInData',
			    data: this.userInfo,
			    success: (res)=>{
					console.log('数据')
					console.log(res)
					this.userInfo = res.data;
			    }
			});
			
		},
		methods:{
			formSubmit(e){
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [
					{name:"workStartDate", checkType : "date", checkRule:"起始时间",  errorMsg:"请选择起始时间"},
					{name:"workEndDate", checkType : "date", checkRule:"结束时间",  errorMsg:"请选择结束时间"},
					{name:"workUnit", checkType : "string", checkRule:"1,",  errorMsg:"请输入在何单位何部门!"},
					{name:"workContent", checkType : "string", checkRule:"1,",  errorMsg:"请输入从事何种工作!"},
					{name:"workJob", checkType : "string", checkRule:"1,",  errorMsg:"请输入任何职"}
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
					if(this.type === 'true'){
						this.userInfo.workList.unshift(formData);
					}else{
						this.userInfo.workList[this.index] = formData;
					}
					uni.setStorage({
					    key: 'checkInData',
					    data: this.userInfo,
					    success: ()=>{
							uni.navigateBack({detail:1});
					    }
					});
				}else{
					uni.showToast({ title: this.$global.graceChecker.error, icon: "none" });
				}
			},
			changeStartDate(e) {
				console.log(e)
				this.workInfo.workStartDate = e.detail.value;
			},
			changeEndDate(e) {
				console.log(e)
				this.workInfo.workEndDate = e.detail.value;
			},
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
