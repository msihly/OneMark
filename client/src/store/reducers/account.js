import * as types from "../actionTypes.js";

const initState = {};

export default function menus(state = initState, action) {
    switch (action.type) {
        case types.ACCOUNT_RETRIEVED: {
            return { ...state, ...action.payload.info };
        } case types.ACCOUNT_UPDATED: {
            const { username, email } = action.payload;
            return { ...state, username, email };
        } default: {
            return state;
        }
    }
}