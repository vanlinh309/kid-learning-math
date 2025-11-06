# Calculation Lesson

A new interactive learning page for teaching kids basic arithmetic operations (addition and subtraction).

## 🎯 Features

### Three-Row Layout

#### **First Row: Input Controls**
- **Left Textbox**: Enter first number (1-9 only)
- **Middle Dropdown**: Select operation (Add + or Subtract −)
- **Right Textbox**: Enter second number (1-9 only)

#### **Second Row: Visual Representation**
- **Left Block**: Displays red circles matching the first number
- **Middle Block**: "Check Answer" button to verify the calculation
- **Right Block**: Displays red circles matching the second number

#### **Third Row: Result Display** (shown after clicking Check)
- **Left Block**: Shows the numeric result
- **Right Block**: Shows the result visually using red circles

## 🎨 Design Features

- **Kid-Friendly Colors**: Gradient backgrounds with vibrant colors
- **Visual Learning**: Red circles provide visual representation of numbers
- **Input Validation**: Only allows numbers 1-9
- **Animations**: 
  - Circle appear animation
  - Result bounce animation
  - Feedback messages with smooth transitions
- **Responsive Design**: Works on mobile, tablet, and desktop

## 📂 File Structure

```
src/features/learning/components/lessons/
├── CalculationLesson.tsx      # Main component
├── CalculationLesson.css      # Styling
└── index.ts                   # Barrel export (updated)
```

## 🚀 Usage

### Accessing the Lesson

1. Navigate to the home page
2. Click on the "Calculation" category
3. The calculation lesson will load

### How It Works

```typescript
// The component is automatically rendered when category is 'calculation'
// In MainContent.tsx:
selectedLesson.questions[currentQuestionIndex].category === 'calculation' ? (
  <CalculationLesson />
) : ...
```

## 🔧 Technical Details

### Component Props
The `CalculationLesson` component is standalone and doesn't require any props (unlike other lessons that need question data from the database).

### State Management
```typescript
const [leftNumber, setLeftNumber] = useState<string>('')
const [rightNumber, setRightNumber] = useState<string>('')
const [operator, setOperator] = useState<Operator>('+')
const [showResult, setShowResult] = useState(false)
```

### Key Functions

1. **handleNumberInput**: Validates and sets input (only 1-9)
2. **renderCircles**: Creates visual representation of numbers
3. **calculateResult**: Performs arithmetic operation
4. **handleCheck**: Validates inputs and shows result

### Calculation Logic
```typescript
const calculateResult = (): number => {
  const left = parseInt(leftNumber) || 0
  const right = parseInt(rightNumber) || 0
  
  if (operator === '+') {
    return left + right
  } else {
    return Math.max(0, left - right) // Prevent negative results
  }
}
```

## 🎓 Educational Benefits

1. **Visual + Numeric Learning**: Kids see both numbers and visual representations
2. **Interactive**: Kids actively participate by entering numbers
3. **Immediate Feedback**: Check button provides instant verification
4. **Progressive Learning**: Start with addition, then subtraction
5. **Safe Environment**: Subtraction prevents negative results (suitable for young learners)

## 🔄 Integration

### Added to Categories
```typescript
// src/data/lessons.ts
{
  id: 'calculation',
  title: 'Calculation'
}
```

### Added to Type Definitions
```typescript
// RecognizeObjectLesson.tsx
category?: 'recognize_object' | 'counting' | 'calculation' | 'shapes' | 'colors' | 'patterns'
```

### Added to Routing
```typescript
// MainContent.tsx
selectedLesson.questions[currentQuestionIndex].category === 'calculation' ? (
  <CalculationLesson />
) : ...
```

## 🎨 Styling Highlights

- **Purple Gradient**: Input row (makes it stand out)
- **Pink Gradient**: Visual representation row (engaging for kids)
- **Yellow Gradient**: Result row (celebratory feel)
- **Green Button**: Check button (clear call to action)
- **Red Circles**: Visual counters (easy to count)

## 📱 Responsive Design

- Desktop: Full three-column layout
- Tablet/Mobile: Adjusted sizing, maintains usability
- Circle size: Adapts from 40px (desktop) to 30px (mobile)

## 🚧 Future Enhancements

Potential improvements:
1. Add multiplication and division operators
2. Store calculation history
3. Add time-based challenges
4. Track accuracy and speed
5. Add sound effects for correct answers
6. Create progressive difficulty levels
7. Add achievements/badges for completing calculations

---

**Status**: ✅ Complete and tested  
**Build**: ✅ Successful  
**Integration**: ✅ Fully integrated with learning platform
