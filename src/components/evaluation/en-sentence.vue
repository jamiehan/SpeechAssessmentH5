<template>
  <div>
    <van-nav-bar
      title="英文句子"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>
    <div class="content" style="padding-left: 12px; padding-right: 12px">
      <div class="title">
        <div></div>
        <div>英文句子</div>
      </div>
      <div class="card">
        <div class="sentence-content">{{ content }}</div>
        <div class="words-content"></div>
      </div>
      <div class="title">
        <div></div>
        <div>测评结果</div>
      </div>
      <div class="card result">
        <div
          class="total-result-wrapper"
          :class="{
            active: words.length > 0,
          }"
        >
          <div
            class="total-score"
            :class="{
              red: total_score < 60,
              orange: total_score < 90 && total_score >= 60,
              green: total_score >= 90,
              active: words.length > 0,
            }"
          >
            {{ total_score }}
          </div>
          <div class="score-item-wrapper">
            <div class="score-item">
              <div class="score-label">准确度评分</div>
              <div class="score">{{ accuracy_score }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">流畅度评分</div>
              <div class="score">{{ fluency_score }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">完整度评分</div>
              <div class="score">{{ integrity_score }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">标准度评分</div>
              <div class="score">{{ standard_score }}</div>
            </div>
            <!-- <div class="score-item">
            <div class="score-label">总分</div>
            <div class="score">90</div>
          </div> -->
          </div>
        </div>
        <div class="result-detail" v-if="words.length > 0">
          <div v-for="word in words" :key="word.content" class="words-detail">
            <div class="word">
              <div
                :class="{
                  red: word.score < 60,
                  orange: word.score < 90 && word.score >= 60,
                  green: word.score >= 90,
                }"
              >
                {{ word.score }}
              </div>
              <div>{{ word.content }}</div>
              <div
                :class="{
                  red: word.score < 60,
                  orange: word.score < 90 && word.score >= 60,
                  green: word.score >= 90,
                }"
                v-if="word.dp_message != 0"
              >
                {{ word.dp_message }}
              </div>
            </div>
          </div>
        </div>
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
    <!-- <div>
      <button @click="start()">开始</button>
      <button @click="stop">结束</button>
    </div> -->
    <div class="player">
      <audio src="" ref="audioPlayer"></audio>
    </div>
    <van-popup v-model="show">内容</van-popup>
  </div>
</template>

<script>
import RecorderWrapper from "../lib/recorder/recorder-wrapper";
import { NavBar, Image as VanImage, Icon, Toast, Popup } from "vant";

let iseRecorder = new RecorderWrapper({
  action: "read_sentence",
  language: "en_us",
  accent: "",
  ent: "en_vip",
});
// console.log(iseRecorder)
export default {
  components: {
    [NavBar.name]: NavBar,
    [VanImage.name]: VanImage,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    // [Dialog.Component.name]: Dialog,
  },
  data() {
    return {
      modalName: "",
      // rec: Recorder
      result: {},
      content: "",
      contents: [
        "How are you today?",
        "where are you from?",
        "do you like programming?",
        "i am chinese",
        "good idea",
      ],
      show: false,
      support: false,
      words: [],
      dpMessages: ["正常", "漏读", "增读", "回读", "替换"], //0正常；16漏读；32增读；64回读；128替换
    };
  },
  computed: {
    total_score() {
      return Math.floor(((this.result.total_score || 0) / 5) * 100);
    },
    accuracy_score() {
      return Math.floor(((this.result.accuracy_score || 0) / 5) * 100);
    },
    fluency_score() {
      return Math.floor(((this.result.fluency_score || 0) / 5) * 100);
    },
    integrity_score() {
      return Math.floor(((this.result.integrity_score || 0) / 5) * 100);
    },
    standard_score() {
      return Math.floor(((this.result.standard_score || 0) / 5) * 100);
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    touchStart: function () {
      Toast.loading({
        message: "请跟读。。。",
        forbidClick: true,
        closeOnClick: true,
        duration: 0,
      });
      this.words = [];
      console.log("start recording");
      iseRecorder.setText(this.content);
      iseRecorder.start();
    },
    touchEnd: function () {
      Toast.clear(true);
      console.log("recording end");
      iseRecorder.stop();
    },
    start() {
      this.words = [];
      iseRecorder.setText(this.content);
      iseRecorder.start();
    },
    stop() {
      console.log("recording end");
      iseRecorder.stop();
    },
    replay: function () {
      Toast.clear(true);
      Toast.loading({
        message: "回放",
        duration: iseRecorder.recorder.duration * 1000,
      });
      iseRecorder.play();
    },
    changeContent: function () {
      this.content = this.contents[Math.round(Math.random() * 3)];
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
          grade.xml_result.read_sentence &&
          grade.xml_result.read_sentence.rec_paper &&
          grade.xml_result.read_sentence.rec_paper.read_chapter;
        const words = self.result.sentence.word;
        self.words = [];
        for (const d of words) {
          if (isNaN(d.global_index)) {
            continue;
          } else {
            let dpMessage = 0;
            if (!isNaN(d.dp_message) && d.dp_message != 0) {
              dpMessage =
                self.dpMessages[Math.log2(parseInt(d.dp_message || 0)) - 3];
            }
            self.words.push({
              content: d.content,
              score: Math.floor(((d.total_score || 0) / 5) * 100),
              dp_message: dpMessage,
            });
          }
        }
        console.log(self.words);
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
    .sentence-content {
      padding: 16px 10px;
      font-size: 18px;
    }
  }
  .result {
    padding-top: 16px;
    padding-bottom: 16px;
    .total-result-wrapper {
      padding-left: 32px;
      padding-bottom: 16px;
      // margin-bottom: 10px;
      display: flex;
      // justify-content: center;
      align-items: center;
      .total-score {
        width: 40px;
        height: 40px;
        line-height: 44px;
        text-align: center;
        color: white;
        border-radius: 50%;
        font-size: 20px;
      }
      .score-item-wrapper {
        text-align: left;
        font-size: 12px;
        margin-left: 32px;
        .score-item {
          display: flex;
          align-items: center;
          .score-label {
            padding-bottom: 4px;
            padding-top: 4px;
            width: 100px;
          }
          .score {
            margin-left: 10px;
          }
        }
      }
    }
    .total-result-wrapper.active {
      border-bottom: 1px dashed #ddd;
    }
    .result-detail {
      margin-top: 16px;
      margin-left: 10px;
      display: flex;
      .words-detail {
        .word {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 8px;
          div:nth-child(odd) {
            font-size: 12px;
            padding: 2px 4px;
            border-radius: 2px;
          }
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
}
.orange {
  background-image: linear-gradient(45deg, #eef123e8, #e9fa00);
  // color:white;
}
.red {
  background-image: linear-gradient(45deg, #e74e4e, #f70808);
  color: white;
}
</style>
