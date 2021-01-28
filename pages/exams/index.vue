<template>
	<view style="height: 100%;">
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">正式考试</block>
		</cu-custom>
		<scroll-view scroll-y="true">
			<view class="cu-list menu">
				<view class="cu-item" v-for="l in list" :key="l.id">
					<view class="content padding-tb-sm">
						<view>{{l.name}}</view>
						<view class="text-gray text-sm">共{{l.total}}题，总分{{l.score}}分，考试时长{{l.time}}分钟</view>
					</view>
					<view class="action text-xxl">
						<!-- <uni-icons type="search" class="text-gray" size="24"></uni-icons> -->
						<text class="cuIcon-form" v-if="!l.finished" @tap="open"></text>
						<text class="cuIcon-roundcheck" v-if="l.finished"></text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="cu-modal" :class="modalName=='confirmModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
					<view class="action" @tap="close">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">开始考试后将开始计时，无法退出或暂停，超时自动提交，确定开始考试吗？</view>
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
					name: '2020-2021秋六年级期末试卷',
					total: 50,
					score: 100,
					finished: false,
					time: 90
				}, {
					id: 2,
					name: '考试2',
					total: 50,
					score: 100,
					finished: false,
					time: 90
				}, {
					id: 3,
					name: '考试3',
					total: 50,
					score: 100,
					finished: true,
					time: 90
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
			confirm(){
				this.modalName = ''
				uni.navigateTo({
					url:'./examing'
				})
			}
		},
		mounted() {
			// this.getRec()
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.round {
		padding: 4px;
	}

	uni-page-body {
		height: 100%;
	}

	.btn-wrapper-fixed {
		position: fixed;
		bottom: 0px;
		width: 100%;
	}

	.btn-left-round {
		position: absolute;
		top: -24px;
		right: 0;
		padding: 2px 4px 2px 12px;
		border-top-left-radius: 2500px;
		border-bottom-left-radius: 2500px;
	}
</style>
