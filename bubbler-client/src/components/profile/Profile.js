import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "../profile/EditDetails";
import MyButton from "../../utils/MyButton";
import Logo from "../../images/main_logo.png";

import ProfileSkeleton from "../../utils/ProfileSkeleton";
// import { theme } from '';

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";

//MUI
import Grid from "@material-ui/core/Grid";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";
import CalendarToday from "@material-ui/icons/CalendarToday";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

import MuiLink from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
   paper: {
      padding: 20,
   },
   profile: {
      "& .image-wrapper": {
         textAlign: "center",
         position: "relative",
         "& button": {
            position: "absolute",
            top: "80%",
            left: "70%",
         },
      },
      "& .profile-image": {
         width: 200,
         height: 200,
         objectFit: "cover",
         maxWidth: "100%",
         borderRadius: "50%",
      },
      "& .profile-details": {
         textAlign: "center",
         "& span, svg": {
            verticalAlign: "middle",
         },
         "& a": {
            color: theme.palette.primary.main,
         },
      },
      "& hr": {
         border: "none",
         margin: "0 0 10px 0",
      },
      "& svg.button": {
         "&:hover": {
            cursor: "pointer",
         },
      },
   },
   buttons: {
      textAlign: "center",
      "& a": {
         margin: "20px 10px",
      },
   },
   profileLogo: {
      width: 80,
   },
});

class Profile extends Component {
   handleImageChange = (event) => {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image, image.name);
      this.props.uploadImage(formData);
   };

   handleEditPicture = (event) => {
      const fileInput = document.querySelector("#imageInput");
      fileInput.click();
   };

   handleLogout = (event) => {
      this.props.logoutUser();
   };

   render() {
      const {
         classes,
         user: {
            credentials: { name, createdAt, imageUrl, bio, website, location },
            loading,
            authenticated,
         },
      } = this.props;

      let profileMarkup = !loading ? (
         authenticated ? (
            // If user is logged
            <Paper className={classes.paper}>
               <div className={classes.profile}>
                  <div className="image-wrapper">
                     <img
                        src={imageUrl}
                        alt="profile"
                        className="profile-image"
                     />
                     <input
                        type="file"
                        id="imageInput"
                        hidden="hidden"
                        onChange={this.handleImageChange}
                     />

                     <MyButton
                        onClick={this.handleEditPicture}
                        tip="Change profile picture"
                        btnClassName="button"
                     >
                        <EditIcon color="primary" />
                     </MyButton>
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
                           <LocationOn color="primary" />{" "}
                           <span>{location}</span>
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
                        <span>
                           Joined {dayjs(createdAt).format("MMM YYYY")}
                        </span>
                     </div>
                  </div>
                  <MyButton
                     onClick={this.handleLogout}
                     tip="Logout"
                     btnClassName="button"
                  >
                     <KeyboardReturn color="primary" />
                  </MyButton>
                  <EditDetails />
               </div>
            </Paper>
         ) : (
            // If not logged
            <Paper className={classes.paper}>
               <Grid container justify="center" alignItems="center">
                  <Grid item sm={4} style={{ textAlign: "center" }}>
                     <img
                        src={Logo}
                        alt="Logo"
                        className={classes.profileLogo}
                     ></img>
                  </Grid>
                  <Grid item sm={8}>
                     <Typography variant="body1" align="center">
                        Log in and be part of the conversation. Or sign up and
                        start one!
                     </Typography>
                  </Grid>
               </Grid>
               <div className={classes.buttons}>
                  <Button
                     component={Link}
                     color="primary"
                     variant="contained"
                     to="/login"
                  >
                     Login
                  </Button>
                  <Button
                     component={Link}
                     color="primary"
                     variant="contained"
                     to="/signup"
                  >
                     Signup
                  </Button>
               </div>
            </Paper>
         )
      ) : (
         <ProfileSkeleton />
      );

      return profileMarkup;
   }
}

Profile.propTypes = {
   user: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   logoutUser: PropTypes.func.isRequired,
   uploadImage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   user: state.user,
});

const mapActionsToProps = {
   logoutUser,
   uploadImage,
};

export default connect(
   mapStateToProps,
   mapActionsToProps
)(withStyles(styles)(Profile));
