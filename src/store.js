import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./combineReducer";
import {thunk} from "redux-thunk"

const INITIAL_STATE = {};
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: true })
  : compose;

const store = createStore(
  rootReducer,
  INITIAL_STATE,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
