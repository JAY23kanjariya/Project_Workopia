import * as Yup from "yup";

const jobFormValidationSchema = Yup.object({
    title: Yup.string()
        .required("Job title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),
    category_id: Yup.string()
        .required("Please select a category"),
    location: Yup.string()
        .required("Base location is required"),
    description: Yup.string()
        .required("Job description is required")
        .min(20, "Description should be at least 20 characters"),
    status: Yup.number()
        .required("Status is required"),
    
    // New Fields
    employment_type: Yup.string()
        .required("Employment type is required"),
    city: Yup.string()
        .required("City is required"),
    state: Yup.string()
        .required("State is required"),
    country: Yup.string()
        .required("Country is required"),
    work_mode: Yup.string()
        .required("Work mode is required"),
    salary_type: Yup.string()
        .required("Salary type is required"),
    min_salary: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable(),
    max_salary: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable()
        .when('min_salary', ([min_salary], schema) =>
            min_salary != null
                ? schema.min(min_salary, "Max salary must be greater than or equal to min salary")
                : schema
        ),
    required_skills: Yup.string()
        .required("Required skills are required"),
    min_experience: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable()
        .min(0, "Years cannot be negative"),
    max_experience: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable()
        .when('min_experience', ([min_experience], schema) =>
            min_experience != null
                ? schema.min(min_experience, "Max experience must be greater than or equal to min experience")
                : schema
        ),
    education_qualification: Yup.string()
        .required("Education qualification is required"),
    openings_count: Yup.number()
        .required("Number of openings is required")
        .min(1, "Must be at least 1"),
    application_deadline: Yup.mixed()
        .nullable()
        .transform((value, originalValue) => (!originalValue || originalValue === "") ? null : originalValue)
        .test("is-future", "Deadline must be tomorrow or later", (value) => {
            if (!value) return true;
            const date = new Date(value);
            if (isNaN(date.getTime())) return true;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date > today;
        }),
    company_name: Yup.string()
        .required("Company name is required"),
    company_description: Yup.string()
        .required("Company description is required"),
    company_website: Yup.string()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable()
        .url("Invalid URL"),
});

export default jobFormValidationSchema;