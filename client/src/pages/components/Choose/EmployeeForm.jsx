import React, { useState, useEffect } from 'react';
import { TextField, FormControl, Autocomplete, Button, IconButton } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { serverURL } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeRole, editToken } from '../../../redux';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .min(10, "Wrong phone number")
    .matches(/^07[789]\d{7}$/, "Wrong phone number"),
  skills: Yup.array().min(1, 'At least one specialty is required'),
  experience: Yup.array().of(
    Yup.object({
      jobTitle: Yup.string().required('Job Title is required'),
      companyName: Yup.string().required('Company Name is required'),
      startDate: Yup.date().nullable(false).required('Start Date is required'),
      endDate: Yup.date()
        .nullable(false)
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date cannot be before Start Date'),
      description: Yup.string().required('Description is required'),
    })
  ),
  education: Yup.array().of(
    Yup.object({
      institutionName: Yup.string().required('Institution Name is required'),
      degree: Yup.string().required('Degree is required'),
      graduationYear: Yup.number()
        .required('Year of Graduation is required')
        .min(1950, 'Too small')
        .max(2050, 'Too large')
        .integer('Year of Graduation must be a valid number')
    })
  ),
});



function EmployeeForm() {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const accessToken = useSelector(state => state.auth.token);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = () => {
    axios.get(`${serverURL}/skills/all-skills/`, { headers: { accessToken } })
      .then(response => {
        const skillList = response?.data?.map((item, index) => ({
          ...item,
          id: index, // Assuming you want sequential IDs starting from 1
          label: item.name,
        }));
        setOptions(skillList);
      })
      .catch(err => {
        console.log("Error fetching skills: ", err);
      });
  };

  const submitEmployee = (values) => {
    const { firstName, lastName, phone, professionalSummary, skills, experience, education } = values;

    const skillsArray = []

    const theData = {
      fullName: `${firstName} ${lastName}`,
      phoneNumber: phone,
      professionalSummary,
      skills,
      experience,
      education
    }

    axios.post(`${serverURL}/auth/employee`, theData, { headers: { accessToken } }).
      then(response => {
        dispatch(editToken(response.data.token))
        dispatch(changeRole("employee"))
        navigate('/')
      })
      .catch(err => {
        console.log("error", err.message)
      })
  }

  const handleAddOption = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setOptions([...options, { _id: null, name: event.target.value }]);
      event.target.value = '';
    }
  };


  return (

    <div className="container-flex-1-column" style={{ width: "100%", padding: "20px" }}>
      <Formik
        initialValues={{
          firstName: '', lastName: '', email: '', phone: '', skills: [], professionalSummary: '',
          experience: [{ jobTitle: '', companyName: '', startDate: null, endDate: null, description: '' }],
          education: [{ institutionName: '', degree: '', graduationYear: '' }],
        }}
        validationSchema={validationSchema}

        onSubmit={(values) => {
          console.log(values);
          
          submitEmployee(values);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (

          <Form
            onSubmit={handleSubmit}
            style={{ width: "100%" }}

          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "24px" }}>

              <FormControl
                sx={{ width: "100%", marginRight: "10px" }}
                variant="outlined"
                size="small"
              >
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  sx={{ marginBottom: "5px" }}
                  error={Boolean(errors.firstName && touched.firstName)}
                  helperText={touched.firstName && errors.firstName ? errors.firstName : ''}
                />
              </FormControl>

              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                size="small"
              >
                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  sx={{ marginBottom: "5px" }}
                  error={Boolean(errors.lastName && touched.lastName)}
                  helperText={touched.lastName && errors.lastName ? errors.lastName : ''}
                />
              </FormControl>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "24px" }}>

              <FormControl
                sx={{ flex:1, marginRight: "10px" }}
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

              <FormControl sx={{ flex: 1 }}>
                <Field
                  component={Autocomplete}
                  multiple
                  options={options}
                  value={values.skills}
                  freeSolo
                  name="skills"
                  sx={{ flex: 1 }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue); // Track input value for filtering
                  }}
                  onChange={(event, value) => {
                    // Handle freeSolo custom entries by checking if it's a string
                    const formattedValue = value.map((item) =>
                      typeof item === 'string'
                        ? { _id: null, name: item } // Create object with _id as null
                        : item // Return existing object if it's already structured
                    );
                    setFieldValue('skills', formattedValue);
                  }}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name} // Handle both freeSolo and existing options
                  filterOptions={(options, { inputValue }) => {
                    const filteredOptions = inputValue
                      ? options.filter(option =>
                        option.name && option.name.toLowerCase().includes(inputValue.toLowerCase())
                      )
                      : [];

                    // Add the input value as an object with _id: null if it's not already present
                    if (inputValue !== '' && !filteredOptions.some(option => option.name === inputValue)) {
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
                      label="Add Skill"
                      onKeyDown={handleAddOption} // Optional: handle keydown if needed
                      error={Boolean(errors.skills && touched.skills)}
                      helperText={touched.skills && errors.skills ? errors.skills : ''}
                    />
                  )}
                />
              </FormControl>

            </div>

            <FormControl
              sx={{ width: "100%", marginBottom: "24px" }}
              variant="outlined"
            >
              <Field
                as={TextField}
                multiline
                rows={2}
                name="professionalSummary"
                label="Professional Summary (Optional)"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.professionalSummary}
                sx={{ marginBottom: "5px" }}

              />
            </FormControl>

            <FormControl
              sx={{ width: "100%", marginBottom: "24px", display: "flex", flexDirection: 'column' }}

            >
              <FieldArray name="experience">
                {({ push, remove }) => (
                  <div>
                    <h3 style={{ marginBottom: "10px" }} >Experience:</h3>
                    <div style={{ width: "100%", display: "flex", flexDirection: 'column', }} >

                      {values.experience.map((_, index) => (
                        <div key={index} style={{ marginBottom: "20px", width: "100%" }}>

                          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "10px" }}>
                            <Field as={TextField} name={`experience[${index}].jobTitle`} label="Job Title" sx={{ flex: 1, marginRight: "10px" }}
                              error={Boolean(errors.experience?.[index]?.jobTitle && touched.experience?.[index]?.jobTitle)}
                              helperText={touched.experience?.[index]?.jobTitle && errors.experience?.[index]?.jobTitle ? errors.experience[index].jobTitle : ''}
                            />

                            <Field as={TextField} name={`experience[${index}].companyName`} label="Company Name" sx={{ flex: 1 }}
                              error={Boolean(errors.experience?.[index]?.companyName && touched.experience?.[index]?.companyName)}
                              helperText={touched.experience?.[index]?.companyName && errors.experience?.[index]?.companyName ? errors.experience[index].companyName : ''}
                            />
                          </div>


                          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "10px" }} >

                            <FormControl sx={{ flex: 1, marginRight: "10px" }} size="Normal" variant="outlined">

                              <Field name={`experience[${index}].startDate`}>
                                {({ field, form }) => (
                                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DatePicker
                                      label="Start Date"
                                      value={field.value}
                                      onChange={(newValue) => form.setFieldValue(field.name, newValue)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ flex: 1 }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              </Field>
                              <ErrorMessage name={`experience[${index}].startDate`} component="span" style={{ color: 'red' }} />

                            </FormControl>

                            <FormControl sx={{ flex: 1, marginBottom: "24px" }} size="Normal" variant="outlined">
                              <Field name={`experience[${index}].endDate`}>
                                {({ field, form }) => (
                                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ flex: 1 }}>
                                    <DatePicker
                                      sx={{ flex: 1 }}
                                      label="End Date"
                                      value={field.value}
                                      onChange={(newValue) => form.setFieldValue(field.name, newValue)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ flex: 1 }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              </Field>
                              <ErrorMessage name={`experience[${index}].endDate`} component="div" style={{ color: 'red', }} />
                            </FormControl>
                          </div>



                          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "10px" }} >
                            <Field as={TextField} name={`experience[${index}].description`} label="Description" multiline rows={3} sx={{ flex: 3 }}
                              error={Boolean(errors.experience?.[index]?.description && touched.experience?.[index]?.description)}
                              helperText={touched.experience?.[index]?.description && errors.experience?.[index]?.description ? errors.experience[index].description : ''}
                            />

                            {index !== 0 && (
                              <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
                                <IconButton onClick={() => remove(index)}><DeleteIcon sx={{ fontSize: "30px" }} /></IconButton>
                              </div>
                            )}

                          </div>

                        </div>
                      ))}
                    </div>

                    <Button variant="outlined" onClick={() => push({ jobTitle: '', companyName: '', startDate: null, endDate: null, description: '' })}>
                      <AddIcon /> Add Experience
                    </Button>
                  </div>
                )}
              </FieldArray>
            </FormControl>


            <FormControl
              sx={{ width: "100%", marginBottom: "24px", display: "flex", flexDirection: 'column' }}

            >
              <FieldArray name="education">
                {({ push, remove }) => (
                  <div>
                    <h3 style={{ marginBottom: "10px" }} >education:</h3>
                    <div style={{ width: "100%", display: "flex", flexDirection: 'column', }} >

                      {values.education.map((_, index) => (
                        <div key={index} style={{ marginBottom: "20px", width: "100%" }}>

                          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "10px" }}>
                            <Field as={TextField} name={`education[${index}].institutionName`} label="institution Name" sx={{ flex: 1, marginRight: "10px" }}
                              error={Boolean(errors.education?.[index]?.institutionName && touched.education?.[index]?.institutionName)}
                              helperText={touched.education?.[index]?.institutionName && errors.education?.[index]?.institutionName ? errors.education[index].institutionName : ''}
                            />

                            <Field as={TextField} name={`education[${index}].graduationYear`} label="graduation Year" sx={{ flex: 1 }} type="number"
                              error={Boolean(errors.education?.[index]?.graduationYear && touched.education?.[index]?.graduationYear)}
                              helperText={touched.education?.[index]?.graduationYear && errors.education?.[index]?.graduationYear ? errors.education[index].graduationYear : ''}
                            />
                          </div>



                          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "10px" }} >
                            <Field as={TextField} name={`education[${index}].degree`} label="Degree" sx={{ flex: 3 }}
                              error={Boolean(errors.education?.[index]?.degree && touched.education?.[index]?.degree)}
                              helperText={touched.education?.[index]?.degree && errors.education?.[index]?.degree ? errors.education[index].degree : ''}
                            />

                            {index !== 0 && (
                              <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
                                <IconButton onClick={() => remove(index)}><DeleteIcon sx={{ fontSize: "30px" }} /></IconButton>
                              </div>
                            )}

                          </div>

                        </div>
                      ))}
                    </div>

                    <Button variant="outlined" onClick={() => push({ institutionName: '', degree: '', graduationYear: '' })}>
                      <AddIcon /> Add Education
                    </Button>
                  </div>
                )}
              </FieldArray>
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

export default EmployeeForm