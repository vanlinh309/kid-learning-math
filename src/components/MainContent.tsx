import React, { useState, useEffect } from 'react'
import { Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Question from './Question'
import CountingQuestion from './CountingQuestion'
import type { LessonItem } from '../data/lessons'

interface MainContentProps {
  selectedLesson?: LessonItem
  onNextLesson?: () => void
  onPreviousLesson?: () => void
  canGoNext?: boolean
  canGoPrevious?: boolean
  currentIndex?: number
  totalLessons?: number
}

const MainContent: React.FC<MainContentProps> = ({
  selectedLesson,
  onNextLesson,
  onPreviousLesson,
  canGoNext,
  canGoPrevious,
  currentIndex,
  totalLessons
}) => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>()

  // Reset state when a new lesson is selected
  useEffect(() => {
    setCurrentQuestionIndex(0)
    setSelectedAnswerId(undefined)
  }, [selectedLesson?.id]) // Reset when lesson ID changes

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId)
  }

  return (
    <div className="h-100 d-flex flex-column position-relative w-100">
      <Container fluid className="h-100 py-6 d-flex align-items-center justify-content-center">
        {selectedLesson ? (
          <div className="d-flex align-items-center gap-3 w-100" style={{ maxWidth: '1100px' }}>
            {/* Previous Button */}
            {totalLessons && totalLessons > 1 && (
              <button
                onClick={onPreviousLesson}
                disabled={!canGoPrevious}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white',
                  cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                  opacity: canGoPrevious ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6366F1',
                  flexShrink: 0
                }}
                aria-label="Previous lesson"
              >
                ‹
              </button>
            )}

            {/* Lesson Content */}
            <div className="flex-grow-1">
              {selectedLesson.questions.length > 0 ? (
                selectedLesson.questions[currentQuestionIndex].category === 'counting' ? (
                  <CountingQuestion
                    question={selectedLesson.questions[currentQuestionIndex]}
                  />
                ) : (
                  <Question
                    question={selectedLesson.questions[currentQuestionIndex]}
                    onAnswerSelect={handleAnswerSelect}
                    selectedAnswerId={selectedAnswerId}
                  />
                )
              ) : (
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div className="text-center">
                      <div className="mb-4" style={{ fontSize: '4rem' }}>
                        🚧
                      </div>
                      <h4 className="mb-3">Lesson Coming Soon!</h4>
                      <p className="text-muted fs-5">
                        This lesson is currently being developed.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>

            {/* Next Button */}
            {totalLessons && totalLessons > 1 && (
              <button
                onClick={onNextLesson}
                disabled={!canGoNext}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white',
                  cursor: canGoNext ? 'pointer' : 'not-allowed',
                  opacity: canGoNext ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6366F1',
                  flexShrink: 0
                }}
                aria-label="Next lesson"
              >
                ›
              </button>
            )}
          </div>
        ) : (
          <Card className="h-100 border-0 shadow-sm" style={{ maxWidth: '600px' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <div className="mb-4" style={{ fontSize: '4rem' }}>
                  🎯
                </div>
                <h3 className="mb-3">Select a lesson</h3>
                <p className="text-muted fs-5 mb-5">
                  Choose a lesson to get started
                </p>
                <div className="mt-4">
                  <div className="d-flex justify-content-center gap-3">
                    <div
                      className="text-center"
                      style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                      onClick={() => navigate('/learn/recognize_object')}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <span className="fs-4">👁️</span>
                      </div>
                      <p className="mt-2 mb-0 small">Objects</p>
                    </div>
                    <div
                      className="text-center"
                      style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                      onClick={() => navigate('/learn/counting')}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#10B981' }}>
                        <span className="fs-4">🔢</span>
                      </div>
                      <p className="mt-2 mb-0 small">Counting</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  )
}

export default MainContent
