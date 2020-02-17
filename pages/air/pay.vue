<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{$store.state.air.allPrice}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      timer: "",
      orderNumber: ""
    };
  },
  mounted() {
    setTimeout(() => {
      const { id } = this.$route.query;
      this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        const urlCode = res.data.payInfo.code_url;
        this.orderNumber = res.data.payInfo.order_no;
        const canvas = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(canvas, urlCode, {
          width: 200
        });
        this.isPay();
      });
    }, 0);
  },
  methods: {
    isPay() {
      this.timer = setInterval(() => {
        const id = this.$route.query.id;
        this.$axios({
          url: "airorders/checkpay",
          method: "POST",
          data: {
            id,
            nonce_str: this.$store.state.air.allPrice,
            out_trade_no: this.orderNumber
          },
          headers: {
            Authorization: `Bearer ` + this.$store.state.user.userInfo.token
          }
        }).then(res => {
          console.log(res);
          if (res.data.statusTxt === "支付完成") {
            clearInterval(this.timer);
            this.$alert("已支付0.01元", "支付成功", {
              confirmButtonText: "确定",
              callback: action => {
                this.$message({
                  type: "success",
                  message: `action: ${action}`
                });
              }
            });
          }
        });
      }, 3000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>