import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AdminPage from './components/AdminPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/questions" element={<AdminPage />} />
        <Route path="/admin/questions/new" element={<AdminPage />} />
        <Route path="/admin/edit" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
