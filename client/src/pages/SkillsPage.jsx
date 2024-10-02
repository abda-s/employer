import React from 'react'
import DashboardLayout from './components/DashboardLayout'
import CategorysView from './components/AdminDashboard/CategorysView'

function SkillsPage() {
  return (
    <DashboardLayout>
      <CategorysView />
    </DashboardLayout>
  )
}

export default SkillsPage