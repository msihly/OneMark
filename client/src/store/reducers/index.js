import { combineReducers } from "redux";
import account from "./account.js";
import bookmarks from "./bookmarks.js";
import menus from "./menus.js";
import modals from "./modals.js";
import inputs from "./inputs.js";
import panels from "./panels.js";

const rootReducer = combineReducers({ account, bookmarks, menus, modals, inputs, panels });

export default rootReducer;