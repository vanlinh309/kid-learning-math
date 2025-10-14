import React, { useState } from 'react'
import { Button, Container, Row, Col, Offcanvas } from 'react-bootstrap'
import { List } from 'react-bootstrap-icons'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import type { LessonItem } from '../data/lessons'

const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | undefined>()

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
          <Sidebar onLessonSelect={handleLessonSelect} />
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
          <Sidebar onLessonSelect={handleLessonSelect} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  )
}

export default Layout
