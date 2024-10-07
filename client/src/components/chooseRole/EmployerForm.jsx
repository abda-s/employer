import React, { useState } from 'react';
import { TextField, FormControl, Autocomplete, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { serverURL } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeRole, editToken } from '../../redux';
import { useAxios } from '../../hooks/useAxios';


const validationSchema = Yup.object({
    companyName: Yup.string().required('Company name is required'),
    specialties: Yup.array().min(1, 'At least one specialty is required'),
    phone: Yup.string()
        .min(10, "Worng phone number")
        .matches(/^07[789]\d{7}$/, "Worng phone number")
});


function EmployerForm() {
    const [options, setOptions] = useState([]);
    const token = useSelector(state => state.auth.token)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const { fetchData: submitData } = useAxios({
        url: `/auth/employer`,
        method: "POST",
        manual: true
    })

    const submitEmployer = (values) => {
        try {
            const result = submitData({
                body: values
            })

            if (result && !result.error) {
                dispatch(editToken(result.token))
                dispatch(changeRole("employer"))
                navigate('/')
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    const handleAddOption = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            setOptions([...options, event.target.value]);
            event.target.value = '';
        }
    };
    return (

        <div className="container-flex-1-column" style={{ width: "100%", padding: "20px" }}>
            <Formik

                initialValues={{ companyName: '', companyDescription: '', specialties: [], email: '', phone: '', addres: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(`${values.companyName} | ${values.companyDescription} |  ${values.specialties} |  ${values.email} |  ${values.phone} |  ${values.addres} |`)
                    submitEmployer(values)
                }}

            >
                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (
                    <Form
                        onSubmit={handleSubmit}
                        style={{ width: "100%" }}

                    >

                        <FormControl
                            sx={{ width: "100%", marginBottom: "24px" }}
                            variant="outlined"
                            size="small"
                        >
                            <Field
                                as={TextField}
                                name="companyName"
                                label="Company Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.companyName}
                                sx={{ marginBottom: "5px" }}
                                error={Boolean(errors.companyName && touched.companyName)}
                                helperText={touched.companyName && errors.companyName ? errors.companyName : ''}
                            />
                        </FormControl>

                        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                            <div className='container-flex-1' style={{ marginRight: "10px" }}>

                                <FormControl
                                    sx={{ width: "100%", marginBottom: "24px" }}
                                    variant="outlined"
                                >
                                    <Field
                                        as={TextField}
                                        multiline
                                        name="companyDescription"
                                        label="Company Description (Optional)"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.companyDescription}
                                        sx={{ marginBottom: "5px" }}

                                    />
                                </FormControl>
                            </div>

                            <div className='container-flex-1' >
                                <FormControl
                                    sx={{ width: "100%", marginBottom: "24px" }}
                                    variant="outlined"
                                >
                                    <Field
                                        component={Autocomplete}
                                        multiple
                                        options={options}
                                        freeSolo
                                        name="specialties"
                                        sx={{ marginBottom: "5px" }}
                                        value={values.specialties}
                                        onChange={(event, value) => setFieldValue('specialties', value)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Add Specialties"
                                                onKeyDown={handleAddOption}
                                                error={Boolean(errors.specialties && touched.specialties)}
                                                helperText={touched.specialties && errors.specialties ? errors.specialties : ''}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </div>

                        </div>


                        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                            <div className='container-flex-1' style={{ marginRight: "10px" }}>

                                <FormControl
                                    sx={{ width: "100%", marginBottom: "24px" }}
                                    variant="outlined"
                                >
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email (Optional)"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        sx={{ marginBottom: "5px" }}

                                    />
                                </FormControl>
                            </div>

                            <div className='container-flex-1'>

                                <FormControl
                                    sx={{ width: "100%", marginBottom: "24px" }}
                                    variant="outlined"
                                >
                                    <Field name="phone">
                                        {({ field }) => (
                                            <InputMask
                                                {...field}
                                                mask="0799999999"

                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.phone}
                                                maskChar="" // Ensures no placeholder characters are displayed
                                            >
                                                {(inputProps) => (
                                                    <TextField
                                                        {...inputProps}
                                                        label="Phone (Optional)"
                                                        variant="outlined"
                                                        sx={{ marginBottom: "5px" }}
                                                        error={Boolean(errors.phone && touched.phone)}
                                                        helperText={touched.phone && errors.phone ? errors.phone : ''}
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
                            size="small"
                        >
                            <Field
                                as={TextField}
                                name="addres"
                                label="Addres (Optional, But recommended for clarity) "
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.addres}
                                sx={{ marginBottom: "5px" }}
                                error={Boolean(errors.addres && touched.addres)}
                                helperText={touched.addres && errors.addres ? errors.addres : ''}
                            />
                        </FormControl>

                        {/* {error !== "" && (<div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>)} */}

                        <Button
                            variant="contained"
                            color="primary"
                            size='large'
                            type="submit"
                            sx={{
                                width: "100%"
                            }}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EmployerForm