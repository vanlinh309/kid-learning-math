import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import { useAudioFeedback } from '../hooks/useAudioFeedback'
import type { QuestionData } from './Question'
import './Question.css'

interface CountingQuestionProps {
  question: QuestionData
  onAnswerSubmit?: (isCorrect: boolean) => void
}

const CountingQuestion: React.FC<CountingQuestionProps> = ({ 
  question,
  onAnswerSubmit 
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({})
  const [mainImageLoaded, setMainImageLoaded] = useState(false)
  const [answerImagesLoaded, setAnswerImagesLoaded] = useState<Record<string, boolean>>({})
  const { playCorrectSound, playIncorrectSound, playClickSound } = useAudioFeedback()

  // Reset state when question changes
  useEffect(() => {
    setUserAnswers({})
    setShowFeedback(false)
    setIsCorrect(false)
    setCheckedAnswers({})
    setMainImageLoaded(false)
    setAnswerImagesLoaded({})
  }, [question.id])

  const handleInputChange = (answerId: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setUserAnswers(prev => ({
        ...prev,
        [answerId]: value
      }))
    }
  }

  const handleCheckAnswer = () => {
    playClickSound()
    
    // Check if all answers have been entered
    const allAnswered = question.answers.every(answer => 
      userAnswers[answer.id] && userAnswers[answer.id].trim() !== ''
    )

    if (!allAnswered) {
      alert('Please enter a number for all images!')
      return
    }

    // Check each answer
    const results: Record<string, boolean> = {}
    let allCorrect = true

    question.answers.forEach(answer => {
      const userNumber = parseInt(userAnswers[answer.id])
      const correctNumber = answer.blocks[0]?.number || 0
      const correct = userNumber === correctNumber
      results[answer.id] = correct
      if (!correct) allCorrect = false
    })

    setCheckedAnswers(results)
    setIsCorrect(allCorrect)
    setShowFeedback(true)

    // Play sound
    if (allCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }

    // Notify parent
    if (onAnswerSubmit) {
      onAnswerSubmit(allCorrect)
    }
  }

  const handleTryAgain = () => {
    setUserAnswers({})
    setShowFeedback(false)
    setIsCorrect(false)
    setCheckedAnswers({})
    playClickSound()
  }

  return (
    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'transparent' }}>
      <Card.Body className="d-flex flex-column p-5">
        {/* Main Question Image */}
        {question.imageUrl && (
          <div className="text-center mb-4 position-relative" style={{ minHeight: '300px' }}>
            {!mainImageLoaded && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            <img 
              src={question.imageUrl} 
              alt="Question" 
              className="img-fluid rounded shadow-sm"
              style={{ 
                maxHeight: '500px', 
                objectFit: 'contain', 
                maxWidth: '100%',
                display: mainImageLoaded ? 'block' : 'none',
                margin: '0 auto'
              }}
              onLoad={() => setMainImageLoaded(true)}
              onError={() => setMainImageLoaded(true)} // Show even if error to avoid infinite loading
            />
          </div>
        )}

        {/* Answer Options (Images with textboxes) */}
        <div className="mb-5 mt-5">
          <Row className="g-4">
            {question.answers.map((answer) => {
              const isAnswerCorrect = checkedAnswers[answer.id]
              
              return (
                <Col md={4} key={answer.id}>
                  <Card
                    className="h-100"
                    style={{
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      border: showFeedback
                        ? isAnswerCorrect
                          ? '2px solid #10B981'
                          : '2px solid #F59E0B'
                        : '1px solid #E5E7EB',
                      borderRadius: '12px',
                      backgroundColor: 'white'
                    }}
                  >
                    {/* Success/Fail Badge */}
                    {showFeedback && (
                      <div
                        className="position-absolute top-0 end-0 m-2 text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          fontSize: '18px',
                          backgroundColor: isAnswerCorrect ? '#10B981' : '#F59E0B'
                        }}
                      >
                        {isAnswerCorrect ? '✓' : '✗'}
                      </div>
                    )}
                    
                    <Card.Body className="d-flex flex-column align-items-center p-2">
                      {/* Image Preview - Smaller */}
                      {answer.imageUrl ? (
                        <div className="position-relative w-100 mb-2" style={{ minHeight: '120px' }}>
                          {!answerImagesLoaded[answer.id] && (
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '120px' }}>
                              <Spinner animation="border" variant="primary" size="sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </Spinner>
                            </div>
                          )}
                          <img 
                            src={answer.imageUrl} 
                            alt={`Option ${answer.id}`}
                            className="img-fluid rounded"
                            style={{ 
                              maxHeight: '120px', 
                              objectFit: 'contain',
                              width: '100%',
                              display: answerImagesLoaded[answer.id] ? 'block' : 'none'
                            }}
                            onLoad={() => setAnswerImagesLoaded(prev => ({ ...prev, [answer.id]: true }))}
                            onError={() => setAnswerImagesLoaded(prev => ({ ...prev, [answer.id]: true }))}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-muted mb-2" style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div>
                            <div style={{ fontSize: '2rem' }}>🖼️</div>
                            <div className="small">No image</div>
                          </div>
                        </div>
                      )}

                      {/* Number Input Below Image */}
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={userAnswers[answer.id] || ''}
                        onChange={(e) => handleInputChange(answer.id, e.target.value)}
                        placeholder="?"
                        disabled={showFeedback}
                        className="text-center"
                        style={{
                          fontSize: '1.8rem',
                          fontWeight: 'bold',
                          height: '60px',
                          color: showFeedback
                            ? isAnswerCorrect
                              ? '#10B981'
                              : '#F59E0B'
                            : '#6366F1',
                          borderColor: showFeedback
                            ? isAnswerCorrect
                              ? '#10B981'
                              : '#F59E0B'
                            : '#E5E7EB',
                          borderWidth: '2px'
                        }}
                      />

                      {/* Show correct answer if wrong */}
                      {showFeedback && !isAnswerCorrect && (
                        <div className="mt-1 text-center">
                          <small className="text-muted">
                            Correct: <strong style={{ color: '#10B981' }}>{answer.blocks[0]?.number || 0}</strong>
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>

        {/* Check Button and Feedback */}
        <div className="text-center">
          {!showFeedback ? (
            <Button
              size="lg"
              onClick={handleCheckAnswer}
              className="px-5 py-3 border-0"
              style={{
                fontSize: '1.5rem',
                borderRadius: '50px',
                minWidth: '100px',
                backgroundColor: '#10B981',
                color: 'white'
              }}
            >
              ✓
            </Button>
          ) : (
            <div>
              {/* Feedback Message with Animation */}
              <div
                className={`alert mb-3 border-0`}
                style={{
                  fontSize: '1.1rem',
                  backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: isCorrect ? '#10B981' : '#F59E0B'
                }}
              >
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div style={{ fontSize: '2.5rem' }}>
                    {isCorrect ? '🎉' : '💭'}
                  </div>
                  <div>
                    <h5 className="mb-1">
                      {isCorrect ? 'Perfect!' : 'Try Again'}
                    </h5>
                    <p className="mb-0">
                      {isCorrect
                        ? 'Great job!'
                        : 'Check the correct answers'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Try Again Button */}
              <Button
                size="lg"
                onClick={handleTryAgain}
                className="px-5 py-3 border-0"
                style={{
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  backgroundColor: '#6366F1',
                  color: 'white'
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </Card.Body>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes success-pulse {
          0% { transform: scale(1); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
          75% { transform: translateX(-15px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  )
}

export default CountingQuestion
