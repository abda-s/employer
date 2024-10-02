import React from 'react';
import { Box } from '@mui/material';
import NavBar from './NavBar';
import DashboardSideMenu from './DashboradSideMenu';

function DashboardLayout({ children }) {
    return (
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
            <DashboardSideMenu />
            <Box sx={{ display: 'flex', flexDirection: 'column', width:"100%" }}>
                <NavBar />
                <Box sx={{ padding: '20px', boxSizing: 'border-box',width:"100%" }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardLayout;
