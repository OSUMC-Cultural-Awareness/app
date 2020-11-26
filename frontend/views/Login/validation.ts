import * as Yup from "yup";

/**
 * Login Validation Schema, a Yup Schema for basic validation for Login
 * performs basic validation.
 */
export default Yup.object().shape({
  // Email must be provided and be a valid email.
  email: Yup.string().email("Invalid email address").required("Required"),
  // Password must be provided
  password: Yup.string().required("Required"),
});
