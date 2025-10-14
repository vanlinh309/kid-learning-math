import React, { useEffect } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useAudioFeedback } from '../hooks/useAudioFeedback'
import './Question.css'

export interface Answer {
  id: string
  isCorrect: boolean
  blocks: {
    shape: 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond' | ''
    number: number
  }[]
}

export interface QuestionData {
  id: string
  title: string
  imageUrl?: string
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

  // Reset any internal state when question changes (if needed in future)
  useEffect(() => {
    // This ensures the component resets when a new question is loaded
    // Currently, the Question component is stateless, but this is here for future enhancements
  }, [question.id])
  const renderShape = (shape: 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond', size = 30) => {
    const shapeStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: '#dc3545', // Bootstrap red
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
              borderBottom: `${size}px solid #dc3545`,
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
              borderRadius: '5px'
            }}
          />
        )
      case 'diamond':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size}px solid transparent`,
              borderRight: `${size}px solid transparent`,
              borderBottom: `${size}px solid #dc3545`,
              display: 'inline-block',
              marginRight: '10px'
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
      transition: 'all 0.3s ease',
      ...(selectedAnswerId === answer.id && answer.isCorrect && {
        boxShadow: '0 0 20px rgba(25, 135, 84, 0.6)',
        transform: 'scale(1.05)'
      }),
      ...(selectedAnswerId === answer.id && !answer.isCorrect && {
        boxShadow: '0 0 15px rgba(255, 193, 7, 0.5)',
        transform: 'scale(0.98)'
      })
    }

    return (
      <Col md={4} key={answer.id} className="mb-3">
        <Card 
          className={`h-100 ${borderClass} ${bgClass} ${animationClass} border-2`}
          style={cardStyle}
          onClick={() => {
            playClickSound()
            onAnswerSelect?.(answer.id)
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center p-4 position-relative">
            {/* Success celebration elements */}
            {selectedAnswerId === answer.id && answer.isCorrect && (
              <>
                {/* Animated checkmark */}
                <div className="position-absolute top-0 end-0 m-2">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center animate-bounce" 
                       style={{ width: '30px', height: '30px', fontSize: '16px' }}>
                    ✓
                  </div>
                </div>
                {/* Sparkle effects */}
                <div className="position-absolute top-0 start-0 animate-pulse" style={{ fontSize: '20px' }}>✨</div>
                <div className="position-absolute bottom-0 end-0 animate-pulse" style={{ fontSize: '20px', animationDelay: '0.5s' }}>🌟</div>
              </>
            )}

            {/* Incorrect answer feedback elements */}
            {selectedAnswerId === answer.id && !answer.isCorrect && (
              <>
                {/* Animated X mark */}
                <div className="position-absolute top-0 end-0 m-2">
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center animate-wobble" 
                       style={{ width: '30px', height: '30px', fontSize: '14px' }}>
                    ❌
                  </div>
                </div>
                {/* Try again encouragement */}
                <div className="position-absolute top-0 start-0 animate-fade-in" style={{ fontSize: '16px' }}>🤔</div>
                <div className="position-absolute bottom-0 end-0 animate-fade-in" style={{ fontSize: '16px', animationDelay: '0.3s' }}>💭</div>
              </>
            )}
            
            {answer.blocks.map((block, index) => (
              <div 
                key={index} 
                className="d-flex align-items-center justify-content-center mb-3"
              >
                {renderShape(block.shape)}
                <span className="mx-3 fw-bold fs-4">=</span>
                <span className="fs-4 fw-bold text-primary">{block.number}</span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    )
  }

  return (
    <div className="question-container">
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{question.title}</h4>
        </Card.Header>
        <Card.Body>
          {/* First Row - Image Section */}
          {question.imageUrl && (
            <Row className="mb-4">
              <Col xs={12} className="d-flex justify-content-center">
                <div className="text-center">
                  <img 
                    src={question.imageUrl} 
                    alt="Question illustration"
                    className="img-fluid rounded border"
                    style={{ maxWidth: '400px', maxHeight: '450px', objectFit: 'contain' }}
                  />
                </div>
              </Col>
            </Row>
          )}
          
          {/* Second Row - Answer Section */}
          <Row>
            <Col xs={12} className="d-flex flex-column align-items-center">
              <h5 className="mb-3 text-center">Choose the correct answer:</h5>
              <Row className="justify-content-center w-100">
                {question.answers.map(answer => renderAnswerBlock(answer))}
              </Row>
              
              {/* {selectedAnswerId && (
                <div className="text-center mt-3">
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => alert('Great job! You selected an answer!')}
                  >
                    Submit Answer
                  </Button>
                </div>
              )} */}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Question
