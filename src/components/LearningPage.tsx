import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Row, Col, Offcanvas } from 'react-bootstrap'
import { List, House } from 'react-bootstrap-icons'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import { fetchQuestionsWithAnswers } from '../utils/supabase'
import type { LessonItem } from '../data/lessons'
import type { QuestionData } from './Question'

const LearningPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | undefined>()
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch questions data filtered by category
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const result = await fetchQuestionsWithAnswers(category)
        
        if (result.success && result.questions) {
          // Convert database format to QuestionData format
          const convertedQuestions: QuestionData[] = result.questions.map((dbQuestion: {
            id: string;
            title?: string;
            image_url?: string;
            category?: string;
            answer?: Array<{
              id: string;
              is_correct: boolean;
              content: Array<{ shape: string; number: number; color: string }> | { image_url: string; correct_number: number };
            }>;
          }) => ({
            id: dbQuestion.id,
            title: dbQuestion.title || 'Untitled Question',
            imageUrl: dbQuestion.image_url || '',
            category: dbQuestion.category as 'recognize_object' | 'counting' | 'shapes' | 'colors' | 'patterns',
            answers: dbQuestion.answer?.map((answer, index: number) => {
              // Check if it's a counting question (content is an object with image_url and correct_number)
              if (dbQuestion.category === 'counting' && typeof answer.content === 'object' && 'image_url' in answer.content) {
                return {
                  id: answer.id || `answer${index + 1}`,
                  isCorrect: answer.is_correct,
                  imageUrl: answer.content.image_url,
                  blocks: [{
                    shape: 'circle' as const,
                    number: answer.content.correct_number,
                    color: '#007bff'
                  }]
                }
              }
              // For other question types (content is an array of blocks)
              return {
                id: answer.id || `answer${index + 1}`,
                isCorrect: answer.is_correct,
                blocks: Array.isArray(answer.content) ? answer.content.map(block => ({
                  shape: block.shape as 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond',
                  number: block.number,
                  color: block.color
                })) : []
              }
            }) || []
          }))
          
          setQuestionsData(convertedQuestions)
        } else {
          console.error('Failed to fetch questions:', result.error)
          setQuestionsData([])
        }
      } catch (error) {
        console.error('Error loading questions:', error)
        setQuestionsData([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [category])

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const handleLessonSelect = (lesson: LessonItem) => {
    setSelectedLesson(lesson)
    // Close sidebar on mobile when lesson is selected
    if (window.innerWidth < 992) {
      setSidebarVisible(false)
    }
  }

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Top Navigation Bar */}
      <div className="bg-white border-bottom p-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="d-lg-none"
            onClick={toggleSidebar}
          >
            <List size={20} />
          </Button>
          <h5 className="mb-0 text-primary">
            {category === 'counting' ? '🔢 Counting Lessons' : '👁️ Object Recognition'}
          </h5>
        </div>
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => navigate('/')}
        >
          <House size={16} className="me-1" />
          Home
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        <Row className="g-0 w-100 h-100">
          {/* Sidebar - Desktop */}
          <Col lg={3} className="d-none d-lg-block border-end bg-light h-100">
            <Sidebar 
              onLessonSelect={handleLessonSelect}
              questionsData={questionsData}
              loading={loading}
            />
          </Col>

          {/* Sidebar - Mobile (Offcanvas) */}
          <Offcanvas 
            show={sidebarVisible} 
            onHide={toggleSidebar}
            placement="start"
            className="w-75"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Lessons</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <Sidebar 
                onLessonSelect={handleLessonSelect}
                questionsData={questionsData}
                loading={loading}
              />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Content */}
          <Col lg={9} className="h-100 overflow-auto">
            <MainContent selectedLesson={selectedLesson} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default LearningPage
