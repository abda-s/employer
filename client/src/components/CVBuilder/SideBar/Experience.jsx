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
import TextInputField from '../../common/TextInputField';
import DatePickerField from '../../common/DatePickerField';


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
    const { fetchData: deleteExperienceData } = useAxios({ method: 'DELETE', manual: true });
    const deleteItem = async (index) => {
        try {
            const result = await deleteExperienceData({ url: `/cv/experience/${index}` });
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
                p: 1,
                mb: 3,
                borderRadius: 2,
                boxShadow: 'none',
                '&::before': { display: 'none' },
                '&::after': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Experience
            </AccordionSummary>
            <AccordionDetails>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >

                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }} >
                        {data?.experience?.map((item, index) => {
                            return (
                                <Box key={index} sx={{ width: "100%", display: "flex", flexDirection: "column" }} >
                                    {index === 0 && <Divider />}

                                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", p: 2, cursor: "pointer" }}
                                        onClick={() => { setIndexOfItem(index); setIsEditMode(true); }}
                                    >
                                        <Box sx={{ width: "100%" }}>
                                            <Typography variant="body1" component="span" sx={{ fontWeight: 700 }} >
                                                {item.companyName}
                                            </Typography>
                                            <Typography variant="body1" component="span" >
                                                {`, ${item.jobTitle}`}
                                            </Typography  >
                                        </Box>

                                        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1">
                                                {moment(item.startDate).format("YYYY/MM")}
                                            </Typography  >
                                            <Typography variant="body1" sx={{ mx: 1 }} >
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
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }} >
                        <Button
                            variant="outlined"
                            onClick={() => { setIsEditMode(true); }}
                        >
                            Add experience
                        </Button>
                    </Box>
                </Box>

            </AccordionDetails>
        </Accordion>
    ) : (
        <Box className="sidbar-item-con" >
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
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{mb:1}}>
                                <Typography variant="h6"  >Edit Experience</Typography>
                                <Divider />
                            </Box>

                            <Box sx={{ display: "flex", width: "100%", gap: 2 }}>

                                <TextInputField
                                    name="jobTitle"
                                    label="Job Title"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />

                                <TextInputField
                                    name="companyName"
                                    label="Company Name"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />
                            </Box>
                            <TextInputField
                                name="description"
                                label="Description"
                                values={values}
                                touched={touched}
                                errors={errors}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                multiline={true}
                            />

                            <Box sx={{ display: "flex", width: "100%", gap: 2 }}>

                                <DatePickerField
                                    name="startDate"
                                    label="Start Date"
                                />

                                <DatePickerField
                                    name="endDate"
                                    label="End Date"
                                />

                            </Box>

                            <Box sx={{ width: '100%', display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>

                                {indexOfItem !== 0 && indexOfItem !== null && (
                                    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                                        <IconButton
                                            onClick={() => {
                                                deleteItem(indexOfItem);
                                                setIndexOfItem(null);
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: '28px' }} />
                                        </IconButton>
                                    </Box>
                                )}

                                <Button variant="outlined" fullWidth onClick={() => {
                                    setIsEditMode(false);
                                    setIndexOfItem(null);
                                }} >
                                    Cancel
                                </Button>

                                <Button variant="contained" type="submit" fullWidth>
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