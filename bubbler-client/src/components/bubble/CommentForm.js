import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// REDUX
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
   ...theme.myClasses,
});

export class CommentForm extends Component {
   state = {
      body: "",
   };

   handleChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
   };

   handleSubmit = (event) => {
      event.preventDefault();
      this.props.submitComment(this.props.bubbleId, { body: this.state.body });
   };

   componentDidupdate = (prevProps, prevState) => {
      if (
         !prevProps.UI.loading &&
         !!this.props.UI.loading &&
         Object.keys(this.props.UI.errors).length === 0
      ) {
         this.setState({ body: "" });
      }
   };

   render() {
      const {
         classes,
         authenticated,
         UI: { errors },
      } = this.props;

      const commentFormMarkup = authenticated ? (
         <Grid item sm={12} style={{ textAlign: "center" }}>
            <form onSubmit={this.handleSubmit}>
               <TextField
                  name="body"
                  type="text"
                  label="Comment on bubble"
                  error={!!errors.comment}
                  helperText={errors.comment}
                  value={this.state.body}
                  onChange={this.handleChange}
                  className={classes.textField}
                  fullWidth
               />
               <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
               >
                  Submit
               </Button>
            </form>
         </Grid>
      ) : null;

      return commentFormMarkup;
   }
}

CommentForm.propTypes = {
   UI: PropTypes.object.isRequired,
   authenticated: PropTypes.bool.isRequired,
   classes: PropTypes.object.isRequired,
   submitComment: PropTypes.func.isRequired,
   bubbleId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
   UI: state.UI,
   authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
   withStyles(styles)(CommentForm)
);
