<template>
  <div class="search-form">
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          @blur="departBlur"
        ></el-autocomplete>
        <!-- 头部tab切换 -->
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDesSelect"
          class="el-autocomplete"
          @blur="desBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
          :picker-options="pickerOptions1"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      },
      defartData: [],
      desData: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      }
    };
  },
  methods: {
    queryDepartSearch(value, cb) {
      if (!value) {
        this.defartData = [];
        cb([]);
        return;
      }
      // this.$axios({
      //   url: "/airs/city",
      //   params: {
      //     name: value
      //   }
      // }).then(res => {
      //   //console.log(res);
      //   const arr = res.data.data.map(v => {
      //     v.value = v.name.replace("市", "");
      //     return v;
      //   });
      //   this.defartData = arr;
      //   cb(arr);
      // });
      this.querySearch(this.form.departCity).then(arr => {
          this.defartData = arr;
          cb(arr);
      })
    },
    queryDestSearch(value, cb) {
      if (!value) {
        this.desData = [];
        cb([]);
        return;
      }
      this.querySearch(this.form.destCity).then(arr => {
        this.desData = arr;
        cb(arr);
      });
    },
    querySearch(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        //console.log(res);
        const arr = res.data.data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        return arr;
      });
    },
    handleDepartSelect(item) {
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },
    handleDesSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },
    // 确认选择日期时触发
    handleDate(value) {
      this.form.departDate = moment(value).format("YYYY/MM/DD");
      //console.log(this.form.departDate);
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCode = destCode;
      this.form.departCity = destCity;
      this.form.destCode = departCode;
      this.form.destCity = departCity;
    },

    // 提交表单是触发
    handleSubmit() {
      if (!this.form.departCity) {
        this.$message.error("请输入开始城市");
        return;
      }
      if (!this.form.destCity) {
        this.$message.error("请输入到达城市");
        return;
      }
      if (!this.form.departDate) {
        this.$message.error("请选择时间");
        return;
      }
      this.$router.push({
        path: "/air/flights",
        query: this.form
      });
      this.$store.commit('air/setHistory',this.form)
    },
    departBlur() {
      if (this.defartData.length != 0) {
        this.form.departCity = this.defartData[0].value;
        this.form.departCode = this.defartData[0].code;
      }
    },
    desBlur() {
      if (this.desData.length != 0) {
        this.form.destCity = this.desData[0].value;
        this.form.destCode = this.desData[0].code;
      }
    },
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$confirm("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>