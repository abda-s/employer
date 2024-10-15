import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Accordion, AccordionDetails, AccordionSummary, Button, Typography, TextField, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { addSkill, deleteSkill, editSkill } from '../../../redux';
import SelectSkillsField from '../../SelectSkillsField';
import { useAxios } from '../../../hooks/useAxios';

const validationSchema = Yup.object({
    skillId: Yup.object({
        name: Yup.string().required('Name is required'),

    }),
    level: Yup.number().required('Level is required')
        .min(0, "You can't put a negative number")
        .max(10, "You are not super-man, chill the max is 10")
        .integer('Level must be a valid number')
});

function Skills() {
    const data = useSelector(state => state.cv);
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);

    const { fetchData: addSkillData } = useAxios({ method: 'PUT', manual: true });
    const submitAdd = async (skillId, level) => {
        try {
            const result = await addSkillData({ url: '/cv/add-skill', body: { skillId, level } });
            if (result && !result.error) {
                setIsEditMode(false);
                setIndexOfItem(null);
                dispatch(addSkill(skillId, level));
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const { fetchData: deleteSkillData } = useAxios({ method: 'DELETE', manual: true });
    const deleteItem = async (index) => {
        try {
            const result = await deleteSkillData({ url: `/cv/skill/${index}`, });
            if (result && !result.error) {
                setIndexOfItem(null);
                setIsEditMode(false);
                dispatch(deleteSkill(index));
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const { fetchData: editSkillData } = useAxios({ method: 'PUT', manual: true });
    const submitEdit = async (values) => {
        const { level } = values;
        try {
            const result = await editSkillData({
                url: '/cv/edit-skill',
                body: { level, skillsIndex: indexOfItem }
            });
            if (result && !result.error) {
                setIsEditMode(false);
                setIndexOfItem(null);
                dispatch(editSkill(indexOfItem, level));
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
                Skills
            </AccordionSummary>
            <AccordionDetails>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    {data?.employeeSkills?.map((item, index) => (
                        <React.Fragment key={index}>
                            {index === 0 && <Divider />}

                            <Box
                                sx={{ width: "100%", display: "flex", flexDirection: "column", p: 1, cursor: "pointer" }}
                                onClick={() => {
                                    setIndexOfItem(index);
                                    setIsEditMode(true);
                                }}
                            >
                                <Box sx={{ width: "100%", display: "flex" }}>
                                    <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start" }} >
                                        <Typography variant="body1" sx={{ fontWeight: "bold", textTransform: "capitalize" }} >{item?.skillId?.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }} >
                                        <Typography variant="body1">{`${item?.level}/10`}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider />
                        </React.Fragment>
                    ))}
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => { setIsEditMode(true); }}
                    >
                        Add Skill
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    ) : (
        <Box className="sidbar-item-con">
            <Formik
                validationSchema={validationSchema}
                initialValues={{
                    skillId: indexOfItem !== null ? data?.employeeSkills?.[indexOfItem]?.skillId || {} : {},
                    level: indexOfItem !== null ? data?.employeeSkills?.[indexOfItem]?.level || "" : "",
                }}
                onSubmit={values => {
                    if (indexOfItem !== null) {
                        submitEdit(values);
                    } else {
                        console.log(values);
                        submitAdd(values.skillId, values.level)

                        // submitAdd(values.name, values.level);
                    }
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit} style={{ width: "100%" }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <Box sx={{mb:1}} >
                                <Typography variant="h6">Edit skill level</Typography>
                                <Divider />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", gap: 2 }}>


                                {indexOfItem !== null ? (
                                    <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-start", mt: 1 }} >
                                        <Typography variant="body1" sx={{ textTransform: "capitalize" }} >{values.skillId.name}</Typography>
                                    </Box>
                                ) : (
                                    <SelectSkillsField
                                        name='skillId'
                                        label='Select skill'
                                        values={values}
                                        setFieldValue={(fieldName, values) => setFieldValue(fieldName, values)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                )}



                                <Field
                                    as={TextField}
                                    name="level"
                                    label="Level"
                                    type="number"
                                    size="small"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.level}
                                    sx={{ flex: 1 }}
                                    error={Boolean(errors.level && touched.level)}
                                    helperText={touched.level && errors.level ? errors.level : ''}
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
    );
}


export default Skills;
