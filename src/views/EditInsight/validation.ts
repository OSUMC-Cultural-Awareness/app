import * as Yup from "yup";

/**
 * EditInsight screen fields for Formik.
 */
export type Fields = {
  cultureName: string;
  title?: string;
  summary: string;
  description: string;
  source: string;
  sourceType: string;
};

/**
 * EditInsight Validation Schema, a Yup Schema for basic validation for EditInsight
 * performs basic validation.
 */
export function validator(type: "general" | "specialized"): Yup.ObjectSchema {
  return Yup.object().shape({
    cultureName: Yup.string().required("Required"),
    title: type === "specialized" && Yup.string().required("Required"),
    summary: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    source: Yup.string().required("Required"),
    sourceType: Yup.string().required("Required"),
  });
}
