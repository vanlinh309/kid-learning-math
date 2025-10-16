import React from 'react'
import { Card, Table, Button, Badge } from 'react-bootstrap'
import type { QuestionData } from './Question'

interface QuestionListProps {
  questions: QuestionData[]
  savedQuestions: QuestionData[]
  draftQuestions: QuestionData[]
  onEdit: (question: QuestionData) => void
  onDelete: (questionId: string) => void
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  savedQuestions: _savedQuestions,
  draftQuestions,
  onEdit,
  onDelete
}) => {
  const handleDelete = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(questionId)
    }
  }
  
  const isQuestionDraft = (questionId: string) => {
    return draftQuestions.some(q => q.id === questionId)
  }

  const renderShapeBlocks = (question: QuestionData) => {
    const correctAnswer = question.answers.find(answer => answer.isCorrect)
    if (!correctAnswer) return 'No correct answer'

    return correctAnswer.blocks.map((block, index) => (
      <span key={index} className="me-2">
        <Badge bg="secondary" className="me-1">
          {block.shape}
        </Badge>
        <span className="text-muted">{block.number}</span>
      </span>
    ))
  }

  return (
    <Card>
      <Card.Header>
        <h4>Manage Questions ({questions.length})</h4>
      </Card.Header>
      <Card.Body>
        {questions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No questions available. Add your first question!</p>
          </div>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Status</th>
                <th>ID</th>
                <th>Title</th>
                <th>Image</th>
                <th>Correct Answer</th>
                <th>Answers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className={isQuestionDraft(question.id) ? 'table-warning' : ''}>
                  <td>
                    {isQuestionDraft(question.id) ? (
                      <Badge bg="warning" className="text-dark">
                        📝 Draft
                      </Badge>
                    ) : (
                      <Badge bg="success">
                        ✅ Saved
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg="primary">{question.id}</Badge>
                  </td>
                  <td>
                    <div className="fw-semibold">{question.title}</div>
                  </td>
                  <td>
                    {question.imageUrl ? (
                      <Badge bg="success">✓ Has Image</Badge>
                    ) : (
                      <Badge bg="warning">No Image</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap">
                      {renderShapeBlocks(question)}
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{question.answers.length} options</Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEdit(question)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default QuestionList
