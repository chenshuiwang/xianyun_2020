export const state = () => {
   return {
        history:[],
        allPrice: 0
   } 
} 
export const mutations = {
    setHistory(state,data){
        state.history.unshift(data);
        if(state.history.length > 5){
            state.history.length = 5;
        }  
    },
    setAllPrice(state,data){
        state.allPrice = data;
    }
}