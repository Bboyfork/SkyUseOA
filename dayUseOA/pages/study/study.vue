<template>
	<view>
		<form  @submit="formSubmit">
			<view class="study">
				<view class="uni-form-item uni-column">
					<view class="title">学习时间<text class="red">*</text></view>
					<view class="dateRange">
						<picker mode="date" :value="studyInfo.studyStartDate" fields="month" name="studyStartDate" :start="startDate" :end="endDate" @change="changeStartDate">
							<view class="uni-input">{{studyInfo.studyStartDate}}</view>
						</picker>
						<view> - </view>
						<picker mode="date" :value="studyInfo.studyEndDate" fields="month" name="studyEndDate" :start="startDate" :end="endDate" @change="changeEndDate">
							<view class="uni-input">{{studyInfo.studyEndDate}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">学习及培训单位<text class="red">*</text></view>
					<input class="uni-input" name="studyUnit" :value="studyInfo.studyUnit" placeholder="请输入学习及培训单位" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">学习及培训内容<text class="red">*</text></view>
					<input class="uni-input" name="studyContent" :value="studyInfo.studyContent" placeholder="请输入学习及培训内容" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">结果<text class="red">*</text></view>
					<input class="uni-input" name="studyResult" :value="studyInfo.studyResult" placeholder="请输入结果" />
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
		width:45%;
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
				studyInfo: {
					studyStartDate:'起始时间',
					studyEndDate:'结束时间',
					studyUnit:'',
					studyContent:'',
					studyResult:'',
				}
			}
		},
		onLoad: function(e) {
			uni.getStorage({
			    key: 'checkInData',
			    data: this.userInfo,
			    success: (res)=>{
					console.log('数据')
					console.log(res)
					this.userInfo = res.data;
			    }
			});
			if(e.type === 'true'){
				this.type = e.type;
			}else{
				this.index = Number(e.index);
				this.studyInfo = this.userInfo.studyList[this.index];
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		methods:{
			formSubmit(e){
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [
					{name:"studyStartDate", checkType : "date", checkRule:"起始时间",  errorMsg:"请选择起始时间"},
					{name:"studyEndDate", checkType : "date", checkRule:"结束时间",  errorMsg:"请选择结束时间"},
					{name:"studyUnit", checkType : "string", checkRule:"1,",  errorMsg:"请输入学习及培训单位!"},
					{name:"studyContent", checkType : "string", checkRule:"1,",  errorMsg:"请输入学习机培训内容!"},
					{name:"studyResult", checkType : "string", checkRule:"1,",  errorMsg:"请输入结果"}
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.studyInfo.studyStartDate !== '起始时间' && this.studyInfo.studyStartDate !== '结束时间' &&
				(this.studyInfo.studyStartDate === this.studyInfo.studyEndDate || new Date(this.studyInfo.studyStartDate).getTime() > new Date(this.studyInfo.studyEndDate).getTime())){
					uni.showToast({ title: '起始时间必须小于结束时间', icon: "none" });
					return;
				}
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					if(this.type === 'true'){
						this.userInfo.studyList.unshift(formData);
					}else{
						this.userInfo.studyList[this.index] = formData;
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
			changeStartDate(e,index) {
				console.log(e)
				this.studyInfo.studyStartDate = e.detail.value;
			},
			changeEndDate(e) {
				console.log(e)
				this.studyInfo.studyEndDate = e.detail.value;
			},
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
