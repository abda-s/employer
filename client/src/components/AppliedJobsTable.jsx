import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid} from '@mui/x-data-grid';
import { useAxios } from '../hooks/useAxios';

function AppliedJobsTable() {
    const { response: jobs, error, isLoading } = useAxios({ url: `/application/applied-jobs`, method: 'GET' });
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (error) {
            console.log('Error fetching applied jobs:', error);
            return;
        }

        // Transform the data into the structure expected by DataGrid
        const formattedRows = jobs?.map((item) => ({
            id: item._id, // Use _id as the row id
            jobTitle: item.jobPostingId.jobTitle,
            companyName: item.jobPostingId.companyName,
            skills: item.jobPostingId.skills.map(skill => skill.name).join(', '), // Convert array to string
            applicationDate: new Date(item.applicationDate).toLocaleDateString(), // Format the date
        }));
        setRows(formattedRows);

    }, [jobs, isLoading, error]); // Add isLoading and error to the dependency array

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
            {error && <div style={{ color: 'red' }}>Error fetching applied jobs: {error.message}</div>}
            <DataGrid
                rows={rows}
                columns={columns}
                loading={isLoading} // Show a loading indicator until data is loaded
                disableColumnMenu
                autoHeight
            />
        </Box>
    );
}

export default AppliedJobsTable;

