import { createStore, applyMiddleware } from "redux"
import logger from "redux-logger"

import rootReducer from "./rootReducer"

// convert object to string and store in localStorage
function saveToLocalStorage(state) {
    try {
        const serialisedState = JSON.stringify(state);
        localStorage.setItem("persistantState", serialisedState);
    } catch (e) {
        console.warn(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serialisedState = localStorage.getItem("persistantState");
        if (serialisedState === null) return undefined;
        return JSON.parse(serialisedState);
    } catch (e) {
        console.warn(e);
        return undefined;
    }
}

const store = createStore(rootReducer, loadFromLocalStorage(), applyMiddleware(logger))
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store
