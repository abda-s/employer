import { Box, Button, Typography, } from '@mui/material'
import React from 'react'
import logo from '../../assetes/employer-high-resolution-logo-transparent-orange.png';

function HomepageNavBar() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 10,
                mx: "auto",
                px: 3,
                py: 2,
                background: "rgba(255, 225, 255, 0.01)",
                backdropFilter: "blur(25px)",
                borderRadius: 5,
                zIndex: 1000,
                width: "90%",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", px: 2, gap: 2, }}>
                <img src={logo} alt="logo" style={{ height: "40px", marginRight: 2 }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", px: 2, gap: 2, }} >
                <Button variant="contained">Sign In</Button>
                <Button variant="outlined">Sign Up</Button>
            </Box>
        </Box>
    );
}export default HomepageNavBar