<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow() {
			uni.showLoading({
				title:'加载中...'
			})
			uni.getStorage({
				key:'idcardNo',
				success:(res)=>{
					uni.hideLoading();
					this.idcardNo = res.data;
					uni.redirectTo({
						url:'../index/index'
					})
				},
				fail: () => {
					uni.hideLoading();
					uni.redirectTo({
						url:'../register/register'
					})
				}
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
