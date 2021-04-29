<template>
  <div class="evaluation">
    <van-nav-bar
      title="年级列表"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <!-- <van-row>
      <van-image
        width="100%"
        height="240"
        fit="cover"
        :src="require('@/assets/componentBg.png')"
      />
    </van-row> -->
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate(g)"
      v-for="(g, index) in grades"
      :key="index"
    >
      <van-icon name="records" color="blue" />
      <div>{{ gradesCn[index] }}年级</div>
    </van-row>
    <!-- <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('en-word')"
    >
      <van-icon name="description" />
      <div>英文单词</div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('en-sentence')"
    >
      <van-icon name="points" />
      <div>英文句子</div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('en-paragraph')"
    >
      <van-icon name="font-o" />
      <div>英文段落</div>
    </van-row> -->
    <!-- <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('evaluation')"
    >
      <van-icon name="apps-o" />
      <div>英文对比</div>
    </van-row> -->
  </div>
</template>

<script>
import { NavBar, Col, Row, Image, Icon, Toast } from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
    [Col.name]: Col,
    [Row.name]: Row,
    [Image.name]: Image,
    [Icon.name]: Icon,
  },
  data() {
    return {
      grades: [3, 4, 5, 6, 7, 8, 9],
      gradesCn: ["三", "四", "五", "六", "七", "八", "九"],
      routeType: "",
    };
  },
  methods: {
    navigate: function (grade) {
      this.$router.push({
        name: this.routeType,
        params: { grade: grade },
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
  mounted() {
    if(!this.routeType){
    this.routeType = this.$route.params.type;
    }
  },
};
</script>
<style lang="less">
.evaluation {
  .menu-row {
    margin-top: 10px;
    padding: 10px 0;
    background-color: white;
    color: blueviolet;
    div {
      margin-left: 8px;
      user-select: none;
    }
  }
}
</style>
