import React, { useState } from 'react'
import { Button, Box } from '@mui/material';
import { Formik, Form, } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';
import TextInputField from '../common/TextInputField';
import PasswordInputField from '../common/PasswordInputField';

const SignupValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is Required'),
    password: Yup.string().required('Password is Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
});



function SignupForm() {
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

        <Box
            sx={{
                flex: 1,
                display: 'flex',
                width: { xs: "90%", sm: "90%", lg: "480px", xl: "480px" },
            }}
        >
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={SignupValidationSchema}
                onSubmit={(values) => {
                    signupReq(values)
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                    <Form onSubmit={handleSubmit}
                        style={{ width: "100%" }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, width: '100%' }}>

                            <TextInputField
                                name="email"
                                label="Email address"
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={errors}
                                touched={touched}
                            />

                            <PasswordInputField
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={errors}
                                touched={touched}
                            />

                            <TextInputField
                                name="confirmPassword"
                                label="Confirm Password"
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={errors}
                                touched={touched}
                                type='password'
                            />

                            {error && (
                                <Box sx={{ color: 'error.main' }}>{error}</Box>
                            )}

                            <Button
                                size='large'
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Sign up"}
                            </Button>

                            <Box sx={{ flex: 1, display: 'flex', alignContent: 'flex-start', width: '100%' }}>
                                <span>Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#F25C05' }}>Login</Link></span>
                            </Box>

                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default SignupForm
