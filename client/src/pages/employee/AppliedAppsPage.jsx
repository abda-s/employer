import React from 'react'
import NavBar from '../../components/NavBar'
import AppliedJobsTable from '../../components/AppliedJobsTable'
import "../../styles/AppliedAppsPage.css"

function AppliedAppsPage() {
    return (
        <div style={{width:"100%" }} >
            <NavBar />
                <div className='applied-jobs-table' >
                    {/* <JobListingView /> */}
                    <AppliedJobsTable />
                </div>
        </div>)
}

export default AppliedAppsPage