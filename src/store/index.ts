import { createStore } from 'vuex'
import gameStore from "./modules/GameStore";


export default createStore({
  modules: {
    gameStore,
  }
})
