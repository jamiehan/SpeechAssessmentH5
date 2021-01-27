<template>
	<view>
		<scroll-view scroll-y class="page">
			<image src="/static/BasicsBg.png" mode="widthFix" class="response"></image>
			<view class="bg-gray">
				<view class="cu-list menu">
					<view class="cu-item margin-bottom-xs" @tap="navigate('../exams/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-edit text-blue"></text>
							<text class="text-blue text-lg cur-pointer">开始考试</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate('../mocks/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-form text-blue"></text>
							<text class="text-blue text-lg cur-pointer">套题模拟</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate('../questions/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-list text-blue"></text>
							<text class="text-blue text-lg cur-pointer">题库背题</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate('../evaluation/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-voice text-blue"></text>
							<text class="text-blue text-lg cur-pointer">语音测评</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			navigate: function(page) {
				uni.navigateTo({
					url: page
				})
			}
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
	.cur-pointer{
		cursor: pointer;
	}
</style>
