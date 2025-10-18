import type { QuestionData } from '../components/Question'

export interface LessonItem {
  id: string
  title: string
  questions: QuestionData[]
}

export interface Category {
  id: string
  title: string
}

export const categories: Category[] = [
  {
    id: 'recognize_object',
    title: 'Recognizing Objects'
  },
  {
    id: 'counting',
    title: 'Counting'
  },
  {
    id: 'shapes',
    title: 'Shapes & Geometry'
  },
  {
    id: 'colors',
    title: 'Colors'
  },
  {
    id: 'patterns',
    title: 'Patterns'
  }
]