import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { serverURL } from '../../../constants';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useMediaQuery, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResetUserPassModel from './ResetUserPassModel';
import { useNavigate } from 'react-router-dom';


function JobsTable() {

    const navigate = useNavigate()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const accessToken = useSelector(state => state.auth.token);
    const [data, setData] = useState([]);

    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        axios.get(`${serverURL}/job-posting/all-jobs`, { headers: { accessToken } })
            .then(res => {
                const jobsList = res.data.map(item => ({ ...item, id: item._id }));
                setData(jobsList);
            })
            .catch(err => {
                setData([]);
                console.log(err);
            });
    }, []);

    const columns = [
        {
            field: 'jobTitle',
            headerName: 'job Title',
            flex: isMobile ? 0 : 1,
            width: isMobile ? 100 : 0,
            editable: false,
        },
        {
            field: 'companyName',
            headerName: 'Company Name',
            flex: isMobile ? 0 : 1,
            width: isMobile ? 100 : 0,
            editable: false,

        },
        {
            field: 'skills',
            headerName: 'Skills',
            flex: isMobile ? 0 : 1,
            width: isMobile ? 150 : 0,
            editable: false,

        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: false,
            flex: isMobile ? 0 : 1,
            width: isMobile ? 100 : 0,
            disableColumnMenu: true,
        },
        {
            field: 'action',
            headerName: 'View',
            sortable: false,
            flex: isMobile ? 0 : 1,
            width: isMobile ? 100 : 0,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { navigate(params.id) }}
                >
                    View
                </Button>
            ),
        },
    ];

    // Filter the rows based on the search query
    const filteredRows = data.filter(user =>
        user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.description.toLowerCase().includes(searchQuery.toLowerCase())

    );

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", width: "100%" }} >
                {/* Search Bar */}
                <TextField
                    label="Search jobs"
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

        </Box>
    )
}

export default JobsTable