import React, { useState } from 'react'
import AdminLayout from './AdminLayout'
import type { QuestionData } from './Question'

const AdminPage: React.FC = () => {
  // This would typically come from a backend API or context
  const [questions, setQuestions] = useState<QuestionData[]>([
    // You can add some initial questions here or leave empty
  ])

  const handleAddQuestion = (question: QuestionData) => {
    setQuestions(prev => [...prev, question])
    console.log('Added question:', question)
    // Here you would typically send the question to your backend API
  }

  const handleEditQuestion = (updatedQuestion: QuestionData) => {
    setQuestions(prev => 
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    )
    console.log('Updated question:', updatedQuestion)
    // Here you would typically update the question in your backend API
  }

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
    console.log('Deleted question:', questionId)
    // Here you would typically delete the question from your backend API
  }

  return (
    <AdminLayout
      questions={questions}
      onAddQuestion={handleAddQuestion}
      onEditQuestion={handleEditQuestion}
      onDeleteQuestion={handleDeleteQuestion}
    />
  )
}

export default AdminPage
