import * as types from "../actions/types";

export default function menus(state = {}, action) {
    switch (action.type) {
        case types.ACCOUNT_RETRIEVED: {
            const { info } = action.payload;
            return { ...state, ...info };
        } case types.ACCOUNT_UPDATED: {
            const { username, email } = action.payload;
            return { ...state, username, email };
        } default: {
            return state;
        }
    }
}