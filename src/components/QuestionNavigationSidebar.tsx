import React from 'react'
import { Card, ListGroup, Badge } from 'react-bootstrap'
import type { QuestionData } from './Question'

interface QuestionFormInstance {
  id: string
  questionData?: QuestionData | null
  title?: string
}

interface QuestionNavigationSidebarProps {
  forms: QuestionFormInstance[]
  onScrollToQuestion: (formId: string, index: number) => void
  completedForms: Set<string>
}

const QuestionNavigationSidebar: React.FC<QuestionNavigationSidebarProps> = ({
  forms,
  onScrollToQuestion,
  completedForms
}) => {
  return (
    <div 
      className="question-navigation-sidebar"
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '200px',
        zIndex: 1050,
        maxHeight: '60vh',
        overflowY: 'auto'
      }}
    >
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white text-center">
          <small className="fw-bold">📋 Question Navigator</small>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {forms.map((form, index) => {
              const isCompleted = completedForms.has(form.id)
              
              return (
                <ListGroup.Item
                  key={form.id}
                  action
                  onClick={() => onScrollToQuestion(form.id, index)}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: isCompleted ? '#f8f9fa' : 'white'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {isCompleted ? '✅' : '📝'}
                    </span>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                        #{index + 1}
                      </small>
                      <small className="fw-semibold">
                        {form.title ? (
                          <span style={{ fontSize: '0.8rem' }}>
                            {form.title.length > 15 ? `${form.title.substring(0, 15)}...` : form.title}
                          </span>
                        ) : (
                          <span className="text-muted">Untitled Question</span>
                        )}
                      </small>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <Badge bg="success" pill>
                      Done
                    </Badge>
                  )}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Card.Body>
        
        <Card.Footer className="text-center bg-light">
          <small className="text-muted">
            {completedForms.size}/{forms.length} completed
          </small>
        </Card.Footer>
      </Card>
      
      {/* Floating summary */}
      <div 
        className="mt-2 text-center"
        style={{
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 123, 255, 0.2)'
        }}
      >
        <small className="text-primary fw-bold">
          Total: {forms.length} forms
        </small>
      </div>
    </div>
  )
}

export default QuestionNavigationSidebar
