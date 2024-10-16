import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
    coverLetter: Yup.string().required('Cover Letter is required'),
});

function JobApplyModal({ isVisible, onClose, id, setToRefeshJobListing }) {

    const { fetchData: applyApplication } = useAxios({ method: "POST", manual: true })
    const onApply = async (coverLetter) => {
        try {
            const response = await applyApplication({
                url: `/application`,
                body: {
                    coverLetter, jobPostingId: id
                }
            })

            if (response && !response.error) {
                onClose()
                setToRefeshJobListing(response)
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
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, m: 2, display: "flex", flexDirection: "column", width: "480px", boxSizing: "border-box" }}>

                <Formik
                    initialValues={{ coverLetter: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        onApply(values.coverLetter)
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <Box sx={{ marginBottom: "20px", width: "100%" }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
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
                                </Box>
                            </Box>



                            <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }} >


                                <Box sx={{ flex: 1, marginRight: "10px" }} >
                                    <Button
                                        variant="outlined"
                                        onClick={() => { onClose(); }}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </Box>

                                <Box sx={{ flex: 1 }} >
                                    <Button
                                        variant="contained"
                                        type='submit'
                                        fullWidth
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default JobApplyModal;

