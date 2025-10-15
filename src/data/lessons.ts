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
  imageUrl: 'https://linh309.sirv.com/lessons/rocket.png', // Replace with your actual Google Drive file ID
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
  imageUrl: 'https://linh309.sirv.com/lessons/rocket2.png', // Using the image we created
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

const question3: QuestionData = {
  id: 'q3',
  title: 'Look at the picture and select the correct answer',
  imageUrl: 'https://linh309.sirv.com/lessons/spider-man.png', // Using the image we created
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'circle', number: 3 },
        { shape: 'triangle', number: 2 },
        { shape: 'square', number: 1 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: false,
      blocks: [
        { shape: 'circle', number: 3 },
        { shape: 'triangle', number: 4 },
        { shape: 'square', number: 2 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: true,
      blocks: [
        { shape: 'circle', number: 1 },
        { shape: 'triangle', number: 2 },
        { shape: 'square', number: 2 }
      ]
    }
  ]
}

// Question 4 - Mock data for shape counting
const question4: QuestionData = {
  id: 'q4',
  title: 'Count the shapes and choose the correct answer',
  imageUrl: 'https://example.com/mock-shapes-image.png', // Mock image URL - replace with your actual image
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'diamond', number: 2 },
        { shape: 'rectangle', number: 3 },
        { shape: 'circle', number: 1 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: true,
      blocks: [
        { shape: 'diamond', number: 3 },
        { shape: 'rectangle', number: 2 },
        { shape: 'circle', number: 2 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: false,
      blocks: [
        { shape: 'diamond', number: 3 },
        { shape: 'rectangle', number: 3 },
        { shape: 'circle', number: 1 }
      ]
    }
  ]
}

// Question 5 - Mock data for mixed counting
const question5: QuestionData = {
  id: 'q5',
  title: 'Look at the animals and count each type',
  imageUrl: 'https://example.com/mock-animals-image.png', // Mock image URL - replace with your actual image
  answers: [
    {
      id: 'answer1',
      isCorrect: true,
      blocks: [
        { shape: 'square', number: 4 },
        { shape: 'triangle', number: 3 },
        { shape: 'circle', number: 5 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: false,
      blocks: [
        { shape: 'square', number: 3 },
        { shape: 'triangle', number: 4 },
        { shape: 'circle', number: 5 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: false,
      blocks: [
        { shape: 'square', number: 4 },
        { shape: 'triangle', number: 3 },
        { shape: 'circle', number: 4 }
      ]
    }
  ]
}

// Question 6 - Mock data for pattern recognition
const question6: QuestionData = {
  id: 'q6',
  title: 'Find the missing pattern pieces',
  imageUrl: 'https://example.com/mock-pattern-image.png', // Mock image URL - replace with your actual image
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'rectangle', number: 1 },
        { shape: 'diamond', number: 2 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: false,
      blocks: [
        { shape: 'rectangle', number: 2 },
        { shape: 'diamond', number: 1 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: true,
      blocks: [
        { shape: 'rectangle', number: 3 },
        { shape: 'diamond', number: 1 }
      ]
    }
  ]
}

// Question 7 - Mock data for color counting
const question7: QuestionData = {
  id: 'q7',
  title: 'Count the colored objects in the picture',
  imageUrl: 'https://example.com/mock-colors-image.png', // Mock image URL - replace with your actual image
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'circle', number: 6 },
        { shape: 'square', number: 2 },
        { shape: 'triangle', number: 3 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: true,
      blocks: [
        { shape: 'circle', number: 5 },
        { shape: 'square', number: 3 },
        { shape: 'triangle', number: 2 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: false,
      blocks: [
        { shape: 'circle', number: 5 },
        { shape: 'square', number: 2 },
        { shape: 'triangle', number: 4 }
      ]
    }
  ]
}

// Question 8 - Mock data for advanced counting
const question8: QuestionData = {
  id: 'q8',
  title: 'Count all the items and select the right combination',
  imageUrl: 'https://example.com/mock-items-image.png', // Mock image URL - replace with your actual image
  answers: [
    {
      id: 'answer1',
      isCorrect: false,
      blocks: [
        { shape: 'diamond', number: 4 },
        { shape: 'rectangle', number: 6 },
        { shape: 'circle', number: 3 },
        { shape: 'square', number: 2 }
      ]
    },
    {
      id: 'answer2', 
      isCorrect: false,
      blocks: [
        { shape: 'diamond', number: 3 },
        { shape: 'rectangle', number: 5 },
        { shape: 'circle', number: 4 },
        { shape: 'square', number: 3 }
      ]
    },
    {
      id: 'answer3',
      isCorrect: true,
      blocks: [
        { shape: 'diamond', number: 3 },
        { shape: 'rectangle', number: 6 },
        { shape: 'circle', number: 4 },
        { shape: 'square', number: 2 }
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
        questions: [question3]
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: [question4]
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: [question5]
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: [question6]
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: [question7]
      },
      {
        id: 'count-to-10',
        title: 'Count to 10',
        questions: [question8]
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
        questions: [question6]
      },
      {
        id: 'build-shapes',
        title: 'Build basic shapes',
        questions: [question7]
      },
      {
        id: 'match-patterns',
        title: 'Match patterns',
        questions: [question8]
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
