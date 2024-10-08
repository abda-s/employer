import React, { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';

const SignupValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Password Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
});



function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const { isLoading, fetchData: fetchSignup } = useAxios({ method: 'POST', manual: true })
    const signupReq = async (values) => {
        try {
            const result = await fetchSignup({ body: values, url: '/auth/signup' })
            if (result && !result.error) {
                navigate('/login')
            }
            else {
                setError(result?.error)
            }

        }
        catch (err) {
            console.log(err.message)
        }
    }

    return (

        <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={SignupValidationSchema}
            onSubmit={(values) => {
                signupReq(values)
            }}
        >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
                <Form onSubmit={handleSubmit}
                    style={{ width: "100%" }}
                >

                    <FormControl
                        sx={{ width: "100%", marginBottom: "24px", marginTop: "20px" }}
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

                    <FormControl sx={{ width: "100%", marginBottom: "24px" }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                        <Field
                            as={OutlinedInput}
                            id="outlined-adornment-confirm-password"
                            name="confirmPassword"
                            sx={{ marginBottom: "5px" }}
                            type='password'
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}

                            label="Confirm Password"
                        />
                        <ErrorMessage name="confirmPassword" component="div" style={{ color: 'red' }} />
                    </FormControl>

                    {error !== "" && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

                    {/* <div style={{ marginBottom: "10px" }} >{passResetInfo} </div> */}
                    <Button
                        size='large'
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ marginBottom: "10px", flex: 1, width: "100%" }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Sign up"}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default SignupForm
