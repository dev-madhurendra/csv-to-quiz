import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, RotateCcw, Info } from 'lucide-react';
import { Quiz, QuizState, QuizAttempt } from '../types';
import { getCorrectAnswerIndex, storage } from '../utils';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: () => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quiz.questions.length).fill(null),
    showExplanation: false,
    isCompleted: false
  });

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[state.currentQuestionIndex];
  const isAnswered = currentAnswer !== null;
  const currentQuestionOptions = currentQuestion.options;
  const selectedAnswerIndex = currentQuestionOptions.findIndex(
    (optionValue) => optionValue === currentAnswer
  );
  const isCorrect = getCorrectAnswerIndex(selectedAnswerIndex) == currentQuestion.correctAnswer; 
  const handleAnswer = (answer: string) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = answer;
    setState({ ...state, answers: newAnswers, showExplanation: true });
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < quiz.questions.length - 1) {
      setState({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        showExplanation: false
      });
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
        showExplanation: state.answers[state.currentQuestionIndex - 1] !== null
      });
    }
  };

  const completeQuiz = () => {
    const score = state.answers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer
    ).length;

    const attempt: QuizAttempt = {
      quizId: quiz.id,
      quizName: quiz.name,
      answers: state.answers,
      score,
      totalQuestions: quiz.questions.length,
      completedAt: new Date()
    };

    storage.saveAttempt(attempt);
    setState({ ...state, isCompleted: true });
  };

  const handleRestart = () => {
    setState({
      currentQuestionIndex: 0,
      answers: Array(quiz.questions.length).fill(null),
      showExplanation: false,
      isCompleted: false
    });
  };

  if (state.isCompleted) {
    const score = state.answers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer
    ).length;
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="quiz-complete">
        <div className="score-display">
          <h1>Quiz Complete!</h1>
          <div className="score-circle">
            <span className="score-number">{percentage}%</span>
          </div>
          <p className="score-text">
            {score} out of {quiz.questions.length} correct
          </p>
        </div>

        <div className="complete-actions">
          <button onClick={handleRestart} className="btn-secondary">
            <RotateCcw size={20} />
            Retry Quiz
          </button>
          <button onClick={onComplete} className="btn-primary">
            View History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h1>{quiz.name}</h1>
        <button onClick={onExit} className="btn-exit">Exit</button>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((state.currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="question-number">
        Question {state.currentQuestionIndex + 1} of {quiz.questions.length}
      </div>

      <div className="question-content">
        <h2>{currentQuestion.question}</h2>

        <div className="options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer === option;
            const isCorrectOption = option === currentAnswer;
            const showCorrectness = state.showExplanation;

            let optionClass = 'option';
            if (isSelected) optionClass += ' selected';
            if (showCorrectness && isCorrectOption) optionClass += ' correct';
            if (showCorrectness && isSelected && !isCorrect) optionClass += ' incorrect';

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => !isAnswered && handleAnswer(option)}
                disabled={isAnswered}
              >
                <span className="option-label">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showCorrectness && isCorrectOption && isCorrect && <CheckCircle size={20} />}
                {showCorrectness && isSelected && !isCorrect && <XCircle size={20} />}
              </button>
            );
          })}
        </div>

        {state.showExplanation && (
          <div className={`explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="explanation-header">
              <Info size={20} />
              <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
            </div>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="navigation">
        <button
          onClick={handlePrevious}
          disabled={state.currentQuestionIndex === 0}
          className="btn-nav"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="btn-nav btn-next"
        >
          {state.currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
