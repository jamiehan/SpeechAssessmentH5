<template name="basics">
	<view>
		<text>考试</text>
	</view>
</template>

<script>
	export default {
		name: "exams",
		data() {
			return {
				
			};
		},
		onShow() {
			console.log("success")
		},
		onLoad() {
			console.log('跳转了')
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
