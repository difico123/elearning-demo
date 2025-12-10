import auth from "./auth.reducer";
import app from "./app.reducer";
import userList from "./userlist.reducer";
import courseList from "./courselist.reducer";

import { combineReducers } from "redux";

const reducers = combineReducers({
  auth: auth,
  app: app,
  userList: userList,
  courseList: courseList,
});

export default (state, actions) => reducers(state, actions);
