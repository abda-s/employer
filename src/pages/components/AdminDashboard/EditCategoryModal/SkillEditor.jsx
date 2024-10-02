import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function SkillEditor({ skill: initialSkill, onSave, onCancel, isAdd }) {
  const [skill, setSkill] = useState(initialSkill);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setSkill(event.target.value);
    setError(''); // Clear error on change
  };

  const validate = () => {
    if (skill.trim().length < 1) {
      setError('Skill must be at least 1 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(skill);
    }
  };

  return (
    <Box sx={editViewStyles}>
      <TextField
        value={skill}
        onChange={handleChange}
        size="small"
        label={!isAdd ? "Edit Skill" : "Add Skill"}
        sx={{ marginRight: 1, flex: 1 }}
        error={Boolean(error)}
        helperText={error}
      />

      <IconButton color="primary" onClick={handleSubmit} sx={{ marginRight: 1 }}>
        <DoneRoundedIcon />
      </IconButton>

      <IconButton onClick={onCancel}>
        <CloseRoundedIcon color="secondary" />
      </IconButton>

    </Box>
  );
}

const editViewStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  mt: 2,
  padding: 1,
  borderRadius: '4px',
  backgroundColor: '#f5f5f5',
  width: '100%',
  boxSizing: 'border-box',
};

export default SkillEditor;
