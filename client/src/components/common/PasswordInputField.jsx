import React, { useState } from 'react';
import {
    FormControl,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    IconButton,
    FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field } from 'formik';

function PasswordInputField({
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const isError = Boolean(errors.password && touched.password);

    return (
        <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{
                    color: isError ? 'error.main' : 'text.primary'
                }}
            >
                Password
            </InputLabel>
            <Field
                as={OutlinedInput}
                id="outlined-adornment-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={isError}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
            <FormHelperText error={isError} sx={{ mx: 1.75, mt: 0.375 }}>
                {touched.password && errors.password ? errors.password : ''}
            </FormHelperText>
        </FormControl>
    );
}

export default PasswordInputField;
