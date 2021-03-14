<template>
  <div>
    <van-nav-bar
      title="模拟考试列表"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>
    <div class="content">
      <div class="exam-list">
        <div v-if="list.length == 0" class="no-exams">
          未找到适合您的模拟考试信息。
        </div>
        <div class="exam-item" v-for="l in list" :key="l.examId">
          <div>
            <div class="name">{{ l.examPaperName }}</div>
            <!-- <div class="info">
                共{{ l.total }}题，总分{{ l.score }}分，考试时长{{ l.time }}分钟
              </div> -->
          </div>
          <div class="action">
            <van-icon
              name="records"
              size="20"
              v-if="!l.finished"
              @click="confirm(l)"
            />
            <van-icon name="passed" size="20" v-if="l.finished" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Dialog } from "vant";
export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    // [Dialog.Component.name]: Dialog,
  },
  data() {
    return {
      modalName: null,
      list: [],
      loading: true,
      finished: false,
      error: false,
    };
  },
  methods: {
    async getExams() {
      const result = await this.request.get(
        "/exam-list-api?token=" + localStorage.getItem("token")
      );
      if (result.respCode != "200") {
        this.error = true;
      } else {
        const data = result.data;
        this.list = data.modelTestToStart;
        this.finished = true;
      }
    },
    open() {
      this.modalName = "confirmModal";
    },
    close() {
      this.modalName = "";
    },
    confirm(obj) {
      this.$router.push({
        name: "mockdetail",
        params: {
          id: obj.examId,
          name: obj.examPaperName,
        },
      });
    },
    back() {
      this.$router.push("index");
    },
  },
  mounted() {
    this.getExams();
  },
};
</script>

<style lang="less" >
div {
  user-select: none;
}
.content {
  margin-top: 46px;
  .exam-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    background-color: white;
    border-bottom: 1px solid rgba(170, 170, 170, 0.3);
    .name {
      font-size: 14px;
      text-align: left;
    }
    .info {
      font-size: 12px;
      color: #aaaaaa;
      text-align: left;
    }
  }
  .no-exams {
    font-size: 14px;
    color: rgba(170, 170, 170, 0.7);
    padding-top: 32px;
  }
}
</style>
