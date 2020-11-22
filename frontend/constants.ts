import { DefaultTheme } from "react-native-paper";
import * as Yup from "yup";

export const API_URL = "http://localhost:5000/v1";

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e88e5",
    accent: "#1e88e5",
  },
};
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
