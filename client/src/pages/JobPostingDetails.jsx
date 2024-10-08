import React from 'react'
import DashboardLayout from "../layout/DashboardLayout"
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationView from '../components/jobPostingPage/application/ApplicationView';
import { Box } from '@mui/material';

function JobPostingDetails() {
    const navigate = useNavigate()
    const { id } = useParams();



    return (
        <DashboardLayout>
            <ApplicationView
                id={id}
                goBack={() => navigate('/dashboard/jobs')}
            />
        </DashboardLayout>
    )
}

export default JobPostingDetails