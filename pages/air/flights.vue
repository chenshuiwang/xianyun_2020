<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightData" @filterData='filterData'></FlightsFilters>

        <!-- 航班头部布局 -->
        <FlightsListHead></FlightsListHead>

        <!-- 航班信息 -->
        <div>
          <!-- 航班列表 -->
          <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item"></FlightsItem>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="flightData.total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside></FlightsAside>
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead";
import moment from "moment";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from '@/components/air/flightsFilters'
import FlightsAside from '@/components/air/flightsAside'
export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      flightData: {
        flights:[],
        info: {},
        options:{}
      },
      cacheFlightData: {
        flights:[],
        info: {},
        options:{}
      },
      pageIndex: 1,
      pageSize: 5
    };
  },
  methods: {
    getData() {
      this.$axios({
        url: "airs",
        params: this.$route.query
      }).then(res => {
        console.log(res);
        this.cacheFlightData = {...res.data}
        this.flightData = res.data;
      });
    },
    handleSizeChange(value){
      this.pageSize = value;
      this.pageIndex = 1;
    },
    handleCurrentChange(value){
      this.pageIndex = value;
    },
    filterData(value){
      //console.log(value);
      this.flightData.flights = value;
      this.flightData.total = value.length
    }
  },
  mounted() {
    this.getData();
  },
  computed:{
    dataList(){
      if(!this.flightData.flights){
        return []
      }
      const arr = this.flightData.flights.slice(
        (this.pageIndex-1) * this.pageSize,this.pageIndex * this.pageSize
      )
      return arr;
    }
  },
  watch:{
    $route(){
      this.getData()
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>