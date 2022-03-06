import { createStore, createLogger } from "vuex";
import state from "./state";
import mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";
const debug = process.env.NODE_ENV != "production";
// 创建一个新的 store 实例
const store = createStore({
  state,
  mutations,
  getters,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
