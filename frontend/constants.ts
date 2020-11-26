import * as Yup from "yup";

/**
 * Login Validation Schema, a Yup Schema for basic validation for Login not nearly as extensive as Register,
 * but performs basic validation.
 */
export const LoginValidationSchema = Yup.object().shape({
  // Email must be provided and be a valid email.
  email: Yup.string().email("Invalid email address").required("Required"),
  // Password must be provided
  password: Yup.string().required("Required"),
});

/**
 * HelpText to displayed when a field is focused
 * in the {@link Register} screen
 */
export const RegisterHelpText = {
  name:
    "This is how other administrators will see you. You can always change this later.",
  email: "You'll need to verify that you own this email account.",
  password:
    "Strong passwords include a mix of lower case letters, uppercase letters, numbers, and special characters.",
  passwordConfirmation: "Double check you know the password",
};

/**
 * Register Validation Schema, a Yup Schema for basic validation
 * for Account Registration.
 */
export const RegisterValidationSchema = Yup.object().shape({
  // Name must be provided and be at least 2 characters
  // up to 64 characters in length.
  name: Yup.string()
    .min(2, "Too short")
    .max(64, "Too long")
    .required("Required"),
  // Email must be provided and be a valid email.
  email: Yup.string().email("Invalid email address").required("Required"),
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

export const TermsOfServiceURL = "http://www.google.com";

export const disclaimerURL = "http://www.google.com";
