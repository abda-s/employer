import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Accordion, FormControl, AccordionDetails, AccordionSummary, Button, Typography, TextField, IconButton, Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import dayjs from "dayjs"

import { addExperience, deleteExperience, editExperience } from '../../../redux';
import { useAxios } from '../../../hooks/useAxios';


const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job Title is required'),
    companyName: Yup.string().required('Company Name is required'),
    startDate: Yup.date().nullable(false).required('Start Date is required'),
    endDate: Yup.date()
        .nullable(false)
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date cannot be before Start Date'),
    description: Yup.string().required('Description is required'),

});


function Experience() {
    const data = useSelector(state => state.cv)
    const dispatch = useDispatch()

    const [isEditMode, setIsEditMode] = useState(false)
    const [indexOfItem, setIndexOfItem] = useState(null)

    
    const { fetchData: editExperienceData } = useAxios({ method: 'PUT', manual: true });
    const submitEdit = async (values) => {
        const params = { ...values, experienceIndex: indexOfItem };
        try {
            const result = await editExperienceData({ url: `/cv/edit-experience`, body: params });
            if (result && !result.error) {
                setIsEditMode(false);
                setIndexOfItem(null);
                const { jobTitle, companyName, description, startDate, endDate } = values
                dispatch(editExperience(indexOfItem, jobTitle, companyName, description, startDate, endDate));
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    };


    // useAxios hook for adding experience
    const { fetchData: addExperienceData } = useAxios({ method: 'PUT', manual: true });
    const submitAdd = async (values) => {
        try {
            const result = await addExperienceData({ url: `/cv/add-experience`, body: values });
            if (result && !result.error) {
                setIsEditMode(false);
                const { jobTitle, companyName, description, startDate, endDate } = values
                dispatch(addExperience(jobTitle, companyName, description, startDate, endDate));
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    };


    // useAxios hook for deleting experience
    const { fetchData: deleteExperienceData } = useAxios({method: 'DELETE',manual: true});
    const deleteItem = async (index) => {
        try {
            const result = await deleteExperienceData({url: `/cv/experience/${index}`});
            if (result && !result.error) {
                setIsEditMode(false);
                dispatch(deleteExperience(index));
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    };


    return !isEditMode ? (
        <Accordion
            sx={{
                padding: "5px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "none",  // Removes the shadow

                "&::before": {
                    display: "none" // Hides the before pseudo-element
                },
                "&::after": {
                    display: "none" // Hides the after pseudo-element
                }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Experience
            </AccordionSummary>
            <AccordionDetails
                sx={{ mp: 2 }}
            >
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }} >
                    {data?.experience?.map((item, index) => {
                        return (
                            <Box key={index} sx={{ width: "100%", display: "flex", flexDirection: "column" }} >
                                <Divider />
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", padding: "7px", cursor: "pointer" }}
                                    onClick={() => { setIndexOfItem(index); setIsEditMode(true); }}
                                >
                                    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                                        <Typography variant="body2" sx={{}} >
                                            {item.jobTitle}
                                        </Typography>
                                        <Typography variant="body1" >
                                            {item.companyName}
                                        </Typography  >
                                    </Box>

                                    <Box sx={{ width: "100%", display: "flex" }}>
                                        <Typography variant="body2" sx={{ color: "GrayText" }} >
                                            {item.description}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                                        <Typography variant="body1">
                                            {moment(item.startDate).format("YYYY/MM")}
                                        </Typography  >
                                        <Typography variant="body1" sx={{ fontWeight: 700, marginLeft: "5px", marginRight: "5px" }} >
                                            |
                                        </Typography  >
                                        <Typography variant="body1">
                                            {moment(item.endDate).format("YYYY/MM")}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider />
                            </Box>
                        )
                    })}
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "15px" }} >
                    <Button
                        variant="outlined"
                        onClick={() => { setIsEditMode(true); }}

                    >
                        Add experience
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    ) : (
        <Box className="sidbar-item-con" sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Formik
                validationSchema={validationSchema}
                initialValues={
                    indexOfItem !== null && data?.experience?.[indexOfItem] ? {
                        jobTitle: data.experience[indexOfItem]?.jobTitle || "",
                        companyName: data.experience[indexOfItem]?.companyName || "",
                        description: data.experience[indexOfItem]?.description || "",
                        startDate: dayjs(data.experience[indexOfItem]?.startDate) || null,
                        endDate: dayjs(data.experience[indexOfItem]?.endDate) || null,
                    } : {
                        jobTitle: "",
                        companyName: "",
                        description: "",
                        startDate: null,
                        endDate: null,
                    }
                }
                onSubmit={values => {
                    if (indexOfItem !== null) {
                        submitEdit(values)
                    } else {
                        submitAdd(values)
                    }
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                    <Form
                        onSubmit={handleSubmit}
                        sx={{ width: "100%" }}
                    >
                        <Box sx={{ marginBottom: "20px", width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                <Field
                                    as={TextField}
                                    name="jobTitle"
                                    label="Job Title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.jobTitle}
                                    sx={{ flex: 1, marginRight: "5px" }}
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
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
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
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>

                                <FormControl sx={{ flex: 1, marginRight: "10px" }} size="Normal" variant="outlined">
                                    <Field name={`startDate`}>
                                        {({ field, form }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <DatePicker
                                                    label="Start Date"
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
                                    <ErrorMessage name={`startDate`} component="span" style={{ color: 'red' }} />

                                </FormControl>

                                <FormControl sx={{ flex: 1, marginBottom: "24px" }} size="Normal" variant="outlined">
                                    <Field name={`endDate`}>
                                        {({ field, form }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ flex: 1 }}>
                                                <DatePicker
                                                    sx={{ flex: 1 }}
                                                    label="End Date"
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
                                    <ErrorMessage name={`endDate`} component="div" style={{ color: 'red', }} />
                                </FormControl>

                            </Box>

                        </Box>
                        <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }} >

                            {(indexOfItem !== 0 && indexOfItem !== null) && (
                                <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
                                    <IconButton onClick={() => { deleteItem(indexOfItem); setIndexOfItem(null); }}><DeleteIcon sx={{ fontSize: "30px" }} /></IconButton>
                                </Box>
                            )}
                            <Box sx={{ flex: 1, marginRight: "10px" }} >
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setIsEditMode(false);
                                        setIndexOfItem(null);
                                    }}
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
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>

    )
}

export default Experience