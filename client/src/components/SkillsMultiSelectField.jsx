import React, { useEffect, useState } from 'react';
import { TextField, FormControl, Autocomplete } from '@mui/material';
import { Field } from 'formik';
import { useAxios } from '../hooks/useAxios';


function SkillsMultiSelectField({ name, label, setFieldValue, errors, touched }) {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const { response, error } = useAxios({
        url: `/skills/all-skills/`,
        method: 'GET',
    })

    useEffect(() => {
        if (response && (!response.error || error)) {
            const skillList = response?.map((item, index) => ({
                ...item,
                id: index, // Assuming you want sequential IDs starting from 1
                label: item.name,
            }));
            setOptions(skillList)
        }
    }, [response, error])

    const handleAddOption = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            setOptions([...options, event.target.value]);
            event.target.value = '';
        }
    };

    return (
        <FormControl sx={{ flex: 1 }} variant="outlined">
            <Field
                component={Autocomplete}
                multiple
                options={options}
                freeSolo
                name={name}
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
                    setFieldValue(name, formattedValue);
                }}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name} // Handle both freeSolo and existing options
                filterOptions={(options, { inputValue }) => {
                    // Filter options based on input value
                    const filteredOptions = inputValue ? options?.filter(option =>
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
                        label={label}
                        onKeyDown={handleAddOption} // Optional: handle keydown if needed
                        error={Boolean(errors[name] && touched[name])}
                        helperText={touched[name] && errors[name] ? errors[name] : ''}
                    />
                )}
            />
        </FormControl>
    )
}

export default SkillsMultiSelectField