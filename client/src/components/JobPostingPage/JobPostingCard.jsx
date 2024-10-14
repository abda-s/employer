import React from 'react';
import { Box } from '@mui/material';

function JobPostingCard({ item, index, setIndexOfJob, setIsVisible }) {
    return (
        <Box key={index} className='job-posting-item'
            onClick={() => {
                setIndexOfJob(index)
                setIsVisible(true)
            }}
        >
            <Box style={{ display: "flex", flexDirection: "column" }} >
                <Box style={{ fontSize: "16px", flex: 1, alignItems: "center", marginBottom: "5px" }}>
                    <strong style={{ fontSize: "14px" }} >Job Title:</strong> {item.jobTitle}
                </Box>

                <Box style={{ flex: 1, display: "flex", alignItems: "center", flexWrap: "wrap", marginBottom: "5px" }}>
                    {item.skills.map((s, i) => (
                        <Box key={i} style={{ fontSize: "12px", padding: "5px", background: "#fff2e0", color: "#f25c05", borderRadius: "5px", border: "solid 1px #f25c05", marginLeft: i === 0 ? "0" : "5px", boxSizing: "border-box", marginBottom: "2px" }} >
                            {s?.name}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box style={{ marginBottom: "10px", fontSize: "16px", color: "GrayText" }}>
                {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
            </Box>
        </Box>
    );
}

export default JobPostingCard;

