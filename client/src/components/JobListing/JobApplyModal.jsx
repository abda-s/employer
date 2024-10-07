import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
    coverLetter: Yup.string().required('Cover Letter is required'),
});

function JobApplyModal({ isVisible, onClose, id }) {

    const { fetchData } = useAxios({
        url: `/application`,
        method: "POST",
        manual: true
    })

    const onApply = async (coverLetter) => {
        try {
            const response = await fetchData({
                body: {
                    coverLetter, jobPostingId: id
                }
            })

            if (response && !response.error) {
                onClose()
            }
        }
        catch (error) {
            console.log(error.response.data)
        }
    }

    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, margin: "10px", display: "flex", flexDirection: "column", width: "500px", boxSizing: "border-box" }}>

                <Formik
                    initialValues={{ coverLetter: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        onApply(values.coverLetter)
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <div style={{ marginBottom: "20px", width: "100%" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                    <Field
                                        as={TextField}
                                        multiline
                                        rows={5}
                                        name="coverLetter"
                                        label="Cover Letter"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.coverLetter}
                                        sx={{ flex: 1 }}
                                        error={Boolean(errors.coverLetter && touched.coverLetter)}
                                        helperText={touched.coverLetter && errors.coverLetter ? errors.coverLetter : ''}
                                    />
                                </div>
                            </div>



                            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }} >


                                <div style={{ flex: 1, marginRight: "10px" }} >
                                    <Button
                                        variant="outlined"
                                        onClick={() => { onClose(); }}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                <div style={{ flex: 1 }} >
                                    <Button
                                        variant="contained"
                                        type='submit'
                                        fullWidth
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default JobApplyModal;
