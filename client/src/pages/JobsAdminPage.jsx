import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import JobsTable from '../components/adminDashboard/JobsTable'

function JobsAdminPage() {
  return (
    <DashboardLayout>
        <JobsTable />
    </DashboardLayout>
  )
}

export default JobsAdminPage