import React, { useState, useEffect } from 'react'
import { Container, Card } from 'react-bootstrap'
import Question from './Question'
import type { LessonItem } from '../data/lessons'

interface MainContentProps {
  selectedLesson?: LessonItem
}

const MainContent: React.FC<MainContentProps> = ({ selectedLesson }) => {
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

  const handleNextQuestion = () => {
    if (selectedLesson && currentQuestionIndex < selectedLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswerId(undefined)
    }
  }

  return (
    <div className="h-100 d-flex flex-column">
      <Container fluid className="h-100 p-4">
        {selectedLesson ? (
          <div className="h-100 d-flex flex-column">
            {/* Lesson Header */}
            <div className="mb-4">
              <h2 className="text-primary">📚 {selectedLesson.title}</h2>
              {selectedLesson.questions.length > 0 && (
                <p className="text-muted">
                  Question {currentQuestionIndex + 1} of {selectedLesson.questions.length}
                </p>
              )}
            </div>

            {/* Lesson Content */}
            <div className="flex-grow-1">
              {selectedLesson.questions.length > 0 ? (
                <Question 
                  question={selectedLesson.questions[currentQuestionIndex]}
                  onAnswerSelect={handleAnswerSelect}
                  selectedAnswerId={selectedAnswerId}
                />
              ) : (
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div className="text-center">
                      <div className="mb-4" style={{ fontSize: '4rem' }}>
                        🚧
                      </div>
                      <h4 className="mb-3">Lesson Coming Soon!</h4>
                      <p className="text-muted fs-5">
                        This lesson is currently being developed.
                      </p>
                      <p className="text-muted">
                        Lesson ID: <code>{selectedLesson.id}</code>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <div className="mb-4" style={{ fontSize: '4rem' }}>
                  🎯
                </div>
                <h3 className="mb-3">Select a lesson</h3>
                <p className="text-muted fs-5">
                  Choose a lesson from the sidebar to get started with your learning journey.
                </p>
                <div className="mt-4">
                  <div className="d-flex justify-content-center gap-3">
                    <div className="text-center">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <span className="fs-4">📊</span>
                      </div>
                      <p className="mt-2 mb-0 small">Counting</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <span className="fs-4">🔧</span>
                      </div>
                      <p className="mt-2 mb-0 small">Building</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <span className="fs-4">🎨</span>
                      </div>
                      <p className="mt-2 mb-0 small">Colors</p>
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
