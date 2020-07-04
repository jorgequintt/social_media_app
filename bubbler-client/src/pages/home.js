import React, { Component } from "react";
import PropTypes from "prop-types";
import Sensor from "react-visibility-sensor";

import Bubble from "../components/bubble/Bubble";
import Profile from "../components/profile/Profile";

// MUI
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

//Redux
import { connect } from "react-redux";
import { getBubbles, getMoreBubbles } from "../redux/actions/dataActions";

export class home extends Component {
   state = {
      sensorActive: true,
   };

   componentDidMount() {
      this.props.getBubbles();
   }

   handleSensorChange = (isVisible) => {
      if (isVisible && !this.props.data.loading) {
         const lastBubble = this.props.data.bubbles[
            this.props.data.bubbles.length - 1
         ];
         this.props.getMoreBubbles(lastBubble.createdAt);
      }
   };

   componentDidUpdate = (prevProps) => {
      const prevData = prevProps.data;
      const { loading, bubbles } = this.props.data;

      if (
         prevData.loading === true &&
         loading === false &&
         prevData.bubbles.length === bubbles.length
      ) {
         // disable loading more on scrolling to bottom
         this.setState({ sensorActive: false });
      }
   };

   render() {
      const { bubbles, loading } = this.props.data;
      let recentBubblesMarkup = bubbles.map((bubble) => (
         <Bubble key={bubble.bubbleId} bubble={bubble} />
      ));

      const loadingMarkup = (
         <div style={{ width: "100%", textAlign: "center" }}>
            <CircularProgress size={50} thickness={2} />
         </div>
      );
      return (
         <Grid container spacing={2}>
            <Grid item sm={4} xs={12}>
               <Profile />
            </Grid>
            <Grid item sm={8} xs={12}>
               {recentBubblesMarkup}
               {loading && loadingMarkup}
               <Sensor
                  active={this.state.sensorActive}
                  onChange={this.handleSensorChange}
                  delayedCall={true}
               >
                  <hr style={{ opacity: 0 }} />
               </Sensor>
            </Grid>
         </Grid>
      );
   }
}

home.propTypes = {
   getBubbles: PropTypes.func.isRequired,
   data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   data: state.data,
});

const mapActionsToProps = {
   getBubbles,
   getMoreBubbles,
};

export default connect(mapStateToProps, mapActionsToProps)(home);
