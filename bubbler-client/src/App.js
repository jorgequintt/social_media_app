import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeObj from "./utils/theme";
import AuthRoute from "./utils/AuthRoute";
import jwtDecode from "jwt-decode";
import axios from "axios";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import "./App.css";
// Layout
import NavBar from "./components/layout/NavBar";
// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";
// Redix
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

axios.defaults.baseURL =
   "https://us-east1-bubbler-671eb.cloudfunctions.net/api";
// "http://localhost:5000/bubbler-671eb/us-east1/api";

const theme = createMuiTheme(themeObj);

const token = localStorage.FBIdToken;
if (token) {
   const decoded = jwtDecode(token);
   if (Date.now() > decoded.exp * 1000) {
      // if expired
      store.dispatch(logoutUser());
   } else {
      store.dispatch({ type: SET_AUTHENTICATED });
      axios.defaults.headers.common["Authorization"] = token;
      store.dispatch(getUserData());
   }
}

function App() {
   return (
      <MuiThemeProvider theme={theme}>
         <Provider store={store}>
            <Router>
               <div className="container">
                  <NavBar />
                  <Switch>
                     <Route exact path="/" component={home} />
                     <AuthRoute exact path="/login" component={login} />
                     <AuthRoute exact path="/signup" component={signup} />
                     <Route exact path="/user/:userName" component={user} />
                     <Route
                        exact
                        path="/user/:userName/bubble/:bubbleId"
                        component={user}
                     />
                  </Switch>
               </div>
            </Router>
         </Provider>
      </MuiThemeProvider>
   );
}

export default App;
