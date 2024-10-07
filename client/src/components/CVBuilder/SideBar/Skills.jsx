import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Accordion, AccordionDetails, AccordionSummary, Button, Typography, TextField, IconButton, Box} from '@mui/material';
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

// Use Axios hook for adding a skill
const { fetchData: addSkillData } = useAxios({
    url: '/cv/add-skill',
    method: 'PUT',
    manual: true,
});

// Use Axios hook for editing a skill
const { fetchData: editSkillData } = useAxios({
    url: '/cv/edit-skill',
    method: 'PUT',
    manual: true,
});

// Use Axios hook for deleting a skill
const { fetchData: deleteSkillData } = useAxios({
    url: `/cv/skill/${indexOfItem}`,
    method: 'DELETE',
    manual: true,
});

const submitAdd = async (skillId, level) => {
    const result = await addSkillData({ body: { skillId, level } });
    if (!result.error) {
        setIsEditMode(false);
        setIndexOfItem(null);
        dispatch(addSkill(skillId, level));
    } else {
        console.log(result.error);
    }
};

const deleteItem = async (index) => {
    const result = await deleteSkillData();
    if (!result.error) {
        setIndexOfItem(null);
        setIsEditMode(false);
        dispatch(deleteSkill(index));
    } else {
        console.log(result.error);
    }
};

const submitEdit = async (values) => {
    const { level } = values;
    const result = await editSkillData({ body: { level, skillsIndex: indexOfItem } });
    if (!result.error) {
        setIsEditMode(false);
        setIndexOfItem(null);
        dispatch(editSkill(indexOfItem, level));
    } else {
        console.log(result.error);
    }
};

    return !isEditMode ? (
        <Accordion
            sx={{
                padding: "5px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "none",
                "&::before": {
                    display: "none"
                },
                "&::after": {
                    display: "none"
                }
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
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    {data?.employeeSkills?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Divider />
                            <div
                                style={{ width: "100%", display: "flex", flexDirection: "column", padding: "7px", cursor: "pointer" }}
                                onClick={() => {
                                    setIndexOfItem(index);
                                    setIsEditMode(true);
                                }}
                            >
                                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                                    <div style={{ display: "flex", flex: 1, justifyContent: "center" }} >
                                        <Typography variant="body1">{item?.skillId?.name}</Typography>
                                    </div>
                                    <div style={{ display: "flex", flex: 1, justifyContent: "center" }} >
                                        <Typography variant="body1">{item?.level}</Typography>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                        </React.Fragment>
                    ))}
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "15px" }}>
                    <Button
                        variant="outlined"
                        onClick={() => { setIsEditMode(true); }}
                    >
                        Add Skill
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    ) : (
        <div className="sidbar-item-con">
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
                        <div style={{ marginBottom: "20px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%" }}>
                                {indexOfItem !== null ? (
                                    <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", mt: 1 }} >
                                        <Box sx={{ fontSize: "18px" }} >
                                            {values.skillId.name}

                                        </Box>
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
                            </div>
                        </div>
                        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
                            {indexOfItem !== null && (
                                <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
                                    <IconButton onClick={() => { deleteItem(indexOfItem); setIsEditMode(false); }}>
                                        <DeleteIcon sx={{ fontSize: "30px" }} />
                                    </IconButton>
                                </div>
                            )}
                            <div style={{ flex: 1, marginRight: "10px" }}>
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
                            <div style={{ flex: 1 }}>
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
    );
}

export default Skills;
