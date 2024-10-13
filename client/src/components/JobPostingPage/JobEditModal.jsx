import React, { useState, useEffect } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import SkillsMultiSelectField from '../SkillsMultiSelectField';
import { useAxios } from '../../hooks/useAxios';
import TextInputField from '../common/TextInputField';
import DatePickerField from '../common/DatePickerField';
import SelectInputField from '../common/SelectInputField';

const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
    skills: Yup.array().min(1, 'At least one skill is required'),
});

function JobEditModal({ jobData, isVisible, onClose, setToRefreshApplications }) {
    const [initalSkills, setInitalSkills] = useState([])


    useEffect(() => {
        const skillList = jobData?.skills?.map((item, index) => ({
            ...item,
            id: index, // Assuming you want sequential IDs starting from 1
            label: item.name,
        }));
        setInitalSkills(skillList)
    }, []);

    const { fetchData: editJob } = useAxios({ method: "PUT", manual: true })
    const handleSubmitSkills = async (values) => {
        try {
            const result = await editJob({
                url: `/job-posting/edit-job`,
                body: {
                    ...values,
                    postId: jobData._id
                }
            })
            if (result && !result.error) {
                setToRefreshApplications(result)
                onClose()
            }
        }
        catch (err) {
            console.log(err)
        }
    };



    const initialValues = {
        jobTitle: jobData?.jobTitle || '',
        companyName: jobData?.companyName || '',
        location: jobData?.location || '',
        description: jobData?.description || '',
        skills: initalSkills || [],
        applicationDeadline: jobData?.applicationDeadline ? dayjs(jobData.applicationDeadline) : null,
        status: jobData?.status || 'active'
    };

    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", mx: 2 }}
        >
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, boxSizing: "border-box", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" } }}>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmitSkills(values);
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
                                <TextInputField
                                    name="location"
                                    label="Location"
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                />

                                <SkillsMultiSelectField
                                    name="skills"
                                    label="Add Skill"
                                    values={values}
                                    setFieldValue={(fieldName, value) => setFieldValue(fieldName, value)}
                                    errors={errors}
                                    touched={touched}
                                />



                                <DatePickerField
                                    name="applicationDeadline"
                                    label="Application Deadline"
                                />

                                <SelectInputField
                                    name="status"
                                    label="Status"
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    menuItems={['active', 'expired']}
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
                                <Button variant="outlined" onClick={onClose} fullWidth>
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit" fullWidth>
                                    Save
                                </Button>

                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default JobEditModal;
