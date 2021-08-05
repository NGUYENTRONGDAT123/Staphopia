import { combineReducers } from "redux";

import Auth from "./reducers/AuthReducer";
import Visualization from "./reducers/VisualizationReducer";

export default combineReducers({
  Auth,
  Visualization,
});
