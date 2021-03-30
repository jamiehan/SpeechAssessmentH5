<template>
  <div>
    <van-nav-bar
      title="考试列表"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>
    <div class="content">
      <div class="exam-list">
        <van-list
          v-model="loading"
          loading-text="获取考试信息..."
          :finished="finished"
          @load="getExams"
        >
          <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
          <div v-if="list.length == 0 && finished == true && error == false" class="no-exams">
            未找到适合您的考试信息。
          </div>
          <div v-if="error == true" class="no-exams">
            请求失败，请刷新重试!
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
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Dialog, Loading, List, Toast } from "vant";
export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [List.name]: List,
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
        "/Portal/exam-list-api?token=" + localStorage.getItem("token")
      );
      if (result.respCode != "200") {
        this.finished = true;
        this.error = true;
      } else {
        const data = result.data;
        this.list = data.examListToStart;
        this.error = false;
        this.finished = true;
      }
    },
    reload() {
      setTimeout(() => {
        Toast("刷新成功");
        this.loading = false;
        this.count++;
      }, 1000);
    },
    open() {
      this.modalName = "confirmModal";
    },
    close() {
      this.modalName = "";
    },
    async confirm(obj) {
      const result = await this.getExamInfo(obj.examId);
      if (result.respCode != 200) {
        Toast.fail(result.respMessage);
      } else {
        Dialog.confirm({
          message: "开始考试后无法取消和暂停，确认开始考试吗？",
          confirmButtonColor: "#1989fa",
        })
          .then(() => {
            this.$router.push({
              name: "examing",
              params: {
                id: obj.examId,
                name: obj.examPaperName
              },
            });
          })
          .catch(() => {});
      }
    },
    back() {
      this.$router.push("index");
    },
    getExamInfo(id) {
      return this.request.get(
        "/Portal/exam-start-api?token=" +
          localStorage.getItem("token") +
          "&examId=" +
          id
      );
    },
  },
  mounted() {
    this.getExams()
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
