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
        <div class="symbol">[{{ stdSymbols[selectedIdx] }}]</div>
        <!-- <van-image
          width="100"
          height="100"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        /> -->
        <!-- <div class="label">
          发音时舌尖抵下齿，舌前部尽量向上颚抬起，嘴唇向两旁伸开，成扁平形，注意一定要把音发足。
        </div> -->
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
import IseRecorder from "../lib/recorder";
import { NavBar, Image as VanImage, Icon, Toast } from "vant";

const iseRecorder = new IseRecorder({
  action: "read_word",
  language: "en_us",
  accent: "mandarin",
  ent: "en_vip",
});

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
      audioAction: {
        method: "play",
      },
      showAudio: false,
      msg: "",
      duration: 0,
      iseRecorder: null,
      selectedIdx: 9,
      stdSymbols: [
        "ɑː",
        "æ",
        "ʌ",
        "ɔː",
        "eə",
        "aʊ",
        "ə",
        "aɪ",
        "e",
        "ɜː",
        "eɪ",
        "ɪ",
        "ɪə",
        "iː",
        "ɒ",
        "əʊ",
        "ɒɪ",
        "ʊ",
        "uː",
        "ʊə",
        "b",
        "tʃ",
        "d",
        "ð",
        "f",
        "g",
        "h",
        "dʒ",
        "k",
        "l",
        "m",
        "n",
        "ŋ",
        "p",
        "r",
        "s",
        "ʃ",
        "t",
        "θ",
        "v",
        "w",
        "j",
        "z",
        "ʒ",
        "dr",
        "dz",
        "tr",
        "ts",
      ],
      xfSymbols: [
        "aa",
        "ae",
        "ah",
        "ao",
        "ar",
        "aw",
        "ax",
        "ay",
        "eh",
        "er",
        "ey",
        "ih",
        "ir",
        "iy",
        "oo",
        "ow",
        "oy",
        "uh",
        "uw",
        "ur",
        "b",
        "ch",
        "d",
        "dh",
        "f",
        "g",
        "hh",
        "jh",
        "k",
        "l",
        "m",
        "n",
        "ng",
        "p",
        "r",
        "s",
        "sh",
        "t",
        "th",
        "v",
        "w",
        "y",
        "z",
        "zh",
        "dr",
        "dz",
        "tr",
        "ts",
      ],
      result: {}
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    touchStart: function () {
      // Toast.loading({
      //   message: "请跟读。。。",
      //   // forbidClick: true,
      //   closeOnClick: true,
      //   duration: 0,
      // });
      iseRecorder.setText(this.xfSymbols[this.selectedIdx]);
      console.log("start recording");
      iseRecorder.start();
    },
    touchEnd: function () {
      Toast.clear(true);
      console.log("recording end");
      iseRecorder.stop();
    },
    replay: function () {
      Toast.clear(true);
      Toast.loading({
        message: "录音回放",
        duration: 1,
      });
      // this.recPlay()
    },
    changeContent: function () {
      this.selectedIdx = Math.round(Math.random() * 46);
    },
  },
  mounted() {
    // this.getRec();
    const self = this;
    iseRecorder.onTextChange = function (grade) {
      if (grade) {
        self.result =
          grade.xml_result &&
          grade.xml_result.read_sentence &&
          grade.xml_result.read_sentence.rec_paper &&
          grade.xml_result.read_sentence.rec_paper.read_chapter;
          console.log(self.result)
      }
    };
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
