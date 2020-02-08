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
    }
};