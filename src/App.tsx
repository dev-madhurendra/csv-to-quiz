import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizPlayer } from './components/QuizPlayer';
import { History } from './components/History';
import { Quiz } from './types';
import { BookOpen, History as HistoryIcon } from 'lucide-react';
import './App.css';

type View = 'upload' | 'quiz' | 'history';

function App() {
  const [view, setView] = useState<View>('upload');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const handleQuizCreated = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setView('quiz');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setView('quiz');
  };

  const handleQuizComplete = () => {
    setView('history');
    setCurrentQuiz(null);
  };

  const handleExitQuiz = () => {
    setView('history');
    setCurrentQuiz(null);
  };

  const handleBackToUpload = () => {
    setView('upload');
    setCurrentQuiz(null);
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <BookOpen size={32} strokeWidth={1.5} />
          <h1>QuizMaster</h1>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${view === 'upload' || view === 'quiz' ? 'active' : ''}`}
            onClick={handleBackToUpload}
          >
            <BookOpen size={20} />
            <span>New Quiz</span>
          </button>
          <button
            className={`nav-link ${view === 'history' ? 'active' : ''}`}
            onClick={() => setView('history')}
          >
            <HistoryIcon size={20} />
            <span>History</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <p>Upload your quiz files and test your knowledge</p>
        </div>
      </nav>

      <main className="main-content">
        {view === 'upload' && <FileUpload onQuizCreated={handleQuizCreated} />}
        {view === 'quiz' && currentQuiz && (
          <QuizPlayer
            quiz={currentQuiz}
            onComplete={handleQuizComplete}
            onExit={handleExitQuiz}
          />
        )}
        {view === 'history' && <History onStartQuiz={handleStartQuiz} />}
      </main>
    </div>
  );
}

export default App;
