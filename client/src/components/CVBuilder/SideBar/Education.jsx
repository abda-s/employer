import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Accordion, AccordionDetails, AccordionSummary, Button, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../../hooks/useAxios'; // Assuming your hook is in this path

import { addEduaction, deletEducation, editEducation } from '../../../redux';
import TextInputField from '../../common/TextInputField';

const validationSchema = Yup.object({
    education: Yup.array().of(
        Yup.object({
            institutionName: Yup.string().required('Institution Name is required'),
            degree: Yup.string().required('Degree is required'),
            graduationYear: Yup.number()
                .required('Year of Graduation is required')
                .min(1950, 'Too small')
                .max(2050, 'Too large')
                .integer('Year of Graduation must be a valid number'),
        })
    ),
});

function Education() {
    const data = useSelector((state) => state?.cv);
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);

    // Using the custom useAxios hook
    const { fetchData: editEducationData } = useAxios({ method: 'PUT', manual: true });
    const submitEdit = async (values) => {
        const { institutionName, degree, graduationYear } = values
        const body = { educationIndex: indexOfItem, institutionName, degree, graduationYear };
        try {
            const result = await editEducationData({ url: `/cv/edit-education`, body });
            if (!result.error) {
                setIsEditMode(false);
                setIndexOfItem(null);
                dispatch(editEducation(indexOfItem, institutionName, degree, graduationYear));
            }
        } catch (err) {
            console.log(err);
        }
    };


    const { fetchData: addEducationData } = useAxios({ method: 'PUT', manual: true });
    const submitAdd = async (values) => {
        const { institutionName, degree, graduationYear } = values
        try {
            const result = await addEducationData({ url: `/cv/add-education`, body: values });
            if (result && !result.error) {
                setIsEditMode(false);
                dispatch(addEduaction(institutionName, degree, graduationYear));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const { fetchData: deleteEducationData } = useAxios({ method: 'DELETE', manual: true });
    const deleteItem = async (index) => {
        try {
            const result = await deleteEducationData({ url: `/cv/education/${index}` });
            if (result && !result.error) {
                setIsEditMode(false);
                dispatch(deletEducation(index));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const initialValues = data?.education?.[indexOfItem] ? {
        institutionName: data.education[indexOfItem].institutionName,
        degree: data.education[indexOfItem].degree,
        graduationYear: data.education[indexOfItem].graduationYear,
    } : { institutionName: '', degree: '', graduationYear: '' }


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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                Education
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
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {data?.education?.map((educationItem, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                                {index === 0 && <Divider />}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 2,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        setIndexOfItem(index);
                                        setIsEditMode(true);
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        {educationItem.degree}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                        {educationItem.institutionName}
                                    </Typography>
                                </Box>
                                <Divider />
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={() => setIsEditMode(true)}>
                            Add education
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    ) : (
        <Box className="sidbar-item-con">
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values) => {
                    if (indexOfItem !== null) {
                        submitEdit(values);
                    } else {
                        submitAdd(values);
                    }
                }}
            >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                    <Form style={{ width: '100%' }}>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h6"  >Edit Experience</Typography>
                                <Divider />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>

                                <TextInputField
                                    name="institutionName"
                                    label="Institution Name"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />
                                <TextInputField
                                    name="graduationYear"
                                    label="Graduation Year"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    type="number"
                                />

                            </Box>

                            <TextInputField
                                name="degree"
                                label="Degree"
                                values={values}
                                touched={touched}
                                errors={errors}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                            />

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
    );
}

export default Education;

