import React from "react";
import ReactDOM from "react-dom";
import thunk from 'redux-thunk';
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import burgerBuilderReducer from "./store/reducers/burgerBuilder";
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// when using multiple reducer, state.value should now be state.nameOfReducer.value
// in mapDispatchToProps
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer,
})

const store = createStore(
  rootReducer,
  composeEnchancers(applyMiddleware(thunk)),
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
