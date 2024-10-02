import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import cvReducer from "./cv/cvReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    cv: cvReducer

})

export default rootReducer