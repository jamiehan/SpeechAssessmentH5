<template>
  <div>
    <van-nav-bar
      title="英文音标"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>
    <div class="content" style="padding-left: 12px; padding-right: 12px">
      <div class="title">
        <div></div>
        <div>测评音标</div>
      </div>
      <div class="card">
        <div class="symbol">[i:]</div>
        <van-image
          width="100"
          height="100"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="label">
          发音时舌尖抵下齿，舌前部尽量向上颚抬起，嘴唇向两旁伸开，成扁平形，注意一定要把音发足。
        </div>
      </div>
      <div class="title">
        <div></div>
        <div>测评结果</div>
      </div>
      <div class="card result">
        <div>99</div>
      </div>
    </div>
    <div class="action-bottom">
      <div >
        <van-icon name="service" size="30" color="#1989fa" @touchstart="touchStart" @touchend="touchEnd"/>
        <div>长按跟读</div>
      </div>
      <div>
        <van-icon name="play-circle" size="30" color="#1989fa" @click="replay"/>
        <div>点击回放</div>
      </div>
      <div class="btn-next" @click="recStop">换一个</div>
    </div>
    <div class="player">
      <audio src="" ref="audioPlayer"></audio>
    </div>
  </div>
</template>

<script>
import Recorder from "recorder-core";
import "recorder-core/src/engine/wav";
Recorder.TrafficImgUrl = "";
import { NavBar, Image as VanImage, Icon, Toast } from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
    [VanImage.name]: VanImage,
    [Icon.name]: Icon,
    // [Dialog.Component.name]: Dialog,
  },
  data() {
    return {
      modalName: "",
      rec: Recorder,
      type: "wav",
      bitRate: 16,
      // sampleRate: 16000,
      // duration: 0,
      powerLevel: 0,
      recOpenDialogShow: 0,
      dialogInt: null,
      logs: [],
      blob: null,
      current: {
        poster:
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/7fbf26a0-4f4a-11eb-b680-7980c8a877b8.png",
        name: "致爱丽丝",
        author: "暂无",
        src:
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3",
      },
      audioAction: {
        method: "play",
      },
      showAudio: false,
      msg: "",
      wave: null,
      duration: 0
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getRec() {
      const self = this;
      const rec = (this.rec = Recorder({
        type: self.type,
        onProcess: function (buffers, powerLevel, duration, sampleRate) {
          buffers, duration, sampleRate;
          if (powerLevel > 0) {
            console.log(powerLevel);
          }
          // self.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate);
        },
      }));
      self.dialogInt = setTimeout(function () {
        //定时8秒后打开弹窗，用于监测浏览器没有发起权限请求的情况
        // self.showDialog();
      }, 8000);
      rec.open(
        function () {
          self.msg = "open recorder success";
          // self.dialogCancel();
          // self.reclog("已打开:" + self.type + " " + self.sampleRate + "hz " + self.bitRate + "kbps", 2);

          // self.wave = Recorder.WaveView({
          // 	elem: ".wave-view",
          // 	lineWidth: 1
          // });
        },
        function (msg, isUserNotAllow) {
          this.msg = msg;
          console.log(isUserNotAllow);
          // self.reclog((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + msg, 1);
        }
      );
      self.waitDialogClickFn = function () {
        // self.dialogCancel();
        // self.reclog("打开失败：权限请求被忽略，用户主动点击的弹窗", 1);
      };
    },
    recStart: function () {
      if (!this.rec) {
        this.msg = "can not open recorder";
        console.log("未打开录音");
        return;
      }
      this.rec.start();
      // var set = this.rec.set;
      console.log("录制中");
      this.msg = "recording";
    },
    recStop: function () {
      var self = this;
      var rec = self.rec;
      if (!rec) {
        console.log("未打开录音");
        return;
      }
      // res.pause()
      rec.stop(
        function (blob, duration) {
          // self.reclog("已录制:", "", {
          // 	blob: blob,
          // 	duration: duration,
          // 	rec: rec
          // });
          self.blob = blob;
          console.log(duration);
          self.duration = duration;
        },
        function (s) {
          this.msg = "error:" + s;
          // self.reclog("结束出错：" + s, 1);
        },
        false
      ); //自动close
    },
    recPlay: function () {
      this.showAudio = true;
      var audio = this.$refs.audioPlayer;
      audio.onerror = function (e) {
        console.log("play failed", e);
      };
      let url = window.URL
      if(typeof window.webkitURL !== undefined){
        url = window.webkitURL
        // Toast.success('webkit')
      }else{
        url = window.URL
      }
      audio.src = url.createObjectURL(this.blob);
      audio.play();
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
    touchStart: function () {
      console.log("this is a test");
      Toast.loading({
        message: "请跟读。。。",
        // forbidClick: true,
        closeOnClick: true,
        duration: 0,
      });
      this.recStart();
    },
    touchEnd: function () {
      Toast.clear(true);
      this.recStop();
    },
    replay: function () {
      Toast.clear(true);
      Toast.loading({
        message: '录音回放',
        duration: this.duration
      })
      this.recPlay()
    },
  },
  mounted() {
    this.getRec();
  },
};
</script>

<style lang="less">
div {
  user-select: none;
}
.content {
  margin-top: 46px;
  height: 100%;

  .title {
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
    div:first-child {
      background-color: #0081ff;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      margin-right: 4px;
    }
  }
  .card {
    background-color: white;
    min-height: 24px;
    border-radius: 2px;
    box-shadow: 0 4px 6px #ebedf0;
    .symbol {
      font-size: 40px;
      color: #333333;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .label {
      font-size: 12px;
      color: #666666;
      padding: 10px 16px;
    }
  }
  .result {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 16px;
    div {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);
      color: white;
      border-radius: 50%;
      font-size: 32px;
    }
  }
  // .player{
  //   display: none;
  // }
}
.action-bottom {
  position: fixed;
  display: flex;
  width: 100%;
  bottom: 0;
  margin: 16px;
  color: #1989fa;
  //   overflow: hidden;
  .btn-next {
    position: absolute;
    background-color: #0081ff;
    color: #ffffff;
    right: 16px;
    top: -32px;
    padding: 2px 4px 2px 12px;
    border-top-left-radius: 2500px;
    border-bottom-left-radius: 2500px;
    font-size: 14px;
    // height: 20px;
    // width: 42px;
  }
  & > div {
    flex: 1;
  }
}
</style>
