import * as types from "../actions/types";

export default function menus(state = [], action) {
    switch (action.type) {
        case types.PANEL_CREATED: {
            return [...state, action.payload];
        } case types.PANEL_UPDATED: {
            const { id, value } = action.payload;
            return state.map(panel => panel.id === id ? { ...panel, value } : panel);
        } case types.PANEL_DELETED: {
            const { id } = action.payload;
            return state.filter(panel => panel.id !== id);
        } default: {
            return state;
        }
    }
}