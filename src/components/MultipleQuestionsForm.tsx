import React, { useState, useRef } from 'react'
import { Button, Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap'
import QuestionForm from './QuestionForm'
import QuestionNavigationSidebar from './QuestionNavigationSidebar'
import type { QuestionData } from './Question'

// Function to generate UUID
const generateUUID = (): string => {
  return 'form_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

interface QuestionFormInstance {
  id: string
  questionData?: QuestionData | null
  title?: string
}

interface MultipleQuestionsFormProps {
  onAddQuestion: (question: QuestionData) => void
  onSaveAllQuestions: () => void
  draftCount: number
}

const MultipleQuestionsForm: React.FC<MultipleQuestionsFormProps> = ({
  onAddQuestion,
  onSaveAllQuestions,
  draftCount
}) => {
  const [forms, setForms] = useState<QuestionFormInstance[]>([
    { id: generateUUID() }
  ])
  const [completedForms, setCompletedForms] = useState<Set<string>>(new Set())
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
  const formRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  const addNewForm = () => {
    const newForm: QuestionFormInstance = {
      id: generateUUID()
    }
    setForms(prev => [...prev, newForm])
  }
  
  const removeForm = (formId: string) => {
    if (forms.length === 1) return // Keep at least one form
    setForms(prev => prev.filter(form => form.id !== formId))
    // Remove from completed forms if it was completed
    setCompletedForms(prev => {
      const newSet = new Set(prev)
      newSet.delete(formId)
      return newSet
    })
  }
  
  const handleQuestionSubmit = (question: QuestionData, formId?: string) => {
    onAddQuestion(question)
    // Mark this form as completed if formId is provided
    if (formId) {
      setCompletedForms(prev => new Set([...prev, formId]))
    }
  }

  const scrollToQuestion = (formId: string, _index: number) => {
    const element = formRefs.current[formId]
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const handleTitleChange = (title: string, formId?: string) => {
    if (formId) {
      setForms(prev => prev.map(form => 
        form.id === formId ? { ...form, title } : form
      ))
    }
  }

  const handleSaveAllClick = () => {
    setShowSaveModal(true)
  }

  const handleConfirmSave = () => {
    onSaveAllQuestions()
    setShowSaveModal(false)
  }

  const handleCancelSave = () => {
    setShowSaveModal(false)
  }

  return (
    <>
      {/* Navigation Sidebar */}
      <QuestionNavigationSidebar
        forms={forms}
        onScrollToQuestion={scrollToQuestion}
        completedForms={completedForms}
      />
      
      <Container fluid>
      {/* Header with Add Question and Save All buttons */}
      <Row className="mb-4">
        <Col>
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">📝 Create Questions</h4>
                  <small>Add multiple questions simultaneously</small>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="light" 
                      onClick={addNewForm}
                      size="sm"
                    >
                      ➕ Add Question Form
                    </Button>

                  </div>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* Draft count alert */}
      {draftCount > 0 && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="d-flex align-items-center">
              <span className="me-2">📊</span>
              <span>
                You have <strong>{draftCount}</strong> draft question{draftCount !== 1 ? 's' : ''} ready to save.
              </span>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Question Forms */}
      {forms.map((form, index) => (
        <Row 
          key={form.id} 
          className="mb-4"
          ref={(el: HTMLDivElement | null) => {
            formRefs.current[form.id] = el
          }}
        >
          <Col>
            <Card className="border-secondary">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {form.title ? (
                    <>
                      <span className="text-muted me-2">#{index + 1}</span>
                      {form.title}
                    </>
                  ) : (
                    `Question #${index + 1}`
                  )}
                  {completedForms.has(form.id) && (
                    <span className="ms-2 text-success">✅</span>
                  )}
                </h5>
                {forms.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeForm(form.id)}
                  >
                    ✕ Remove
                  </Button>
                )}
              </Card.Header>
              <Card.Body className="p-0">
                <QuestionForm
                  question={form.questionData}
                  onSubmit={handleQuestionSubmit}
                  showCardWrapper={false}
                  formId={form.id}
                  onTitleChange={handleTitleChange}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}

      {/* Footer with quick actions */}
      <Row className="mb-4">
        <Col className="text-center">
          <div className="d-flex gap-2 justify-content-center">
            <Button 
              variant="outline-primary" 
              onClick={addNewForm}
            >
              ➕ Add Another Question Form
            </Button>
            <Button 
              variant={draftCount > 0 ? "success" : "outline-success"}
              onClick={handleSaveAllClick}
            >
              💾 Save All Questions {draftCount > 0 ? `(${draftCount})` : '(0)'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>

    {/* Save All Confirmation Modal */}
    <Modal show={showSaveModal} onHide={handleCancelSave} centered>
      <Modal.Header closeButton>
        <Modal.Title>💾 Save All Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {draftCount > 0 ? (
            <>
              <h5 className="mb-3">Are you sure you want to save all questions?</h5>
              <p className="text-muted mb-3">
                You have <strong>{draftCount}</strong> draft question{draftCount !== 1 ? 's' : ''} ready to be saved to the database.
              </p>
              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> Once saved, these questions will be permanently stored and available for use in the learning application.
                </small>
              </div>
            </>
          ) : (
            <>
              <h5 className="mb-3">No draft questions to save</h5>
              <p className="text-muted mb-3">
                You currently have no draft questions. Please create and submit some questions first.
              </p>
              <div className="alert alert-warning">
                <small>
                  <strong>Tip:</strong> Fill out the question forms and click "📝 Add Question (Draft)" to create draft questions that can be saved.
                </small>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelSave}>
          {draftCount > 0 ? 'Cancel' : 'Close'}
        </Button>
        {draftCount > 0 && (
          <Button variant="success" onClick={handleConfirmSave}>
            💾 Yes, Save All Questions
          </Button>
        )}
      </Modal.Footer>
    </Modal>

    </>
  )
}

export default MultipleQuestionsForm
