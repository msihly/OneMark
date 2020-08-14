import * as types from "../actionTypes.js";

const initState = [];

export default function modal(state = initState, action) {
    switch (action.type) {
        case types.MODAL_OPENED:
            return [...state, {id: action.payload.id, isOpen: true}];
        case types.MODAL_CLOSED:
            return state.filter(modal=> modal.id !== action.payload.id);
        default:
            return state;
    }
}