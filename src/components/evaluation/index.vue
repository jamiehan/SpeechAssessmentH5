<template>
  <div class="evaluation">
    <van-nav-bar
      title="语音评测"
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
      @click="navigate('phoneticsymbol')"
    >
      <van-icon name="records" color="blue" />
      <div>英文音标</div>
    </van-row>
    <van-row
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
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('evaluation')"
    >
      <van-icon name="apps-o" />
      <div>英文对比</div>
    </van-row>
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
    return {};
  },
  methods: {
    navigate: function (path) {
      // if(path !== 'phoneticsymbol'){
      // 	Toast.success('功能正在全力开发中，请耐心等候！')
      // 	return
      // }
      this.$router.push(path);
    },
    back(){
      this.$router.go(-1);
    }
  },
  mounted() {
    // this.getRec()
  },
};
</script>
<style lang="less">
.evaluation{
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
