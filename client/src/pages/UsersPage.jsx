import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import UsersTable from '../components/adminDashboard/UsersTable'

function UsersPage() {
  return (
    <DashboardLayout>
       <UsersTable /> 
    </DashboardLayout>
  )
}

export default UsersPage