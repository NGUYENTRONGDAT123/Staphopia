import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import combineReducers from './combineReducer'
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(
  combineReducers,
  composeWithDevTools(applyMiddleware(thunk))
)