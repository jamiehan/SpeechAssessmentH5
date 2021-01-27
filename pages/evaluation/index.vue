<template>
	<view>
		<scroll-view scroll-y class="page">
			<image src="/static/BasicsBg.png" mode="widthFix" class="response"></image>
			<view class="bg-gray">
				<view class="cu-list menu">
					<view class="cu-item margin-bottom-xs" @tap="navigate('phonetic-symbol')">
						<view class="content flex justify-center">
							<text class="cuIcon-edit text-blue"></text>
							<text class="text-blue text-lg cur-pointer">英文音标</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate()">
						<view class="content flex justify-center">
							<text class="cuIcon-form text-blue"></text>
							<text class="text-blue text-lg cur-pointer">英文单词</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate()">
						<view class="content flex justify-center">
							<text class="cuIcon-list text-blue"></text>
							<text class="text-blue text-lg cur-pointer">英文句子</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate('../evaluation/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-voice text-blue"></text>
							<text class="text-blue text-lg cur-pointer">英文段落</text>
						</view>
					</view>
					<view class="cu-item margin-bottom-xs" @tap="navigate('../evaluation/index')">
						<view class="content flex justify-center">
							<text class="cuIcon-voice text-blue"></text>
							<text class="text-blue text-lg cur-pointer">英文对比</text>
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
				rec: Recorder,
				type: "mp3",
				bitRate: 16,
				sampleRate: 16000,
				rec: 0,
				duration: 0,
				powerLevel: 0,
				recOpenDialogShow: 0,
				logs: []
			}
		},
		methods: {
			navigate: function(page) {
				uni.navigateTo({
					url: page
				})
			}
		},
		mounted() {
			// this.getRec()
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
