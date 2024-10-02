import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function DashboardSideMenu() {

    const dashboardRoutes = [
        { label: "Users", path: '/dashboard/users' },
        { label: "Jobs", path: '/dashboard/jobs' },
        { label: "Skills", path: '/dashboard/skills' },
    ]

    return (
        <Box className="dashboard-side-menu" sx={{ color: 'white', width: "200px" }}>
            <Typography sx={{ padding: '19px 0', fontSize: '20px' }}>
                Dashboard
            </Typography>

            <List sx={{ width: '100%', paddingTop: '0' }}>

                {dashboardRoutes.map((item, index) => (
                    <ListItem key={index} button component={Link} to={item.path}>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                
            </List>
        </Box>
    );
}

export default DashboardSideMenu;
