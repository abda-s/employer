import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import SkillList from './EditCategoryModal/SkillList';
import SkillEditor from './EditCategoryModal/SkillEditor';
import CategoryField from './EditCategoryModal/CategoryField';
import * as Yup from 'yup';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
    category: Yup.string().required('Category Required'),
});

function EditCategoryModal({ isVisible, onClose, category, skillsList, setToRefreshFetch }) {
    const [skills, setSkills] = useState(skillsList); // Use the skillsList prop as the initial state
    const [editingIndex, setEditingIndex] = useState(null); // -1 for adding new skill

    useEffect(() => {
        setSkills(skillsList)
    }, [isVisible])


    const handleSkillSave = (index, newSkillValue) => {
        if (index === -1) {
            // Add new skill
            setSkills([...skills, { _id: null, name: newSkillValue }]);
        } else {
            // Edit existing skill
            const updatedSkills = [...skills];
            updatedSkills[index] = { ...updatedSkills[index], name: newSkillValue };
            setSkills(updatedSkills);
        }
        setEditingIndex(null); // Reset editing index after save
    };

    const { fetchData: deleteSkill } = useAxios({
        method: 'DELETE',
        manual: true
    })
    const handleSkillDelete = async (index) => {
        try {
            const skillsId = skills[index]._id
            if (skillsId) {
                const result = await deleteSkill({ url: `/skills/delete-skill/${skillsId}` })
                if (result && !result.error) {
                    setToRefreshFetch(result)
                }
            }
            const updatedSkills = skills.filter((_, i) => i !== index);
            setSkills(updatedSkills);

            return true;
        } catch (err) {
            console.log('Error: ', err);
            return false;
        }

    };

    const { fetchData: updateCategory } = useAxios({
        url: `/skills/edit-category-with-its-skills`,
        method: 'PUT',
        manual: true
    })

    const submitEditCategory = async (categoryNameFinal) => {
        const categoryData = {
            category: {
                name: categoryNameFinal,
                _id: category._id,
            },
            skills,
        };

        try {
            const result = await updateCategory({ body: categoryData })
            if (result && !result.error) {
                setToRefreshFetch(result)
                onClose()
            }
        } catch (err) {
            console.log('Error: ', err);
        }
    };


    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box sx={modalStyles}>
                <h2>Edit Category</h2>
                <Formik
                    initialValues={{ skills: skillsList, category: category.name }} // Use skillsList directly
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={values => submitEditCategory(values.category)}
                >
                    {({ values, handleSubmit, handleChange }) => (
                        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <CategoryField
                                categoryName={values.category}
                                handleChange={handleChange}
                            />

                            {editingIndex === null ? (
                                <SkillList
                                    skills={skills}
                                    onEditClick={setEditingIndex}
                                    onDeleteClick={(i) => handleSkillDelete(i)}
                                />
                            ) : (
                                <SkillEditor
                                    skill={editingIndex === -1 ? '' : skills[editingIndex]?.name} // Empty skill for add
                                    isAdd={editingIndex === -1 ? true : false}
                                    onSave={(newSkill) => handleSkillSave(editingIndex, newSkill)}
                                    onCancel={() => setEditingIndex(null)} // Corrected onCancel handler
                                />
                            )}

                            {/* Button to trigger adding new skill */}
                            {editingIndex === null && (
                                <Box sx={addSkillButtonStyles}>
                                    <Button
                                        sx={{ mt: 1 }}
                                        variant="outlined"
                                        onClick={() => setEditingIndex(-1)} // Set editing index to -1 to add new skill
                                    >
                                        Add Skill
                                    </Button>
                                </Box>
                            )}

                            <Box sx={buttonContainerStyles}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={buttonStyles}
                                    disabled={editingIndex !== null}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { onClose(); setEditingIndex(null); }}
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
const addSkillButtonStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
};

export default EditCategoryModal;
