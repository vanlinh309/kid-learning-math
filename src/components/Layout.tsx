import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Offcanvas } from 'react-bootstrap'
import { List } from 'react-bootstrap-icons'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import { fetchQuestionsWithAnswers } from '../utils/supabase'
import type { LessonItem } from '../data/lessons'
import type { QuestionData } from './Question'

const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | undefined>()
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch questions data on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const result = await fetchQuestionsWithAnswers()
        
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
              content: Array<{
                shape: string;
                number: number;
                color: string;
              }>;
            }>;
          }) => ({
            id: dbQuestion.id,
            title: dbQuestion.title || 'Untitled Question',
            imageUrl: dbQuestion.image_url || '',
            category: dbQuestion.category as 'recognize_object' | 'counting' | 'shapes' | 'colors' | 'patterns',
            answers: dbQuestion.answer?.map((answer, index: number) => ({
              id: answer.id || `answer${index + 1}`,
              isCorrect: answer.is_correct,
              blocks: answer.content?.map(block => ({
                shape: block.shape as 'square' | 'triangle' | 'circle' | 'rectangle' | 'diamond',
                number: block.number,
                color: block.color
              })) || []
            })) || []
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
  }, [])

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
    <Container fluid className="p-0 vh-100 d-flex flex-column">
      {/* Header with Toggle Button */}
      <Row className="g-0 bg-primary text-white py-2 px-3">
        <Col className="d-flex align-items-center">
          <Button
            variant="outline-light"
            size="sm"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="me-3"
          >
            <List size={18} />
          </Button>
          <h5 className="mb-0">Kid Learning Platform</h5>
        </Col>
      </Row>

      {/* Main Layout */}
      <Row className="g-0 flex-grow-1">
        {/* Desktop Sidebar */}
        <Col lg={3} className="d-none d-lg-block bg-light border-end">
          <Sidebar 
            onLessonSelect={handleLessonSelect} 
            questionsData={questionsData}
            loading={loading}
          />
        </Col>

        {/* Main Content */}
        <Col lg={9} xs={12} className="d-flex flex-column">
          <MainContent selectedLesson={selectedLesson} />
        </Col>
      </Row>

      {/* Mobile Sidebar (Offcanvas) */}
      <Offcanvas 
        show={sidebarVisible} 
        onHide={toggleSidebar} 
        className="d-lg-none"
        placement="start"
      >
        <Offcanvas.Header closeButton className="bg-primary text-white">
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
    </Container>
  )
}

export default Layout
