import * as Yup from "yup";

export default Yup.object().shape({
  // Password must contain a lowercase, uppercase, one number, and a special character.
  // Be at least 8 characters long and 64 maximum.
  password: Yup.string()
    .required("Required")
    .min(8, "Must be at least 8 characters")
    .max(64, "Too long")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "Must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  // Password Confirmation must match Password
  passwordConfirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Must match password"),
});
