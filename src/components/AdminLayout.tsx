import React, { useState } from 'react'
import { Container, Row, Col, Nav, Navbar, Card, Button, Badge } from 'react-bootstrap'
import QuestionForm from './QuestionForm'
import QuestionList from './QuestionList'
import MultipleQuestionsForm from './MultipleQuestionsForm'
import type { QuestionData } from './Question'

type AdminSection = 'add-question' | 'manage-questions' | 'categories'

interface AdminLayoutProps {
  questions: QuestionData[]
  savedQuestions: QuestionData[]
  draftQuestions: QuestionData[]
  onAddQuestion: (question: QuestionData) => void
  onEditQuestion: (question: QuestionData) => void
  onDeleteQuestion: (questionId: string) => void
  onSaveAllQuestions: () => void
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  questions,
  savedQuestions,
  draftQuestions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSaveAllQuestions
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('add-question')
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)

  const handleEditClick = (question: QuestionData) => {
    setEditingQuestion(question)
    setActiveSection('add-question')
  }

  const handleFormSubmit = (question: QuestionData, _formId?: string) => {
    if (editingQuestion) {
      onEditQuestion(question)
      setEditingQuestion(null)
      setActiveSection('manage-questions')
    } else {
      onAddQuestion(question)
      // Stay on add-question section for continuous adding
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'add-question':
        if (editingQuestion) {
          // Show single QuestionForm for editing
          return (
            <QuestionForm
              question={editingQuestion}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
            />
          )
        } else {
          // Show MultipleQuestionsForm for adding new questions
          return (
            <MultipleQuestionsForm
              onAddQuestion={onAddQuestion}
              onSaveAllQuestions={onSaveAllQuestions}
              draftCount={draftQuestions.length}
            />
          )
        }
      case 'manage-questions':
        return (
          <div>
            {draftQuestions.length > 0 && (
              <Card className="mb-3 border-warning">
                <Card.Header className="bg-warning-subtle">
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-0 text-warning-emphasis">
                        📝 Unsaved Questions ({draftQuestions.length})
                      </h5>
                      <small className="text-muted">
                        These questions are not yet saved. Click "Save All Questions" to persist them.
                      </small>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        variant="success"
                        onClick={onSaveAllQuestions}
                        size="sm"
                      >
                        💾 Save All Questions
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
            )}
            <QuestionList
              questions={questions}
              savedQuestions={savedQuestions}
              draftQuestions={draftQuestions}
              onEdit={handleEditClick}
              onDelete={onDeleteQuestion}
            />
          </div>
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
                      {!editingQuestion && draftQuestions.length > 0 && (
                        <Badge bg="warning" className="ms-2 text-dark">
                          {draftQuestions.length} draft{draftQuestions.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
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
