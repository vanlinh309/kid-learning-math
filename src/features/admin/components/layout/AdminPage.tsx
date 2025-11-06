import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <span className="navbar-brand">Math Questions Admin</span>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </nav>
      
      <AdminLayout />
    </div>
  )
}

export default AdminPage
