import * as types from "../actionTypes.js";

const initState = [];

export default function inputs(state = initState, action) {
    switch (action.type) {
        case types.INPUT_CREATED:
            return [...state, {id: action.payload.id, value: action.payload.value}];
        case types.INPUT_UPDATED:
            return state.map(input => {
                return input.id === action.payload.id ? {...input, value: action.payload.value} : input;
            });
        case types.INPUT_DELETED:
            return state.filter(input => input.id !== action.payload.id);
        case types.IMAGE_INPUT_CREATED:
            return [...state, {
                id: action.payload.id,
                value: action.payload.value,
                isImageRemoved: false
            }];
        case types.IMAGE_INPUT_UPDATED:
            return state.map(input => {
                return input.id === action.payload.id ? {...input,
                    value: action.payload.value,
                    isImageRemoved: action.payload.isImageRemoved
                } : input;
            });
        case types.TAG_ADDED:
            return state.map(input => {
                return input.id === action.payload.id ? {...input, value: [...input.value, action.payload.value]} : input;
            });
        case types.TAG_REMOVED:
            return state.map(input => {
                return input.id === action.payload.id ? {...input, value: input.value.filter(tag => tag !== action.payload.value)} : input;
            });
        default:
            return state;
    }
}