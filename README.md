# QuizMaster - Interactive Quiz Application

A modern, feature-rich quiz application built with React, TypeScript, and Vite. Upload quiz files and test your knowledge with instant feedback and detailed explanations.

## Features

- **File Upload Support**: Upload quizzes in CSV, XLSX, XLS, or TSV format
- **Interactive Quiz Taking**: Answer questions with immediate feedback
- **Detailed Explanations**: See explanations for correct and incorrect answers
- **Score Tracking**: View your performance with percentage scores
- **Quiz History**: Keep track of all your quiz attempts
- **Saved Quizzes**: Manage and retake your uploaded quizzes
- **Modern UI**: Sleek dark theme with gold accents and smooth animations

## File Format

Your quiz files should contain the following columns:

- `question` - The question text
- `option1` - First answer option
- `option2` - Second answer option
- `option3` - Third answer option
- `option4` - Fourth answer option
- `correctAnswer` - The correct answer (must match one of the options exactly)
- `explanation` - Explanation of the correct answer

### Example CSV:

```csv
question,option1,option2,option3,option4,correctAnswer,explanation
"What is the capital of France?",London,Paris,Berlin,Madrid,Paris,"Paris is the capital and largest city of France."
"What is 2 + 2?",3,4,5,6,4,"Basic arithmetic: 2 + 2 equals 4."
```

### Alternative Column Names

The application supports flexible column naming:
- Question: `question`, `Question`, `q`, `Q`
- Options: `option1-4`, `Option1-4`, `a-d`, `A-D`, or comma-separated `options`
- Answer: `correctAnswer`, `correct_answer`, `answer`, `correct`
- Explanation: `explanation`, `Explanation`, `exp`, `Exp`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Upload a Quiz**: 
   - Click "New Quiz" in the sidebar
   - Drag and drop your quiz file or click to browse
   - Supported formats: CSV, XLSX, XLS, TSV

2. **Take a Quiz**:
   - Select an answer for each question
   - View immediate feedback with explanations
   - Navigate between questions
   - Complete the quiz to see your final score

3. **View History**:
   - Click "History" in the sidebar
   - See all your quiz attempts with scores
   - Retake any quiz from your history
   - Delete quizzes you no longer need

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **PapaParse** - CSV parsing
- **SheetJS** - Excel file parsing
- **Lucide React** - Icon library

## Project Structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx    # File upload component
│   │   ├── QuizPlayer.tsx    # Quiz taking interface
│   │   └── History.tsx       # Quiz history view
│   ├── App.tsx               # Main application
│   ├── App.css               # Styles
│   ├── main.tsx              # Entry point
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features in Detail

### Quiz Player
- Progress bar showing completion percentage
- Question counter
- Multiple choice options with letter labels
- Instant feedback on answer selection
- Color-coded correct/incorrect answers
- Detailed explanations
- Navigation between questions
- Final score display with percentage

### History Management
- List of all uploaded quizzes
- Recent quiz attempts with scores
- Color-coded performance (Excellent: 80%+, Good: 60-79%, Needs Improvement: <60%)
- One-click quiz retake
- Quiz deletion
- Timestamps for all activities

### Storage
- All data stored in browser memory during session
- No external database required
- Privacy-focused design

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with modern web technologies and designed for an exceptional user experience.
