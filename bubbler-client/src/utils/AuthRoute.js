import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
   // return functional component to render
   const renderHandler = (props) => {
      if (authenticated) return <Redirect to="/" />;
      else return <Component {...props} />;
   };

   return <Route {...rest} render={renderHandler} />;
};

AuthRoute.propTypes = {
   authenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
   authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(AuthRoute);
