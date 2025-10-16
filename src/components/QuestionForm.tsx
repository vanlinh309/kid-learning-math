import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import type { QuestionData } from './Question'

// Function to generate UUID
const generateUUID = (): string => {
  return 'q_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

interface QuestionFormProps {
  question?: QuestionData | null
  onSubmit: (question: QuestionData, formId?: string) => void
  onCancel?: () => void
  showCardWrapper?: boolean
  formId?: string
  onTitleChange?: (title: string, formId?: string) => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSubmit,
  onCancel,
  showCardWrapper = true,
  formId,
  onTitleChange
}) => {
  const [formData, setFormData] = useState<QuestionData>({
    id: generateUUID(),
    title: '',
    imageUrl: '',
    answers: [
      {
        id: 'answer1',
        isCorrect: false,
        blocks: [
          { shape: 'square', number: 1, color: '#007bff' },
          { shape: 'triangle', number: 1, color: '#007bff' },
          { shape: 'circle', number: 1, color: '#007bff' }
        ]
      },
      {
        id: 'answer2',
        isCorrect: false,
        blocks: [
          { shape: 'square', number: 1, color: '#007bff' },
          { shape: 'triangle', number: 1, color: '#007bff' },
          { shape: 'circle', number: 1, color: '#007bff' }
        ]
      },
      {
        id: 'answer3',
        isCorrect: false,
        blocks: [
          { shape: 'square', number: 1, color: '#007bff' },
          { shape: 'triangle', number: 1, color: '#007bff' },
          { shape: 'circle', number: 1, color: '#007bff' }
        ]
      }
    ]
  })

  const [error, setError] = useState<string>('')
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)


  useEffect(() => {
    if (question) {
      setFormData(question)
      // Show preview if there's an image URL
      setShowPreview(!!question.imageUrl)
    } else {
      // Generate new UUID when creating a new question
      setFormData(prev => ({
        ...prev,
        id: generateUUID()
      }))
    }
  }, [question])

  // Auto-show preview when imageUrl changes
  useEffect(() => {
    const hasUrl = !!formData.imageUrl?.trim()
    setShowPreview(hasUrl)
    if (hasUrl) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [formData.imageUrl])

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      // Only close if clicking outside the color picker and shape icon
      if (target && !target.closest('.color-picker-popup') && !target.closest('.shape-icon-clickable')) {
        setActiveColorPicker(null)
      }
    }

    if (activeColorPicker) {
      // Use setTimeout to avoid immediate closure from the same click that opened it
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 10)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeColorPicker])

  const handleInputChange = (field: keyof QuestionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Notify parent when title changes
    if (field === 'title' && onTitleChange) {
      onTitleChange(value, formId)
    }
  }

  const handleBlockChange = (answerIndex: number, blockIndex: number, field: 'shape' | 'number' | 'color', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, aIndex) => 
        aIndex === answerIndex 
          ? {
              ...answer,
              blocks: answer.blocks.map((block, bIndex) =>
                bIndex === blockIndex ? { ...block, [field]: value } : block
              )
            }
          : answer
      )
    }))
  }

  const addBlock = (answerIndex: number) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, index) => 
        index === answerIndex 
          ? {
              ...answer,
              blocks: [...answer.blocks, { shape: 'square', number: 1, color: '#007bff' }]
            }
          : answer
      )
    }))
  }

  const handleAnswerDoubleClick = (answerIndex: number) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, index) => ({
        ...answer,
        isCorrect: index === answerIndex ? !answer.isCorrect : false
      }))
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Question title is required')
      return false
    }
    
    const hasCorrectAnswer = formData.answers.some(answer => answer.isCorrect)
    if (!hasCorrectAnswer) {
      setError('At least one answer must be marked as correct')
      return false
    }

    const correctAnswers = formData.answers.filter(answer => answer.isCorrect).length
    if (correctAnswers > 1) {
      setError('Only one answer can be marked as correct')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Ensure we have a valid ID
      const questionToSubmit = {
        ...formData,
        id: formData.id || generateUUID()
      }
      onSubmit(questionToSubmit, formId)
      
      // Show success message and reset form for next question (if not editing)
      if (!question) {
        setShowSuccess(true)
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000)
        
        setFormData({
          id: generateUUID(),
          title: '',
          imageUrl: '',
          answers: [
            {
              id: 'answer1',
              isCorrect: false,
              blocks: [
                { shape: 'square', number: 1, color: '#007bff' },
                { shape: 'triangle', number: 1, color: '#28a745' },
                { shape: 'circle', number: 1, color: '#dc3545' }
              ]
            },
            {
              id: 'answer2',
              isCorrect: false,
              blocks: [
                { shape: 'square', number: 1, color: '#007bff' },
                { shape: 'triangle', number: 1, color: '#28a745' },
                { shape: 'circle', number: 1, color: '#dc3545' }
              ]
            },
            {
              id: 'answer3',
              isCorrect: false,
              blocks: [
                { shape: 'square', number: 1, color: '#007bff' },
                { shape: 'triangle', number: 1, color: '#28a745' },
                { shape: 'circle', number: 1, color: '#dc3545' }
              ]
            }
          ]
        })
      }
    }
  }

  const shapeOptions = ['square', 'triangle', 'circle', 'rectangle', 'diamond'] as const

  const renderShapeIcon = (shape: string, size = 16, color = '#007bff') => {
    // Ensure we have a valid color
    const safeColor = color || '#007bff'
    const iconStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: safeColor,
      display: 'inline-block',
      verticalAlign: 'middle'
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
              verticalAlign: 'middle'
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
              transformOrigin: 'center'
            }}
          />
        )
      default:
        return null
    }
  }

  const formContent = (
    <div className={showCardWrapper ? '' : 'p-3'}>
        {error && <Alert variant="danger">{error}</Alert>}
        {showSuccess && (
          <Alert variant="success" className="d-flex align-items-center">
            <span className="me-2">✅</span>
            <span>Question added successfully! You can add another question below.</span>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
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
                            maxWidth: '400px', 
                            maxHeight: '300px', 
                            width: '100%',
                            height: '250px',
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
                          style={{ maxWidth: '400px', maxHeight: '300px', objectFit: 'contain'}}
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
              placeholder="Enter the question title"
              required
            />
          </Form.Group>

          {/* Answers Section - 3 Blocks Horizontally */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Answers (Choose the correct one)</h5>
            <small className="text-muted">
              💡 Double-click any answer to mark as correct
            </small>
          </div>
          <Row className="mb-4">
            {formData.answers.map((answer, answerIndex) => (
              <Col md={4} key={answer.id} className="mb-3">
                <Card 
                  className={`h-100 border-2 ${answer.isCorrect ? 'border-success' : ''}`}
                  onDoubleClick={() => handleAnswerDoubleClick(answerIndex)}
                  style={{ cursor: 'pointer' }}
                  title="Double-click to toggle as correct answer"
                >
                  <Card.Header 
                    className={`text-center py-2 ${answer.isCorrect ? 'bg-success text-white' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>
                        {answer.isCorrect ? '✅ ' : ''}Answer {answerIndex + 1}
                        {answer.isCorrect ? ' (Correct)' : ''}
                      </strong>
                      <Form.Check
                        type="radio"
                        name="correctAnswer"
                        label="Correct"
                        checked={answer.isCorrect}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            answers: prev.answers.map((a, i) => ({
                              ...a,
                              isCorrect: i === answerIndex ? e.target.checked : false
                            }))
                          }))
                        }}
                      />
                    </div>
                  </Card.Header>
                  <Card.Body className="p-3">
                    {/* Rows for shapes and numbers */}
                    {answer.blocks.map((block, blockIndex) => {
                      const colorPickerId = `${answerIndex}-${blockIndex}`
                      return (
                        <Row key={blockIndex} className="mb-3 align-items-center position-relative">
                          <Col xs={8}>
                            {/* Visual Shape Selector with Clickable Color Icon */}
                            <div className="d-flex align-items-center gap-2 p-2 border rounded bg-light">
                              <div 
                                className="position-relative d-flex align-items-center justify-content-center shape-icon-clickable" 
                                style={{ minWidth: '30px', cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  console.log('Shape clicked, current activeColorPicker:', activeColorPicker, 'colorPickerId:', colorPickerId)
                                  setActiveColorPicker(activeColorPicker === colorPickerId ? null : colorPickerId)
                                }}
                                title="Click to change color"
                              >
                                {renderShapeIcon(block.shape, 20, block.color || '#007bff')}
                                
                                
                                {/* Color Picker Popup */}
                                {activeColorPicker === colorPickerId && (
                                  <div 
                                    className="position-absolute bg-white border rounded shadow-lg p-2 color-picker-popup"
                                    style={{ 
                                      top: '100%', 
                                      left: '0', 
                                      zIndex: 9999, 
                                      marginTop: '4px',
                                      minWidth: '200px',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                      border: '2px solid #007bff'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Color Palette */}
                                    <div className="mb-2">
                                      <small className="text-muted d-block mb-1">Quick Colors:</small>
                                      <div className="d-flex flex-wrap gap-1">
                                        {[
                                          '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1',
                                          '#fd7e14', '#e83e8c', '#20c997', '#6c757d', '#343a40', '#f8f9fa'
                                        ].map(color => (
                                          <button
                                            key={color}
                                            type="button"
                                            className="btn p-0 border"
                                            style={{ 
                                              width: '24px', 
                                              height: '24px', 
                                              backgroundColor: color,
                                              borderColor: block.color === color ? '#000' : '#ccc',
                                              borderWidth: block.color === color ? '2px' : '1px'
                                            }}
                                            onClick={() => {
                                              handleBlockChange(answerIndex, blockIndex, 'color', color)
                                              setActiveColorPicker(null)
                                            }}
                                            title={color}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Custom Color Picker */}
                                    <div className="d-flex align-items-center gap-2">
                                      <Form.Control
                                        type="color"
                                        value={block.color || '#007bff'}
                                        onChange={(e) => handleBlockChange(answerIndex, blockIndex, 'color', e.target.value)}
                                        size="sm"
                                        style={{ width: '32px', height: '24px', padding: '0', border: '1px solid #ddd' }}
                                        title="Custom color"
                                      />
                                      <Form.Control
                                        type="text"
                                        value={block.color || '#007bff'}
                                        onChange={(e) => handleBlockChange(answerIndex, blockIndex, 'color', e.target.value)}
                                        size="sm"
                                        style={{ fontSize: '11px', fontFamily: 'monospace', width: '80px' }}
                                        placeholder="#ffffff"
                                      />
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => setActiveColorPicker(null)}
                                        style={{ padding: '2px 8px', fontSize: '10px' }}
                                      >
                                        ✓
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Form.Select
                                value={block.shape}
                                onChange={(e) => handleBlockChange(answerIndex, blockIndex, 'shape', e.target.value)}
                                size="sm"
                                style={{ border: 'none', background: 'transparent', fontSize: '12px' }}
                              >
                                {shapeOptions.map(shape => (
                                  <option key={shape} value={shape}>
                                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                          </Col>
                          <Col xs={4}>
                            {/* Small number input */}
                            <Form.Control
                              type="number"
                              min="0"
                              max="99"
                              value={block.number}
                              onChange={(e) => handleBlockChange(answerIndex, blockIndex, 'number', parseInt(e.target.value) || 0)}
                              size="sm"
                              className="text-center"
                              style={{ fontSize: '14px' }}
                            />
                          </Col>
                        </Row>
                      )
                    })}
                    
                    {/* Add Row Button */}
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => addBlock(answerIndex)}
                        style={{ fontSize: '12px', padding: '4px 12px' }}
                      >
                        + Add Row
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Form Actions */}
          <div>
            {!question && (
              <div className="alert alert-info mb-3">
                <small>
                  <strong>💡 Tip:</strong> Click "Add Question" to add this question as a draft. 
                  Go to "Manage Questions" and click "Save All Questions" to persist all your drafts.
                </small>
              </div>
            )}
            <div className="d-flex gap-2">
              <Button type="submit" variant={question ? "success" : "primary"}>
                {question ? 'Update Question' : '📝 Add Question (Draft)'}
              </Button>
              {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Form>
    </div>
  )

  if (showCardWrapper) {
    return (
      <Card>
        <Card.Header>
          <h4>{question ? 'Edit Question' : 'Add New Question'}</h4>
        </Card.Header>
        <Card.Body>
          {formContent}
        </Card.Body>
      </Card>
    )
  }

  return formContent
}

export default QuestionForm
