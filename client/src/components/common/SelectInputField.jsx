import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Field, ErrorMessage } from 'formik';


function SelectInputField({ name, label, values, handleChange, handleBlur, menuItems }) {
    return (
        <FormControl sx={{ flex: 1 }}>
            <InputLabel>{label}</InputLabel>
            <Field
                label={label}
                as={Select}
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[name]}
            >
                {menuItems.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </MenuItem>
                ))}
            </Field>
            <ErrorMessage name="status" component="span" style={{ color: 'red' }} />
        </FormControl>
    )
}

export default SelectInputField