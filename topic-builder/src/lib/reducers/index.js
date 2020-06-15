import { combineReducers } from "redux";
import dataset from "./dataset";
import labelSet from "./labelSet";
import layout from "./layout";
import filter from "./filter";
import ignoredKeywords from "./ignoredKeywords";

export default combineReducers({
    dataset,
    labelSet,
    layout,
    filter,
    ignoredKeywords
});
