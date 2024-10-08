import React from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import JobsTable from '../../components/adminDashboard/JobsTable'

function JobsAdminPage() {
  return (
    <DashboardLayout>
        <JobsTable />
    </DashboardLayout>
  )
}

export default JobsAdminPage