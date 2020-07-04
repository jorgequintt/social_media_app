import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/main_logo.png";

//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//REDUX
import { signupUser } from "../redux/actions/userActions";
import { connect } from "react-redux";

const styles = (theme) => ({ ...theme.myClasses });

export class signup extends Component {
   constructor() {
      super();

      this.state = {
         email: "",
         password: "",
         confirmPassword: "",
         name: "",
      };
   }
   handleSubmit = (event) => {
      event.preventDefault();
      const newUserData = {
         email: this.state.email,
         password: this.state.password,
         confirmPassword: this.state.confirmPassword,
         name: this.state.name,
      };

      this.props.signupUser(newUserData, this.props.history);
   };

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   };

   render() {
      const {
         classes,
         UI: { loading, errors },
      } = this.props;
      return (
         <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
               <img src={AppIcon} alt="Bubble Icon" className={classes.image} />
               <Typography variant="h3" className={classes.pageTitle}>
                  Signup
               </Typography>
               <form noValidate onSubmit={this.handleSubmit}>
                  <TextField
                     id="email"
                     name="email"
                     type="email"
                     label="Email"
                     className={classes.textField}
                     value={this.state.email}
                     onChange={this.handleChange}
                     fullWidth
                     helperText={errors.email}
                     error={!!errors.email}
                  />
                  <TextField
                     id="password"
                     name="password"
                     type="password"
                     label="Password"
                     className={classes.textField}
                     value={this.state.password}
                     onChange={this.handleChange}
                     fullWidth
                     helperText={errors.password}
                     error={!!errors.password}
                  />
                  <TextField
                     id="confirmPassword"
                     name="confirmPassword"
                     type="password"
                     label="Confim Password"
                     className={classes.textField}
                     value={this.state.confirmPassword}
                     onChange={this.handleChange}
                     fullWidth
                     helperText={errors.confirmPassword}
                     error={!!errors.confirmPassword}
                  />
                  <TextField
                     id="name"
                     name="name"
                     type="text"
                     label="Username"
                     className={classes.textField}
                     value={this.state.name}
                     onChange={this.handleChange}
                     fullWidth
                     helperText={errors.name}
                     error={!!errors.name}
                  />
                  {!!errors.general && (
                     <Typography
                        variant="body1"
                        className={classes.customError}
                     >
                        {errors.general}
                     </Typography>
                  )}
                  <Button
                     type="submit"
                     variant="contained"
                     color="primary"
                     className={classes.button}
                     disabled={loading}
                  >
                     {loading ? (
                        <CircularProgress
                           size={30}
                           className={classes.progress}
                        />
                     ) : (
                        "Signup"
                     )}
                  </Button>
                  <br />
                  <small>
                     Already have an account? Log in{" "}
                     <Link to="/login">here</Link>
                  </small>
               </form>
            </Grid>
            <Grid item sm />
         </Grid>
      );
   }
}

signup.propTypes = {
   classes: PropTypes.object.isRequired,
   signupUser: PropTypes.func.isRequired,
   UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   UI: state.UI,
});

export default connect(mapStateToProps, { signupUser })(
   withStyles(styles)(signup)
);
