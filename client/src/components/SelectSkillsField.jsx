import React, { useState, useEffect } from 'react';
import {  TextField, FormControl, Autocomplete } from '@mui/material';
import { useAxios } from '../hooks/useAxios';
function SelectSkillsField({ name, label, values, setFieldValue, errors, touched }) {
    const [options, setOptions] = useState([]);

    const {response, error} = useAxios({
        url: `/skills/all-skills/`,
        method: 'GET',
    })

    useEffect(() => {
        const skillList = response?.map((item, index) => ({
            ...item,
            id: index, // Assuming you want sequential IDs starting from 1
            label: item?.name,
        }));
        setOptions(skillList);    }, [response]);

    return (
        <FormControl sx={{ flex: 1, mr: 1 }}>
            <Autocomplete
                options={options}
                size='small'
                value={options?.find(option => option._id === values[name]?._id) || null}
                freeSolo
                onChange={(event, newValue) => {
                    // Set newValue if it's a string or an object
                    if (typeof newValue === 'string') {
                        setFieldValue(name, { name: newValue, _id: null });
                    } else if (newValue && typeof newValue === 'object') {
                        setFieldValue(name, newValue);
                    } else {
                        setFieldValue(name, null);
                    }
                }}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                filterOptions={(options, { inputValue }) => {
                    const filteredOptions = options?.filter(option =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                    );
                    if (inputValue && !filteredOptions?.some(option => option.name === inputValue)) {
                        filteredOptions?.push({
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
                        error={Boolean(errors[name] && touched[name])}
                        helperText={touched[name] && errors[name] ? errors[name] : ''}
                    />
                )}
            />
        </FormControl>
    )
}

export default SelectSkillsField