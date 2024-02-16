import React from "react";
import { combineReducers } from "redux";
import Auth from "./reducer/auth";



const rootReducer = combineReducers({
  auth: Auth,
});

export default rootReducer;
