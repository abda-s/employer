import React from 'react'
import DashboardLayout from "../components/DashboardLayout"
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationView from '../components/JobPostingPage/application/ApplicationView';
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