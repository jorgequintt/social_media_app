import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MyButton from "../../utils/MyButton";
import PostBubble from "../bubble/PostBubble";
import Notifications from "../layout/Notifications";
import LogoImg from "../../images/white_logo.png";
import AboutButton from "./AboutButton";

// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import HomeIcon from "@material-ui/icons/Home";

//Redux
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";

const styles = {
   title: {
      flexGrow: 1,
      textDecoration: "none",
      color: "#FFFFFF",
      display: "flex",
   },
   logo: {
      width: 30,
      height: "auto",
      margin: "0 13px",
   },
   appBar: {
      flexDirection: "unset",
   },
};

class NavBar extends Component {
   render() {
      const { authenticated, classes } = this.props;
      return (
         <AppBar className={classes.appBar}>
            <Toolbar className="nav-container">
               <Link to="/" className={classes.title}>
                  <img
                     src={LogoImg}
                     className={classes.logo}
                     alt="Bubbler Logo"
                  />
                  <Typography variant="h5">Bubbler</Typography>
               </Link>
               {authenticated ? ( // Authenticated
                  <Fragment>
                     <PostBubble />
                     <Link to="/">
                        <MyButton tip="Home">
                           <HomeIcon />
                        </MyButton>
                     </Link>
                     <Notifications />
                     <AboutButton />
                  </Fragment>
               ) : (
                  // Not authenticated
                  <Fragment>
                     <Button color="inherit" component={Link} to="/">
                        Home
                     </Button>
                     <Button color="inherit" component={Link} to="/login">
                        Login
                     </Button>
                     <Button color="inherit" component={Link} to="/signup">
                        Signup
                     </Button>
                     <AboutButton />
                  </Fragment>
               )}
            </Toolbar>
         </AppBar>
      );
   }
}

NavBar.propTypes = {
   authenticated: PropTypes.bool.isRequired,
   classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(NavBar));
