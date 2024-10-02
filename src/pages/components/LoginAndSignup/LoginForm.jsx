import React, { useState } from 'react';
import { TextField, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { logIn } from '../../../redux';
import axios from "axios"
import { serverURL } from '../../../constants';


const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Password Required')
    // .length(8, "At least 8 char"),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const loginSubmit = (values) => {
        console.log(values)
        axios.post(`${serverURL}/auth/login`, values)
            .then((response) => {
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    dispatch(logIn(response.data.email, response.data.role, response.data.token, response.data.id));
                    navigate(`/`);
                }
            })


    }


    return (

        <div className='form-con'>
            <div className='sigin-in-email'>Login</div>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    loginSubmit(values)
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
                            // error={Boolean(<ErrorMessage name="email" />)}
                            />
                            <ErrorMessage name="email" component="div" style={{ color: 'red', }} />
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

                        {error !== "" && (
                            <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            size='large'
                            type="submit"
                            sx={{
                                width: "100%"
                            }}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
            <div style={{ flex: 1, display: "flex", alignContent: "flex-start", width: "100%", marginTop: "20px" }} >
                <span>Don't have an account? <Link to="/signup" style={{textDecoration:"none",color:"#F25C05"}} >Register</Link> </span>
            </div>

        </div>
    );
}
