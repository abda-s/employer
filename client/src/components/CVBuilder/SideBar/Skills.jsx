import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Accordion, AccordionDetails, AccordionSummary, Button, Typography, TextField, IconButton, Box, FormControl, Autocomplete } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { serverURL } from '../../../constants';
import { addSkill, deleteSkill, editSkill } from '../../../redux';

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
    const accessToken = useSelector(state => state.auth.token);

    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        getSkills();
    }, []);

    const getSkills = () => {
        axios.get(`${serverURL}/skills/all-skills/`, { headers: { accessToken } })
            .then(response => {
                const skillList = response?.data?.map((item, index) => ({
                    ...item,
                    id: index, // Assuming you want sequential IDs starting from 1
                    label: item?.name,
                }));
                setOptions(skillList);
            })
            .catch(err => {
                console.log("Error fetching skills: ", err);
            });
    };

    const submitAdd = (skillId, level) => {
        axios.put(`${serverURL}/cv/add-skill`, { skillId, level }, { headers: { accessToken } })
            .then(() => {
                setIsEditMode(false);
                setIndexOfItem(null);
                dispatch(addSkill(skillId, level));
            })
            .catch(err => { console.log(err.message); });
    };

    const deleteItem = index => {
        axios.delete(`${serverURL}/cv/skill/${index}`, { headers: { accessToken } })
            .then(() => {
                setIndexOfItem(null);
                setIsEditMode(false);
                dispatch(deleteSkill(index));
            })
            .catch(err => { console.log(err.message); });
    };

    const submitEdit = values => {
        const { level } = values;
        axios.put(`${serverURL}/cv/edit-skill`, { level, skillsIndex: indexOfItem }, { headers: { accessToken } })
            .then(() => {
                setIsEditMode(false);
                setIndexOfItem(null);
                dispatch(editSkill(indexOfItem, level));

            })
            .catch(err => {
                console.log(err);
            });
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
                            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px", width: "100%"}}>
                                {indexOfItem !== null ? (
                                    <Box sx={{ display: "flex", flex: 1 ,alignItems: "center", justifyContent: "center",mt:1 }} >
                                        <Box sx={{fontSize:"18px"}} >
                                            {values.skillId.name}

                                        </Box>
                                    </Box>
                                ) : (
                                    <FormControl sx={{ flex: 1, mr: 1 }}>
                                        <Autocomplete
                                            options={options}
                                            value={options.find(option => option._id === values.skillId?._id) || null}
                                            freeSolo
                                            onChange={(event, newValue) => {
                                                // Set newValue if it's a string or an object
                                                if (typeof newValue === 'string') {
                                                    setFieldValue('skillId', { name: newValue, _id: null });
                                                } else if (newValue && typeof newValue === 'object') {
                                                    setFieldValue('skillId', newValue);
                                                } else {
                                                    setFieldValue('skillId', null);
                                                }
                                            }}
                                            getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                                            filterOptions={(options, { inputValue }) => {
                                                const filteredOptions = options.filter(option =>
                                                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                );
                                                if (inputValue && !filteredOptions.some(option => option.name === inputValue)) {
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
                                                    label="Skill"
                                                    error={Boolean(errors.skillId && touched.skillId)}
                                                    helperText={touched.skillId && errors.skillId ? errors.skillId : ''}
                                                />
                                            )}
                                        />
                                    </FormControl>
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
