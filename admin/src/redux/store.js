import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const middleware = [thunk];
const rootReducer = combineReducers({ store: reducers });

export const store = createStore(rootReducer, applyMiddleware(...middleware));
