import React from 'react';
import { Button } from '@mui/material';

const SortApplicationsMenu = ({ sortApplicationsByStatus, sortMenuItems }) => {
    return (
        <div style={{ display: "flex", width: "100%", margin: "10px"}}>
            <Button
                variant="outlined"
                onClick={() => sortApplicationsByStatus('All')}
            >
                All
            </Button>
            {sortMenuItems.length > 1 && sortMenuItems.map((item, index) => (
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
