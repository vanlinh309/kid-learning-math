import React, { useState } from 'react'
import { Form, Nav, Collapse } from 'react-bootstrap'
import { Search, ChevronDown, ChevronRight } from 'react-bootstrap-icons'
import { categories } from '../data/lessons'
import type { LessonItem } from '../data/lessons'

interface SidebarProps {
  onLessonSelect: (lesson: LessonItem) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onLessonSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['counting'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredCategories = categories.map(category => ({
    ...category,
    lessons: category.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.lessons.length > 0)

  return (
    <div className="h-100 d-flex flex-column">
      {/* Search Box */}
      <div className="p-3 border-bottom bg-light">
        <Form.Group className="mb-0">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-5"
              size="sm"
            />
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
          </div>
        </Form.Group>
      </div>

      {/* Menu Items */}
      <div className="flex-grow-1 overflow-auto p-2">
        <Nav className="flex-column">
          {filteredCategories.map(category => (
            <div key={category.id} className="mb-1">
              <Nav.Link
                className="d-flex align-items-center justify-content-between p-2 rounded bg-white border text-dark text-decoration-none"
                onClick={() => toggleCategory(category.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="fw-semibold small">{category.title}</span>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </Nav.Link>
              
              <Collapse in={expandedCategories.includes(category.id)}>
                <div className="ms-2">
                  {category.lessons.map(lesson => (
                    <Nav.Link
                      key={lesson.id}
                      className="d-block p-2 ps-3 small text-secondary text-decoration-none rounded-end"
                      onClick={() => onLessonSelect(lesson)}
                      style={{ 
                        cursor: 'pointer',
                        borderLeft: '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = '#0d6efd'
                        e.currentTarget.style.backgroundColor = '#f8f9fa'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = 'transparent'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {lesson.title}
                    </Nav.Link>
                  ))}
                </div>
              </Collapse>
            </div>
          ))}
        </Nav>

        {filteredCategories.length === 0 && (
          <div className="text-muted text-center py-4 small">
            No lessons found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
