import { combineReducers } from "redux";
import account from "./account";
import bookmarks from "./bookmarks";
import menus from "./menus";
import modals from "./modals";
import inputs from "./inputs";
import panels from "./panels";

const rootReducer = combineReducers({ account, bookmarks, menus, modals, inputs, panels });

export default rootReducer;