import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'

interface AdminSidebarProps {
  currentActiveSection: string
  onNavigate?: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentActiveSection, onNavigate }) => {
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleNavigation = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="admin-sidebar">
      {/* Home Section */}
      <div className="sidebar-menu mb-4">
        <div 
          className={`sidebar-menu-item ${currentActiveSection === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigation('/admin')}
        >
          <div className="sidebar-menu-icon">
            <i className="fas fa-home"></i>
          </div>
          <span className="sidebar-menu-text">Home</span>
        </div>
      </div>

      {/* Object Recognition Section */}
      <div className="sidebar-section-header" onClick={() => toggleSection('object-recognition')}>
        <span>OBJECT RECOGNITION</span>
        <i className={`fas fa-chevron-${expandedSection === 'object-recognition' ? 'down' : 'right'}`}></i>
      </div>
      
      {expandedSection === 'object-recognition' && (
        <div className="sidebar-menu mb-4">
          <div 
            className={`sidebar-menu-item ${currentActiveSection === 'object-recognition-list' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin/object-recognition')}
          >
            <div className="sidebar-menu-icon">
              <i className="fas fa-list-ul"></i>
            </div>
            <span className="sidebar-menu-text">List</span>
          </div>
          
          <div 
            className={`sidebar-menu-item ${currentActiveSection === 'object-recognition-new' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin/object-recognition/new')}
          >
            <div className="sidebar-menu-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <span className="sidebar-menu-text">New</span>
          </div>
        </div>
      )}

      {/* Counting Section */}
      <div className="sidebar-section-header" onClick={() => toggleSection('counting')}>
        <span>COUNTING</span>
        <i className={`fas fa-chevron-${expandedSection === 'counting' ? 'down' : 'right'}`}></i>
      </div>
      
      {expandedSection === 'counting' && (
        <div className="sidebar-menu">
          <div 
            className={`sidebar-menu-item ${currentActiveSection === 'counting-list' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin/counting')}
          >
            <div className="sidebar-menu-icon">
              <i className="fas fa-list-ul"></i>
            </div>
            <span className="sidebar-menu-text">List</span>
          </div>
          
          <div 
            className={`sidebar-menu-item ${currentActiveSection === 'counting-new' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin/counting/new')}
          >
            <div className="sidebar-menu-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <span className="sidebar-menu-text">New</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSidebar
