import React from 'react';
import { TextField } from '@mui/material';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import {get} from 'lodash';

function TextInputField({ 
    name, 
    label, 
    values, 
    handleChange, 
    handleBlur, 
    errors, 
    touched, 
    multiline = false,
    type = "text"
}) {
    // Check if the name is nested
    const isNested = name.includes('.') || name.includes('[');
    
    // Use lodash.get for nested fields, otherwise access directly
    const fieldValue = isNested ? get(values, name) : values[name];
    const fieldError = isNested ? get(errors, name) : errors[name];
    const fieldTouched = isNested ? get(touched, name) : touched[name];

    return (
        <Field
            as={TextField}
            name={name}
            label={label}
            onChange={handleChange}
            onBlur={handleBlur}
            value={fieldValue}
            error={Boolean(fieldError && fieldTouched)}
            helperText={fieldTouched && fieldError ? fieldError : ''}
            fullWidth // Optional: makes the text field full width
            multiline={multiline}
            type={type}
        />
    );
}

TextInputField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired, 
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    multiline: PropTypes.bool, 
    type: PropTypes.string
};

export default TextInputField;
