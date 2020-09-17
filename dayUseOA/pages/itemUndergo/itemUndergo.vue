<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-form-item uni-column">
				<view class="title">项目名称<text class="red">*</text></view>
				<input class="uni-input" name="itemName" v-model="itemInfo.itemName" placeholder="请输入项目名称" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">项目时间<text class="red">*</text></view>
				<view class="dateRange">
					<picker mode="date" :value="itemInfo.itemStartDate"  name="itemStartDate" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{itemInfo.itemStartDate}}</view>
					</picker>
					<view> - </view>
					<picker mode="date" :value="itemInfo.itemEndDate" name="itemEndDate" :start="startDate" :end="endDate" @change="bindDateChange2">
						<view class="uni-input">{{itemInfo.itemEndDate}}</view>
					</picker>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">运用技能<text class="red">*</text></view>
				<view class="uni-textarea">
					<textarea class="uni-input" name="itemSkill"
					v-model="itemInfo.itemSkill" placeholder="请输入运用技能" />
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">主要工作<text class="red">*</text></view>
				<view class="uni-textarea">
					<textarea class="uni-input" name="itemUndergo"
					v-model="itemInfo.itemUndergo" placeholder="请输入主要工作,字数限制2000字" maxlength="2000" />
				</view>
			</view>
			<view class="button-sp-area">
				<button class='addBtn' type="primary" form-type="submit">保存</button>
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
	form textarea.uni-input{
		height:300rpx;
	}
	.button-sp-area{
		margin:60rpx 0;
		display: flex;
		justify-content: center;
	}
	.addBtn,.delBtn,.editBtn{
		width:40%;
	}
</style>

<script>
	export default {
		data(){
			return{
				itemInfo:{
					itemName:'',
					itemStartDate: '起始时间',
					itemEndDate: '结束时间',
					itemUndergo: '',
					itemSkill:''
				},
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				type:'',
				index:0,
				userInfo:{}
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
			console.log('App Load')
			console.log(e)
			console.log(e.type === 'true')
			if(e.type === 'true'){
				this.type = e.type;
			}else{
				this.index = Number(e.index);
				this.itemInfo = this.userInfo.itemList[this.index];
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		methods:{
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			    //定义表单规则
			    var rule = [
			        {name:"itemName", checkType : "string",  checkRule:"1,", errorMsg:"请输入项目名称"},
			        {name:"itemStartDate", checkType : "date", checkRule:"起始时间",  errorMsg:"请选择项目起始时间"},
			        {name:"itemEndDate", checkType : "date", checkRule:"结束时间",  errorMsg:"请选择项目结束时间"},
			        {name:"itemSkill", checkType : "string", checkRule:"1,",  errorMsg:"请输入运用技能"},
					{name:"itemUndergo", checkType : "string", checkRule:"1,",  errorMsg:"请输入主要工作"}
			    ];
			    //进行表单检查
			    var formData = e.detail.value;
			    var checkRes = this.$global.graceChecker.check(formData, rule);
				if(this.itemInfo.itemStartDate !== '起始时间' && this.itemInfo.itemEndDate !== '结束时间' && 
				(this.itemInfo.itemStartDate === this.itemInfo.itemEndDate || new Date(this.itemInfo.itemStartDate).getTime() > new Date(this.itemInfo.itemEndDate).getTime())){
					uni.showToast({ title: '起始时间必须小于结束时间', icon: "none" });
					return;
				}
			    if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					if(this.type === 'true'){
						this.userInfo.itemList.unshift(formData);
					}else{
						this.userInfo.itemList[this.index] = formData;
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
			bindDateChange: function(e) {
				this.itemInfo.itemStartDate = e.detail.value;
			},
			bindDateChange2: function(e) {
				this.itemInfo.itemEndDate = e.detail.value;
			},
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>



