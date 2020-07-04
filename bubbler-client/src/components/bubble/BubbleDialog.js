import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../utils/MyButton";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

import dayjs from "dayjs";

//MUI
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { getBubble } from "../../redux/actions/dataActions";
import { connect } from "react-redux";

const style = (theme) => ({
   ...theme.myClasses,
   profileImage: {
      maxWidth: 200,
      height: 200,
      borderRadius: "50%",
      objectFit: "cover",
   },
   dialogContent: {
      padding: 30,
   },
   closeButton: {
      position: "absolute",
      left: "90%",
   },
   expandButton: {
      position: "absolute",
      right: "5px",
      bottom: "5px",
   },
   spinnerDiv: {
      textAlign: "center",
      margin: "50px 0px",
   },
});

class BubbleDialog extends Component {
   state = {
      open: false,
      oldPath: "",
      newPath: "",
   };

   componentDidMount() {
      if (this.props.openDialog) {
         this.handleOpen();
      }
   }

   handleOpen = () => {
      let oldPath = window.location.pathname;

      const { userName, bubbleId } = this.props;
      const newPath = `/user/${userName}/bubble/${bubbleId}`;

      if (oldPath === newPath) oldPath = `/user/${userName}`;

      window.history.pushState(null, null, newPath);

      this.setState({ open: true, oldPath, newPath });
      this.props.getBubble(this.props.bubbleId);
   };
   handleClose = () => {
      window.history.pushState(null, null, this.state.oldPath);
      this.setState({ open: false });
   };
   render() {
      const {
         classes,
         bubble: {
            bubbleId,
            body,
            createdAt,
            likeCount,
            commentCount,
            userImage,
            userName,
            comments,
         },
         UI: { loading },
      } = this.props;

      const dialogMarkup = loading ? (
         <div className={classes.spinnerDiv}>
            <CircularProgress
               className={classes.circularProgress}
               size={130}
               thickness={2}
            ></CircularProgress>
         </div>
      ) : (
         <Grid container spacing={2}>
            <Grid item sm={5}>
               <img
                  src={userImage}
                  alt="Profile"
                  className={classes.profileImage}
               ></img>
            </Grid>
            <Grid item sm={7}>
               <Typography
                  component={Link}
                  color="primary"
                  variant="h5"
                  to={`/user/${userName}`}
               >
                  @{userName}
               </Typography>
               <hr className={classes.invisibleSeparator} />
               <Typography variant="body2" color="textSecondary">
                  {dayjs(createdAt).format("h:mm a, MMM DD YYYY")}
               </Typography>
               <hr className={classes.invisibleSeparator} />
               <Typography className={classes.bubbleBody} variant="body1">
                  {body}
               </Typography>
               <LikeButton bubbleId={bubbleId} />
               <span>{likeCount}</span>
               <MyButton tip="comments">
                  <ChatIcon color="primary"></ChatIcon>
               </MyButton>
               <span>{commentCount} comments</span>
            </Grid>
            {/* <hr className={classes.visibleSeparator} /> */}
            <CommentForm bubbleId={bubbleId}></CommentForm>
            <Comments comments={comments} />
         </Grid>
      );
      return (
         <Fragment>
            <MyButton
               onClick={this.handleOpen}
               tip="Expand bubble"
               tipClassName={classes.expandButton}
            >
               <UnfoldMore color="primary"></UnfoldMore>
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
               <DialogContent className={classes.dialogContent}>
                  {dialogMarkup}
               </DialogContent>
            </Dialog>
         </Fragment>
      );
   }
}

const mapStateToProps = (state) => ({
   bubble: state.data.bubble,
   UI: state.UI,
});

const mapDispatchToProps = { getBubble };

BubbleDialog.propTypes = {
   getBubble: PropTypes.func.isRequired,
   bubbleId: PropTypes.string.isRequired,
   userName: PropTypes.string.isRequired,
   bubble: PropTypes.object.isRequired,
   UI: PropTypes.object.isRequired,
};

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withStyles(style)(BubbleDialog));
