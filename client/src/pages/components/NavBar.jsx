import React from 'react';
import { AppBar, Toolbar, Typography, Button, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux';
import { Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

import logo from '../../assetes/employer-high-resolution-logo-transparent.png';

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { loggedIn, role, email } = useSelector(state => state.auth);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleLogOut = () => {
        dispatch(logOut());
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const commonRoutes = !loggedIn ? [
        { label: "Home", path: '/' },
        { label: "Login", path: '/login' }
    ] : [];

    const roleBasedRoutes = {
        employee: [
            { label: "Applied Jobs", path: '/dashboard/applied-jobs' },
            { label: "CV Builder", path: '/cv-builder' },
            { label: "Job Listing", path: '/job-listing' },
        ],
        employer: [
            { label: "Job Posting", path: '/dashboard/job-posting' }
        ],
        admin: [
            { label: "Users", path: '/dashboard/users' },
            { label: "Jobs", path: '/dashboard/jobs' },
            { label: "Skills", path: '/dashboard/skills' },

        ]
    };

    const drawerContent = (
        <List>
            {(loggedIn && role !== "admin") ? (
                <ListItem><ListItemText primary={email} /></ListItem>
            ) : (
                <ListItem><ListItemText primary={"Admin"} /></ListItem>
            )}

            {commonRoutes.map(({ label, path }) => (
                <ListItem button key={label} onClick={() => navigate(path)}>
                    <ListItemText primary={label} />
                </ListItem>
            ))}

            {loggedIn && roleBasedRoutes[role]?.map(({ label, path }) => (
                <ListItem button key={label} onClick={() => navigate(path)}>
                    <ListItemText primary={label} />
                </ListItem>
            ))}

            {loggedIn && (
                <ListItem button onClick={handleLogOut}>
                    <ListItemText primary="Log Out" />
                </ListItem>
            )}
        </List>
    );

    return (
        <AppBar position="static" sx={{ zIndex: 2 }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {(isMobile) && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ marginRight: role === "admin" ? "auto" : 0 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: "flex", justifyContent: isMobile ? "flex-end" : "flex-start" }}>
                    <img src={logo} alt="logo" style={{ height: "25px", width: "auto" }} />
                </Typography>
                {!isMobile && (
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        {(loggedIn && role !== "admin") && <Typography variant="span" sx={{ marginRight: "10px" }}>{email}</Typography>}
                        {(loggedIn && role === "admin") && <Typography variant="span" sx={{ marginRight: "10px" }}>Admin</Typography>}

                        {commonRoutes.map(({ label, path }) => (
                            <Button key={label} onClick={() => navigate(path)} color="inherit">{label}</Button>
                        ))}
                        {(loggedIn && role !== "admin") && roleBasedRoutes[role]?.map(({ label, path }) => (
                            <Button key={label} onClick={() => navigate(path)} color="inherit">{label}</Button>
                        ))}
                        {loggedIn && <Button onClick={handleLogOut} color="inherit">Log Out</Button>}
                    </Stack>
                )}
                <Drawer
                    anchor={"left"}
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            width: 240, // Fixed width for the drawer
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>

            </Toolbar>
        </AppBar>
    );
}
