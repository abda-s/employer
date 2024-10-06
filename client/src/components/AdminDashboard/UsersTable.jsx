import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { serverURL } from '../../constants';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useMediaQuery, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResetUserPassModel from './ResetUserPassModel';

function UsersTable() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const accessToken = useSelector(state => state.auth.token);
    const [usersData, setUsersData] = useState([]);

    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const [isVisible, setIsVisible] = useState(false)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        axios.get(`${serverURL}/users/all-users`, { headers: { accessToken } })
            .then(res => {
                const usersList = res.data.map(item => ({ ...item, id: item._id }));
                setUsersData(usersList);
            })
            .catch(err => {
                setUsersData([]);
                console.log(err);
            });
    }, []);

    const columns = [
        {
            field: 'email',
            headerName: 'Email',
            flex: isMobile ? 0 : 1,
            width: isMobile ? 200 : 0,
            editable: false,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: isMobile ? 0 : 1,
            width: isMobile ? 100 : 0,
            editable: false,

        },
        {
            field: 'action',
            headerName: 'Reset Password',
            sortable: false,
            flex: isMobile ? 0 : 1,
            width: isMobile ? 150 : 0,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { setUserId(params.id); setIsVisible(true) }}
                >
                    Reset Password
                </Button>
            ),
        },
    ];

    // Filter the rows based on the search query
    const filteredRows = usersData.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", width: "100%" }} >
                {/* Search Bar */}
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
                    sx={{ marginBottom: 2, width: "100%" }} // Spacing below search bar
                />
            </Box>

            {/* DataGrid */}
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows} // Use filtered rows
                    columns={columns}
                    disableColumnMenu
                    autoHeight
                    disableColumnResize={!isMobile} // Disable resizing if !isMobile
                />
            </Box>

            <ResetUserPassModel 
            isVisible={isVisible}
            userId={userId}
            onClose={()=>{setIsVisible(false); setUserId(null) }}

            />
        </Box>
    );
}

export default UsersTable;
