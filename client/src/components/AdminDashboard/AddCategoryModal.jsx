import React from 'react'
import { useSelector } from 'react-redux';
import { Modal, TextField, Button, Box, FormControl } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAxios } from '../../hooks/useAxios';


const validationSchema = Yup.object({
    categoryName: Yup.string().required('Category Name Required')
});

function AddCategoryModal({ isVisible, onClose, setToRefreshFetch }) {

    const { fetchData: addCategory } = useAxios({ method: "POST", manual: true })
    const handleSubmit = async (categoryName) => {
        try {
            const result = await addCategory({ url: "/skills/add-category", body: { categoryName } })
            if(result && !result.error) {
                setToRefreshFetch(result)
                onClose()
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <Modal
            open={isVisible}
            onClose={() => { onClose() }}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box component="section" sx={{ p: 2, m: 1, borderRadius: 3, backgroundColor: "white", display: "flex", flexDirection: "column", width: { xs: "100%", sm: "100%", lg: "550px", xl: "550px" } }}>
                Add a category
                {/* <Box */}
                <Formik
                    initialValues={{ categoryName: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmit(values.categoryName)
                    }}
                >

                    {({ values, handleChange, handleBlur, handleSubmit }) => (

                        <Form onSubmit={handleSubmit}>
                            <FormControl
                                sx={{ width: "100%", marginBottom: "10px", marginTop: "10px", display: "flex", flexDirection: "column" }}
                                variant="outlined"
                                size="Normal"
                            >
                                <Field
                                    as={TextField}
                                    name="categoryName"
                                    label="Category Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.categoryName}
                                    sx={{ marginBottom: "5px" }}
                                // error={Boolean(<ErrorMessage name="email" />)}
                                />
                                <ErrorMessage name="categoryName" component="div" style={{ color: 'red', }} />
                            </FormControl>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ marginBottom: "10px", flex: 1, width: "100%" }}
                            >
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => { onClose() }}
                >
                    Cancel
                </Button>
            </Box>

        </Modal>)
}

export default AddCategoryModal