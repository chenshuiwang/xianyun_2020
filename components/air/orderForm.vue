<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox
            :label="`航空意外险：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    {{allPrice}}
  </div>
</template>

<script>
export default {
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users = [
        ...this.form.users,
        {
          username: "",
          id: ""
        }
      ];
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      this.$store
        .dispatch("user/getCaptcha", this.form.contactPhone)
        .then(res => {
          console.log(res);
          this.$message.success(`模拟验证码为：${res.data.code}`);
          this.form.captcha = res.data.code;
        });
    },

    // 提交订单
    handleSubmit() {
      //自定义校验用户列表
      const rules = {
        //校验用户列表
        users: {
          errMessage: "乘机人信息不能为空",
          validator: () => {
            let vali = true;
            this.form.users.forEach(v => {
              if (!v.username || !v.id) {
                vali = false;
              }
            });
            return vali;
          }
        },
        // 校验联系人
        contactName: {
          errMessage: "联系人不能为空",
          validator: () => {
            return !!this.form.contactName;
          }
        },
        // 校验手机号码
        contactPhone: {
          errMessage: "手机号不能为空",
          validator: () => {
            return !!this.form.contactPhone;
          }
        },
        // 校验验证码
        captcha: {
          errMessage: "验证码不能为空",
          validator: () => {
            return !!this.form.captcha;
            jie;
          }
        }
      };
      let valid = true;
      Object.keys(rules).forEach(v => {
        if (!valid) return;
        const item = rules[v];
        valid = item.validator();
        if (!valid) {
          this.$message.error(item.errMessage);
        }
      });
      if (!valid) return;
      //console.log(2131231)
      this.$message.success("正在生成订单，请稍后....");
      this.$axios({
        url: "/airorders",
        method: "POST",
        data: this.form,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        console.log(res);
        if(res.data.message === '订单提交成功'){
          this.$router.push({
            path: '/air/pay',
            query:{
              id:res.data.data.id
            }
          })
        }else{
          this.$message.error(res.data.message)
        }
      });
    },
    handleInsurance(id) {
      const index = this.form.insurances.indexOf(id);
      if (index > -1) {
        this.form.insurances.splice(index, 1);
      } else {
        this.form.insurances.push(id);
      }
    }
  },
  data() {
    return {
      form: {
        users: [
          {
            username: "",
            id: ""
          }
        ],
        insurances: [], //保险数据
        contactName: "", //联系人名字
        contactPhone: "", //联系人电话
        captcha: "", //验证码
        invoice: false, //发票
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      }
    };
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  //计算总价
  computed:{
    allPrice(){
      if(!this.data.seat_infos){
        return;
      }
      let price = 0;
      //加上单价
      price += this.data.seat_infos.org_settle_price;
      //加上机建燃油费
      price += this.data.airport_tax_audlet;
      //加上保险费
      this.data.insurances.forEach(v => {
        if(this.form.insurances.indexOf(v.id) > -1){
          price += v.price
        }
      })
      //乘与人数
      price *= this.form.users.length;
      this.$store.commit('air/setAllPrice',price)
      return ''
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>