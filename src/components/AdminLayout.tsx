import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap'
import QuestionForm from './QuestionForm'
import QuestionList from './QuestionList'
import CreateQuestionsForm from './CreateQuestionsForm'
import AdminSidebar from './AdminSidebar'
import type { QuestionData } from './Question'
import './AdminLayout.css'

type AdminSection = 'home' | 'object-recognition-list' | 'object-recognition-new' | 'counting-list' | 'counting-new' | 'questions-edit'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [editingQuestion] = useState<QuestionData | null>(null)

  const getActiveSectionFromPath = (pathname: string): AdminSection => {
    if (pathname === '/admin/object-recognition') {
      return 'object-recognition-list'
    } else if (pathname === '/admin/object-recognition/new') {
      return 'object-recognition-new'
    } else if (pathname === '/admin/counting') {
      return 'counting-list'
    } else if (pathname === '/admin/counting/new') {
      return 'counting-new'
    } else if (pathname === '/admin/questions') {
      return 'object-recognition-list' // Legacy path
    } else if (pathname === '/admin/questions/new') {
      return 'object-recognition-new' // Legacy path
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
                    onClick={() => navigate('/admin/object-recognition/new')}
                    className="me-3"
                  >
                    <i className="fas fa-plus-circle me-2"></i>
                    Create New Questions
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/admin/object-recognition')}
                  >
                    <i className="fas fa-list-ul me-2"></i>
                    View All Questions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'object-recognition-new':
        if (editingQuestion) {
          return (
            <QuestionForm
              question={editingQuestion}
            />
          )
        } else {
          return (
            <CreateQuestionsForm 
              category="recognize_object"
              redirectPath="/admin/object-recognition"
            />
          )
        }
      case 'counting-new':
        if (editingQuestion) {
          return (
            <QuestionForm
              question={editingQuestion}
            />
          )
        } else {
          return (
            <CreateQuestionsForm 
              category="counting"
              redirectPath="/admin/counting"
            />
          )
        }
      case 'questions-edit':
        return (
          <QuestionForm
            question={editingQuestion}
          />
        )
      case 'object-recognition-list':
        return (
          <QuestionList
            onEdit={handleEditClick}
            category="recognize_object"
          />
        )
      case 'counting-list':
        return (
          <QuestionList
            onEdit={handleEditClick}
            category="counting"
          />
        )
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
            <AdminSidebar 
              currentActiveSection={currentActiveSection}
            />
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
