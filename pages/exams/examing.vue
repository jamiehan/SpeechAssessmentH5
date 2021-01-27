<template>
	<view style="height: 100%;">
		<cu-custom bgColor="bg-blue" :isBack="false">
			<block slot="content">
				<uni-countdown splitor-color="#FFFFFF" :show-colon="false" color="#FFFFFF" background-color="#00B26A" border-color="#00B26A" :show-day="false" :minute="90" :second="0"></uni-countdown>
			</block>
			<block slot="right">
				<view class="action" style="margin-left: auto;" @tap="open()">交卷</view>
			</block>
		</cu-custom>
		<scroll-view scroll-y="true">
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content text-xl">
						<text class="text-grey">某次考试名称</text>
					</view>
					<view class="action text-xl">
						<view class="text-grey">1/50</view>
					</view>
				</view>
				<view class="cu-item margin-top-sm" style="height: 100%;">
				</view>
			</view>
			<view class="bg-white btn-wrapper-fixed shadow-lg">
				<view class="flex">
					<view class="flex-sub padding-sm margin-xs radius" @tap="pre">
						<text class="cuIcon-back text-blue"></text>上一题
					</view>
					<view class="flex-sub padding-sm margin-xs radius text-right" @tap="next">
						下一题<text class="cuIcon-right text-blue"></text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="cu-modal" :class="modalName=='confirmModal'?'show':''" @tap="close()">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
					<view class="action" @tap="close">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">确定交卷吗？</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn text-grey" @tap="close">再想想</button>
						<button class="cu-btn text-blue margin-left" @tap="confirm()">准备好了</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				list: [{
					id: 1,
					name: '1.1+1=2吗',
					type: 'singlechoice',
					anwsers: []
				}, {
					id: 2,
					name: '2.题目2',
					type: 'multichoice',
					anwsers: []
				}, {
					id: 3,
					name: '3.题目3',
					type: 'singlechoice',
					anwsers: []
				}]
			}
		},
		methods: {
			getExams() {

			},
			open() {
				this.modalName = 'confirmModal'
			},
			close() {
				this.modalName = ''
			},
			confirm(){},
			pre(){},
			next(){}
		},
		mounted() {
			// this.getRec()
		}
	}
</script>

<style>
	.cu-item{
		min-height: 36px !important;
	}
	.btn-wrapper-fixed {
		position: fixed;
		bottom: 0px;
		width: 100%;
	}
	
</style>
