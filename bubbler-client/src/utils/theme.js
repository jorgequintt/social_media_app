export default {
   typography: {
      useNextVariants: true,
   },
   palette: {
      primary: {
         light: "#b4d4ff",
         main: "#4993f7",
         dark: "#3e78c7",
         contrastText: "#fff",
      },
      secondary: {
         light: "#ff7961",
         main: "#f44336",
         dark: "#ba000d",
         contrastText: "#000",
      },
   },
   myClasses: {
      form: {
         textAlign: "center",
      },
      pageTitle: {
         margin: "15px auto 15px auto",
      },
      image: {
         margin: "15px auto 15px auto",
      },
      textField: {
         margin: "10px auto 10px auto",
      },
      button: {
         margin: "10px auto 10px auto",
      },
      customError: {
         color: "red",
         fontSize: "0.8em",
         marginTop: 10,
      },
      progress: {
         color: "#FFFFFF",
      },
      invisibleSeparator: {
         border: "none",
         margin: 4,
      },
      visibleSeparator: {
         width: "88%",
         border: "0px solid rgba(20,20,20,0.1)",
         margin: "20px auto",
      },
      card: {
         display: "flex",
         marginBottom: 20,
      },
      content: {
         width: "100%",
         flexDirection: "column",
         padding: 25,
      },
      cover: {
         minWidth: 200,
         objectFit: "cover",
      },
      name: {
         width: 60,
         height: 20,
         backgroundColor: "#4993f7",
         marginBottom: 7,
      },
      date: {
         height: 13,
         width: 100,
         backgroundColor: "rgba(0,0,0,0.2)",
         marginBottom: 10,
      },
      fullLine: {
         height: 15,
         width: "80%",
         backgroundColor: "rgba(0,0,0,0.4)",
         marginBottom: 10,
      },
      halfLine: {
         height: 15,
         width: "50%",
         backgroundColor: "rgba(0,0,0,0.4)",
         marginBottom: 10,
      },
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
               color: "#4993f7",
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
      bubbleBody: {
         wordBreak: "break-word",
      },
      lineInfoHolder: {
         fontSize: 13,
      },
      bio: {
         marginBottom: 15,
      },
   },
};
