import React from 'react'
import { Modal, TextField, Button, Box, FormControl } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
    password: Yup.string().required('Password Required')
});

function ResetUserPassModel({ isVisible, onClose, userId }) {

    const { fetchData: resetPassFetch } = useAxios({method: 'PUT',manual: true});
    const resetPassSubmit = async (password, userId) => {
        try {
            const result = await resetPassFetch({url: `/users/reset-user-password`, body: { userId, password } })
            if (result && !result.error) {
                onClose();
            }
        } catch (err) {
            console.log(err)
        }


    }

    return (
        <Modal
            open={isVisible}
            onClose={() =>  onClose() }
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box component="section" sx={{ p: 2, m: 1, borderRadius: 3, backgroundColor: "white", display: "flex", flexDirection: "column", width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" } }}>
                Reset Password
                {/* <Box */}
                <Formik
                    initialValues={{ password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        resetPassSubmit(values.password, userId)
                    }}
                >

                    {({ values, handleChange, handleBlur, handleSubmit }) => (

                        <Form onSubmit={handleSubmit}>
                            <FormControl
                                sx={{ width: "100%", marginBottom: "10px", marginTop: "10px", display: "flex", flexDirection: "column" }}
                                variant="outlined"
                                size="Normal"
                            >
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    sx={{ marginBottom: "5px" }}
                                // error={Boolean(<ErrorMessage name="email" />)}
                                />
                                <ErrorMessage name="password" component="div" style={{ color: 'red', }} />
                            </FormControl>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ marginBottom: "10px", flex: 1, width: "100%" }}
                            >
                                Reset
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => { onClose() }}
                >
                    Cancel
                </Button>
            </Box>

        </Modal>
    )
}

export default ResetUserPassModel