import React from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import UsersTable from '../../components/adminDashboard/UsersTable'

function UsersManagementPage() {
  return (
    <DashboardLayout>
       <UsersTable /> 
    </DashboardLayout>
  )
}

export default UsersManagementPage