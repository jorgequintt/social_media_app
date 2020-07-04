import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../utils/MyButton";

//Redux
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";

//MUI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
   ...theme.myClasses,
   button: {
      float: "right",
   },
});

class EditDetails extends Component {
   state = {
      bio: "",
      website: "",
      location: "",
      open: false,
   };

   mapUserDetailsToState = (credentials) => {
      this.setState({
         bio: credentials.bio ? credentials.bio : "",
         website: credentials.website ? credentials.website : "",
         location: credentials.location ? credentials.location : "",
      });
   };

   componentDidMount() {
      const { credentials } = this.props.user;
      this.mapUserDetailsToState(credentials);
   }

   handleOpen = (event) => {
      this.setState({ open: true });
   };

   handleClose = (event) => {
      this.setState({ open: false });
   };

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   };

   handleSubmit = (event) => {
      const userDetails = {
         bio: this.state.bio,
         website: this.state.website,
         location: this.state.location,
      };
      this.props.editUserDetails(userDetails);
      this.handleClose();
   };

   render() {
      const { classes } = this.props;
      return (
         <Fragment>
            <MyButton
               onClick={this.handleOpen}
               tip="Edit details"
               btnClassName={classes.button}
            >
               <EditIcon color="primary" />
            </MyButton>
            <Dialog
               open={this.state.open}
               onClose={this.handleClose}
               fullWidth
               maxWidth="sm"
            >
               <DialogTitle>Edit your details</DialogTitle>
               <DialogContent>
                  <form>
                     <TextField
                        name="bio"
                        type="text"
                        label="Bio"
                        multiline
                        rows="3"
                        placeholder="A short bio about yourself"
                        className={classes.textField}
                        value={this.state.bio}
                        onChange={this.handleChange}
                        fullWidth
                     ></TextField>
                     <TextField
                        name="website"
                        type="text"
                        label="Website"
                        placeholder="Your website"
                        className={classes.textField}
                        value={this.state.website}
                        onChange={this.handleChange}
                        fullWidth
                     ></TextField>
                     <TextField
                        name="location"
                        type="text"
                        label="Location"
                        placeholder="Your location"
                        className={classes.textField}
                        value={this.state.location}
                        onChange={this.handleChange}
                        fullWidth
                     ></TextField>
                  </form>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                     Cancel
                  </Button>
                  <Button onClick={this.handleSubmit} color="primary">
                     Submit
                  </Button>
               </DialogActions>
            </Dialog>
         </Fragment>
      );
   }
}

EditDetails.propTypes = {
   editUserDetails: PropTypes.func.isRequired,
   classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   user: state.user,
});

const mapActionsToProps = {
   editUserDetails,
};

export default connect(
   mapStateToProps,
   mapActionsToProps
)(withStyles(styles)(EditDetails));
