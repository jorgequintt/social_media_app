import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NoImg from "../images/no-img.png";

import Paper from "@material-ui/core/Paper";

//MUI
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
   ...theme.myClasses,
   handle: {
      height: 20,
      backgroundColor: theme.palette.primary.main,
      width: 60,
      margin: "0 auto 7px auto",
   },
   fullLine: {
      height: 15,
      backgroundColor: "rgba(0,0,0,0.6)",
      width: "100%",
      marginBottom: 10,
   },
   smallLine: {
      height: 15,
      backgroundColor: "rgba(0,0,0,0.4)",
      width: "30%",
      margin: "7px 5px",
      display: "inline-block",
   },
});

const ProfileSkeleton = (props) => {
   const { classes } = props;
   return (
      <Paper className={classes.paper}>
         <div className={classes.profile}>
            <div className="image-wrapper">
               <img src={NoImg} alt="profile" className="profile-image" />
            </div>
            <hr />
            <div className="profile-details">
               <div className={classes.handle}></div>
               <hr />
               <div className={classes.fullLine}></div>
               <div className={classes.fullLine}></div>
               <hr />
               <LocationOn color="primary" />
               <span className={classes.smallLine}></span>
               <hr />
               <LinkIcon color="primary" />{" "}
               <span className={classes.smallLine}></span>
               <hr />
               <CalendarToday color="primary" />{" "}
               <span className={classes.smallLine}></span>
            </div>
         </div>
      </Paper>
   );
};

ProfileSkeleton.propTypes = {
   classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
