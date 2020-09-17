<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/css/uni.css';
	/* #endif */
	/*每个页面公共css */
	page{
		background-color: #F5F5F5;
		padding:0 30rpx;
		box-sizing: border-box;
	}
	.uni-form-item .title {
		padding: 10rpx 0;
	}
	.red{
		color:red;
	}
	.blue{
		color:#1A8AFA;
	}
	.noData{
		height:200rpx;
		line-height:200rpx;
		text-align: center;
	}
</style>
