import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Spinner } from 'react-bootstrap'
import { useAudioFeedback } from '../hooks/useAudioFeedback'
import './Question.css'

export interface Answer {
  id: string
  isCorrect: boolean
  blocks: {
    shape: 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond'
    number: number
    color?: string
  }[]
  imageUrl?: string // For counting questions
}

export interface QuestionData {
  id: string
  title: string
  imageUrl?: string
  category?: 'recognize_object' | 'counting' | 'shapes' | 'colors' | 'patterns'
  answers: Answer[]
}

interface QuestionProps {
  question: QuestionData
  onAnswerSelect?: (answerId: string) => void
  selectedAnswerId?: string
}

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onAnswerSelect, 
  selectedAnswerId 
}) => {
  const { playCorrectSound, playIncorrectSound, playClickSound } = useAudioFeedback()
  const [mainImageLoaded, setMainImageLoaded] = useState(false)

  // Play sound when an answer is selected and feedback is shown
  useEffect(() => {
    if (selectedAnswerId) {
      const selectedAnswer = question.answers.find(answer => answer.id === selectedAnswerId)
      if (selectedAnswer) {
        if (selectedAnswer.isCorrect) {
          playCorrectSound()
        } else {
          playIncorrectSound()
        }
      }
    }
  }, [selectedAnswerId, question.answers, playCorrectSound, playIncorrectSound])

  // Reset image loading state when question changes
  useEffect(() => {
    setMainImageLoaded(false)
  }, [question.id])
  
  const renderShape = (shape: 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond', size = 30, color = '#dc3545') => {
    const shapeStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      display: 'inline-block',
      marginRight: '10px'
    }

    switch (shape) {
      case 'square':
        return <div style={shapeStyle} />
      case 'triangle':
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              display: 'inline-block',
              marginRight: '10px'
            }}
          />
        )
      case 'circle':
        return (
          <div 
            style={{
              ...shapeStyle,
              borderRadius: '50%'
            }}
          />
        )
      case 'rectangle':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: '5px',
              width: `${size * 2.0}px`
            }}
          />
        )
      case 'diamond':
        return (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              display: 'inline-block',
              marginRight: '10px',
              transform: 'rotate(45deg)',
              transformOrigin: 'center'
            }}
          />
        )
      default:
        return null
    }
  }

  const renderAnswerBlock = (answer: Answer) => {
    // Determine border style based on selection and correctness
    let borderClass = ''
    let bgClass = ''
    let animationClass = ''
    
    if (selectedAnswerId) {
      // If an answer is selected, show feedback
      if (answer.isCorrect) {
        borderClass = 'border-success'
        bgClass = selectedAnswerId === answer.id ? 'bg-success bg-opacity-10' : ''
        // Add celebration animation for correct answer when selected
        if (selectedAnswerId === answer.id) {
          animationClass = 'animate-correct-answer'
        }
      } else {
        borderClass = 'border-danger'
        bgClass = selectedAnswerId === answer.id ? 'bg-danger bg-opacity-10' : ''
        // Add gentle shake for incorrect answer when selected
        if (selectedAnswerId === answer.id) {
          animationClass = 'animate-incorrect-answer'
        }
      }
    } else if (selectedAnswerId === answer.id) {
      // If this answer is selected but no feedback yet
      borderClass = 'border-primary'
      bgClass = 'bg-light'
    }

    const cardStyle = {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'white'
    }

    return (
      <Col md={4} key={answer.id} className="mb-4">
        <Card
          className={`h-100 ${borderClass} ${bgClass} ${animationClass}`}
          style={{
            ...cardStyle,
            border: selectedAnswerId === answer.id
              ? answer.isCorrect
                ? '2px solid #10B981'
                : '2px solid #F59E0B'
              : '1px solid #E5E7EB',
            borderRadius: '16px',
            minHeight: '120px'
          }}
          onClick={() => {
            playClickSound()
            onAnswerSelect?.(answer.id)
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center p-5 position-relative">
            {/* Success celebration elements */}
            {selectedAnswerId === answer.id && answer.isCorrect && (
              <div className="position-absolute top-0 end-0 m-2">
                <div className="text-white rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '32px', height: '32px', fontSize: '18px', backgroundColor: '#10B981' }}>
                  ✓
                </div>
              </div>
            )}

            {/* Incorrect answer feedback elements */}
            {selectedAnswerId === answer.id && !answer.isCorrect && (
              <div className="position-absolute top-0 end-0 m-2">
                <div className="text-white rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '32px', height: '32px', fontSize: '16px', backgroundColor: '#F59E0B' }}>
                  ✗
                </div>
              </div>
            )}
            
            {answer.blocks.map((block, index) => (
              <div 
                key={index} 
                className="d-flex align-items-center justify-content-center mb-3"
              >
                {renderShape(block.shape, 30, block.color)}
                <span className="mx-3 fw-bold fs-4">=</span>
                <span className="fs-4 fw-bold text-danger">{block.number}</span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    )
  }

  return (
    <div className="question-container">
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <Card.Body className="p-5">
          {/* First Row - Image Section */}
          {question.imageUrl && (
            <Row className="mb-6">
              <Col xs={12} className="d-flex justify-content-center">
                <div className="text-center position-relative" style={{ minHeight: '350px', width: '100%' }}>
                  {!mainImageLoaded && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
                      <Spinner animation="border" style={{ color: '#6366F1' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  )}
                  <img
                    src={question.imageUrl}
                    alt="Question illustration"
                    className="img-fluid rounded"
                    style={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      objectFit: 'contain',
                      display: mainImageLoaded ? 'block' : 'none',
                      margin: '0 auto'
                    }}
                    onLoad={() => setMainImageLoaded(true)}
                    onError={() => setMainImageLoaded(true)}
                  />
                </div>
              </Col>
            </Row>
          )}
          
          {/* Second Row - Answer Section */}
          <Row>
            <Col xs={12} className="d-flex flex-column align-items-center">
              <Row className="justify-content-center w-100 mt-5">
                {question.answers.map(answer => renderAnswerBlock(answer))}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Question
