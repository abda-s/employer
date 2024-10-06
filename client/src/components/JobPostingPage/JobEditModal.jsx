import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, FormControl, Button, Autocomplete, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { serverURL } from '../../constants';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
    skills: Yup.array().min(1, 'At least one skill is required'),
});

function JobEditModal({ jobData, isVisible, onClose, onSave, setToRefresh }) {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [initalSkills,setInitalSkills] = useState([])

    const accessToken = useSelector(state => state.auth.token);

    useEffect(() => {
        getSkills();
        const skillList = jobData?.skills?.map((item, index) => ({
            ...item,
            id: index, // Assuming you want sequential IDs starting from 1
            label: item.name,
        }));
        setInitalSkills(skillList)

    }, []);

    const getSkills = () => {
        axios.get(`${serverURL}/skills/all-skills/`, { headers: { accessToken } })
            .then(response => {
                const skillList = response?.data?.map((item, index) => ({
                    ...item,
                    id: index, // Assuming you want sequential IDs starting from 1
                    label: item.name,
                }));
                setOptions(skillList);
            })
            .catch(err => {
                console.log("Error fetching skills: ", err);
            });
    };

    const handleAddOption = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            setOptions([...options, { _id: null, name: event.target.value }]);
            event.target.value = '';
        }
    };

    const handleSubmitSkills = (values) => {
        axios.put(`${serverURL}/job-posting/edit-job`, {
            jobTitle: values.jobTitle,
            companyName: values.companyName,
            location: values.location,
            description: values.description,
            skills: values.skills,
            applicationDeadline: values.applicationDeadline,
            status: values.status,
            postId: jobData._id
        }, { headers: { accessToken } })
            .then(response => {
                console.log(response.data);
                
                setToRefresh(response.data)
                onClose();
            })
            .catch(err => {
                console.log(err.message);
            });
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

                                    <FormControl sx={{ flex: 1 }}>
                                        <Field
                                            component={Autocomplete}
                                            multiple
                                            options={options}
                                            value={values.skills}
                                            freeSolo
                                            name="skills"
                                            sx={{ flex: 1 }}
                                            inputValue={inputValue}
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue); // Track input value for filtering
                                            }}
                                            onChange={(event, value) => {
                                                // Handle freeSolo custom entries by checking if it's a string
                                                const formattedValue = value.map((item) =>
                                                    typeof item === 'string'
                                                        ? { _id: null, name: item } // Create object with _id as null
                                                        : item // Return existing object if it's already structured
                                                );
                                                setFieldValue('skills', formattedValue);
                                            }}
                                            getOptionLabel={(option) => typeof option === 'string' ? option : option.name} // Handle both freeSolo and existing options
                                            filterOptions={(options, { inputValue }) => {
                                                const filteredOptions = inputValue
                                                    ? options.filter(option =>
                                                        option.name && option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                    )
                                                    : [];

                                                // Add the input value as an object with _id: null if it's not already present
                                                if (inputValue !== '' && !filteredOptions.some(option => option.name === inputValue)) {
                                                    filteredOptions.push({
                                                        _id: null,
                                                        name: inputValue
                                                    });
                                                }

                                                return filteredOptions;
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Add Skill"
                                                    onKeyDown={handleAddOption} // Optional: handle keydown if needed
                                                    error={Boolean(errors.skills && touched.skills)}
                                                    helperText={touched.skills && errors.skills ? errors.skills : ''}
                                                />
                                            )}
                                        />
                                    </FormControl>

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
                                            <MenuItem value="inactive">Inactive</MenuItem>
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
