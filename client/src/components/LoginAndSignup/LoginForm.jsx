import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { logIn } from '../../redux';
import { useAxios } from '../../hooks/useAxios'; // Import the custom hook
import PasswordInputField from '../common/PasswordInputField';
import TextInputField from '../common/TextInputField';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email Required'),
    password: Yup.string().required('Password Required')
});

export default function LoginForm() {
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
            console.log(err);
        }
    };

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                width: { xs: "90%", sm: "90%", lg: "480px", xl: "480px" },
            }}
        >
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    loginSubmit(values); // Trigger loginSubmit on form submission
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                    <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
                                type="password"
                            />

                            {error && (
                                <Box sx={{ color: 'error.main' }}>{error}</Box>
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

                            <Box sx={{ flex: 1, display: 'flex', alignContent: 'flex-start', width: '100%' }}>
                                <span>Don't have an account? <Link to="/signup" style={{ textDecoration: 'none', color: '#F25C05' }}>Register</Link></span>
                            </Box>
                            
                        </Box>

                    </Form>
                )}
            </Formik>

        </Box>
    );
}
