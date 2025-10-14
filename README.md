# 🧮 Kid Learning Math

An interactive web application designed to teach kids math through engaging visual and audio feedback. Built with React, TypeScript, and Bootstrap for a fun and educational experience.

## ✨ Features

- 📚 **Interactive Lessons** - Categorized math lessons with progressive difficulty
- 🎯 **Visual Feedback** - Animated responses for correct and incorrect answers
- 🔊 **Audio Feedback** - Engaging sound effects to reinforce learning
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Kid-Friendly UI** - Colorful shapes, animations, and encouraging feedback
- 🔄 **State Management** - Smart lesson switching with automatic state reset
- 📱 **Mobile-friendly** responsive layout

## 🎮 Current Lessons

### Counting
- **Count to 3** - Visual shape counting with interactive feedback
- **Count to 4** - Coming soon
- **Count to 5** - Coming soon
- **Count to 10** - Coming soon

### Constructing Objects
- **Find image to complete object** - Coming soon
- **Build basic shapes** - Coming soon
- **Match patterns** - Coming soon

### Colors
- **Primary colors** - Coming soon
- **Color mixing** - Coming soon
- **Color matching games** - Coming soon

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview the production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx        # Main layout with sidebar and content
│   ├── Layout.css        # Layout-specific styles
│   ├── Sidebar.tsx       # Collapsible lesson navigation
│   ├── MainContent.tsx   # Lesson content display area
│   ├── Question.tsx      # Interactive question component
│   └── Question.css      # Question animations and styles
├── data/
│   └── lessons.ts        # Lesson data and question definitions
├── hooks/
│   └── useAudioFeedback.ts # Audio feedback system
├── App.tsx               # Main application component
├── App.css               # Global application styles
└── main.tsx              # Application entry point

public/
├── rocket.png            # Lesson images and assets
└── ...                   # Other static assets
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type safety and better developer experience  
- **Vite** - Fast build tool and dev server
- **Bootstrap 5** - Responsive CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Web Audio API** - Programmatic audio feedback generation
- **CSS Animations** - Engaging visual feedback for kids

## 🎨 Key Components

### Question Component
Interactive question display with:
- Visual shape rendering (squares, triangles, circles)
- Clickable answer selection
- Animated feedback for correct/incorrect answers
- Audio feedback integration

### Layout System
- Responsive sidebar navigation
- Mobile-friendly offcanvas menu
- Smooth animations and transitions
- Bootstrap grid system

### Audio Feedback
- Celebration sounds for correct answers
- Encouraging sounds for incorrect answers
- Click feedback for interactions
- Web Audio API implementation

## 🎯 Educational Features

- **Immediate Feedback** - Visual and audio responses to user actions
- **Positive Reinforcement** - Celebratory animations and sounds
- **Progressive Learning** - Structured lesson categories
- **Accessibility** - Screen reader friendly with proper ARIA labels
- **Mobile Support** - Touch-friendly interface for tablets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
└── index.css        # Global styles
```

## Technologies Used

- **React 18** - Modern React with functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting for better code quality

## Development Notes

This is a simple single-page application showcasing a clean home page. The application is fully responsive and follows modern React development practices with TypeScript for better development experience.
    },
  },
])
```
