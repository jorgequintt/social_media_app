import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

export class Notifications extends Component {
   state = {
      anchorEl: null,
   };

   handleOpen = (event) => {
      this.setState({ anchorEl: event.target });
   };

   handleClose = () => {
      this.setState({ anchorEl: null });
   };

   onMenuOpened = () => {
      let unreadNotificationsIds = this.props.notifications
         .filter((notification) => !notification.read)
         .map((notification) => notification.notificationId);
      this.props.markNotificationsRead(unreadNotificationsIds);
   };

   render() {
      const { notifications } = this.props;
      const anchorEl = this.state.anchorEl;

      dayjs.extend(relativeTime);

      let notificationIcon;
      if (notifications && notifications.length > 0) {
         const unreadNotifications = notifications.filter(
            (notification) => notification.read === false
         ).length;
         unreadNotifications > 0
            ? (notificationIcon = (
                 <Badge
                    badgeContent={
                       <span style={{ color: "#FFFFFF" }}>
                          {unreadNotifications}
                       </span>
                    }
                    color="secondary"
                 >
                    <NotificationsIcon />
                 </Badge>
              ))
            : (notificationIcon = <NotificationsIcon />);
      } else {
         notificationIcon = <NotificationsIcon />;
      }

      let notificationsMarkup =
         notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
               const verb =
                  notification.type === "like" ? "liked" : "commented on";
               const time = dayjs(notification.createdAt).fromNow();
               const iconColor = notification.read ? "primary" : "secondary";
               const icon =
                  notification.type === "like" ? (
                     <FavoriteIcon
                        color={iconColor}
                        style={{ marginRight: 10 }}
                     />
                  ) : (
                     <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
                  );

               return (
                  <MenuItem
                     key={notification.createdAt}
                     onClick={this.handleClose}
                  >
                     {icon}{" "}
                     <Typography
                        component={Link}
                        color="default"
                        variant="body1"
                        to={`/user/${notification.recipient}/bubble/${notification.bubbleId}`}
                     >
                        {notification.sender} {verb} your bubble {time}
                     </Typography>
                  </MenuItem>
               );
            })
         ) : (
            <MenuItem onClick={this.handleClose}>No notifications yet</MenuItem>
         );

      return (
         <Fragment>
            <Tooltip placement="top" title="Notifications">
               <IconButton
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                  aria-haspopup={true}
                  onClick={this.handleOpen}
               >
                  {notificationIcon}
               </IconButton>
            </Tooltip>
            <Menu
               anchorEl={anchorEl}
               open={!!anchorEl}
               onClose={this.handleClose}
               onEntered={this.onMenuOpened}
            >
               {notificationsMarkup}
            </Menu>
         </Fragment>
      );
   }
}

Notifications.propTypes = {
   markNotificationsRead: PropTypes.func.isRequired,
   notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
   notifications: state.user.notifications,
});

const mapDispatchToProps = { markNotificationsRead };

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
