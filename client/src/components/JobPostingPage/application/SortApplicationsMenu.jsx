import React, { useEffect } from 'react';
import { Button } from '@mui/material';

const SortApplicationsMenu = ({ sortApplicationsByStatus }) => {
    const menuValues = [
        "All",
        "Pending",
        "Reviewed",
        "Accepted",
        "Rejected",
    ]

    useEffect(() => {   
        sortApplicationsByStatus("All")
    }, [])

    return (
        <div style={{ display: "flex", width: "100%", margin: "10px" }}>

            {menuValues.map((item, index) => (
                <div key={index} style={{ marginLeft: "5px" }}>
                    <Button
                        variant="outlined"
                        onClick={() => sortApplicationsByStatus(item)}
                    >
                        {item}
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default SortApplicationsMenu;
