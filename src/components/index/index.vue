<template>
  <div>
    <van-row>
      <van-image
        width="100%"
        height="240"
        fit="cover"
        :src="require('@/assets/BasicsBg.png')"
      />
    </van-row>
    <van-row type="flex" justify="center" align="center" class="menu-row" @click="navigate('examlist')">
		<van-icon name="records" color="blue"/>
		<div>开始考试</div>
    </van-row>
    <van-row type="flex" justify="center" align="center" class="menu-row" @click="navigate('mocks/index')">
		<van-icon name="description" />
		<div>套题模拟</div>
    </van-row>
    <van-row type="flex" justify="center" align="center" class="menu-row" @click="navigate('questions/index')">
		<van-icon name="points" />
		<div>题库背题</div>
    </van-row>
    <van-row type="flex" justify="center" align="center" class="menu-row" @click="navigate('evaluation')">
		<van-icon name="play-circle-o" />
		<div>语音测评</div>
    </van-row>
  </div>
</template>

<script>
import { Col, Row, Image, Icon } from "vant";
export default {
  components: {
    [Col.name]: Col,
    [Row.name]: Row,
	[Image.name]: Image,
	[Icon.name]: Icon
  },
  data() {
    return {};
  },
  methods: {
    navigate(path) {
		this.$router.push(path)
	},
  },
};
</script>

<style lang="less">
.menu-row{
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
