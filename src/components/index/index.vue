<template>
  <div>
    <van-row>
      <div class="user-info">
        <div class="user-none" v-if="userInfo.name == ''" @click="showLoginBox">
          <van-icon name="user-o" size="60" color="rgba(25, 137, 250,0.8)" />
          <div style="font-size: 14px; color: #b3b1b1">未登录</div>
        </div>
        <div class="user" v-else>
          <van-icon name="user-o" size="60" color="#b6d8c6" />
          <div>{{ userInfo.name }}</div>
        </div>
      </div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('examlist')"
    >
      <van-icon name="records" color="blue" />
      <div>开始考试</div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('mocklist')"
    >
      <van-icon name="description" />
      <div>套题模拟</div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('questions')"
    >
      <van-icon name="points" />
      <div>题库背题</div>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      align="center"
      class="menu-row"
      @click="navigate('evaluation')"
    >
      <van-icon name="play-circle-o" />
      <div>语音测评</div>
    </van-row>
    <van-dialog
      v-model="show"
      title="登录"
      show-cancel-button
      confirmButtonColor="#1989fa"
      cancelButtonColor="#00000080"
      confirmButtonText="确定"
      :beforeClose="login"
    >
      <!-- <img src="https://img01.yzcdn.cn/vant/apple-3.jpg" /> -->
      <div style="padding: 0 16px">
        <van-field v-model="name" label="用户名" placeholder="请输入用户名" />
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Col, Row, Image, Icon, Dialog, Field, Toast } from "vant";
export default {
  components: {
    [Col.name]: Col,
    [Row.name]: Row,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      userInfo: {
        name: "",
        id: "",
      },
      name: "",
      password: "",
      show: false,
    };
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
    },
    showLoginBox() {
      this.show = true;
    },
    login(action, done) {
      if (action === "confirm") {
        if (this.name.trim() == "" || this.password.trim() == "") {
          Toast("用户名或密码不能为空!");
          done(false);
        } else {
          setTimeout(done, 2000);
        }
      } else {
        done();
      }
    },
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
.user-info {
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: white;
  margin-bottom: 12px;
}
</style>
