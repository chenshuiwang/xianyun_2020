export const state = () => ({
    userInfo: {
        user:{}
    },
})
export const mutations = {
 setUserInfo(state,data){
    state.userInfo = data;
 }
}
export const actions = {
    login(store,data){
        return this.$axios({
            url: "/accounts/login",
            method: "POST",
            data
          }).then(res => {
            console.log(res.data);
            store.commit("setUserInfo", res.data)
          });
    },
    getCaptcha(store,text){
        return this.$axios({
            url: "/captchas",
            method: "POST",
            data: {
              tel: text
            }
          }).then(res => {
            //console.log(res.data);
            return res;
          });
    },
    register(store,data){
        return this.$axios({
            url:'/accounts/register',
            method: 'POST',
            data
        }).then(res => {
            store.commit('setUserInfo',res.data)
            return res
        })
    }
};