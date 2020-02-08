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
        <el-row type="flex" align="middle" class="login">
          <el-dropdown v-if="$store.state.user.userInfo.token">
            <el-row type="flex" align="middle" class="el-dropdown-link">
              <nuxt-link to="#">
                <img :src="$axios.defaults.baseURL+$store.state.user.userInfo.user.defaultAvatar" />
                {{$store.state.user.userInfo.user.nickname}}
              </nuxt-link>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-row>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <nuxt-link to="#">个人中心</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="handleLogout">退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <nuxt-link to="/user/login" v-else>登录/注册</nuxt-link>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleLogout() {}
  },
  mounted() {}
};
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
      &:hover,
      &:focus,
      &:active {
        border-bottom: 5px #409eff solid;
        color: #409eff;
      }
    }
    /deep/.nuxt-link-exact-active {
      background-color: #409eff;
      color: #fff !important;
    }
  }
  .message {
    height: 36px;
    line-height: 1;
    cursor: pointer;
    .el-icon-bell {
      margin-right: 2px;
      font-size: 18px;
    }
  }

  .el-dropdown-link {
    margin-left: 20px;

    &:hover {
      img {
        border-color: #409eff;
      }
    }

    a {
      display: block;
    }

    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      border: 2px #fff solid;
      border-radius: 50px;
    }
  }

  .account-link {
    font-size: 14px;
    margin-left: 10px;
    color: #666;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
</style>