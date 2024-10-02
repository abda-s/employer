import React from 'react'
import DashboardLayout from './components/DashboardLayout'
import UsersTable from './components/AdminDashboard/UsersTable'

function UsersPage() {
  return (
    <DashboardLayout>
       <UsersTable /> 
    </DashboardLayout>
  )
}

export default UsersPage