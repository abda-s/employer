import { CHANGE_ROLE, EDIT_TOKEN, LOG_IN, LOG_OUT } from "./authTypes"

export const logIn = (email, role, token, id) => {
    return {
        type: LOG_IN,
        email,
        role,
        token,
        id,
    }
}

export const logOut = () => {
    return {
        type: LOG_OUT
    }
}
export const changeRole = (role) => {
    return {
        type: CHANGE_ROLE,
        role
    }
}

export const editToken = (token) => {
    return {
        type: EDIT_TOKEN,
        token
    }
}

