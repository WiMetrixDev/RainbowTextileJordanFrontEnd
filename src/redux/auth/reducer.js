import actions from "./actions";

const initState = {
    loading: false
}

export default function authReducer(state = initState, action) {
    switch (action.type) {
        case actions.TOGGLE_LOADER:
            console.log("toggle logger...",action.payload);
            return Object.assign({}, state, {
                loading: action.payload
            });
        default:
            return state;
    }
}
