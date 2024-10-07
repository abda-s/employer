import { Typography, IconButton, FormControl, TextField, Button } from '@mui/material'
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

    const { fetchData: editPersonalData } = useAxios({
        url: `/cv/edit-personal-data`,
        method: 'PUT',
        manual: true
    })


    const submitEdit = (fullName, phoneNumber, professionalSummary) => {
        try {
            const result = editPersonalData({ body: { fullName, phoneNumber, professionalSummary } })
            if (result && !result.error) {
                setIsEditMode(false)
                dispatch(editPrsonalInfo(fullName, phoneNumber, professionalSummary))
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="sidbar-item-con personal-info-con" >
            {!isEditMode ? (<>
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ marginBottom: "15px", textTransform: "capitalize", color: "#222222" }}>
                        {data.fullName}
                    </Typography>

                    <IconButton sx={{ marginRight: "10px" }} onClick={() => { setIsEditMode(true) }}>
                        <EditIcon color='primary' />
                    </IconButton>

                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <MailOutlineIcon
                                color='primary'
                                sx={{
                                    marginRight: "10px"
                                }}
                            />
                            <Typography variant="body1" sx={{ fontSize: "20px" }}>
                                {email}
                            </Typography>
                        </div>

                        {data.phoneNumber && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <CallOutlinedIcon
                                    color='primary'
                                    sx={{
                                        marginRight: "10px"
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontSize: "20px" }}>
                                    {data.phoneNumber}
                                </Typography>
                            </div>

                        )}


                    </div>
                    <div style={{ flex: 1, width: "50%", height: "100%" }}>
                        <Typography variant="body1" sx={{ fontSize: "15px", color: "GrayText", paddingLeft: "8px" }}>
                            {data?.professionalSummary?.length > 75
                                ? data?.professionalSummary.substring(0, 75) + '...'
                                : data?.professionalSummary}
                        </Typography>
                    </div>



                </div>
            </>) : (<>

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

                            <div style={{ display: "flex", marginBottom: "15px" }}>

                                <div style={{ flex: 1, marginRight: "10px" }} >
                                    <FormControl
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                        size="small"
                                    >
                                        <Field
                                            as={TextField}
                                            name="fullName"
                                            label="Full Name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.fullName}
                                            sx={{ marginBottom: "5px" }}
                                            error={Boolean(errors.fullName && touched.fullName)}
                                            helperText={touched.fullName && errors.fullName ? errors.fullName : ''}
                                        />
                                    </FormControl>

                                </div>

                                <div style={{ flex: 1 }} >
                                    <FormControl
                                        sx={{ width: "100%", marginRight: "10px" }}
                                        variant="outlined"
                                    >
                                        <Field name="phoneNumber">
                                            {({ field }) => (
                                                <InputMask
                                                    {...field}
                                                    mask="0799999999"

                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.phoneNumber}
                                                    maskChar="" // Ensures no placeholder characters are displayed
                                                >
                                                    {(inputProps) => (
                                                        <TextField
                                                            {...inputProps}
                                                            label="Phone (Optional)"
                                                            variant="outlined"
                                                            sx={{ marginBottom: "5px" }}
                                                            error={Boolean(errors.phoneNumber && touched.phoneNumber)}
                                                            helperText={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : ''}
                                                        />
                                                    )}
                                                </InputMask>
                                            )}
                                        </Field>
                                    </FormControl>

                                </div>

                            </div>

                            <FormControl
                                sx={{ width: "100%", marginBottom: "24px" }}
                                variant="outlined"
                            >
                                <Field
                                    as={TextField}
                                    multiline
                                    rows={3}
                                    name="professionalSummary"
                                    label="Professional Summary (Optional)"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.professionalSummary}
                                    sx={{ marginBottom: "5px" }}
                                />
                            </FormControl>

                            <div style={{ display: "flex", width: "100%" }} >
                                <div style={{ flex: 1, marginRight: "10px" }} >
                                    <Button
                                        variant="outlined"
                                        onClick={() => { setIsEditMode(false) }}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                <div style={{ flex: 1 }} >
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
            </>)}
        </div>
    )
}

export default PresonalInfo