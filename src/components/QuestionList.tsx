import React, { useState, useEffect, useCallback } from 'react'
import { Card, Table, Button, Spinner, Alert, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap'
import { fetchQuestions, deleteQuestionWithAnswers, fetchQuestionWithAnswersById, type QuestionDB } from '../utils/supabase'
import QuestionForm from './QuestionForm'
import type { QuestionData } from './Question'

// Types for database response
interface DatabaseAnswer {
  id: string
  question_id: string
  title: string
  content: Array<{
    shape: string
    number: number
    color: string
  }>
  type?: string
  is_correct: boolean
  created_at?: string
  updated_at?: string
}

interface QuestionListProps {
  onEdit: (questionId: string) => void
  onRefresh?: () => void
  category?: string // Add category filter
}

const QuestionList: React.FC<QuestionListProps> = ({
  onEdit,
  onRefresh,
  category
}) => {
  const [questions, setQuestions] = useState<QuestionDB[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null)
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await fetchQuestions()
      if (result.success) {
        let allQuestions = result.questions || []
        // Filter by category if provided
        if (category) {
          allQuestions = allQuestions.filter(q => q.category === category)
        }
        setQuestions(allQuestions)
      } else {
        setError(result.error || 'Failed to load questions')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error loading questions:', err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return
    }

    try {
      const result = await deleteQuestionWithAnswers(questionId)
      if (result.success) {
        // Refresh the questions list
        await loadQuestions()
        if (onRefresh) {
          onRefresh()
        }
      } else {
        alert('Failed to delete question: ' + (result.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error deleting question:', err)
      alert('An error occurred while deleting the question')
    }
  }

  const handleTitleClick = async (questionId: string) => {
    setModalLoading(true)
    setShowModal(true)
    setSelectedQuestion(null)

    try {
      // Fetch the specific question with its answers
      const result = await fetchQuestionWithAnswersById(questionId)
      if (result.success && result.question) {
        const fullQuestion = result.question
        // Convert the database format to QuestionData format
        const questionData: QuestionData = {
          id: fullQuestion.id,
          title: fullQuestion.title || '',
          imageUrl: fullQuestion.image_url || '',
          answers: fullQuestion.answer?.map((answer: DatabaseAnswer, index: number) => ({
            id: answer.id || `answer${index + 1}`,
            isCorrect: answer.is_correct,
            blocks: answer.content || []
          })) || []
        }
        setSelectedQuestion(questionData)
      } else {
        console.error('Failed to fetch question details:', result.error)
      }
    } catch (err) {
      console.error('Error fetching question details:', err)
    } finally {
      setModalLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedQuestion(null)
  }

  const formatCategory = (category?: string) => {
    if (!category) return 'Unknown'
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading questions...</div>
        </Card.Body>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>Error Loading Questions</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={loadQuestions}>
              Try Again
            </Button>
          </Alert>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Questions ({questions.length})</h4>
          <Button variant="outline-primary" size="sm" onClick={loadQuestions}>
            <i className="fas fa-refresh me-1"></i>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          {questions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No questions available. Add your first question!</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Title</th>
                  <th style={{ width: '150px' }}>Category</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={question.id}>
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <div 
                        className="fw-semibold text-primary" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleTitleClick(question.id || '')}
                        title="Click to view question details"
                      >
                        {question.title || 'Untitled'}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {formatCategory(question.category)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit Question</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onEdit(question.id || '')}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                        </OverlayTrigger>
                        
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete Question</Tooltip>}
                        >
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(question.id || '')}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Question Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-eye me-2"></i>
            Question Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {modalLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2">Loading question details...</div>
            </div>
          ) : selectedQuestion ? (
            <QuestionForm
              question={selectedQuestion}
              showCardWrapper={false}
              questionId={selectedQuestion.id}
            />
          ) : (
            <Alert variant="warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Question details could not be loaded.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            <i className="fas fa-times me-1"></i>
            Close
          </Button>
          {selectedQuestion && (
            <Button 
              variant="primary" 
              onClick={() => {
                handleCloseModal()
                onEdit(selectedQuestion.id)
              }}
            >
              <i className="fas fa-edit me-1"></i>
              Edit Question
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default QuestionList
