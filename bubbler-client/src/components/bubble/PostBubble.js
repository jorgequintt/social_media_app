import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../utils/MyButton";

//MUI
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

//Redux
import { connect } from "react-redux";
import { postBubble } from "../../redux/actions/dataActions";

const styles = (theme) => ({
   ...theme.myClasses,
   submitButton: {
      position: "relative",
      float: "right",
      margin: "10px 0px",
   },
   progressSpinner: {
      position: "absolute",
   },
   closeButton: {
      position: "absolute",
      left: "91%",
      top: "6%",
   },
});

export class PostBubble extends Component {
   state = {
      open: false,
      body: "",
   };

   handleOpen = () => {
      this.setState({ open: true });
   };

   handleClose = () => {
      this.setState({ open: false, body: "" });
   };

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   };

   handleSubmit = (event) => {
      event.preventDefault();
      const body = this.state.body;
      this.props.postBubble({ body });
   };

   componentDidUpdate = (prevProps, prevState) => {
      if (
         Object.keys(this.props.UI.errors).length === 0 &&
         !this.props.UI.loading &&
         prevProps.UI.loading
      ) {
         this.handleClose();
      }
   };

   render() {
      const {
         classes,
         UI: { errors, loading },
      } = this.props;

      return (
         <Fragment>
            <MyButton onClick={this.handleOpen} tip="Post a bubble">
               <AddIcon />
            </MyButton>
            <Dialog
               open={this.state.open}
               onClose={this.handleClose}
               fullWidth
               maxWidth="sm"
            >
               <MyButton
                  tip="Close"
                  onClick={this.handleClose}
                  tipClassName={classes.closeButton}
               >
                  <CloseIcon />
               </MyButton>
               <DialogTitle>Post a new bubble</DialogTitle>
               <DialogContent>
                  <form onSubmit={this.handleSubmit}>
                     <TextField
                        name="body"
                        type="text"
                        label="Bubble"
                        placeholder="What do you want to say?"
                        multiline
                        rows="3"
                        fullWidth
                        error={!!errors.body}
                        helperText={errors.body}
                        className={classes.textField}
                        onChange={this.handleChange}
                     ></TextField>
                     <Button
                        type="submit"
                        className={classes.submitButton}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                     >
                        Submit
                        {loading && (
                           <CircularProgress
                              size={30}
                              className={classes.progressSpinner}
                           ></CircularProgress>
                        )}
                     </Button>
                  </form>
               </DialogContent>
            </Dialog>
         </Fragment>
      );
   }
}

PostBubble.propTypes = {
   postBubble: PropTypes.func.isRequired,
   UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   UI: state.UI,
});

export default connect(mapStateToProps, { postBubble })(
   withStyles(styles)(PostBubble)
);
