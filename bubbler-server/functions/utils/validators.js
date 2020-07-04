// Validation helpers
const isEmpty = (field) => field.trim() === "";
const isEmail = (email) =>
   /^[\w\.\+]+@([\w]+\.){1,4}[a-zA-Z]{2,6}$/.test(email);
const isUsername = (username) => /^[\w]{3,16}$/.test(username);
const isPassword = (password) => /^[\w!#$%&) (=\-.,}{]{8,35}$/.test(password);

exports.validateSignup = (data) => {
   const errors = {};
   const { email, name, password, confirmPassword } = data;

   // Validate email
   if (!isEmail(email)) errors.email = "Not a valid email";
   if (isEmpty(email)) errors.email = "Must not be empty";

   // Validate password
   if (!isPassword(password)) errors.password = "Invalid password";
   if (isEmpty(password)) errors.password = "Must not be empty";
   if (password !== confirmPassword)
      errors.confirmPassword = "Passwords must match";

   // Validate username
   if (!isUsername(name))
      errors.name =
         "You can only use characters, numbers and underscores. Min 2 characters, max 12.";
   if (isEmpty(name)) errors.name = "Must not be empty";

   // if errors, return errors
   return {
      success: Object.keys(errors).length === 0,
      errors,
   };
};

exports.validateLogin = (data) => {
   const errors = {};
   const { email, password } = data;

   if (isEmpty(email)) errors.email = "Must not be empty";
   if (isEmpty(password)) errors.password = "Must not be empty";

   return {
      success: Object.keys(errors).length === 0,
      errors,
   };
};

exports.reduceUserProfileData = (body) => {
   const data = {};

   if (!!body.bio && !isEmpty(body.bio)) data.bio = body.bio.trim();
   if (!!body.website && !isEmpty(body.website)) {
      if (/^http[s]?:\/\//.test(body.website.trim())) {
         data.website = body.website.trim();
      } else {
         data.website = "http://" + body.website.trim();
      }
   }
   if (!!body.location && !isEmpty(body.location))
      data.location = body.location.trim();

   return data;
};
