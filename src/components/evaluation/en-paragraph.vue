<template>
  <div>
    <van-nav-bar
      title="英文段落"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
      <template #right>
        <van-icon name="orders-o" size="18" @click="showGradeSelect" />
      </template>
    </van-nav-bar>
    <div class="content" style="padding-left: 12px; padding-right: 12px">
      <div class="title">
        <div></div>
        <div>英文段落</div>
      </div>
      <div class="card">
        <div class="sentence-content">[ {{ content }} ]</div>
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
      <van-button
        type="info"
        class="btn-next"
        @click="changeContent"
        :loading="loading"
        >换一个</van-button
      >
      <!-- <div class="btn-next" @click="changeContent">换一个</div> -->
    </div>
    <audio></audio>
    <!-- <div>
      <button @click="start">开始</button>
      <button @click="end">结束</button>
    </div> -->
    <div class="player">
      <audio src="" ref="audioPlayer"></audio>
    </div>
    <van-popup v-model="show">内容</van-popup>
    <van-action-sheet
      v-model="showGradeSelector"
      :actions="actions"
      @select="selectGrade"
    />
  </div>
</template>

<script>
import RecorderWrapper from "../lib/recorder/recorder-wrapper";
import {
  NavBar,
  Image as VanImage,
  Icon,
  Toast,
  Popup,
  Button,
  ActionSheet,
} from "vant";

let recorder = new RecorderWrapper({
  action: "read_chapter",
  language: "en_us",
  accent: "",
  ent: "en_vip",
});
export default {
  components: {
    [NavBar.name]: NavBar,
    [VanImage.name]: VanImage,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet,
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
      loading: false,
      page: 1,
      grade: 3,
      showGradeSelector: false,
      actions: [{ name: '三年级', value: 3 }, { name: '四年级', value: 4 }, { name: '五年级', value: 5 },
      { name: '六年级', value: 6 }, { name: '七年级', value: 7 }, { name: '八年级', value: 8 }, { name: '九年级', value: 9 }]
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
      if (this.loading === true) {
        Toast.loading({
          message: "正在获取数据，请稍后...",
          duration: 0,
        });
        return;
      }
      Toast.loading({
        message: "请跟读。。。",
        forbidClick: true,
        closeOnClick: false,
        duration: 0,
      });
      this.words = [];
      recorder.setText(this.content);
      recorder.start();
    },
    touchEnd: function () {
      Toast.clear(true);
      recorder.stop();
    },
    start: function () {
      recorder.setText(this.content);
      recorder.start();
    },
    end: function () {
      recorder.stop();
    },
    replay: function () {
      if (this.loading == true) {
        Toast.loading({
          message: "正在获取数据，请稍后...",
          duration: 1000,
        });
        return;
      }
      if (recorder.recorder.duration * 1000 <= 0) {
        Toast.fail({
          message: "未开始录音或录音时间太短",
          duration: 1500,
        });
        return;
      }
      Toast.clear(true);
      Toast.loading({
        message: "回放",
        duration: recorder.recorder.duration * 1000,
      });
      recorder.play();
    },
    changeContent: function () {
      this.loading = true;
      this.getParagraph()
        .then((res) => {
          let content;
          if (typeof res.content === "string") {
            content = JSON.parse(res.content);
          }
          this.content = content.title || "";
          if (this.content) {
            this.page += 1;
          } else {
            this.page = 1;
            this.changeContent();
          }
        })
        .finally(() => {
          this.loading = false;
        });
      // this.content = this.contents[Math.round(Math.random() * 3)];
    },
    getParagraph: function () {
      // 11 段落
      // 12 对比
      return this.request.get(
        `/Management/api/questions/index?questionType=11&page=${this.page}&knowledge=${this.grade}`
      );
    },
    showGradeSelect: function(){
      this.showGradeSelector = true
    },
    selectGrade: function(obj){
      this.grade = obj.value
      this.showGradeSelector = false
      this.changeContent()
    }
  },
  mounted() {
    const self = this;
    this.changeContent();
    recorder.onTextChange = function (grade) {
      if (grade) {
        self.result =
          grade.xml_result &&
          grade.xml_result.read_chapter &&
          grade.xml_result.read_chapter.rec_paper &&
          grade.xml_result.read_chapter.rec_paper.read_chapter;
        if (self.result.is_rejected == "true" && recorder.status === "end") {
          Toast({
            message: "请正确朗读所示段落",
          });
          self.result.total_score = 0;
          self.result.accuracy_score = 0;
          self.result.fluency_score = 0;
          self.result.integrity_score = 0;
          self.result.standard_score = 0;
        } else {
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
        }
      }
    };
  },
  destroyed() {
    recorder.dispose();
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
    top: -52px;
    padding: 2px 4px 2px 12px;
    border-top-left-radius: 2500px;
    border-bottom-left-radius: 2500px;
    font-size: 14px;
    height: 28px;

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
