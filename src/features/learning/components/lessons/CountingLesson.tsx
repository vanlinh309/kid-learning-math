import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap'
import { useAudioFeedback } from '../../hooks/useAudioFeedback'
import type { QuestionData } from './RecognizeObjectLesson'
import './RecognizeObjectLesson.css'

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
  const [numberOptions, setNumberOptions] = useState<Record<string, number[]>>({})
  const { playCorrectSound, playIncorrectSound, playClickSound } = useAudioFeedback()

  // Generate 3 number options for each answer (including the correct one)
  const generateNumberOptions = (correctNumber: number): number[] => {
    const options = [correctNumber]
    
    // Generate 2 other numbers that are different from the correct one
    while (options.length < 3) {
      // Random offset between -2 and +2, but not 0
      const offset = Math.floor(Math.random() * 5) - 2
      if (offset === 0) continue
      
      const newNumber = correctNumber + offset
      // Ensure positive number and not duplicate
      if (newNumber > 0 && !options.includes(newNumber)) {
        options.push(newNumber)
      }
    }
    
    // Shuffle the array to randomize position
    return options.sort(() => Math.random() - 0.5)
  }

  // Reset state when question changes
  useEffect(() => {
    setUserAnswers({})
    setShowFeedback(false)
    setIsCorrect(false)
    setCheckedAnswers({})
    setMainImageLoaded(false)
    setAnswerImagesLoaded({})
    
    // Generate number options for each answer
    const options: Record<string, number[]> = {}
    question.answers.forEach(answer => {
      const correctNumber = answer.blocks[0]?.number || 1
      options[answer.id] = generateNumberOptions(correctNumber)
    })
    setNumberOptions(options)
  }, [question.id, question.answers])

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

                      {/* Number Selection Blocks */}
                      <div className="d-flex gap-3 justify-content-center w-100 mt-3">
                        {numberOptions[answer.id]?.map((num, index) => {
                          const isSelected = userAnswers[answer.id] === num.toString()
                          const correctNumber = answer.blocks[0]?.number || 0
                          const isCorrectOption = num === correctNumber
                          
                          return (
                            <button
                              key={index}
                              disabled={showFeedback}
                              onClick={() => {
                                playClickSound()
                                handleInputChange(answer.id, num.toString())
                              }}
                              className={`number-block ${isSelected ? 'selected' : ''} ${
                                showFeedback
                                  ? isCorrectOption
                                    ? 'correct'
                                    : isSelected
                                    ? 'incorrect'
                                    : 'disabled'
                                  : ''
                              }`}
                              style={{
                                fontSize: '1.5rem',
                                fontWeight: 'normal',
                                width: '70px',
                                height: '70px',
                                borderRadius: '12px',
                                border: 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: showFeedback ? 'not-allowed' : 'pointer',
                                position: 'relative',
                                background: showFeedback
                                  ? isCorrectOption
                                    ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
                                    : isSelected
                                    ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
                                    : 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)'
                                  : isSelected
                                  ? 'linear-gradient(135deg, #60A5FA 0%, #818CF8 100%)'
                                  : 'linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)',
                                color: showFeedback
                                  ? '#FFFFFF'
                                  : isSelected
                                  ? '#FFFFFF'
                                  : '#6366F1',
                                transform: isSelected && !showFeedback ? 'scale(1.15) rotate(-3deg)' : 'scale(1)',
                                boxShadow: isSelected && !showFeedback
                                  ? '0 8px 20px rgba(96, 165, 250, 0.4)'
                                  : showFeedback && isCorrectOption
                                  ? '0 8px 20px rgba(16, 185, 129, 0.4)'
                                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                animation: !showFeedback && !isSelected ? 'gentle-pulse 2s ease-in-out infinite' : 'none',
                                opacity: showFeedback && !isCorrectOption && !isSelected ? 0.5 : 1
                              }}
                            >
                              {showFeedback && isCorrectOption && '⭐ '}
                              {showFeedback && isSelected && !isCorrectOption && '😊 '}
                              {num}
                            </button>
                          )
                        })}
                      </div>

                      {/* Show correct answer if wrong */}
                      {showFeedback && !isAnswerCorrect && (
                        <div className="mt-2 text-center animate-fade-in">
                          <small className="text-success fw-bold">
                            ✓ Correct answer: {answer.blocks[0]?.number || 0}
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gentle-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease;
        }
        
        .number-block {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        .number-block:hover:not(:disabled):not(.disabled) {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.25) !important;
        }
        
        .number-block:active:not(:disabled):not(.disabled) {
          transform: scale(0.95) !important;
        }
        
        .number-block.selected {
          animation: bounce 0.4s ease;
        }
        
        .number-block.correct {
          animation: success-pulse 0.6s ease;
        }
        
        .number-block.incorrect {
          animation: error-shake 0.5s ease;
        }
      `}</style>
    </Card>
  )
}

export default CountingQuestion
