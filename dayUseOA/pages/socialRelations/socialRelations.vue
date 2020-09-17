<template>
	<view>
		<form  @submit="formSubmit">
			<view class="member">
				<view class="header">
					<view class="title">成员</view>
					<view class="addbtn" @click="addMember">
						<image src="../../static/image/add.png" mode="widthFix"></image>
						<view>添加</view>
					</view>
				</view>
				<view class="memberList">
					<uni-collapse :accordion="true">
						<uni-collapse-item v-for="(item,index) in memberList" :key="item.id" :title="'成员' + (index+1)" :show-animation="item.animation">
							<view class="memberListItem">
								<view class="uni-form-item uni-column">
									<view class="title">姓名<text class="red">*</text></view>
									<input class="uni-input"  v-model="item.memberName" placeholder="请输入成员姓名" />
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">与本人关系<text class="red">*</text></view>
									<input class="uni-input" v-model="item.memberRelation" placeholder="请输入与本人关系" />
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">籍贯<text class="red">*</text></view>
									<input class="uni-input" v-model="item.memberNativePlace" placeholder="请输入籍贯" />
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">出生年月<text class="red">*</text></view>
									<picker mode="date" :value="item.memberBrithday"  name="memberBrithday" :start="startDate" :end="endDate" @change="changeDate($event,item)">
										<view class="uni-input">{{item.memberBrithday}}</view>
									</picker>
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">单位</view>
									<input class="uni-input"  v-model="item.memberWorkUnit" placeholder="请输入单位" />
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">职务</view>
									<input class="uni-input"  v-model="item.memberJob" placeholder="请输入职务" />
								</view>
								<view class="uni-form-item uni-column">
									<view class="title">电话<text class="red">*</text></view>
									<input class="uni-input"  v-model="item.memberPhone" placeholder="请输入电话号码" />
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
			<view class="button-sp-area" v-if="memberList.length !== 0">
				<button class='saveBtn' type="primary" @click="saveRelation">保存</button>
			</view>
		</form>
	</view>
</template>

<style>
	.spouse,.member{
		margin-top:30rpx;
	}
	.spouse>.title,.member .header .title{
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
	.member .header image{
		width:22rpx;
		margin:0 10rpx 0 0;
	}
	.member .header{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.memberList{
		margin:30rpx 0;
	}
	.memberList .memberListItem{
		padding: 0 30rpx;
		background-color: #e6e6e6;
	}
	.memberListItem .uni-form-item:last-child{
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
				type:'true',
				isMarry:'1',
				userInfo:{},
				index:0,
				startDate: this.$global.getDate('start'),
				endDate: this.$global.getDate('end'),
				memberList: []
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
					this.memberList = this.userInfo.memberList;
			    }
			});
			console.log('App Load')
			console.log(e)
			if(e.type === 'true'){
				this.type = e.type;
			}
			if(e.isMarry){
				this.isMarry = e.isMarry;
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		methods:{
			saveRelation(){
				let checkRes = true;
				if(this.memberList.length !== 0){
					console.log('有成员')
					this.memberList.forEach((item,index)=>{
						for(let val in item){
							console.log(val);
							if(val !== 'memberWorkUnit' && val !== 'memberJob' &&  val !== 'id' &&  val !== 'animation'){
								if(item[val].trim() === ''){
									checkRes = false;
									break;
								}
							}
						}
					})
				}
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
					this.userInfo.memberList = this.memberList;
					uni.setStorage({
					    key: 'checkInData',
					    data: this.userInfo,
					    success: ()=>{
							uni.navigateBack({detail:1});
					    }
					});
				}else{
					uni.showToast({ title:'请完整填写必填项', icon: "none" });
				}
			},
			addMember(){
				this.memberList.push({
					memberName:'',
					memberRelation:'',
					memberWorkUnit:'',
					memberNativePlace:'',
					memberBrithday:'',
					memberJob:'',
					memberPhone:'',
					animation: true,
					id:this.memberList.length
				});
				this.memberList[this.memberList.length-1].id = this.memberList.length-1;
			},
			changeDate(e,item) {
				item.memberBrithday = e.detail.value;
			},
		},
	}
</script>
