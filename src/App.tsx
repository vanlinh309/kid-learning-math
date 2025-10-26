import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AdminPage from './components/AdminPage'
import LearningPage from './components/LearningPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Learning Routes */}
        <Route path="/learn/:category" element={<LearningPage />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />
        {/* Object Recognition Routes */}
        <Route path="/admin/object-recognition" element={<AdminPage />} />
        <Route path="/admin/object-recognition/new" element={<AdminPage />} />
        {/* Counting Routes */}
        <Route path="/admin/counting" element={<AdminPage />} />
        <Route path="/admin/counting/new" element={<AdminPage />} />
        {/* Legacy Routes */}
        <Route path="/admin/questions" element={<AdminPage />} />
        <Route path="/admin/questions/new" element={<AdminPage />} />
        <Route path="/admin/edit" element={<AdminPage />} />
        <Route path="/admin/edit/:id" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
