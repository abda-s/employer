import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, FormControl, Button, Autocomplete, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import SkillsMultiSelectField from '../SkillsMultiSelectField';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
    skills: Yup.array().min(1, 'At least one skill is required'),
});

function JobEditModal({ jobData, isVisible, onClose, onSave, setToRefreshApplications }) {
    const [initalSkills, setInitalSkills] = useState([])


    useEffect(() => {
        const skillList = jobData?.skills?.map((item, index) => ({
            ...item,
            id: index, // Assuming you want sequential IDs starting from 1
            label: item.name,
        }));
        setInitalSkills(skillList)
    }, []);

    const { fetchData } = useAxios({
        url: `/job-posting/edit-job`,
        method: "PUT",
        manual: true
    })

    const handleSubmitSkills = async (values) => {
        console.log("values", values);
        
        try {
            const result = await fetchData({
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
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "500px", margin: "0 10px" }}>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmitSkills(values);
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }} onClick={() => console.log(values.skills)}>
                            <div style={{ marginBottom: "20px", width: "100%" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                    <Field
                                        as={TextField}
                                        name="jobTitle"
                                        label="Job Title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.jobTitle}
                                        sx={{ flex: 1, marginRight: "10px" }}
                                        error={Boolean(errors.jobTitle && touched.jobTitle)}
                                        helperText={touched.jobTitle && errors.jobTitle ? errors.jobTitle : ''}
                                    />
                                    <Field
                                        as={TextField}
                                        name="companyName"
                                        label="Company Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.companyName}
                                        sx={{ flex: 1 }}
                                        error={Boolean(errors.companyName && touched.companyName)}
                                        helperText={touched.companyName && errors.companyName ? errors.companyName : ''}
                                    />
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                    <Field
                                        as={TextField}
                                        name="location"
                                        label="Location"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.location}
                                        sx={{ flex: 1, marginRight: "10px" }}
                                        error={Boolean(errors.location && touched.location)}
                                        helperText={touched.location && errors.location ? errors.location : ''}
                                    />

                                    <SkillsMultiSelectField
                                        name="skills"
                                        label="Add Skill"
                                        values={values}
                                        setFieldValue={(fieldName, value) => setFieldValue(fieldName, value)}
                                        errors={errors}
                                        touched={touched}
                                    />

                                </div>

                                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                    <Field
                                        as={TextField}
                                        multiline
                                        name="description"
                                        label="Description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                        sx={{ flex: 1 }}
                                        error={Boolean(errors.description && touched.description)}
                                        helperText={touched.description && errors.description ? errors.description : ''}
                                    />
                                </div>

                                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                    <FormControl sx={{ flex: 1, marginRight: "10px" }} size="Normal" variant="outlined">
                                        <Field name="applicationDeadline">
                                            {({ field, form }) => (
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label="Application Deadline"
                                                        value={field.value}
                                                        onChange={(newValue) => form.setFieldValue('applicationDeadline', newValue)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                sx={{ flex: 1 }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                        <ErrorMessage name="applicationDeadline" component="span" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl sx={{ flex: 1 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Field
                                            as={Select}
                                            name="status"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.status}
                                        >
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="expired">Expired</MenuItem>
                                        </Field>
                                        <ErrorMessage name="status" component="span" style={{ color: 'red' }} />
                                    </FormControl>
                                </div>
                            </div>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                                <Button variant="outlined" onClick={onClose} sx={{ marginLeft: "10px" }}>Cancel</Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default JobEditModal;
