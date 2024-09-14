import { combineReducers } from "redux";
import Auth from "./reducer/auth";
import institutionsReducer from "./reducer/institution";
import userReducer from "./reducer/user";
import programsReducer from "./reducer/program";

const rootReducer = combineReducers({
  auth: Auth,
  institutions: institutionsReducer,
  user: userReducer,
  users: userReducer,
  programs: programsReducer,
});

export default rootReducer;
