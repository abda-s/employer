import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import JobsTable from '../components/AdminDashboard/JobsTable'

function JobsAdminPage() {
  return (
    <DashboardLayout>
        <JobsTable />
    </DashboardLayout>
  )
}

export default JobsAdminPage