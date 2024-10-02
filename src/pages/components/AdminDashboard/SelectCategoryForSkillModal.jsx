import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, MenuItem, Select, InputLabel, FormControl, IconButton, FormHelperText } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { serverURL } from '../../../constants';
import { useSelector } from 'react-redux';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    skills: Yup.array().min(1, 'At least one skill must be selected'),
});

function SelectCategoryForSkillModal({ data, isVisible, onClose, skillsList, setToRefreshFetch }) {
    const accessToken = useSelector(state => state.auth.token);
    const [uncategorizedSkills, setUncategorizedSkills] = useState([]);

    useEffect(() => {
        const uncategorizedCategory = data.find(cat => cat.category.name === "Uncategorized");
        if (uncategorizedCategory) {
            setUncategorizedSkills(uncategorizedCategory.skills);
        }
    }, [isVisible, data, skillsList]);

    const handleSkillDelete = async (i) => {
        try {

            if (uncategorizedSkills[i]._id) {
                const res = await axios.delete(`${serverURL}/skills/delete-skill/${uncategorizedSkills[i]._id}`, {
                    headers: { accessToken },
                });
                setToRefreshFetch(res.data);
            }
            return true;
        } catch (err) {
            console.log('Error: ', err);
            return false;
        }

    };


    const handleSbmit = async (values) => {
        try {
            const res = await axios.put(`${serverURL}/skills/categories-skills`, values, { headers: { accessToken } })
            onClose();
            setToRefreshFetch(res)
        } catch (err) {
            console.log("Error: ", err);

        }

    }

    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box sx={modalStyles}>
                <h2>Select a category for the skills</h2>
                <Formik
                    initialValues={{ category: '', skills: [] }}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={values => {
                        console.log('Selected values:', values);
                        // Add your form submission logic here
                        handleSbmit(values);
                    }}
                >
                    {({ values, handleSubmit, handleChange, setFieldValue, errors, touched }) => (
                        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>

                            {/* Category Select */}
                            <FormControl fullWidth margin="normal" error={Boolean(errors.category && touched.category)}>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    value={values.category}
                                    onChange={handleChange}
                                    name="category"
                                    label="category"
                                >
                                    {data.map((item, index) => (
                                        item.category.name !== "Uncategorized" && (
                                            <MenuItem key={index} value={item.category._id}>
                                                {item.category.name}
                                            </MenuItem>
                                        )
                                    ))}
                                </Select>
                                {touched.category && errors.category && (
                                    <FormHelperText>{errors.category}</FormHelperText>
                                )}
                            </FormControl>


                            {/* Multi-Select for Uncategorized Skills */}
                            <Autocomplete
                                multiple
                                options={uncategorizedSkills}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => setFieldValue('skills', newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select skills"
                                        placeholder="Skills"
                                        error={Boolean(errors.skills && touched.skills)}
                                        helperText={touched.skills && errors.skills ? errors.skills : ''}
                                    />
                                )}
                                value={values.skills}

                            />

                            {/* Display Not Selected Skills */}
                            {/* <h3>Not Selected Skills</h3> */}
                            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {uncategorizedSkills
                                    .filter(skill => !values.skills.some(selectedSkill => selectedSkill._id === skill._id))
                                    .map((skill, i) => (
                                        <Box key={i} sx={skillButtonStyles} component="div">
                                            <span >{skill.name}</span>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleSkillDelete(i)}
                                            >
                                                <DeleteRoundedIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                            </Box>

                            <Box sx={buttonContainerStyles}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={buttonStyles}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={onClose}
                                    sx={buttonStyles}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

const modalStyles = {
    p: 2, m: 1, borderRadius: 3, backgroundColor: "white", display: "flex", flexDirection: "column",
    width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" },
};

const buttonContainerStyles = {
    display: "flex", marginTop: 2,
};

const buttonStyles = {
    flex: 1, marginRight: 1,
};
const skillButtonStyles = {
    m: 1,
    p: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "17px",
    borderRadius: 2,
    backgroundColor: '#f5f5f5',
};

export default SelectCategoryForSkillModal;
