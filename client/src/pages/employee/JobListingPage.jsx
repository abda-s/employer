import React from 'react'
import { Box } from '@mui/material'
import NavBar from '../../components/NavBar'
import JobListingView from '../../components/jobListing/JobListingView'
import '../../styles/JobListingPage.css'

function JobListingPage() {
  return (
    <Box sx={{ background: "#f4f2ee" }} >
      <NavBar title="Job Listing" />
      <Box sx={{ display: "flex", height: "100vh", }}>

        <Box className='job-listing-view' >
        <JobListingView />

        </Box>
      </Box>
    </Box>

  )
}

export default JobListingPage