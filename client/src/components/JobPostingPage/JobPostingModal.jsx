import React from 'react';
import { Button, Modal, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import SkillsMultiSelectField from '../SkillsMultiSelectField';
import { useAxios } from '../../hooks/useAxios';
import TextInputField from '../common/TextInputField';
import DatePickerField from '../common/DatePickerField';

const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),

    skills: Yup.array().min(1, 'At least one requirement is required'),
});

const initialValues = {
    jobTitle: '',
    companyName: '',
    location: '',
    description: '',
    skills: [],
    applicationDeadline: null
}

function JobPostingModal({ isVisible, setIsVisible, setToRefresh }) {

    const { fetchData: editJob } = useAxios({ method: "POST", manual: true })
    const handleSubmitReq = async (values) => {
        try {
            const result = await editJob({ url: "/job-posting/add-job", body: values })
            if (result && !result.error) {
                setIsVisible(false)
                setToRefresh(result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Modal
            open={isVisible}
            onClose={() => setIsVisible(false)}
            sx={{ display: "flex", alignItems: "center", mx: 2 }}
        >
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, boxSizing: "border-box", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" } }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmitReq(values)
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 2,
                                    width: "100%",
                                    mb: 2
                                }}
                            >
                                <TextInputField
                                    name="jobTitle"
                                    label="Job Title"
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                />
                                <TextInputField
                                    name="companyName"
                                    label="Company Name"
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                />

                                <SkillsMultiSelectField
                                    name="skills"
                                    label="Add skills"
                                    values={values}
                                    setFieldValue={(fieldName, value) => setFieldValue(fieldName, value)}
                                    errors={errors}
                                    touched={touched}
                                />

                                <DatePickerField
                                    name="applicationDeadline"
                                    label="Application Deadline"
                                />

                                <TextInputField
                                    name="location"
                                    label="Location"
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                />

                            </Box>
                            <TextInputField
                                name="description"
                                label="Description"
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={errors}
                                touched={touched}
                                multiline={true}
                            />

                            <Box display="flex" width="100%" alignItems="center" gap={2} justifyContent="center" mt={2}>
                                <Button variant="outlined" onClick={() => setIsVisible(false)} fullWidth>
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit" fullWidth>
                                    Add
                                </Button>
                            </Box>

                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default JobPostingModal;
