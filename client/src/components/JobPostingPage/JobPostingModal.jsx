import React, { useEffect, useState } from 'react';
import { TextField, FormControl, Button, Modal, Box, Autocomplete } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { serverURL } from '../../constants';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),

    requirements: Yup.array().min(1, 'At least one requirement is required'),
});

function JobPostingModal({ isVisible, setIsVisible,setToRefresh }) {
    const accessToken = useSelector(state => state.auth.token)
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        getSkills();
    }, [])

    const getSkills = () => {
        axios.get(`${serverURL}/skills/all-skills/`, { headers: { accessToken } })
            .then(response => {
                const skillList = response?.data?.map((item, index) => ({
                    ...item,
                    id: index, // Assuming you want sequential IDs starting from 1
                    label: item.name,
                }));
                setOptions(skillList)

            })
            .catch(err => {
                console.log("error fetching skills: ", err);
            })
    }

    const handleAddOption = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            setOptions([...options, event.target.value]);
            event.target.value = '';
        }
    };

    const handleSubmitReq = (jobTitle, companyName, location, description, requirements, applicationDeadline) => {
        axios.post(`${serverURL}/job-posting/add-job`, {
            jobTitle,
            companyName,
            location,
            description,
            requirements,
            applicationDeadline,
            skills: requirements,
        }, { headers: { accessToken } })
            .then(response => {
                setIsVisible(false)
                setToRefresh(response)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Modal
            open={isVisible}
            onClose={() => setIsVisible(false)}
            sx={{ display: "flex", alignItems: "center", margin: "0", p: 2 }}
        >
            <Box component="section" sx={{ p: 2, backgroundColor: "white", borderRadius: 3, boxSizing: "border-box", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" } }}>
                <Formik
                    initialValues={{ jobTitle: '', companyName: '', location: '', description: '', requirements: [], applicationDeadline: null }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);

                        handleSubmitReq(values.jobTitle, values.companyName, values.location, values.description, values.requirements, values.applicationDeadline)
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: "20px",
                                    width: "100%",
                                }}
                            >
                                <Field
                                    as={TextField}
                                    name="jobTitle"
                                    label="Job Title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.jobTitle}
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
                                    error={Boolean(errors.companyName && touched.companyName)}
                                    helperText={touched.companyName && errors.companyName ? errors.companyName : ''}
                                />

                                <FormControl sx={{ flex: 1 }} variant="outlined">
                                    <Field
                                        component={Autocomplete}
                                        multiple
                                        options={options}
                                        freeSolo
                                        name="requirements"
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
                                            setFieldValue('requirements', formattedValue);
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
                                                label="Add requirement"
                                                onKeyDown={handleAddOption} // Optional: handle keydown if needed
                                                error={Boolean(errors.requirements && touched.requirements)}
                                                helperText={touched.requirements && errors.requirements ? errors.requirements : ''}
                                            />
                                        )}
                                    />
                                </FormControl>

                                <FormControl sx={{ flex: 1 }} variant="outlined">
                                    <Field name="applicationDeadline">
                                        {({ field, form }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Application Deadline"
                                                    value={field.value}
                                                    onChange={(newValue) => form.setFieldValue(field.name, newValue)}
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
                                <Field
                                    as={TextField}
                                    name="location"
                                    label="Location"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.location}
                                    error={Boolean(errors.location && touched.location)}
                                    helperText={touched.location && errors.location ? errors.location : ''}
                                />
                            </Box>
                            <Field
                                as={TextField}
                                sx={{ marginTop: "20px" }}
                                multiline
                                fullWidth
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                error={Boolean(errors.description && touched.description)}
                                helperText={touched.description && errors.description ? errors.description : ''}
                            />
                            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
                                <div style={{ flex: 1, marginRight: "10px" }}>
                                    <Button variant="outlined" onClick={() => setIsVisible(false)} fullWidth>
                                        Cancel
                                    </Button>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Button variant="contained" type="submit" fullWidth>
                                        Add
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

export default JobPostingModal;
