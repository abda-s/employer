import React from 'react'
import NavBar from '../components/NavBar'
import JobListingView from '../components/jobListing/JobListingView'
import '../styles/JobListingPage.css'

function JobListingPage() {
  return (
    <div style={{ background: "#f4f2ee" }} >
      <NavBar title="Job Listing" />
      <div style={{ display: "flex", height: "100vh", }}>

        <div className='job-listing-view' >
        <JobListingView />

        </div>
      </div>
    </div>

  )
}

export default JobListingPage