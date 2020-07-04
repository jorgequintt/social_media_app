import React, { Fragment } from "react";
import NoImg from "../images/no-img.png";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
   ...theme.myClasses,
});

const BubbleSkeleton = (props) => {
   const { classes } = props;

   const content = Array.from({ length: 5 }).map((item, index) => (
      <Card className={classes.card} key={index}>
         <CardMedia className={classes.cover} image={NoImg} />
         <CardContent className={classes.content}>
            <div className={classes.name}></div>
            <div className={classes.date}></div>
            <div className={classes.fullLine}></div>
            <div className={classes.fullLine}></div>
            <div className={classes.halfLine}></div>
         </CardContent>
      </Card>
   ));

   return <Fragment>{content}</Fragment>;
};

BubbleSkeleton.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(BubbleSkeleton);
