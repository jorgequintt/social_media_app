import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
   ...theme.myClasses,
   commentImage: {
      width: 100,
      height: 100,
      objectFit: "cover",
      borderRadius: "50%",
   },
   commentImageWrapper: {
      textAlign: "center",
   },
   commentData: {
      marginLeft: "10px",
   },
});

export class Comments extends Component {
   state = {};
   render() {
      const { comments, classes } = this.props;
      return (
         <Grid container>
            {comments.map((comment) => {
               const { body, userName, createdAt, userImage } = comment;
               return (
                  <Fragment key={createdAt}>
                     <hr className={classes.visibleSeparator} />
                     <Grid item sm={12}>
                        <Grid container>
                           <Grid
                              item
                              sm={3}
                              className={classes.commentImageWrapper}
                           >
                              <img
                                 src={userImage}
                                 alt="Profile"
                                 className={classes.commentImage}
                              />
                           </Grid>
                           <Grid item sm={9}>
                              <div className={classes.commentData}>
                                 <Typography
                                    variant="h5"
                                    component={Link}
                                    to={`/user/${userName}`}
                                    color="primary"
                                 >
                                    {userName}
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    color="textSecondary"
                                 >
                                    {dayjs(createdAt).format(
                                       "h:mm a, MMMM DD YYYY"
                                    )}
                                 </Typography>
                                 <hr className={classes.invisibleSeparator} />
                                 <Typography variant="body1">{body}</Typography>
                              </div>
                           </Grid>
                        </Grid>
                     </Grid>
                  </Fragment>
               );
            })}
         </Grid>
      );
   }
}

Comments.propTypes = {
   comments: PropTypes.array.isRequired,
};

export default withStyles(styles)(Comments);
