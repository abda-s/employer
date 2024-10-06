import React from 'react';
import { TextField } from '@mui/material';
import { Field } from 'formik';

function CategoryField({ categoryName, handleChange }) {
    return (
        <Field
        onChange={handleChange}
        as={TextField}
            name="category"
            label="Category"
            value={categoryName}
            sx={fieldStyles}
        />
    );
}

const fieldStyles = {
    flex: 1,
    mt: 2,
    width: '100%',
};

export default CategoryField;
