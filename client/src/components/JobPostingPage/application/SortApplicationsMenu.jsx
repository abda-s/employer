import React, { useEffect } from 'react';
import { Button, Box } from '@mui/material';

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
        <Box className="sort-applications-menu" display="flex" width="100%" margin="10px" >

            {menuValues.map((item, index) => (
                <Box key={index} marginLeft="5px">
                    <Button
                        variant="outlined"
                        onClick={() => sortApplicationsByStatus(item)}
                    >
                        {item}
                    </Button>
                </Box>
            ))}
        </Box>
    );
};

export default SortApplicationsMenu;

