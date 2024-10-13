import React from 'react';
import { TextField, FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Field, ErrorMessage } from 'formik';
function DatePickerField({ name, label }) {
    return (
        <FormControl sx={{ flex: 1 }} variant="outlined">
            <Field name={name}>
                {({ field, form }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={label}
                            value={field.value}
                            onChange={(newValue) => form.setFieldValue(field.name, newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ flex: 1 }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                )}
            </Field>
            <ErrorMessage name={name} component="span" style={{ color: 'red' }} />
        </FormControl>
    )
}

export default DatePickerField