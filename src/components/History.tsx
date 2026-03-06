import React from 'react';
import { Clock, Award, Trash2, Play } from 'lucide-react';
import { storage } from '../utils';
import { Quiz } from '../types';

interface HistoryProps {
  onStartQuiz: (quiz: Quiz) => void;
}

export const History: React.FC<HistoryProps> = ({ onStartQuiz }) => {
  const [attempts, setAttempts] = React.useState(storage.getAttempts());
  const [quizzes, setQuizzes] = React.useState(storage.getQuizzes());

  const refreshData = () => {
    setAttempts(storage.getAttempts());
    setQuizzes(storage.getQuizzes());
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      storage.deleteQuiz(quizId);
      refreshData();
    }
  };

  const handleRetakeQuiz = (quizId: string) => {
    const quiz = storage.getQuiz(quizId);
    if (quiz) {
      onStartQuiz(quiz);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-container">
      <h1>Your Quizzes</h1>

      <div className="history-sections">
        {/* Saved Quizzes */}
        <div className="history-section">
          <h2>Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes yet. Upload a file to get started!</p>
            </div>
          ) : (
            <div className="quiz-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <div className="quiz-card-header">
                    <h3>{quiz.name}</h3>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="btn-icon-danger"
                      title="Delete quiz"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="quiz-meta">
                    {quiz.questions.length} questions
                  </p>
                  <p className="quiz-date">
                    <Clock size={14} />
                    Created {formatDate(quiz.createdAt)}
                  </p>
                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="btn-play"
                  >
                    <Play size={18} />
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attempt History */}
        <div className="history-section">
          <h2>Recent Attempts</h2>
          {attempts.length === 0 ? (
            <div className="empty-state">
              <p>No attempts yet. Complete a quiz to see your history!</p>
            </div>
          ) : (
            <div className="attempts-list">
              {attempts.map((attempt, index) => {
                const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                const grade = percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-improvement';

                return (
                  <div key={index} className={`attempt-card ${grade}`}>
                    <div className="attempt-header">
                      <h3>{attempt.quizName}</h3>
                      <div className="attempt-score">
                        <Award size={20} />
                        <span>{percentage}%</span>
                      </div>
                    </div>
                    <div className="attempt-details">
                      <span>{attempt.score}/{attempt.totalQuestions} correct</span>
                      <span className="attempt-date">
                        <Clock size={14} />
                        {formatDate(attempt.completedAt)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRetakeQuiz(attempt.quizId)}
                      className="btn-retake"
                    >
                      <Play size={16} />
                      Retake
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
