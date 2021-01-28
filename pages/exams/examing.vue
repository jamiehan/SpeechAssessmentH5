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
			<view class="flex justify-between align-center padding-sm bg-white">
				<view class="content text-xl">
					<text class="text-grey">{{ examInfo.name }}</text>
				</view>
				<view class="action text-xl">
					<view class="text-grey">{{ currentIdx + 1 }}/{{ examInfo.total }}</view>
				</view>
			</view>
			<view class="cu-list menu" v-if="list[currentIdx].type === 'singlechoice'">
				<view class="cu-item margin-top-sm flex-sub" style="height: 100%;">
					<view>
						<text class="text-xl">{{ list[currentIdx].name }}</text>
					</view>
				</view>
				<radio-group class="block" @change="radioChanged">
					<view class="cu-form-group" v-for="item in list[currentIdx].options">
						<view class="padding-left">{{ item.label + '、' + item.content }}</view>
						<radio :checked="list[currentIdx].answer == item.label" :value="item.label"></radio>
					</view>
				</radio-group>
			</view>
			<view class="cu-list menu" v-else-if="list[currentIdx].type === 'multichoice'">
				<view class="cu-item margin-top-sm flex-sub" style="height: 100%;">
					<view>
						<text class="text-xl">{{ list[currentIdx].name }}</text>
					</view>
				</view>
				<checkbox-group class="block" @change="checkChanged">
					<view class="cu-form-group" v-for="item in list[currentIdx].options">
						<view class="padding-left">{{ item.label + '、' + item.content }}</view>
						<checkbox class="blue" :class="list[currentIdx].answer.indexOf(item.label) >= 0?'checked':''" :checked="list[currentIdx].answer.indexOf(item.label) >= 0" :value="item.label"></checkbox>
					</view>
				</checkbox-group>
			</view>
			<view class="cu-list menu" v-else-if="list[currentIdx].type === 'ownchoice'">
				<view class="cu-item margin-top-sm" style="display: block;">
					<view style="padding-top: 15rpx;">
						<text class="text-xl">{{ list[currentIdx].name }}</text>
					</view>
					<view class="block">
						<textarea class="padding" maxlength="-1" v-model="list[currentIdx].answer" placeholder="请在此处输入您的答案."></textarea>
					</view>
				</view>
			</view>
			<view class="cu-list menu" v-else>
				<view class="cu-item margin-top-sm flex-sub" style="height: 100%;">
					<view>
						<text class="text-red">不支持的题目类型。</text>
					</view>
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
						<button class="cu-btn text-grey" @tap="confirm()">马上交卷</button>
						<button class="cu-btn text-blue margin-left" @tap="close">检查一下</button>
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
					options: [{
						label: 'A',
						content: '正确'
					},{
						label: 'B',
						content: '错误'
					},{
						label: 'C',
						content: '不知道'
					}],
					answer: ''
				}, {
					id: 2,
					name: '2.最喜欢什么好吃的',
					type: 'multichoice',
					options: [{
						label: 'A',
						content: '四喜丸子'
					},{
						label: 'B',
						content: '烧花鸭'
					},{
						label: 'C',
						content: '蒸熊掌'
					},{
						label: 'D',
						content: '喇嘛'
					}],
					answer: ''
				}, {
					id: 3,
					name: '3.题目3',
					type: 'singlechoice',
					options: [{
						label: 'A',
						content: '正确'
					},{
						label: 'B',
						content: '错误'
					}],
					answer: ''
				}, {
					id: 4,
					name: '4.简述你现在的心情',
					type: 'ownchoice',
					answer: ''
				}],
				currentIdx: 0,
				examInfo: {
					name: '冬季摸底考试',
					total: 4
				}
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
				uni.navigateBack({
					
				})
			},
			pre(){
				if(this.currentIdx > 0){
					this.currentIdx -= 1
				}else{
					console.log('已经是第一题了')
				}
			},
			next(){
				if(this.currentIdx < this.examInfo.total - 1){
					this.currentIdx += 1
				}else{
					console.log('已经是最后一道题了')
				}
			},
			radioChanged(e){
				this.list[this.currentIdx].answer = e.detail.value
			},
			checkChanged(e){
				this.list[this.currentIdx].answer = e.detail.value
			}
		},
		mounted() {
			// this.getRec()
			this.current = this.list[0]
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
