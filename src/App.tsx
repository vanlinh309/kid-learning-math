import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Layout from './components/Layout'
import AdminPage from './components/AdminPage'
import './App.css'

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false)

  if (isAdminMode) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center bg-light p-3 border-bottom">
          <h5 className="mb-0">Admin Mode</h5>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => setIsAdminMode(false)}
          >
            Back to Learning App
          </Button>
        </div>
        <AdminPage />
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-end p-3">
        <Button 
          variant="outline-dark" 
          size="sm"
          onClick={() => setIsAdminMode(true)}
        >
          Admin Panel
        </Button>
      </div>
      <Layout />
    </div>
  )
}

export default App
