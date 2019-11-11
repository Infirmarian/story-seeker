import { createStore } from "redux";
import { rootReducer } from "./reducers";

const store = createStore(rootReducer);
console.log(store.getState());
export default store;
