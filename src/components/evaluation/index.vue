<template>
  <div>
    <van-row>
      <van-image
        width="100%"
        height="240"
        fit="cover"
        :src="require('@/assets/componentBg.png')"
      />
    </van-row>
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
      @click="navigate('mocks/index')"
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
      @click="navigate('evaluation')"
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
import { Col, Row, Image, Icon, Toast } from "vant";

export default {
  components: {
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
		this.$router.push(path)
	},
  },
  mounted() {
    // this.getRec()
  },
};
</script>
<style lang="less">
.menu-row {
  margin-bottom: 10px;
  padding: 10px 0;
  background-color: white;
  color: blueviolet;
  div {
    margin-left: 8px;
    user-select: none;
  }
}
</style>
