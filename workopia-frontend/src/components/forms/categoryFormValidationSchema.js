import * as Yup from 'yup';

const categoryFormValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Category name is required")
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name must be at most 50 characters")
        .matches(/^[a-zA-Z0-9\s\&]+$/, "Category name can only contain letters, numbers, spaces, and &"),
    description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be under 500 characters"),
    status: Yup.mixed()
        .required("Status is required"),
});

export default categoryFormValidationSchema;