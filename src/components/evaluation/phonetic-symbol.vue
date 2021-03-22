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
        <div class="symbol">[{{ std }}]</div>
      </div>
      <div class="title">
        <div></div>
        <div>测评结果</div>
      </div>

      <div class="card result">
        <div class="total-score">{{ score }}</div>
      </div>
    </div>
    <!-- <div>
      <button @click="start">开始</button>
      <button @click="stop">结束</button>
    </div> -->
    <div class="action-bottom">
      <div>
        <van-icon
          name="service"
          size="30"
          color="#1989fa"
          @touchstart="touchStart"
          @touchend="touchEnd"
        />
        <div>长按跟读</div>
      </div>
      <div>
        <van-icon
          name="play-circle"
          size="30"
          color="#1989fa"
          @click="replay"
        />
        <div>点击回放</div>
      </div>
      <div class="btn-next" @click="changeContent">换一个</div>
    </div>
    <div class="player">
      <audio src="" ref="audioPlayer"></audio>
    </div>
  </div>
</template>

<script>
import RecorderWrapper from '../lib/recorder/recorder-wrapper'
import { getRandomSymbol } from "../lib/mapping";
import { NavBar, Image as VanImage, Icon, Toast } from "vant";

let iseRecorder = new RecorderWrapper({
  action: "read_word",
  language: "en_us",
  accent: "",
  ent: "en_vip",
})

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
      msg: "",
      iseRecorder: null,
      xf:'',
      std:'',
      result: {},
      support: false,
    };
  },
  computed: {
    score() {
      let score = (this.result.total_score / 5) * 100;
      if (isNaN(score)) {
        score = 0;
      }
      return Math.round(score);
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    touchStart: function () {
      Toast.loading({
        message: "请跟读。。。",
        // forbidClick: true,
        closeOnClick: true,
        duration: 0,
      });
      console.log("start recording");
      iseRecorder.start();
    },
    touchEnd: function () {
      Toast.clear(true);
      console.log("recording end");
      iseRecorder.stop();
    },
    start: function () {
      iseRecorder.start();
    },
    stop: function () {
      iseRecorder.stop();
    },
    replay: function () {
      Toast.clear(true);
      Toast.loading({
        message: "回放",
        duration: iseRecorder.recorder.duration * 1000,
      });
      iseRecorder.play()
    },
    changeContent: function () {
      const sylls = getRandomSymbol()
      this.xf = sylls.xf
      this.std = sylls.std
      iseRecorder.setText("[word]" + this.xf);
    },
  },
  async mounted() {
    const self = this;
    this.changeContent();
    iseRecorder.onTextChange = function (grade) {
      if (grade) {
        console.log(grade);
        self.result =
          grade.xml_result &&
          grade.xml_result.read_word &&
          grade.xml_result.read_word.rec_paper &&
          grade.xml_result.read_word.rec_paper.read_word;
        if (
          self.result.is_rejected == "true" &&
          iseRecorder.status === "end"
        ) {
          Toast({
            message: "请正确朗读所示单词",
          });
          self.result.total_score = 0;
        }
      }
    };
  },
  destroyed() {
    // iseRecorder = null
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
    flex-direction: column;
    padding-top: 16px;
    padding-bottom: 16px;
    .total-score {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);
      color: white;
      border-radius: 50%;
      font-size: 32px;
    }
    .sylls-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      .sylls {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 10px;
        div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 32px;
        }
        .syll{
          margin-left: 2px;
          margin-right: 2px;
        }
      }
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
.green {
  background-image: linear-gradient(45deg, #39b54a, #8dc63f);
  color: white;
  border-radius: 2px;
}
.orange {
  background-image: linear-gradient(45deg, #eef123e8, #e9fa00);
  // color:white;
  border-radius: 2px;
}
.red {
  background-image: linear-gradient(45deg, #e74e4e, #f70808);
  border-radius: 2px;
  color: white;
}
</style>
