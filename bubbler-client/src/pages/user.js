import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Bubble from "../components/bubble/Bubble";
import StaticProfile from "../components/profile/StaticProfile";
import BubbleSkeleton from "../utils/BubbleSkeleton";
import ProfileSkeleton from "../utils/ProfileSkeleton";

// MUI
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

export class user extends Component {
   state = {
      profile: null,
      bubbleIdParam: null,
   };
   componentDidMount() {
      const name = this.props.match.params.userName;
      const bubbleId = this.props.match.params.bubbleId;

      if (bubbleId) this.setState({ bubbleIdParam: bubbleId });

      this.props.getUserData(name);
      axios
         .get(`/user/${name}`)
         .then((res) => {
            this.setState({
               profile: res.data.user,
            });
         })
         .catch((err) => {
            console.log(err);
         });
   }
   render() {
      const { bubbles, loading } = this.props.data;
      const { bubbleIdParam } = this.state;

      const bubblesMarkup = loading ? (
         <BubbleSkeleton />
      ) : bubbles === null ? (
         <p>No bubbles for this user</p>
      ) : !bubbleIdParam ? (
         bubbles.map((bubble) => (
            <Bubble key={bubble.bubbleId} bubble={bubble} />
         ))
      ) : (
         bubbles.map((bubble) => {
            if (bubble.bubbleId !== bubbleIdParam) {
               return <Bubble key={bubble.bubbleId} bubble={bubble} />;
            } else {
               return (
                  <Bubble key={bubble.bubbleId} bubble={bubble} openDialog />
               );
            }
         })
      );

      return (
         <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
               {bubblesMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
               {this.state.profile === null ? (
                  <ProfileSkeleton />
               ) : (
                  <StaticProfile profile={this.state.profile} />
               )}
            </Grid>
         </Grid>
      );
   }
}

user.propTypes = {
   getUserData: PropTypes.func.isRequired,
   data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   data: state.data,
});

const mapDispatchToProps = { getUserData };

export default connect(mapStateToProps, mapDispatchToProps)(user);
