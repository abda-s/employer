import { Typography, IconButton, FormControl, TextField, Button, Box, Divider } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import InputMask from 'react-input-mask';

import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { editPrsonalInfo } from '../../../redux';
import { useAxios } from '../../../hooks/useAxios';
import TextInputField from '../../common/TextInputField';

const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    phone: Yup.string()
        .min(10, "Wrong phone number")
        .matches(/^07[789]\d{7}$/, "Wrong phone number"),

})

function PresonalInfo() {
    const email = useSelector(state => state.auth.email)
    const data = useSelector(state => state.cv)
    const [isEditMode, setIsEditMode] = useState(false)

    const dispatch = useDispatch()

    const { fetchData: editPersonalData } = useAxios({ method: 'PUT', manual: true })
    const submitEdit = (fullName, phoneNumber, professionalSummary) => {
        try {
            const result = editPersonalData({
                url: `/cv/edit-personal-data`,
                body: { fullName, phoneNumber, professionalSummary }
            })
            if (result && !result.error) {
                setIsEditMode(false)
                dispatch(editPrsonalInfo(fullName, phoneNumber, professionalSummary))
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Box className="sidbar-item-con personal-info-con">
            {!isEditMode ? (
                <Box sx={{ display: "flex", width: "100%", flexDirection: "column", gap: 1 }} >
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Typography variant="h5" sx={{ textTransform: "capitalize", color: "#222222" }}>
                            {data.fullName}
                        </Typography>

                        <IconButton onClick={() => { setIsEditMode(true) }}>
                            <EditIcon color='primary' />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <MailOutlineIcon
                                    color='primary'
                                    sx={{
                                        mr: 1
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontSize: "20px" }}>
                                    {email}
                                </Typography>
                            </Box>

                            {data.phoneNumber && (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <CallOutlinedIcon
                                        color='primary'
                                        sx={{
                                            mr: 1
                                        }}
                                    />
                                    <Typography variant="body1" sx={{ fontSize: "20px" }}>
                                        {data.phoneNumber}
                                    </Typography>
                                </Box>

                            )}


                        </Box>
                        <Box sx={{ flex: 1, height: "100%" }}>
                            <Typography variant="body1" sx={{ fontSize: "15px", color: "GrayText" }}>
                                {data?.professionalSummary?.length > 75
                                    ? data?.professionalSummary.substring(0, 75) + '...'
                                    : data?.professionalSummary}
                            </Typography>
                        </Box>

                    </Box>
                </Box>
            ) : (
                <Formik
                    initialValues={{ fullName: data.fullName, phoneNumber: data.phoneNumber, professionalSummary: data.professionalSummary }}
                    validationSchema={validationSchema}
                    onSubmit={values => {
                        const { fullName, phoneNumber, professionalSummary } = values
                        submitEdit(fullName, phoneNumber, professionalSummary)
                        console.log(values)
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (
                        <Form
                            onSubmit={handleSubmit}
                            style={{ width: "100%" }}
                        >

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h6"  >Edit personal information</Typography>
                                <Divider />
                            </Box>
                                <Box sx={{ display: "flex", gap: 2 }}>

                                    <TextInputField
                                        name="fullName"
                                        label="Full Name"
                                        values={values}
                                        touched={touched}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />

                                    <FormControl fullWidth >
                                        <Field name="phoneNumber" >
                                            {({ field }) => (
                                                <InputMask
                                                    {...field}
                                                    mask="0799999999"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.phoneNumber}
                                                    maskChar=""
                                                >
                                                    {(inputProps) => (
                                                        <TextField
                                                            {...inputProps}
                                                            label="Phone (Optional)"
                                                            variant="outlined"
                                                            fullWidth
                                                            error={Boolean(errors.phoneNumber && touched.phoneNumber)}
                                                            helperText={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : ''}
                                                        />
                                                    )}
                                                </InputMask>
                                            )}
                                        </Field>
                                    </FormControl>


                                </Box>

                                <TextInputField
                                    name="professionalSummary"
                                    label="Professional Summary (Optional)"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    multiline={true}
                                />

                                <Box sx={{ display: "flex", width: "100%", gap: 2 }} >
                                    <Button
                                        variant="outlined"
                                        onClick={() => { setIsEditMode(false) }}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        type='submit'
                                        fullWidth
                                    >
                                        Save
                                    </Button>
                                </Box>


                            </Box>
                        </Form>
                    )}
                </Formik>
            )}
        </Box>
    )
}

export default PresonalInfo
