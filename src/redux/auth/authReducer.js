import { CHANGE_ROLE, EDIT_TOKEN, LOG_IN, LOG_OUT } from "./authTypes";

const inialAuthState = {
    loggedIn: false,
    email: null,
    role: null,
    token: null,
    id: null,


}

const authReducer = (state = inialAuthState, action) => {
    switch (action.type) {
        case LOG_IN: return {
            ...state,
            loggedIn: true,
            email: action.email,
            role: action.role,
            token: action.token,
            id: action.id,


        }
        case LOG_OUT: return {
            ...state,
            loggedIn: false,
            email: null,
            role: null,
            token: null,
            id: null,


        }
        case CHANGE_ROLE: return {
            ...state,
            role: action.role
        }
        case EDIT_TOKEN: return {
            ...state,
            token: action.token
        }
        default: return state
    }
}
export default authReducer