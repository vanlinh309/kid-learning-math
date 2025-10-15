import React, { useState } from 'react'
import { Container, Row, Col, Nav, Navbar, Card } from 'react-bootstrap'
import QuestionForm from './QuestionForm'
import QuestionList from './QuestionList'
import type { QuestionData } from './Question'

type AdminSection = 'add-question' | 'manage-questions' | 'categories'

interface AdminLayoutProps {
  questions: QuestionData[]
  onAddQuestion: (question: QuestionData) => void
  onEditQuestion: (question: QuestionData) => void
  onDeleteQuestion: (questionId: string) => void
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('add-question')
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)

  const handleEditClick = (question: QuestionData) => {
    setEditingQuestion(question)
    setActiveSection('add-question')
  }

  const handleFormSubmit = (question: QuestionData) => {
    if (editingQuestion) {
      onEditQuestion(question)
      setEditingQuestion(null)
    } else {
      onAddQuestion(question)
    }
    setActiveSection('manage-questions')
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'add-question':
        return (
          <QuestionForm
            question={editingQuestion}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
          />
        )
      case 'manage-questions':
        return (
          <QuestionList
            questions={questions}
            onEdit={handleEditClick}
            onDelete={onDeleteQuestion}
          />
        )
      case 'categories':
        return (
          <Card>
            <Card.Header>
              <h4>Manage Categories</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Category management coming soon...</p>
            </Card.Body>
          </Card>
        )
      default:
        return null
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
        <Row>
          <Col md={3} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Admin Menu</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      active={activeSection === 'add-question'}
                      onClick={() => {
                        setActiveSection('add-question')
                        setEditingQuestion(null)
                      }}
                      className="text-start"
                    >
                      {editingQuestion ? 'Edit Question' : 'Add Question'}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeSection === 'manage-questions'}
                      onClick={() => setActiveSection('manage-questions')}
                      className="text-start"
                    >
                      Manage Questions ({questions.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeSection === 'categories'}
                      onClick={() => setActiveSection('categories')}
                      className="text-start"
                    >
                      Manage Categories
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
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
