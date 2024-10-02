import React from 'react'
import { useReactToPrint } from 'react-to-print';
import { Box, Button, Typography } from '@mui/material';

function SavePdf() {
    const handlePrint = useReactToPrint({
        content: () => document.getElementById('cv-canvas'),
        documentTitle: 'my_cv',
    });
    return (

        <Box className="cv-save sidbar-item-con">
            <Typography variant="h5" sx={{color:"#222222"}} >
                My CV
            </Typography>
            <Button
                variant="outlined"
                onClick={handlePrint}
            >
                Save as PDF
            </Button>
        </Box>
    )
}

export default SavePdf