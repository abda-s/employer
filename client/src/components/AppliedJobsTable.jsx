import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios'; // Assuming you use axios for the request
import { serverURL } from '../constants';
import { useSelector } from 'react-redux';

function AppliedJobsTable() {
    const accessToken = useSelector(state => state.auth.token)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the data from your API
        const fetchData = async () => {
            try {
                const response = await axios.get(`${serverURL}/application/applied-jobs`, { headers: { accessToken } }); // Replace with your API endpoint
                const data = response.data;

                // Transform the data into the structure expected by DataGrid
                const formattedRows = data.map((item) => ({
                    id: item._id, // Use _id as the row id
                    jobTitle: item.jobPostingId.jobTitle,
                    companyName: item.jobPostingId.companyName,
                    skills: item.jobPostingId.skills.map(skill => skill.name).join(', '), // Convert array to string
                    applicationDate: new Date(item.applicationDate).toLocaleDateString(), // Format the date
                }));
                setRows(formattedRows);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    const columns = [
        {
            field: 'jobTitle',
            headerName: 'Job Title',
            width: 200,
            editable: false,
        },
        {
            field: 'companyName',
            headerName: 'Company Name',
            width: 200,
            editable: false,
        },
        {
            field: 'skills',
            headerName: 'Requirements',
            width: 200,
            editable: false,
        },
        {
            field: 'applicationDate',
            headerName: 'Application Date',
            editable: false,
            width: 200,
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading} // Show a loading indicator until data is loaded
                disableColumnMenu
                autoHeight
            />
        </Box>
    );
}

export default AppliedJobsTable;
