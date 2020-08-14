import * as types from "../actionTypes.js";

const initState = [];

export default function menus(state = initState, action) {
    const nonParents = state.filter(menu => menu.id === action.payload.parent);
    switch (action.type) {
        case types.MENU_OPENED:
            return [...nonParents, {id: action.payload.id, parent: action.payload.parent, isOpen: true}];
        case types.MENU_CLOSED:
            return nonParents.filter(menu => menu.id !== action.payload.id);
        case types.EXTERNAL_CLICK:
            return nonParents;
        default:
            return state;
    }
}