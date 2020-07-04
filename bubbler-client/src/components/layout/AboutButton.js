import React, { Component, Fragment } from "react";
import MyButton from "../../utils/MyButton";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Help from "@material-ui/icons/Help";

const styles = (theme) => ({
   link: {
      color: theme.palette.primary.main,
   },
});

export class AboutButton extends Component {
   state = {
      anchorEl: null,
   };

   handleOpen = (event) => {
      this.setState({ anchorEl: event.target });
   };

   handleClose = (event) => {
      this.setState({ anchorEl: null });
   };

   render() {
      const { classes } = this.props;
      return (
         <Fragment>
            <MyButton onClick={this.handleOpen} tip="About">
               <Help />
            </MyButton>
            <Popover
               open={Boolean(this.state.anchorEl)}
               onClose={this.handleClose}
               anchorEl={this.state.anchorEl}
               anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
               }}
               transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
               }}
            >
               <Typography style={{ padding: 20 }}>
                  Made by{" "}
                  <a
                     href="https://jorgequintt.site"
                     target="_blank"
                     rel="noopener noreferrer"
                     className={classes.link}
                  >
                     Jorge Quintero
                  </a>
               </Typography>
            </Popover>
         </Fragment>
      );
   }
}

AboutButton.propTypes = {
   classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutButton);
