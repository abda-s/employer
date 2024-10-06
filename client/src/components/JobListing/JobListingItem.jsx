import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function JobListingItem({ item, index, onApplyClick }) {
    const [isExpanded, setIsExpanded] = useState(false)


    return (
        <div key={index} className='job-listing-item' >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} >

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ textTransform: "capitalize", color: "#f25c05", fontSize: "18px" }} >
                        {item?.jobTitle}
                    </div>
                    <div style={{ textTransform: "capitalize", fontSize: "16px" }} >
                        {item?.companyName}
                    </div>
                    <div style={{ textTransform: "capitalize", fontSize: "14px", color: "GrayText" }} >
                        {item?.location}
                    </div>


                </div>
                <div>
                    <IconButton
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </div>
            </div>

            <div style={{
                marginTop: isExpanded ? '10px' : '0',
                color: "GrayText",
                maxHeight: isExpanded ? '1000px' : '0',
                opacity: isExpanded ? 1 : 0,
                transition: 'all 0.3s ease',
            }}>
                <div style={{ display: "flex", width: "100%",alignItems:"center",marginBottom:"5px",flexWrap:"wrap" }}>
                    <strong style={{ fontSize: "14px",color:"black" }} >Requirements:</strong>
                    {item?.skills?.map((skill, index) => (

                        <span key={index} style={{ fontSize: "12px", padding: "5px", background: "#fff2e0", color: "#f25c05", borderRadius: "5px", border: "solid 1px #f25c05", marginLeft: "5px" }} >
                            {skill.name}
                        </span>
                    ))}
                </div>
                <p>
                    {item?.description}
                </p>
                <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }} >
                    <Button
                        variant="outlined"
                        onClick={() => onApplyClick()}
                    >
                        Apply
                    </Button>
                </div>

            </div>

        </div>
    );
}

export default JobListingItem;
