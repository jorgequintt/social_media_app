import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import MyButton from "../../utils/MyButton";
import DeleteBubble from "./DeleteBubble";
import BubbleDialog from "./BubbleDialog";
import LikeButton from "./LikeButton";

// MUI
import ChatIcon from "@material-ui/icons/Chat";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

//Redux
import { connect } from "react-redux";

const styles = {
   card: {
      position: "relative",
      display: "flex",
      marginBottom: 20,
   },
   image: {
      minWidth: 134,
   },
   content: {
      padding: "20px 20px 4px 20px",
      objectFit: "cover",
      flexGrow: 1,
   },
   time: {
      display: "inline-block",
      marginLeft: "20px",
   },
};

export class Bubble extends Component {
   render() {
      dayjs.extend(relativeTime);
      const {
         classes,
         bubble: {
            body,
            createdAt,
            userImage,
            userName,
            bubbleId,
            likeCount,
            commentCount,
         },
         user: {
            authenticated,
            credentials: { name },
         },
      } = this.props;

      const deleteButton =
         authenticated && userName === name ? (
            <DeleteBubble bubbleId={bubbleId} />
         ) : null;

      return (
         <Card key={bubbleId} className={classes.card}>
            <CardMedia
               className={classes.image}
               image={userImage}
               title="Profile Page"
            />
            <CardContent className={classes.content}>
               <Typography
                  variant="h6"
                  color="primary"
                  component={Link}
                  to={`/user/${userName}`}
               >
                  {userName}
               </Typography>
               <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.time}
               >
                  {dayjs(createdAt).fromNow()}
               </Typography>
               <Typography className={classes.bubbleBody} variant="body1">
                  {body}
               </Typography>
               <LikeButton bubbleId={bubbleId} />
               <span>{likeCount}</span>
               <MyButton tip="comments">
                  <ChatIcon color="primary"></ChatIcon>
               </MyButton>
               <span>{commentCount} comments</span>
            </CardContent>
            {deleteButton}
            <BubbleDialog
               bubbleId={bubbleId}
               userName={userName}
               openDialog={this.props.openDialog}
            />
         </Card>
      );
   }
}

Bubble.propTypes = {
   bubble: PropTypes.object.isRequired,
   user: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
   user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Bubble));
