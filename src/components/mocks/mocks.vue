<template>
  <div style="overflow:hidden;">
    <van-nav-bar fixed>
      <template #title>
        <van-count-down :time="time">
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </template>
      <template #right>
        <div @click="confirm">交卷</div>
      </template>
    </van-nav-bar>
    <div class="content">
      <div class="exam-info">
        <div>{{ examInfo.name }}</div>
        <div>{{ currentIdx + "/" + examInfo.total }}</div>
      </div>
      <div class="question" v-if="list[currentIdx].type === 'singlechoice'">
        <van-cell :value="list[currentIdx].name"></van-cell>
        <van-radio-group v-model="list[currentIdx].answer">
          <van-cell-group>
            <van-cell
              :value="item.label + '、' + item.content"
              clickable
              @click="list[currentIdx].answer = item.label"
              v-for="item in list[currentIdx].options"
              :key="item.label"
            >
              <template #right-icon>
                <van-radio :name="item.label" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="question" v-else-if="list[currentIdx].type === 'multichoice'">
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
      <div class="question" v-else-if="list[currentIdx].type === 'ownchoice'">
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
      </div>
    </div>
    <div class="footer">
      <div @click="pre">
        <van-icon name="arrow-left" size="18"/>上一题
      </div>
      <div @click="next">
        下一题<van-icon name="arrow" size="18"/>
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
  Field
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
  },
  data() {
    return {
      list: [
        {
          id: 1,
          name: "1.1+1=2吗",
          type: "singlechoice",
          options: [
            {
              label: "A",
              content: "正确",
            },
            {
              label: "B",
              content: "错误",
            },
            {
              label: "C",
              content: "不知道",
            },
          ],
          answer: "",
        },
        {
          id: 2,
          name: "2.最喜欢什么好吃的",
          type: "multichoice",
          options: [
            {
              label: "A",
              content: "四喜丸子",
            },
            {
              label: "B",
              content: "烧花鸭",
            },
            {
              label: "C",
              content: "蒸熊掌",
            },
            {
              label: "D",
              content: "喇嘛",
            },
          ],
          answer: [],
        },
        {
          id: 3,
          name: "3.题目3",
          type: "singlechoice",
          options: [
            {
              label: "A",
              content: "正确",
            },
            {
              label: "B",
              content: "错误",
            },
          ],
          answer: "",
        },
        {
          id: 4,
          name: "4.简述你现在的心情",
          type: "ownchoice",
          answer: "",
        },
      ],
      currentIdx: 0,
      examInfo: {
        name: "冬季摸底考试",
        total: 4,
      },
      time: 30 * 60 * 60 * 1000
    };
  },
  methods: {
    getExams() {},
    confirm() {
      Dialog.confirm({
        message: "确认交卷吗？",
        confirmButtonColor: "#1989fa",
      })
        .then(() => {
          this.$router.push("examlist");
        })
        .catch(() => {});
    },
    pre() {
      if (this.currentIdx > 0) {
        this.currentIdx -= 1;
      } else {
        console.log("已经是第一题了");
      }
    },
    next() {
      if (this.currentIdx < this.examInfo.total - 1) {
        this.currentIdx += 1;
      } else {
        console.log("已经是最后一道题了");
      }
    },
  },
  mounted() {
    this.current = this.list[0];
  },
};
</script>

<style lang="less">
.cu-item {
  min-height: 36px !important;
}
.btn-wrapper-fixed {
  position: fixed;
  bottom: 0px;
  width: 100%;
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
.footer{
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 24px);
  bottom: 0;
  align-items: center;
  padding: 10px 12px;
  background-color: white;
  color: #1989fa;
  div{
    display: flex;
    align-items: center;
  }
}
</style>
