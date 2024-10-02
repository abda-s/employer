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
import axios from 'axios';
import moment from 'moment';
import dayjs from "dayjs"
import { serverURL } from '../../../../constants';

import { addExperience, deleteExperience, editExperience } from '../../../../redux';

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
    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [isEditMode, setIsEditMode] = useState(false)
    const [indexOfItem, setIndexOfItem] = useState(null)


    const submitEdit = (jobTitle, companyName, description, startDate, endDate) => {
        axios.put(`${serverURL}/cv/edit-experience`, { experienceIndex: indexOfItem, jobTitle, companyName, description, startDate, endDate }, { headers: { accessToken: token } })
            .then((result) => {
                setIsEditMode(false)
                setIndexOfItem(null)
                dispatch(editExperience(indexOfItem, jobTitle, companyName, description, startDate, endDate))

            })
            .catch((err) => { console.log(err.message) })
    }

    const submitAdd = (jobTitle, companyName, description, startDate, endDate) => {
        axios.put(`${serverURL}/cv/add-experience`, { jobTitle, companyName, description, startDate, endDate }, { headers: { accessToken: token } })
            .then((result) => {
                setIsEditMode(false)
                dispatch(addExperience(jobTitle, companyName, description, startDate, endDate))
            })
            .catch((err) => { console.log(err.message) })
    }

    const deleteItem = index => {
        axios.delete(`${serverURL}/cv/experience/${index}`, { headers: { accessToken: token } })
            .then((result) => {

                setIsEditMode(false)
                dispatch(deleteExperience(index))
            })
            .catch((err) => { console.log(err.message) })
    }



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
            sx={{mp:2}}
            >
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }} >
                    {data?.experience?.map((item, index) => {
                        return (
                            <Box key={index} >
                                <Divider />
                                <div style={{ width: "100%", display: "flex", flexDirection: "column", padding: "7px", cursor: "pointer" }}
                                    onClick={() => { setIndexOfItem(index); setIsEditMode(true); }}
                                >
                                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                                        <Typography variant="body2" sx={{}} >
                                            {item.jobTitle}
                                        </Typography>
                                        <Typography variant="body1" >
                                            {item.companyName}
                                        </Typography  >
                                    </div>

                                    <div style={{ width: "100%", display: "flex" }}>
                                        <Typography variant="body2" sx={{ color: "GrayText" }} >
                                            {item.description}
                                        </Typography>
                                    </div>

                                    <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                        <Typography variant="body1">
                                            {moment(item.startDate).format("YYYY/MM")}
                                        </Typography  >
                                        <Typography variant="body1" sx={{ fontWeight: 700, marginLeft: "5px", marginRight: "5px" }} >
                                            |
                                        </Typography  >
                                        <Typography variant="body1">
                                            {moment(item.endDate).format("YYYY/MM")}
                                        </Typography>
                                    </div>
                                </div>
                                <Divider />
                            </Box>
                        )
                    })}
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "15px" }} >
                    <Button
                        variant="outlined"
                        onClick={() => { setIsEditMode(true); }}

                    >
                        Add experience
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    ) : (
        <div className="sidbar-item-con">
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
                    console.log("wow")
                    const item = values
                    console.log("wow")
                    if (indexOfItem !== null) {
                        submitEdit(item.jobTitle, item.companyName, item.description, item.startDate, item.endDate)
                    } else {
                        submitAdd(item.jobTitle, item.companyName, item.description, item.startDate, item.endDate)
                    }
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched, isValid }) => (
                    <Form
                        onSubmit={handleSubmit}
                        style={{ width: "100%" }}
                    >
                        <div style={{ marginBottom: "20px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
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

                            </div>

                        </div>
                        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }} >

                            {(indexOfItem !== 0 && indexOfItem !== null) && (
                                <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
                                    <IconButton onClick={() => { deleteItem(indexOfItem); setIndexOfItem(null); }}><DeleteIcon sx={{ fontSize: "30px" }} /></IconButton>
                                </div>
                            )}
                            <div style={{ flex: 1, marginRight: "10px" }} >
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
                            </div>

                            <div style={{ flex: 1 }} >
                                <Button
                                    variant="contained"
                                    type='submit'
                                    fullWidth
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    )
}

export default Experience