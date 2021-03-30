<template>
  <div style="overflow: hidden" class="exam-detail">
    <div>
      <van-nav-bar
        :title="examInfo.name"
        left-text="返回"
        left-arrow
        @click-left="back"
        fixed
      >
      </van-nav-bar>
      <!-- <van-nav-bar fixed>
        <template #right>
          <div @click="confirm">交卷</div>
        </template>
      </van-nav-bar> -->
      <div class="content">
        <div v-if="loading" class="loading-text">获取试题列表...</div>
        <div class="question" v-if="selectedQuestion.questionTypeId == 1">
          <van-cell
            :value="currentIdx + 1 + '、' + selectedQuestion.title"
            style="font-weight: bold"
          ></van-cell>
          <van-radio-group v-model="selectedQuestion.myAnswer">
            <van-cell-group>
              <van-cell
                :value="item.label + '、' + item.content"
                clickable
                @click="selectedQuestion.myAnswer = item.label"
                v-for="item in selectedQuestion.choiceList"
                :key="item.label"
              >
                <template #right-icon>
                  <van-radio :name="item.label" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <!-- <div class="question" v-else-if="list[currentIdx].questionTypeId == 2">
          <van-cell :value="list[currentIdx].name"></van-cell>
          <van-checkbox-group v-model="list[currentIdx].answer">
            <van-cell-group>
              <van-cell
                :value="item.label + '、' + item.content"
                clickable
                @click="list[currentIdx].answer.indexOf(item.label) >= 0"
                v-for="item in list[currentIdx].options"
                :key="item.label"
              >
                <template #right-icon>
                  <van-checkbox shape="square" :name="item.label" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
        <div class="question" v-else-if="list[currentIdx].questionTypeId == 3">
          <van-cell :value="list[currentIdx].name"></van-cell>
          <van-cell>
            <van-field
              v-model="list[currentIdx].answer"
              rows="6"
              type="textarea"
              placeholder="请输入您的答案"
            />
          </van-cell>
        </div>
        <div class="question" v-else>
          <van-cell value="暂不支持此类型题目"></van-cell>
        </div> -->
        <div class="answer-detail">
          <div style="color: #1989fa" @click="showAnswer = true">查看解析</div>
          <!-- <div style="color:#1989fa" @click="showAnswer = true">关闭解析</div> -->
          <div v-if="showAnswer == true">正确答案：{{ selectedQuestion.answer }}</div>
        </div>
      </div>
      <div class="footer">
        <div @click="pre"><van-icon name="arrow-left" size="18" />上一题</div>
        <div @click="next">下一题<van-icon name="arrow" size="18" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  CountDown,
  Dialog,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Field,
  Loading,
  Overlay,
  Toast,
  Skeleton,
} from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [CountDown.name]: CountDown,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Field.name]: Field,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [Skeleton.name]: Skeleton,
  },
  data() {
    return {
      list: [],
      currentIdx: 0,
      examInfo: {
        name: "",
        total: 0,
        examId: "",
        examPaperId: "",
        examHistoryId: "",
      },
      time: 0,
      loading: true,
      selectedQuestion: {},
      showAnswer: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.list[this.currentIdx];
    },
  },
  methods: {
    getExams() {},
    confirm() {
      let message = "确认交卷吗？";
      let answers = [];
      for (let i = 0, len = this.list.length; i < len; i++) {
        let obj = this.list[i];
        if (obj.myAnswer == "") {
          message = "尚有题目未作答，确认交卷吗？";
        }
        let answer = {
          questionId: obj.questionId,
          point: obj.questionPoint,
          questionTypeId: obj.questionTypeId,
          answer: obj.myAnswer,
          right: obj.myAnswer === obj.answer,
        };
        answers.push(answer);
      }
      Dialog.confirm({
        message: message,
        confirmButtonColor: "#1989fa",
      })
        .then(async () => {
          const result = await this.postExam(answers);
          console.log(result);
          if (result.respCode != 200) {
            Toast.fail(result.respMessage || "交卷失败，请重试！");
          } else {
            Toast.success("交卷完成！");
            this.$router.push("examlist");
          }
        })
        .catch(() => {});
    },
    pre() {
      if (this.currentIdx > 0) {
        this.currentIdx -= 1;
        this.selectedQuestion = this.list[this.currentIdx];
        this.showAnswer = false;
      } else {
        Toast({
          message: "已经是第一题了",
          duration: 1000,
        });
        console.log("已经是第一题了");
      }
    },
    next() {
      if (this.currentIdx < this.examInfo.total - 1) {
        this.currentIdx += 1;
        this.selectedQuestion = this.list[this.currentIdx];
        this.showAnswer = false;
      } else {
        Toast({
          message: "已经是最后一道题了",
          duration: 1000,
        });
        console.log("已经是最后一道题了");
      }
    },
    postExam(answers) {
      return this.request.post("/Portal/finish-exam-api", {
        examId: this.examInfo.examId,
        token: localStorage.getItem("token"),
        answerSheet: {
          examHistroyId: this.examInfo.examHistroyId,
          examId: this.examInfo.examId,
          examPaperId: this.examInfo.examPaperId,
          answerSheetItems: answers,
        },
      });
    },
    async getExamInfo(id) {
      const result = await this.request.get(
        "/Portal/exam-start-api?token=" +
          localStorage.getItem("token") +
          "&examId=" +
          id
      );
      this.loading = false;
      if (result.respCode != 200) {
        Toast.fail("加载试题失败，请重试!");
      } else {
        const data = result.data;
        this.time = data.duration * 1000;
        this.examInfo.total = data.questionList.length;
        this.examInfo.examId = data.examId;
        this.examInfo.examPaperId = data.examPaperId;
        this.examInfo.examHistroyId = data.examHistroyId;
        this.list = [];
        data.questionList.forEach((ele) => {
          let content = JSON.parse(ele.content);
          content.questionId = ele.questionId;
          content.questionTypeId = ele.questionTypeId;
          content.answer = ele.answer;
          content.myAnswer = "";
          let choices = [];
          for (const key in content.choiceList) {
            choices.push({
              label: key,
              content: content.choiceList[key],
            });
          }
          content.choiceList = choices;
          this.list.push(content);
          this.selectedQuestion = this.list[this.currentIdx];
        });
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const id = this.$route.params.id;
    this.examInfo.name = this.$route.params.name;
    if (id) {
      this.getExamInfo(id);
    } else {
    }
  },
};
</script>

<style lang="less">
#app {
  overflow-y: auto;
}
.exam-detail {
  .van-overlay {
    background-color: transparent;
    margin-top: 50%;
  }
}

.cu-item {
  min-height: 36px !important;
}
.btn-wrapper-fixed {
  position: fixed;
  bottom: 0px;
  width: 100%;
}
.load-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.colon {
  display: inline-block;
  margin: 0 4px;
  color: #1989fa;
}
.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #1989fa;
}
.content {
  margin-top: 46px;
  .loading-text {
    padding: 32px 0;
    font-size: 14px;
  }
  .question-list {
    height: 100%;
    overflow-y: auto;
  }
  .answer-detail {
    text-align: left;
    font-size: 14px;
    padding-top: 4px;
    padding-left: 4px;
  }
}
.exam-info {
  display: flex;
  justify-content: space-between;
  padding: 6px 6px;
  background: white;
  margin-bottom: 6px;
}
.question {
  background-color: white;
  height: 100%;
}
.footer {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 24px);
  bottom: 0;
  align-items: center;
  padding: 10px 12px;
  background-color: white;
  color: #1989fa;
  div {
    display: flex;
    align-items: center;
  }
}
</style>