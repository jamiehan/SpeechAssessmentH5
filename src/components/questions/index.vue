<template>
  <div>
    <van-nav-bar
      title="题库列表"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>
    <div class="content">
      <div class="exam-list">
        <div class="exam-item" v-for="l in list" :key="l.id">
          <div>
            <div class="name">{{ l.name }}</div>
            <div class="info">
              共{{ l.total }}题，总分{{ l.score }}分，考试时长{{ l.time }}分钟
            </div>
          </div>
          <div class="action">
            <van-icon
              name="records"
              size="20"
              v-if="!l.finished"
              @click="confirm"
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
      list: [
        {
          id: 1,
          name: "2020-2021秋六年级期末试卷",
          total: 50,
          score: 100,
          finished: false,
          time: 90,
        },
        {
          id: 2,
          name: "考试2",
          total: 50,
          score: 100,
          finished: false,
          time: 90,
        },
        {
          id: 3,
          name: "考试3",
          total: 50,
          score: 100,
          finished: true,
          time: 90,
        },
      ],
    };
  },
  methods: {
    getExams() {},
    open() {
      this.modalName = "confirmModal";
    },
    close() {
      this.modalName = "";
    },
    confirm() {
      this.$router.push('questiondetail')
    },
    back() {
      this.$router.push('index')
    },
  },
  mounted() {
    // this.getRec()
  },
};
</script>

<style lang="less" >
div {
  user-select: none;
}
.content {
  margin-top: 46px;
}
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
</style>
