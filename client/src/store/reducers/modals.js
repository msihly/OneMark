import * as types from "../actions/types";

export default function modal(state = [], action) {
    switch (action.type) {
        case types.MODAL_OPENED: {
            const { id } = action.payload;
            return [...state, { id, isOpen: true }];
        } case types.MODAL_CLOSED: {
            const { id } = action.payload;
            return state.filter(modal => modal.id !== id);
        } default: {
            return state;
        }
    }
}