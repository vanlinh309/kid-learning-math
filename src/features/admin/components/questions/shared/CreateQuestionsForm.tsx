import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap'
import { saveQuestionWithAnswers } from '../../../../../core/api/supabase'
import { RecognizeObjectQuestionForm } from '../recognize-object'
import { CountingQuestionForm } from '../counting'
import { QuestionNavigationSidebar } from '../../navigation'
import type { QuestionData } from '../../../../learning/components/lessons/RecognizeObjectLesson'
import { v4 as uuidv4 } from 'uuid'

// Function to generate UUID
const generateUUID = (): string => {
  return uuidv4()
}

interface QuestionInstance {
  id: string
  questionData?: QuestionData | null
  title?: string
}

// Define question category types
export type QuestionCategory = 'recognize_object' | 'counting'

interface MultipleQuestionsFormProps {
  category?: QuestionCategory
  redirectPath?: string
}

const MultipleQuestionsForm: React.FC<MultipleQuestionsFormProps> = ({ 
  category = 'recognize_object',
  redirectPath
}) => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuestionInstance[]>([
    { id: generateUUID() }
  ])
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string>('')
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  const addNewQuestion = () => {
    const newQuestion: QuestionInstance = {
      id: generateUUID()
    }
    setQuestions(prev => [...prev, newQuestion])
  }
  
  const removeQuestion = (questionId: string) => {
    if (questions.length === 1) return // Keep at least one question
    setQuestions(prev => prev.filter(question => question.id !== questionId))
  }

  const scrollToQuestion = (questionId: string) => {
    const element = questionRefs.current[questionId]
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const handleTitleChange = useCallback((title: string, questionId?: string) => {
    if (questionId) {
      setQuestions(prev => prev.map(question => 
        question.id === questionId ? { ...question, title } : question
      ))
    }
  }, [])

  const handleQuestionDataChange = useCallback((questionData: QuestionData, questionId?: string) => {
    if (questionId) {
      setQuestions(prev => prev.map(question => 
        question.id === questionId ? { ...question, questionData } : question
      ))
    }
  }, [])

  const handleSaveAllClick = () => {
    setShowSaveModal(true)
    setSaveError('') // Clear any previous errors
  }

  const handleConfirmSave = async () => {
    // Get questions that have question data
    const questionsWithData = questions
      .filter(q => q.questionData)
      .map(q => q.questionData!)

    if (questionsWithData.length === 0) {
      setSaveError('No questions to save')
      return
    }

    setIsSaving(true)
    setSaveError('')

    try {
      // Validate each question before saving
      const validQuestions: QuestionData[] = []
      const invalidQuestions: string[] = []

      for (const question of questionsWithData) {
        const isValid = validateQuestion(question)
        if (isValid) {
          validQuestions.push(question)
        } else {
          invalidQuestions.push(question.title || question.id)
        }
      }

      // If no valid questions, show error
      if (validQuestions.length === 0) {
        setSaveError('No valid questions found. Each question must have a title, image URL, and at least one correct answer.')
        setIsSaving(false)
        return
      }

      // If some questions are invalid, show warning
      if (invalidQuestions.length > 0) {
        setSaveError(`${invalidQuestions.length} question(s) are invalid and will be skipped: ${invalidQuestions.join(', ')}`)
      }

      // Save all valid questions to database
      const savePromises = validQuestions.map(question => 
        saveQuestionWithAnswers({
          id: question.id,
          title: question.title,
          imageUrl: question.imageUrl,
          category: category, // Use the category prop
          answers: question.answers.map(answer => ({
            id: answer.id,
            isCorrect: answer.isCorrect,
            blocks: answer.blocks.map(block => ({
              shape: block.shape,
              number: block.number,
              color: block.color || '#007bff'
            })),
            imageUrl: answer.imageUrl // Include imageUrl for counting questions
          }))
        })
      )

      const results = await Promise.all(savePromises)
      
      // Check if all saves were successful
      const failedSaves = results.filter(result => !result.success)
      
      if (failedSaves.length === 0) {
        // All saves successful - navigate based on category or redirectPath
        setShowSaveModal(false)
        const defaultPath = category === 'counting' ? '/admin/counting' : '/admin/object-recognition'
        navigate(redirectPath || defaultPath)
      } else {
        // Some saves failed
        setSaveError(`Failed to save ${failedSaves.length} question(s). Please try again.`)
      }
    } catch (error) {
      console.error('Error saving questions to database:', error)
      setSaveError('An error occurred while saving questions to the database. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const validateQuestion = (question: QuestionData): boolean => {
    // Check if title is not empty
    if (!question.title || question.title.trim() === '') {
      return false
    }

    // Check if image URL is not empty
    if (!question.imageUrl || question.imageUrl.trim() === '') {
      return false
    }

    // For counting questions, validate that answers have imageUrl and count
    if (category === 'counting') {
      const hasValidAnswers = question.answers.some(answer => 
        answer.imageUrl && 
        answer.imageUrl.trim() !== '' && 
        answer.blocks.length > 0 && 
        answer.blocks[0].number > 0
      )
      return hasValidAnswers
    }

    // For other question types, check if there's at least one correct answer
    const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect)
    if (!hasCorrectAnswer) {
      return false
    }

    return true
  }

  const handleCancelSave = () => {
    setShowSaveModal(false)
    setSaveError('')
  }

  // Get category display name
  const getCategoryDisplayName = () => {
    switch (category) {
      case 'counting':
        return 'Counting'
      case 'recognize_object':
        return 'Object Recognition'
      default:
        return 'Questions'
    }
  }

  // Get category icon
  const getCategoryIcon = () => {
    switch (category) {
      case 'counting':
        return '🔢'
      case 'recognize_object':
        return '👁️'
      default:
        return '📝'
    }
  }

  return (
    <>
      {/* Navigation Sidebar */}
      <QuestionNavigationSidebar
        forms={questions}
        onScrollToQuestion={scrollToQuestion}
        completedForms={new Set(questions.filter(q => q.questionData).map(q => q.id))}
      />
      
      <Container fluid>
      {/* Header with Add Question and Save All buttons */}
      <Row className="mb-4">
        <Col>
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">{getCategoryIcon()} Create {getCategoryDisplayName()} Questions</h4>
                  <small>Add multiple {getCategoryDisplayName().toLowerCase()} questions simultaneously</small>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="light" 
                      onClick={addNewQuestion}
                      size="sm"
                    >
                      ➕ Add Question
                    </Button>

                  </div>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* Questions with data count alert */}
      {questions.filter(q => q.questionData).length > 0 && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="d-flex align-items-center">
              <span className="me-2">📊</span>
              <span>
                You have <strong>{questions.filter(q => q.questionData).length}</strong> question{questions.filter(q => q.questionData).length !== 1 ? 's' : ''} ready to save.
              </span>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Question Forms */}
      {questions.map((question, index) => (
        <Row 
          key={question.id} 
          className="mb-4"
          ref={(el: HTMLDivElement | null) => {
            questionRefs.current[question.id] = el
          }}
        >
          <Col>
            <Card className="border-secondary">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {question.title ? (
                    <>
                      <span className="text-muted me-2">#{index + 1}</span>
                      {question.title}
                    </>
                  ) : (
                    `Question #${index + 1}`
                  )}
                  {question.questionData && (
                    <span className="ms-2 text-success">✅</span>
                  )}
                </h5>
                {questions.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    ✕ Remove
                  </Button>
                )}
              </Card.Header>
              <Card.Body className="p-0">
                {/* Render different form based on category */}
                {category === 'counting' ? (
                  <CountingQuestionForm
                    question={question.questionData}
                    showCardWrapper={false}
                    questionId={question.id}
                    onTitleChange={handleTitleChange}
                    onQuestionDataChange={handleQuestionDataChange}
                  />
                ) : (
                  <RecognizeObjectQuestionForm
                    question={question.questionData}
                    showCardWrapper={false}
                    questionId={question.id}
                    onTitleChange={handleTitleChange}
                    onQuestionDataChange={handleQuestionDataChange}
                  />
                )}
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
              onClick={addNewQuestion}
            >
              ➕ Add
            </Button>
            <Button 
              variant={questions.filter(q => q.questionData).length > 0 ? "success" : "outline-success"}
              onClick={handleSaveAllClick}
            >
              💾 Save {questions.filter(q => q.questionData).length > 0 ? `(${questions.filter(q => q.questionData).length})` : '(0)'}
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
          {saveError && (
            <div className="alert alert-warning mb-3">
              <small><strong>Warning:</strong> {saveError}</small>
            </div>
          )}
          
          {questions.length > 0 ? (
            <>
              <h5 className="mb-3">Are you sure you want to save all questions?</h5>
              <p className="text-muted mb-3">
                You have <strong>{questions.length}</strong> question{questions.length !== 1 ? 's' : ''} ready to be saved to the database.
              </p>
              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> Each question must have a title, image URL, and at least one correct answer to be saved. Invalid questions will be skipped.
                </small>
              </div>
            </>
          ) : (
            <>
              <h5 className="mb-3">No questions to save</h5>
              <p className="text-muted mb-3">
                You currently have no submitted questions. Please create and submit some questions first.
              </p>
              <div className="alert alert-warning">
                <small>
                  <strong>Tip:</strong> Fill out the question forms and click "📝 Add Question (Draft)" to create questions that can be saved.
                </small>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelSave} disabled={isSaving}>
          {questions.length > 0 ? 'Cancel' : 'Close'}
        </Button>
        {questions.length > 0 && (
          <Button variant="success" onClick={handleConfirmSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              '💾 Yes, Save All Questions'
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>

    </>
  )
}

export default MultipleQuestionsForm
