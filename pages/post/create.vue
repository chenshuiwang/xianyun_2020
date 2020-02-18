<template>
  <el-row class="wrapper" type="flex" justify="space-between">
    <div class="main">
      <h2>发表新攻略</h2>
      <p class="share">分享你的个人游记，让更多人看到哦！</p>
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <!-- 编辑器 -->
        <template>
          <div id="app">
            <VueEditor :config="config" ref="myeditor" />
          </div>
        </template>
        <!-- 选择城市 -->
        <el-form-item label="选择城市" label-width="80px" style="width:300px">
          <el-autocomplete
            v-model="departCity"
            :fetch-suggestions="queryDepartSearch"
            placeholder="请选择游玩城市"
            @select="handleDepartSelect"
            class="el-autocomplete"
            @blur="departBlur"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="font-size:12px" @click="add">发布</el-button>
          <span class="save">
            或者&nbsp;
            <a href="javascirpt:;" @click="save">保存到草稿</a>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <!-- 侧边栏 -->
    <div class="aside">
      <div class="title">草稿箱（{{$store.state.post.draft.length}}）</div>
      <div 
        class="draft" 
         v-for="(item,index) in $store.state.post.draft" 
         :key="index">
        <span >{{item}}</span>
        <i class="el-icon-edit"></i>
      </div>
    </div>
  </el-row>
</template>

<script>
import "quill/dist/quill.snow.css";
let VueEditor;

if (process.browser) {
  VueEditor = require("vue-word-editor").default;
}
export default {
  name: "app",
  components: {
    VueEditor
  },
  mounted() {
    // this.$axios({
    //   url:'/posts',
    //   data:{
    //     city: '韶关市'
    //   }
    // }).then(res => {
    //   console.log(res)
    // })
  },
  data() {
    return {
      form: {
        title: "",
        content: "",
        city: ""
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: "http://127.0.0.1:1337/upload",
          name: "files",
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert("http://127.0.0.1:1337" + res.data[0].url);
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: "http://127.0.0.1:1337/upload",
          name: "files",
          uploadSuccess(res, insert) {
            insert("http://127.0.0.1:1337" + res.data[0].url);
          }
        }
      },
      departCity: "",
      departCode: "",
      defartData: []
    };
  },
  methods: {
    //发布攻略
    add() {
      console.log(this.form.content);
      if (this.form.title.trim().length === 0) {
        this.tip("标题");
        return;
      }
      if (
        this.$refs.myeditor.editor.root.innerText.trim().length === 0 &&
        this.$refs.myeditor.editor.root.innerHTML.indexOf("img") === -1 &&
        this.$refs.myeditor.editor.root.innerHTML.indexOf("video") === -1
      ) {
        this.tip("内容");
        return;
      }
      if (this.form.city.trim().length === 0) {
        this.tip("城市");
        return;
      }
      this.form.content = this.$refs.myeditor.editor.root.innerHTML;
      this.$axios({
        url: "/posts",
        method: "POST",
        data: this.form,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        console.log(res);
        if(res.data.message === "新增成功"){
          this.$message.success(res.data.message)
        }else{
          this.$message.error(res.data.message)
        }
      });
    },
    // 保存草稿
    save() {
      this.form.content = this.$refs.myeditor.editor.root.innerHTML;
      // this.$store.commit("post/setDraft", this.form);
    },
    // 不输入内容提示
    tip(name) {
      this.$alert(`${name}不能为空`, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    //选择城市关键字联线 
    queryDepartSearch(value, cb) {
      if (!value) {
        this.defartData = [];
        cb([]);
        return;
      }
      this.querySearch(this.departCity).then(arr => {
          this.defartData = arr;
          cb(arr);
      })
    },
    // 发请求获取关键字
    querySearch(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        const arr = res.data.data.map(v => {
          v.value = v.name;
          return v;
        });
        return arr;
      });
    },
    // 选择提示关键字触发
    handleDepartSelect(item) {
      this.departCity = item.value;
      this.departCode = item.sort;
      this.form.city = item.value;
    },
    // 不选关键字失去焦点时触发
    departBlur() {
      if (this.defartData.length != 0) {
        this.departCity = this.defartData[0].value;
        this.departCode = this.defartData[0].code;
      }
    },
  }
};
</script>

<style lang='less' scoped>
.wrapper {
  width: 1000px;
  // height: 750px;
  margin: 0 auto;
  padding: 20px 0;
  .aside {
    width: 200px;
    padding: 10px;
    border: 1px solid #ddd;
    color: #666;
    position: absolute;
    right: 0;
  }
  h2 {
    font-weight: normal;
  }
  .share {
    font-size: 12px;
    margin: 10px 0;
    color: #999;
  }
  .el-form {
    width: 750px;
    #app {
      width: 100%;
      height: 458px;
      #vue-editor-wrapper {
        height: 400px;
      }
    }
    .save {
      margin-left: 10px;
      font-size: 14px;
      a {
        color: orange;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>