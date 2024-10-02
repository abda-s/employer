import React, { useState } from 'react'
import { Box, Card, Typography, IconButton } from "@mui/material";
import SelectCategoryForSkillModal from './SelectCategoryForSkillModal';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

function UncategorizedSkills({ item, index, setToRefreshFetch, data }) {
    const [isEditCategoryVisible, setIsEditCategoryVisible] = useState(false)

    return (
        <Card key={index} sx={{ padding: 2, margin: 2, textTransform: "capitalize" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }} >
                <Typography variant="h6">{item?.category?.name}</Typography>
                <IconButton
                    onClick={() => {
                        setIsEditCategoryVisible(true)
                    }}
                >
                    <EditRoundedIcon
                        color='primary'
                        sx={{ fontSize: "20px" }}
                    />
                </IconButton>
            </Box>
            <hr />
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>

                {item?.skills?.map((skill, i) => (
                    <Box
                        component="span"
                        key={i}
                        sx={{
                            m: 1,
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f5",
                        }}
                    >
                        {skill.name}
                    </Box>
                ))}

            </Box>
            <SelectCategoryForSkillModal
                data={data}
                category={item?.category}
                skillsList={item?.skills}
                isVisible={isEditCategoryVisible}
                onClose={() => { setIsEditCategoryVisible(false); }}
                setToRefreshFetch={e => setToRefreshFetch(e)}
            />

        </Card>)
}

export default UncategorizedSkills