import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'
import type { QuestionData } from '../../../../learning/components/lessons/RecognizeObjectLesson'

interface QuestionFormProps {
  question?: QuestionData | null
  showCardWrapper?: boolean
  questionId?: string
  onTitleChange?: (title: string, questionId?: string) => void
  onQuestionDataChange?: (questionData: QuestionData, questionId?: string) => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  showCardWrapper = true,
  questionId,
  onTitleChange,
  onQuestionDataChange
}) => {
  const [formData, setFormData] = useState<QuestionData>({
    id: questionId || '',
    title: '',
    imageUrl: '',
    answers: [
      {
        id: 'answer1',
        isCorrect: false,
        blocks: []
      },
      {
        id: 'answer2',
        isCorrect: false,
        blocks: []
      },
      {
        id: 'answer3',
        isCorrect: false,
        blocks: []
      }
    ]
  })

  const [answerImages, setAnswerImages] = useState<Record<string, string>>({})
  const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({})
  const [answerImageLoading, setAnswerImageLoading] = useState<Record<string, boolean>>({})
  const [answerImageError, setAnswerImageError] = useState<Record<string, boolean>>({})
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)
  
  useEffect(() => {
    const hasUrl = !!formData.imageUrl?.trim()
    setShowPreview(hasUrl)
    if (hasUrl) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [formData.imageUrl])

  // Notify parent when form data changes
  useEffect(() => {
    if (onQuestionDataChange && questionId) {
      onQuestionDataChange(formData, questionId)
    }
  }, [formData, onQuestionDataChange, questionId])

  const handleInputChange = (field: keyof QuestionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Notify parent when title changes
    if (field === 'title' && onTitleChange) {
      onTitleChange(value, questionId)
    }
  }

  const handleAnswerImageChange = (answerId: string, imageUrl: string) => {
    setAnswerImages(prev => ({
      ...prev,
      [answerId]: imageUrl
    }))
    
    // Update formData with imageUrl
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.id === answerId
          ? { ...answer, imageUrl: imageUrl }
          : answer
      )
    }))
    
    if (imageUrl.trim()) {
      setAnswerImageLoading(prev => ({ ...prev, [answerId]: true }))
      setAnswerImageError(prev => ({ ...prev, [answerId]: false }))
    }
  }

  const handleAnswerCountChange = (answerId: string, count: number) => {
    setAnswerCounts(prev => ({
      ...prev,
      [answerId]: count
    }))
    
    // Update formData with a single block containing the count
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.id === answerId
          ? {
              ...answer,
              blocks: [{
                shape: 'circle',
                number: count,
                color: '#007bff'
              }]
            }
          : answer
      )
    }))
  }

  const addAnswer = () => {
    const newAnswerId = `answer${formData.answers.length + 1}`
    setFormData(prev => ({
      ...prev,
      answers: [
        ...prev.answers,
        {
          id: newAnswerId,
          isCorrect: true, // All answers are valid in free choice format
          blocks: []
        }
      ]
    }))
  }

  const removeAnswer = (answerId: string) => {
    if (formData.answers.length <= 1) {
      alert('You must have at least one answer option.')
      return
    }
    
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.filter(a => a.id !== answerId)
    }))
    
    // Clean up state
    setAnswerImages(prev => {
      const newImages = { ...prev }
      delete newImages[answerId]
      return newImages
    })
    setAnswerCounts(prev => {
      const newCounts = { ...prev }
      delete newCounts[answerId]
      return newCounts
    })
    setAnswerImageLoading(prev => {
      const newLoading = { ...prev }
      delete newLoading[answerId]
      return newLoading
    })
    setAnswerImageError(prev => {
      const newError = { ...prev }
      delete newError[answerId]
      return newError
    })
  }

  const formContent = (
    <div className={showCardWrapper ? '' : 'p-3'}>
        <div>
          {/* Question Basic Info */}
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Row className="align-items-end">
              <Col xs={formData.imageUrl?.trim() ? 9 : 12}>
                <Form.Control
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.png or Google Drive link"
                />
              </Col>
              {formData.imageUrl?.trim() && (
                <Col xs={3}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </Col>
              )}
            </Row>
            
            {/* Image Preview - Auto-show when URL is present */}
            {showPreview && formData.imageUrl?.trim() && (
              <div className="mt-3 text-center">
                <Card className="d-inline-block">                  
                  <Card.Body className="p-3 position-relative">
                    {/* Loading Spinner */}
                    {imageLoading && !imageError && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2 text-muted small">Loading image...</div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {imageError && (
                      <div className="text-center text-danger p-4">
                        <div className="mb-2">
                          <svg width="48" height="48" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.75 10.75l-2.487-2.487a.5.5 0 0 0-.577-.093L1.002 9.917V3a1 1 0 0 1 1-1h12z"/>
                          </svg>
                        </div>
                        <div>Failed to load image. Please check the URL.</div>
                      </div>
                    )}
                    
                    {/* Image Content */}
                    <div style={{ opacity: imageLoading ? 0.3 : 1 }}>
                      {formData.imageUrl.includes('drive.google.com') ? (
                        <iframe 
                          src={formData.imageUrl.includes('/preview') ? formData.imageUrl : formData.imageUrl.replace('/view?usp=sharing', '/preview')}
                          className="rounded border"
                          style={{ 
                            maxWidth: '600px', 
                            maxHeight: '450px', 
                            width: '100%',
                            height: '400px',
                            border: 'none'
                          }}
                          title="Image preview"
                          sandbox="allow-same-origin"
                          scrolling="no"
                          onLoad={() => {
                            setImageLoading(false)
                            setImageError(false)
                          }}
                        />
                      ) : (
                        <img 
                          src={formData.imageUrl} 
                          alt="Image preview"
                          className="img-fluid rounded"
                          style={{ maxWidth: '600px', maxHeight: '450px', objectFit: 'contain'}}
                          onLoad={() => {
                            setImageLoading(false)
                            setImageError(false)
                          }}
                          onError={() => {
                            setImageLoading(false)
                            setImageError(true)
                          }}
                        />
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Question Title</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter the question title (e.g., How many apples are in the image?)"
              required
            />
          </Form.Group>

          {/* Answers Section - Tabular Format */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '2px solid #e9ecef' }}>
              <h5 className="mb-0" style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                🎯 Answer Options
              </h5>
              <small className="text-muted" style={{ fontSize: '12px' }}>
                Free choice - all answers are valid counting options
              </small>
            </div>
            
            {/* Table Header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '280px 180px 80px 60px',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px 8px 0 0',
              border: '1px solid #dee2e6',
              borderBottom: 'none',
              fontWeight: '600',
              fontSize: '13px',
              color: '#495057'
            }}>
              <div>📷 Image URL</div>
              <div className="text-center">Preview</div>
              <div className="text-center">🔢 Count</div>
              <div className="text-center">Action</div>
            </div>

            {/* Table Body */}
            <div style={{ 
              border: '1px solid #dee2e6',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden'
            }}>
              {formData.answers.map((answer, answerIndex) => (
                <div 
                  key={answer.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '280px 180px 80px 60px',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderBottom: answerIndex < formData.answers.length - 1 ? '1px solid #e9ecef' : 'none',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  {/* Column 1: Image URL Input */}
                  <div>
                    <Form.Control
                      type="url"
                      size="sm"
                      value={answerImages[answer.id] || ''}
                      onChange={(e) => handleAnswerImageChange(answer.id, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      style={{ 
                        fontSize: '13px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </div>

                  {/* Column 2: Image Preview */}
                  <div>
                    {answerImages[answer.id]?.trim() ? (
                      <div 
                        style={{ 
                          position: 'relative',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          padding: '4px',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        {answerImageLoading[answer.id] && !answerImageError[answer.id] && (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                        
                        {answerImageError[answer.id] && (
                          <div className="text-danger" style={{ fontSize: '10px', textAlign: 'center' }}>
                            ⚠️ Failed
                          </div>
                        )}
                        
                        <img 
                          src={answerImages[answer.id]} 
                          alt={`Answer ${answerIndex + 1}`}
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '92px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            opacity: answerImageLoading[answer.id] ? 0.3 : 1
                          }}
                          onLoad={() => {
                            setAnswerImageLoading(prev => ({ ...prev, [answer.id]: false }))
                            setAnswerImageError(prev => ({ ...prev, [answer.id]: false }))
                          }}
                          onError={() => {
                            setAnswerImageLoading(prev => ({ ...prev, [answer.id]: false }))
                            setAnswerImageError(prev => ({ ...prev, [answer.id]: true }))
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        style={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed #dee2e6',
                          fontSize: '11px',
                          color: '#adb5bd',
                          textAlign: 'center',
                          padding: '8px'
                        }}
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* Column 3: Count Input */}
                  <div>
                    <Form.Control
                      type="number"
                      min="0"
                      max="99"
                      value={answerCounts[answer.id] || ''}
                      onChange={(e) => handleAnswerCountChange(answer.id, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="text-center"
                      style={{ 
                        fontSize: '20px',
                        fontWeight: '700',
                        height: '50px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        backgroundColor: 'white',
                        color: '#007bff',
                        letterSpacing: '1px',
                        padding: '0 8px'
                      }}
                    />
                  </div>

                  {/* Column 4: Remove Button */}
                  <div className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => removeAnswer(answer.id)}
                      className="text-danger p-0"
                      style={{
                        fontSize: '20px',
                        textDecoration: 'none',
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7'
                      }}
                      title="Remove this answer"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add More Button - Small & Clean */}
          <div className="text-center mb-4">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addAnswer}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '8px 20px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              ➕ Add More Answer
            </Button>
          </div>
        </div>
    </div>
  )

  return formContent
}

export default QuestionForm
