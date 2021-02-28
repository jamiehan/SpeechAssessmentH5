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
      </div>
      <div class="title">
        <div></div>
        <div>测评结果</div>
      </div>
      <div class="card result">
        <div class="total-score" :class="{'red': total_score < 60, 'orange': 60 <= total_score < 90, 'green': total_score >= 90}">{{ total_score }}</div>
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
            <div class="score-label">标准度分</div>
            <div class="score">{{ standard_score }}</div>
          </div>
          <!-- <div class="score-item">
            <div class="score-label">总分</div>
            <div class="score">90</div>
          </div> -->
        </div>
      </div>
      <div class="card result-detail" v-if="2==1"></div>
    </div>
    <div class="action-bottom">
      <div>
        <van-icon
          name="service"
          size="30"
          color="#1989fa"
          @touchStart="touchStart" 
          @touchEnd="touchEnd"
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
    <div>
      <button @click="touchStart">开始</button>
      <button @click="touchEnd">结束</button>
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
  action: "read_sentence",
  language: "en_us",
  accent: "",
  ent: "en_vip"
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
      // rec: Recorder
      result: {},
      content: '',
      contents: [
        'How are you today?',
        'where are you from?',
        'do you like programming?',
        'i am chinese',
        'good idea'
      ]
    };
  },
  computed:{
    total_score() {
      return Math.floor((this.result.total_score||0) / 5 *100)
    },
    accuracy_score() {
      return Math.floor((this.result.accuracy_score||0) / 5 *100)
    },
    fluency_score() {
      return Math.floor((this.result.fluency_score||0) / 5 *100)
    },
    integrity_score() {
      return Math.floor((this.result.integrity_score||0) / 5 *100)
    },
    standard_score() {
      return Math.floor((this.result.standard_score||0) / 5 *100)
    }
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
      iseRecorder.setText(this.content)
      iseRecorder.start();
      // this.recStart();
    },
    touchEnd: function () {
      Toast.clear(true);
      // this.recStop();
      console.log("recording end");
      iseRecorder.stop();
      console.log(this.result)
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
      this.content = this.contents[Math.round(Math.random() * 3)]
    }
  },
  mounted() {
    this.changeContent()
    const self = this
    iseRecorder.onTextChange = function (grade) {
      if(grade){
       self.result = grade.xml_result && grade.xml_result.read_sentence && grade.xml_result.read_sentence.rec_paper && grade.xml_result.read_sentence.rec_paper.read_chapter;
      }
    }
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
    display: flex;
    // justify-content: center;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 32px;
    .total-score {
      width: 40px;
      height: 40px;
      line-height: 44px;
      text-align: center;
      color: white;
      border-radius: 50%;
      font-size: 20px;
    }
    .total-score.green{
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);
    }
    .total-score.orange{
      background-image: linear-gradient(45deg, #eef123e8, #e9fa00);
    }
    .total-score.red{
      background-image: linear-gradient(45deg, #e74e4e, #f70808);
    }
    .score-item-wrapper {
      text-align: left;
      font-size: 12px;
      margin-left: 32px;
      .score-item{
        display: flex;
        align-items: center;
        .score-label{
          padding-bottom: 4px;
          padding-top: 4px;
          width: 100px;
        }
        .score{
          margin-left: 10px;
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
</style>
