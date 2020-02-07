<template>
  <div>
    <Header></Header>
    <nuxt />
    <Footer></Footer>
  </div>
</template>
<script>
import Header from '../components/header'
import Footer from '../components/footer'
export default {
  components:{
    Header,Footer
  },
  data(){
    return{

    }
  }
}
</script>
<style lang='less'>
*{
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
}
a{
  color: inherit;
}
em,i{
  font-style: normal;
}

</style>
