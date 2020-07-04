import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
   ...theme.myClasses,
});

const StaticProfile = (props) => {
   const {
      classes,
      profile: { name, createdAt, imageUrl, bio, website, location },
   } = props;

   return (
      <Paper className={classes.paper}>
         <div className={classes.profile}>
            <div className="image-wrapper">
               <img src={imageUrl} alt="profile" className="profile-image" />
            </div>
            <hr />
            <div className="profile-details">
               <MuiLink
                  component={Link}
                  to={`/user/${name}`}
                  color="primary"
                  variant="h5"
               >
                  @{name}
               </MuiLink>
               <hr />
               {bio && (
                  <Typography variant="body1" className={classes.bio}>
                     {bio}
                  </Typography>
               )}
               <hr />
               {location && (
                  <div className={classes.lineInfoHolder}>
                     <LocationOn color="primary" /> <span>{location}</span>
                  </div>
               )}
               <hr />
               {website && (
                  <div className={classes.lineInfoHolder}>
                     <LinkIcon color="primary" />
                     <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        {"  " + website}
                     </a>
                  </div>
               )}
               <hr />
               <div className={classes.lineInfoHolder}>
                  <CalendarToday color="primary" />{" "}
                  <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
               </div>
            </div>
         </div>
      </Paper>
   );
};

StaticProfile.propTypes = {
   profile: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StaticProfile);
