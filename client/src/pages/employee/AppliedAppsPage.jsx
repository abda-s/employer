import React from 'react'
import { Box } from '@mui/material'
import NavBar from '../../components/NavBar'
import AppliedJobsTable from '../../components/AppliedJobsTable'
import "../../styles/AppliedAppsPage.css"

function AppliedAppsPage() {
    return (
        <Box className="applied-apps-page" >
            <NavBar />
            <Box className='applied-jobs-table' >
                <AppliedJobsTable />
            </Box>
        </Box>
    )
}

export default AppliedAppsPage
