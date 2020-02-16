export const state = () => {
   return {
        history:[],
        allPrice: 0
   } 
} 
export const mutations = {
    setHistory(state,data){
        state.history.unshift(data);
        state.history.length = 5;
    },
    setAllPrice(state,data){
        state.allPrice = data;
    }
}