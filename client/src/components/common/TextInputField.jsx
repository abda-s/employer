import React from 'react';
import { TextField } from '@mui/material';
import { Field } from 'formik';
import PropTypes from 'prop-types';

function TextInputField({ 
    name, 
    label, 
    values, 
    handleChange, 
    handleBlur, 
    errors, 
    touched, 
    multiline = false,
    type="text"
}) {
    return (
        <Field
            as={TextField}
            name={name}
            label={label}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[name]} 
            error={Boolean(errors[name] && touched[name])}
            helperText={touched[name] && errors[name] ? errors[name] : ''}
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
