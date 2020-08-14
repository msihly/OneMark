import * as types from "../actionTypes.js";

const initState = [];

export default function menus(state = initState, action) {
    switch (action.type) {
        case types.PANEL_CREATED:
            return [...state, action.payload];
        case types.PANEL_UPDATED:
            return state.map(panel => {
                return panel.id === action.payload.id ? {...panel, value: action.payload.value} : panel;
            });
        case types.PANEL_DELETED:
            return state.filter(panel => panel.id !== action.payload.id);
        default:
            return state;
    }
}