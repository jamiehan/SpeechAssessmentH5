<template>
	<view style="height: 100%;">
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">英文音标</block>
		</cu-custom>
		<form class="bg-white">
			<view class="cu-card flex-sub align-center shadow-lg margin-top">
				<view class="padding-left">
					<text class="cuIcon-title text-blue"></text>测评音标
				</view>
				<view class="cu-item bg-white text-center">
					<view class="text-sl padding">
						<text class="text-black">[i:]</text>
					</view>
					<view class="image">
						<image style="width: 240upx;" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" mode="widthFix"></image>
					</view>
					<view class="padding">发音时舌尖抵下齿，舌前部尽量向上颚抬起，嘴唇向两旁伸开，成扁平形，注意一定要把音发足。</view>
				</view>
			</view>
			<view class="cu-card flex-sub align-center shadow-lg">
				<view class="padding-left">
					<text class="cuIcon-title text-blue"></text>测评结果
				</view>
				<view class="cu-item bg-white text-center padding">
					<view class="cu-avatar round bg-gradual-green xl">90</view>
				</view>
			</view>
			<view class="padding flex btn-wrapper-fixed">
				<!-- <button class="cu-btn bg-blue"></button> -->
				<view class="bg-blue btn-left-round" @tap="recplay">换一个</view>
				<view class="flex-sub text-center">
					<view class="text-sl" tap="recStart">
						<text class="cuIcon-voice text-white round bg-blue"></text>
					</view>
					<view class="action padding-top-xs xs">长按跟读</view>
				</view>
				<view class="flex-sub text-center">
					<view class="text-sl" @tap="recStop" data-target="Modal">
						<text class="cuIcon-playfill text-white round bg-blue"></text>
					</view>
					<view class="padding-top-xs">点击回放</view>
				</view>
			</view>
            <!-- <audio ref="audioPlayer" style="text-align: left" controls></audio> -->
		</form>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{msg}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Recorder from 'recorder-core'
	import 'recorder-core/src/engine/mp3'
	import 'recorder-core/src/engine/mp3-engine'
	import 'recorder-core/src/extensions/waveview'
	Recorder.TrafficImgUrl = ''

	export default {
		data() {
			return {
				modalName: '',
				rec: Recorder,
				type: 'mp3',
				bitRate: 16,
				sampleRate: 16000,
				rec: 0,
				duration: 0,
				powerLevel: 0,
				recOpenDialogShow: 0,
				dialogInt: null,
				logs: [],
				blob: null,
				current: {
					poster: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/7fbf26a0-4f4a-11eb-b680-7980c8a877b8.png',
					name: '致爱丽丝',
					author: '暂无',
					src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				},
				audioAction: {
					method: 'play'
				},
				showAudio: false,
				msg: ''
			}
		},
		methods: {
			showModal(modal) {
				this.modalName = modal
			},
			hideModal(e) {
				this.modalName = null
			},
			getRec() {
				const self = this;
				const rec = this.rec = Recorder({
					type: self.type,
					bitRate: self.bitRate,
					sampleRate: self.sampleRate,
					onProcess: function(buffers, powerLevel, duration, sampleRate) {
						self.duration = duration;
						self.powerLevel = powerLevel;
						// self.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate);
					},

				});
				self.dialogInt = setTimeout(function() { //定时8秒后打开弹窗，用于监测浏览器没有发起权限请求的情况
					// self.showDialog();
				}, 8000);
				rec.open(function() {
					self.msg = 'open recorder success'
					self.showModal('Modal')
					// self.dialogCancel();
					// self.reclog("已打开:" + self.type + " " + self.sampleRate + "hz " + self.bitRate + "kbps", 2);

					// self.wave = Recorder.WaveView({
					// 	elem: ".ctrlProcessWave"
					// });
				}, function(msg, isUserNotAllow) {
					this.msg = msg
					self.showModal('Modal')
					// self.dialogCancel();
					// self.reclog((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + msg, 1);
				});
				self.waitDialogClickFn = function() {
					// self.dialogCancel();
					// self.reclog("打开失败：权限请求被忽略，用户主动点击的弹窗", 1);
				};
			},
			recStart: function() {
				if (!this.rec) {
					this.msg = 'can not open recorder'
					this.showModal('Modal')
					console.log('未打开录音')
					// this.reclog("未打开录音", 1);
					return;
				}
				this.rec.start();
				var set = this.rec.set;
				console.log('录制中')
				this.msg = 'recording'
				self.showModal('Modal')
				this.reclog("录制中：" + set.type + " " + set.sampleRate + "hz " + set.bitRate + "kbps");
			},
			recStop: function() {
				var self = this;
				var rec = self.rec;
				self.rec = null;
				if (!rec) {
					console.log('未打开录音')
					// self.reclog("未打开录音", 1);
					return;
				}
				rec.stop(function(blob, duration) {
					self.reclog("已录制:", "", {
						blob: blob,
						duration: duration,
						rec: rec
					});
					self.blob = blob
					console.log(blob)
					self.showModal('Modal')
				}, function(s) {
					this.msg = 'error:' + s
					self.reclog("结束出错：" + s, 1);
					self.showModal('Modal')
				}, true); //自动close
			},
			reclog: function(msg, color, res) {
				this.logs.splice(0, 0, {
					idx: this.logs.length,
					msg: msg,
					color: color,
					res: res,
					playMsg: "",
					down: 0,
					down64Val: ""
				});
			},
			recplay: function() {
				this.showAudio = true
				var audio = this.$refs.audioPlayer
				debugger
				audio.onerror = function(e) {
					console.log('play failed');
				};
				audio.src = (window.URL || webkitURL).createObjectURL(this.blob);
				// audio.play();
				// const innerAudioContext = uni.createInnerAudioContext();
				// innerAudioContext.autoplay = true;
				// // innerAudioContext.src = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3';
				// innerAudioContext.src = (window.URL || webkitURL).createObjectURL(this.blob);
				// console.log(innerAudioContext.src)
				// innerAudioContext.onPlay(() => {
				//   console.log('开始播放');
				// });
				// innerAudioContext.onError((res) => {
				//   console.log(res.errMsg);
				//   console.log(res.errCode);
				// });
			},
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
