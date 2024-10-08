import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Accordion, AccordionDetails, AccordionSummary, Button, Typography, TextField, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../../hooks/useAxios'; // Assuming your hook is in this path

import { addEduaction, deletEducation, editEducation } from '../../../redux';

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
    const submitEdit = async (institutionName, degree, graduationYear) => {
        const values = { educationIndex: indexOfItem, institutionName, degree, graduationYear };
        try {
            const result = await editEducationData({ url: `/cv/edit-education`, body: values });
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
    const submitAdd = async (institutionName, degree, graduationYear) => {
        const values = { institutionName, degree, graduationYear };
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

    return !isEditMode ? (
        <Accordion
            sx={{
                padding: '5px',
                marginBottom: '20px',
                borderRadius: '10px',
                boxShadow: 'none',
                '&::before': { display: 'none' },
                '&::after': { display: 'none' },
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                Education
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    {data?.education?.map((item, index) => (
                        <Box key={index}>
                            <Divider />
                            <div
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '7px', cursor: 'pointer' }}
                                onClick={() => {
                                    setIndexOfItem(index);
                                    setIsEditMode(true);
                                }}
                            >
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        {item.degree}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                        ,{item?.institutionName}
                                    </Typography>
                                </div>
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <Typography variant="body2">{item?.graduationYear}</Typography>
                                </div>
                            </div>
                            <Divider />
                        </Box>
                    ))}
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <Button variant="outlined" onClick={() => setIsEditMode(true)}>
                        Add education
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    ) : (
        <div className="sidbar-item-con">
            <Formik
                validationSchema={validationSchema}
                initialValues={{
                    education: data?.education?.[indexOfItem]
                        ? [
                            {
                                institutionName: data.education[indexOfItem].institutionName,
                                degree: data.education[indexOfItem].degree,
                                graduationYear: data.education[indexOfItem].graduationYear,
                            },
                        ]
                        : [{ institutionName: '', degree: '', graduationYear: '' }],
                }}
                onSubmit={(values) => {
                    const item = values.education[0];
                    if (indexOfItem !== null) {
                        submitEdit(item.institutionName, item.degree, item.graduationYear);
                    } else {
                        submitAdd(item.institutionName, item.degree, item.graduationYear);
                    }
                }}
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form style={{ width: '100%' }}>
                        <div key={indexOfItem} style={{ marginBottom: '20px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <Field
                                    as={TextField}
                                    name={`education[0].institutionName`}
                                    label="Institution Name"
                                    sx={{ flex: 1, marginRight: '10px' }}
                                    value={values.education[0].institutionName}
                                    onChange={handleChange}
                                    error={Boolean(errors.education?.[0]?.institutionName && touched.education?.[0]?.institutionName)}
                                    helperText={touched.education?.[0]?.institutionName && errors.education?.[0]?.institutionName}
                                />

                                <Field
                                    as={TextField}
                                    name={`education[0].graduationYear`}
                                    label="Graduation Year"
                                    sx={{ flex: 1 }}
                                    value={values.education[0].graduationYear}
                                    onChange={handleChange}
                                    type="number"
                                    error={Boolean(errors.education?.[0]?.graduationYear && touched.education?.[0]?.graduationYear)}
                                    helperText={touched.education?.[0]?.graduationYear && errors.education?.[0]?.graduationYear}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <Field
                                    as={TextField}
                                    name={`education[0].degree`}
                                    label="Degree"
                                    sx={{ flex: 3 }}
                                    onChange={handleChange}
                                    value={values.education[0].degree}
                                    error={Boolean(errors.education?.[0]?.degree && touched.education?.[0]?.degree)}
                                    helperText={touched.education?.[0]?.degree && errors.education?.[0]?.degree}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {indexOfItem !== 0 && indexOfItem !== null && (
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                                    <IconButton
                                        onClick={() => {
                                            deleteItem(indexOfItem);
                                            setIndexOfItem(null);
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: '30px' }} />
                                    </IconButton>
                                </div>
                            )}
                            <div style={{ flex: 1, marginRight: '10px' }}>
                                <Button variant="outlined" onClick={() => {
                                    setIsEditMode(false);
                                    setIndexOfItem(null);
                                }} fullWidth>
                                    Cancel
                                </Button>
                            </div>

                            <div style={{ flex: 1 }}>
                                <Button variant="contained" type="submit" fullWidth>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Education;
