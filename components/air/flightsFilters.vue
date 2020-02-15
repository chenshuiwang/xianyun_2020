<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            :label="item.name"
            :value="item.size"
            v-for="(item,index) in sizeOptions"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <span>{{filter}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      sizeOptions: [
        { name: "大", size: "L" },
        { name: "中", size: "M" },
        { name: "小", size: "S" }
      ]
    };
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
    //   let newFlights = this.data.flights.filter(v => {
    //     return v.org_airport_name == value;
    //   });
    //   this.$emit("filterData", newFlights);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
    //   console.log(value);
    //   let [from, to] = value.split(",");
    //   let newFlights = this.data.flights.filter(v => {
    //     let [start, end] = v.dep_time.split(":");
    //     return +start >= +from && +start < +to;
    //   });
    //   this.$emit("filterData", newFlights);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
    //   let newFlights = this.data.flights.filter(v => {
    //     return v.airline_name == value;
    //   });
    //   this.$emit("filterData", newFlights);
    },

    // 选择机型时候触发
    handleAirSize(value) {
    //   let newFlights = this.data.flights.filter(v => {
    //     return v.plane_size == value;
    //   });
    //   this.$emit("filterData", newFlights);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
        this.flightTimes = '',
        this.company = '',
        this.airSize = '',
        this.airport = ''
    }
  },
  computed: {
    filter() {
        //console.log(213)
      let newFlights = this.data.flights.filter(v => {
        let valid = true;
        if(this.company && this.company != v.airline_name){
            valid = false
        }
        if(this.airport && this.airport != v.org_airport_name){
            valid = false
        }
        if(this.airSize && this.airSize != v.plane_size){
            valid = false
        }
        let [from, to] = this.flightTimes.split(",");
        let [start, end] = v.dep_time.split(":");
        if(this.flightTimes && (+start < +from || +start >= +to)){
            valid = false
        }
        return valid;
      });
      this.$emit("filterData", newFlights);
      return '';
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>