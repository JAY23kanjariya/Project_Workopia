import * as Yup from "yup";
import { ROLES } from "@/utils/constants";

export const signUpValidationSchema = Yup.object({
    role_id: Yup.number()
        .required("Role is required")
        .oneOf([ROLES.CANDIDATE, ROLES.EMPLOYER], "Please select a valid role"),
    name: Yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?_\-&]/, "Password must contain at least one special character"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
});