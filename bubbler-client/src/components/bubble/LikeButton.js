import React, { Component } from "react";
import MyButton from "../../utils/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

// Redux
import { connect } from "react-redux";
import { likeBubble, unlikeBubble } from "../../redux/actions/dataActions";

export class LikeButton extends Component {
   likedBubble = () => {
      const bubbleId = this.props.bubbleId;
      return (
         this.props.user.likes &&
         this.props.user.likes.find((like) => like.bubbleId === bubbleId)
      );
   };
   likeBubble = () => {
      this.props.likeBubble(this.props.bubbleId);
   };
   unlikeBubble = () => {
      this.props.unlikeBubble(this.props.bubbleId);
   };
   render() {
      const { authenticated } = this.props.user;
      const likeButton = !authenticated ? ( // If not authenticated
         <Link to="/login">
            <MyButton tip="Like">
               <FavoriteBorderIcon color="primary" />
            </MyButton>
         </Link>
      ) : this.likedBubble() ? (
         // If authenticated and liked bubble
         <MyButton tip="Undo Like" onClick={this.unlikeBubble}>
            <FavoriteIcon color="primary" />
         </MyButton>
      ) : (
         // If authenticated and not liked bubble
         <MyButton tip="Like" onClick={this.likeBubble}>
            <FavoriteBorderIcon color="primary" />
         </MyButton>
      );
      return likeButton;
   }
}

LikeButton.propTypes = {
   likeBubble: PropTypes.func.isRequired,
   unlikeBubble: PropTypes.func.isRequired,
   user: PropTypes.object.isRequired,
   bubbleId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
   user: state.user,
});

const mapActionsToProps = {
   unlikeBubble,
   likeBubble,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
