import React, { useEffect, useState } from 'react';
import { TextField, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { logIn } from '../../redux';
import { useAxios } from '../../hooks/useAxios'; // Import the custom hook

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Password Required')
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Using the useAxios hook
    const { isLoading, fetchData: fetchLogin } = useAxios({ method: 'POST', manual: true });
    const loginSubmit = async (values) => {
        try {
            const result = await fetchLogin({ body: values, url: '/auth/login' }); // Await the fetchData call

            if (result && !result.error) {
                dispatch(logIn(result.email, result.role, result.token, result.id));
                navigate(`/`);
                console.log(result);
            } else {
                setError(result?.error); // Handle the error appropriately
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    return (
        <div className='form-con'>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    loginSubmit(values); // Trigger loginSubmit on form submission
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormControl
                            sx={{ width: "100%", marginBottom: "24px" }}
                            variant="outlined"
                            size="Normal"
                        >
                            <Field
                                as={TextField}
                                name="email"
                                label="Email address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                sx={{ marginBottom: "5px" }}
                            />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </FormControl>

                        <FormControl sx={{ width: "100%", marginBottom: "24px" }} size="Normal" variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <Field
                                as={OutlinedInput}
                                id="outlined-adornment-password"
                                name="password"
                                sx={{ marginBottom: "5px" }}
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                        </FormControl>

                        {error && (
                            <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            size='large'
                            type="submit"
                            disabled={isLoading} // Disable button while loading
                            sx={{ width: "100%" }}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>

            <div style={{ flex: 1, display: "flex", alignContent: "flex-start", width: "100%", marginTop: "20px" }}>
                <span>Don't have an account? <Link to="/signup" style={{ textDecoration: "none", color: "#F25C05" }}>Register</Link></span>
            </div>
        </div>
    );
}
