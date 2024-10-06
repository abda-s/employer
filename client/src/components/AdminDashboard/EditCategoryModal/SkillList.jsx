import React from 'react';
import { Box, IconButton } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


function SkillList({ skills, onEditClick, onDeleteClick }) {
    return (
        <Box sx={{ mt: 2 }} >
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                {skills.map((skill, i) => (
                    <Box key={i} sx={skillButtonStyles} component="div">
                        <span >{skill.name}</span>
                        <Box>

                            <IconButton onClick={async () => { onDeleteClick(i) }}>
                                <DeleteRoundedIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                color='primary'
                                onClick={() => onEditClick(i)}
                            >
                                <EditRoundedIcon />
                            </IconButton>

                        </Box>

                    </Box>
                ))}
            </Box>
        </Box>
    );
}

const skillButtonStyles = {
    my: 1,
    p: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "17px",
    borderRadius: 2,
    backgroundColor: '#f5f5f5',
};

export default SkillList;
