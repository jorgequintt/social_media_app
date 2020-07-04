import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../../utils/MyButton";

// MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

// Redux
import { connect } from "react-redux";
import { deleteBubble } from "../../redux/actions/dataActions";

const styles = (theme) => ({
   ...theme.myClasses,
   deleteButton: {
      position: "absolute",
      right: "5px",
   },
});

class DeleteBubble extends Component {
   state = {
      open: false,
   };

   handleOpen = (event) => {
      this.setState({ open: true });
   };

   handleClose = (event) => {
      this.setState({ open: false });
   };

   deleteBubble = () => {
      this.props.deleteBubble(this.props.bubbleId);
      this.setState({ open: false });
   };

   render() {
      const { classes } = this.props;
      return (
         <Fragment>
            <MyButton
               tip="Delete Bubble"
               onClick={this.handleOpen}
               btnClassName={classes.deleteButton}
            >
               <DeleteOutline color="secondary" />
            </MyButton>
            <Dialog
               open={this.state.open}
               onClose={this.handleClose}
               fullWidth
               maxWidth="sm"
            >
               <DialogTitle>
                  Are you sure you want to delete this bubble?
               </DialogTitle>
               <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                     Cancel
                  </Button>
                  <Button onClick={this.deleteBubble} color="secondary">
                     Delete
                  </Button>
               </DialogActions>
            </Dialog>
         </Fragment>
      );
   }
}

DeleteBubble.propTypes = {
   deleteBubble: PropTypes.func.isRequired,
   classes: PropTypes.object.isRequired,
   bubbleId: PropTypes.string.isRequired,
};

export default connect(null, { deleteBubble })(
   withStyles(styles)(DeleteBubble)
);
