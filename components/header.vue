<template>
  <div class="container">
    <div class="header">
      <el-row type="flex" justify="space-between" align="middle">
        <div class="logo">
          <nuxt-link to="/">
            <img src="http://157.122.54.189:9093/images/logo.jpg" alt />
          </nuxt-link>
        </div>
        <el-row class="cate" type="flex">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/post">旅游攻略</nuxt-link>
          <nuxt-link to="/hotel">酒店</nuxt-link>
          <nuxt-link to="/air">国内机票</nuxt-link>
        </el-row>
        <div class="login">
          <nuxt-link to="/user/login">登录/注册</nuxt-link>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='less' scoped>
.container {
  width: 1000px;
  margin: 0 auto;
}
.header {
  height: 60px;
  line-height: 60px;
  .logo {
    width: 156px;
    img {
      width: 100%;
      display: block;
    }
  }
  .cate {
    flex: 1;
    margin: 0 20px;
    a {
      display: block;
      padding: 0 20px;
      box-sizing: border-box;
      height: 60px;
      &:hover {
        border-bottom: 5px #409eff solid;
        color: #409eff;
      }
    }
    .nuxt-link-active {
      background-color: #409eff;
      color: #fff !important;
    }
  }
  .login {
    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
</style>