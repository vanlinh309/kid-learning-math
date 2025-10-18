import React, { useState, useEffect } from 'react'
import { Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap'
import { fetchQuestionsWithAnswers, deleteQuestionWithAnswers } from '../utils/supabase'

interface DatabaseQuestion {
  id: string
  title: string
  image_url?: string
  category: string
  created_at: string
  updated_at: string
  answer: Array<{
    id: string
    question_id: string
    title: string
    content: Array<{
      shape: string
      number: number
      color: string
    }>
    type: string
    is_correct: boolean
    created_at: string
    updated_at: string
  }>
}

const QuestionDatabase: React.FC = () => {
  const [questions, setQuestions] = useState<DatabaseQuestion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadQuestions = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchQuestionsWithAnswers()
      if (result.success && result.questions) {
        setQuestions(result.questions)
      } else {
        setError(result.error || 'Failed to load questions')
      }
    } catch (err) {
      console.error('Error loading questions:', err)
      setError('An unexpected error occurred while loading questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question and all its answers?')) {
      return
    }

    setDeletingId(questionId)
    try {
      const result = await deleteQuestionWithAnswers(questionId)
      if (result.success) {
        // Remove the question from the local state
        setQuestions(prev => prev.filter(q => q.id !== questionId))
      } else {
        setError(result.error || 'Failed to delete question')
      }
    } catch (err) {
      console.error('Error deleting question:', err)
      setError('An unexpected error occurred while deleting the question')
    } finally {
      setDeletingId(null)
    }
  }

  const renderShapeIcon = (shape: string, size = 16, color = '#007bff') => {
    const safeColor = color || '#007bff'
    const iconStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: safeColor,
      display: 'inline-block',
      verticalAlign: 'middle',
      margin: '2px'
    }

    switch (shape) {
      case 'square':
        return <div style={iconStyle} />
      case 'triangle':
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${safeColor}`,
              display: 'inline-block',
              verticalAlign: 'middle',
              margin: '2px'
            }}
          />
        )
      case 'circle':
        return (
          <div 
            style={{
              ...iconStyle,
              borderRadius: '50%'
            }}
          />
        )
      case 'rectangle':
        return (
          <div
            style={{
              ...iconStyle,
              width: `${size * 1.3}px`,
              borderRadius: '2px'
            }}
          />
        )
      case 'diamond':
        return (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: safeColor,
              display: 'inline-block',
              verticalAlign: 'middle',
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              margin: '2px'
            }}
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h4>Questions in Database</h4>
        </Card.Header>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-2">Loading questions...</div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Questions in Database</h4>
        <Button variant="outline-primary" size="sm" onClick={loadQuestions}>
          🔄 Refresh
        </Button>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {questions.length === 0 && !error && (
          <Alert variant="info">
            No questions found in the database. Create your first question using the form above!
          </Alert>
        )}

        {questions.map((question) => (
          <Card key={question.id} className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{question.title}</h6>
                  <small className="text-muted">
                    ID: {question.id} | Category: {question.category}
                  </small>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(question.id)}
                  disabled={deletingId === question.id}
                >
                  {deletingId === question.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" />
                      Deleting...
                    </>
                  ) : (
                    '🗑️ Delete'
                  )}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {question.image_url && (
                <div className="mb-3">
                  <small className="text-muted">Image URL:</small>
                  <div className="text-break small">{question.image_url}</div>
                </div>
              )}
              
              <div>
                <strong>Answers ({question.answer.length}):</strong>
                <Row className="mt-2">
                  {question.answer.map((answer) => (
                    <Col md={4} key={answer.id} className="mb-2">
                      <div className={`border rounded p-2 ${answer.is_correct ? 'border-success bg-light-success' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="fw-bold">{answer.title}</small>
                          {answer.is_correct && <Badge bg="success">Correct</Badge>}
                        </div>
                        <div className="d-flex flex-wrap">
                          {answer.content.map((block, blockIndex) => (
                            <div key={blockIndex} className="d-flex align-items-center me-2 mb-1">
                              {renderShapeIcon(block.shape, 16, block.color)}
                              <small className="ms-1">{block.number}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
              
              <div className="mt-3">
                <small className="text-muted">
                  Created: {new Date(question.created_at).toLocaleString()} | 
                  Updated: {new Date(question.updated_at || question.created_at).toLocaleString()}
                </small>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  )
}

export default QuestionDatabase
