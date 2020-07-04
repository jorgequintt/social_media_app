import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

const reducers = combineReducers({
   user: userReducer,
   data: dataReducer,
   UI: uiReducer
});

const initialState = {};
const middleware = [thunk];

let devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
if( process.env.NODE_ENV === "production" ) {
   // If prod, we set devTools as a function that returns the passed composed function made by compose()
   devTools = passedComposedFunction => {return passedComposedFunction};
}

const store = createStore(
   reducers, initialState,
   compose(
      applyMiddleware(...middleware),
      devTools
   )
);

export default store;
