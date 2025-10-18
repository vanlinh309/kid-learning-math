import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap'
import QuestionForm from './QuestionForm'
import QuestionList from './QuestionList'
import MultipleQuestionsForm from './MultipleQuestionsForm'
import type { QuestionData } from './Question'
import './AdminLayout.css'

type AdminSection = 'home' | 'questions-list' | 'questions-new' | 'questions-edit'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)

  const getActiveSectionFromPath = (pathname: string): AdminSection => {
    if (pathname === '/admin/questions') {
      return 'questions-list'
    } else if (pathname === '/admin/questions/new') {
      return 'questions-new'
    } else if (pathname === '/admin/questions/edit') {
      return 'questions-edit'
    } else if (pathname === '/admin') {
      return 'home'
    }
    return 'home' // default
  }

  const currentActiveSection = getActiveSectionFromPath(location.pathname)

  const handleEditClick = (questionId: string) => {
    // For now, just navigate to the edit page
    // You can implement fetching the question by ID later if needed
    navigate(`/admin/edit/${questionId}`)
  }

  const renderContent = () => {
    const sectionToRender = currentActiveSection
    switch (sectionToRender) {
      case 'home':
        return (
          <div className="admin-home">
            <div className="welcome-card">
              <div className="welcome-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h1 className="welcome-title">Welcome to Admin Panel</h1>
              <p className="welcome-subtitle">Kid Learning Math - Administration Dashboard</p>
              <div className="welcome-content">
                <p>
                  Welcome to the administrative interface for Kid Learning Math! 
                  Here you can manage questions, track progress, and create engaging 
                  learning experiences for young mathematicians.
                </p>
                <div className="quick-stats">
                  <div className="stat-item">
                    <div className="stat-number">📊</div>
                    <div className="stat-label">Question Management</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">⚡</div>
                    <div className="stat-label">Fast & Efficient</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">🎯</div>
                    <div className="stat-label">Interactive Learning</div>
                  </div>
                </div>
                <div className="quick-actions">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/admin/questions/new')}
                    className="me-3"
                  >
                    <i className="fas fa-plus-circle me-2"></i>
                    Create New Questions
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/admin/questions')}
                  >
                    <i className="fas fa-list-ul me-2"></i>
                    View All Questions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'questions-new':
        if (editingQuestion) {
          // Show single QuestionForm for editing
          return (
            <QuestionForm
              question={editingQuestion}
            />
          )
        } else {
          // Show MultipleQuestionsForm for adding new questions
          return (
            <MultipleQuestionsForm />
          )
        }
      case 'questions-edit':
        return (
          <QuestionForm
            question={editingQuestion}
          />
        )
      case 'questions-list':
      default:
        return (
          <QuestionList
            onEdit={handleEditClick}
          />
        )
    }
  }

  return (
    <div className="admin-layout">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Admin Panel - Kid Learning Math</Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid>
        <Row className="min-vh-100">
          <Col md={3} className="mb-4 p-0">
            <div className="admin-sidebar">
              {/* Home Section */}
              <div className="sidebar-menu mb-4">
                <div 
                  className={`sidebar-menu-item ${currentActiveSection === 'home' ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                >
                  <div className="sidebar-menu-icon">
                    <i className="fas fa-home"></i>
                  </div>
                  <span className="sidebar-menu-text">Home</span>
                </div>
              </div>

              {/* Main Section Header */}
              <div className="sidebar-section-header">
                QUESTIONS
              </div>
              
              {/* Menu Items */}
              <div className="sidebar-menu">
                <div 
                  className={`sidebar-menu-item ${currentActiveSection === 'questions-list' ? 'active' : ''}`}
                  onClick={() => navigate('/admin/questions')}
                >
                  <div className="sidebar-menu-icon">
                    <i className="fas fa-list-ul"></i>
                  </div>
                  <span className="sidebar-menu-text">List</span>
                </div>
                
                <div 
                  className={`sidebar-menu-item ${currentActiveSection === 'questions-new' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/admin/questions/new')
                    setEditingQuestion(null)
                  }}
                >
                  <div className="sidebar-menu-icon">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <span className="sidebar-menu-text">New</span>
                </div>
                
                {editingQuestion && (
                  <div 
                    className={`sidebar-menu-item ${currentActiveSection === 'questions-edit' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/edit')}
                  >
                    <div className="sidebar-menu-icon">
                      <i className="fas fa-edit"></i>
                    </div>
                    <span className="sidebar-menu-text">Edit</span>
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col md={9}>
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLayout
