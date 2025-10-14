import type { QuestionData } from '../components/Question'

export interface LessonItem {
  id: string
  title: string
  questions: QuestionData[]
}

export interface Category {
  id: string
  title: string
  lessons: LessonItem[]
}

// Question 1 data based on lessons.md
const question1: QuestionData = {
  id: 'q1',
  title: 'Look at the picture and select the correct answer',
  imageUrl: 'lesson-content/rocket.png', // Using the image we created
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'square', number: 7 },
        { shape: 'triangle', number: 6 },
        { shape: 'circle', number: 4 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: true,
      blocks: [
        { shape: 'square', number: 7 },
        { shape: 'triangle', number: 7 },
        { shape: 'circle', number: 4 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: false,
      blocks: [
        { shape: 'square', number: 6 },
        { shape: 'triangle', number: 7 },
        { shape: 'circle', number: 4 }
      ]
    }
  ]
}

const question2: QuestionData = {
  id: 'q2',
  title: 'Look at the picture and select the correct answer',
  imageUrl: 'lesson-content/rocket2.png', // Using the image we created
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'triangle', number: 2 },
        { shape: 'circle', number: 3 },
        { shape: 'rectangle', number: 1 },
        { shape: 'diamond', number: 5 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: true,
      blocks: [
        { shape: 'triangle', number: 3 },
        { shape: 'circle', number: 3 },
        { shape: 'rectangle', number: 1 },
        { shape: 'diamond', number: 4 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: false,
      blocks: [
        { shape: 'triangle', number: 3 },
        { shape: 'circle', number: 3 },
        { shape: 'rectangle', number: 2 },
        { shape: 'diamond', number: 4 }
      ]
    }
  ]
}

export const categories: Category[] = [
  {
    id: 'counting',
    title: 'Counting',
    lessons: [
      {
        id: 'count-to-3',
        title: 'Count to 3',
        questions: [question1]
      },
      {
        id: 'count-to-4',
        title: 'Count to 4',
        questions: [question2]
      },
      {
        id: 'count-to-5',
        title: 'Count to 5',
        questions: []
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: []
      }
    ]
  },
  {
    id: 'constructing-object',
    title: 'Constructing Object',
    lessons: [
      {
        id: 'find-image-complete',
        title: 'Find image to complete object',
        questions: []
      },
      {
        id: 'build-shapes',
        title: 'Build basic shapes',
        questions: []
      },
      {
        id: 'match-patterns',
        title: 'Match patterns',
        questions: []
      }
    ]
  },
  {
    id: 'colors',
    title: 'Colors',
    lessons: [
      {
        id: 'primary-colors',
        title: 'Primary colors',
        questions: []
      },
      {
        id: 'color-mixing',
        title: 'Color mixing',
        questions: []
      },
      {
        id: 'color-matching',
        title: 'Color matching games',
        questions: []
      }
    ]
  }
]
