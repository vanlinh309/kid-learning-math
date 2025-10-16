import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import type { QuestionData } from './Question'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  // Saved questions (persisted)
  const [savedQuestions, setSavedQuestions] = useState<QuestionData[]>([
    // You can add some initial questions here or leave empty
  ])
  
  // Draft questions (temporary, not yet saved)
  const [draftQuestions, setDraftQuestions] = useState<QuestionData[]>([])
  
  // All questions (saved + drafts) for display
  const allQuestions = [...savedQuestions, ...draftQuestions]

  const handleAddQuestion = (question: QuestionData) => {
    // Add to drafts instead of immediately saving
    setDraftQuestions(prev => [...prev, question])
    console.log('Added question to drafts:', question)
  }
  
  const handleSaveAllQuestions = () => {
    if (draftQuestions.length === 0) {
      console.log('No draft questions to save')
      return
    }
    
    // Move all draft questions to saved questions
    setSavedQuestions(prev => [...prev, ...draftQuestions])
    setDraftQuestions([]) // Clear drafts
    
    console.log('Saved all questions:', draftQuestions)
    // Here you would typically send all draft questions to your backend API
  }

  const handleEditQuestion = (updatedQuestion: QuestionData) => {
    // Check if it's a saved question or draft question
    const isDraft = draftQuestions.some(q => q.id === updatedQuestion.id)
    
    if (isDraft) {
      setDraftQuestions(prev => 
        prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
      )
    } else {
      setSavedQuestions(prev => 
        prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
      )
    }
    console.log('Updated question:', updatedQuestion)
    // Here you would typically update the question in your backend API if it's saved
  }

  const handleDeleteQuestion = (questionId: string) => {
    // Check if it's a saved question or draft question and remove from appropriate list
    const isDraft = draftQuestions.some(q => q.id === questionId)
    
    if (isDraft) {
      setDraftQuestions(prev => prev.filter(q => q.id !== questionId))
    } else {
      setSavedQuestions(prev => prev.filter(q => q.id !== questionId))
    }
    console.log('Deleted question:', questionId)
    // Here you would typically delete the question from your backend API if it was saved
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <span className="navbar-brand">Math Questions Admin</span>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </nav>
      
      <AdminLayout
        questions={allQuestions}
        savedQuestions={savedQuestions}
        draftQuestions={draftQuestions}
        onAddQuestion={handleAddQuestion}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onSaveAllQuestions={handleSaveAllQuestions}
      />
    </div>
  )
}

export default AdminPage
