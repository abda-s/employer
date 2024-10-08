import { Box, useMediaQuery } from '@mui/material';
import React from 'react';

function LoginSignupLayout({ children, imageSrc, title }) {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>

            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'column', gap: '12px' , alignItems:"center"}}>
                <Box component="h2">
                    {title}
                </Box>
                {children}
            </Box>

            <Box sx={{ display: isMobile ? 'none' : 'flex', flex: 1, justifyContent: 'center', }}>
                <Box component="img" src={imageSrc} width="80%" alt="side image" />
            </Box>

        </Box>
    );
}

export default LoginSignupLayout;
