import * as Yup from "yup";

const jobFormValidationSchema = Yup.object({
    title: Yup.string()
        .required("Job title is required")
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be at most 50 characters"),
    category_id: Yup.string()
        .required("Please select a category"),
    location: Yup.string()
        .required("Location is required"),
    description: Yup.string()
        .required("Job description is required")
        .min(20, "Description should be at least 20 characters")
        .max(500, "Description should be at most 500 characters"),
    status: Yup.number()
        .required("Status is required"),
});

export default jobFormValidationSchema;