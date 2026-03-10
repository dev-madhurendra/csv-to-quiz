import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, RotateCcw, Info } from 'lucide-react';
import { QuizState, QuizAttempt, QuizPlayerProps } from '../types';
import { getCorrectAnswerIndex, storage } from '../utils';

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quiz.questions.length).fill(null),
    answersIndex: Array(quiz.questions.length).fill(null), 
    showExplanation: false,
    isCompleted: false
  });

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[state.currentQuestionIndex];
  const currentAnswerIndex = state.answersIndex[state.currentQuestionIndex];
  const isAnswered = currentAnswer !== null;

  const isCorrect =
    currentAnswerIndex !== null &&
    getCorrectAnswerIndex(currentAnswerIndex) === currentQuestion.correctAnswer;

  const handleAnswer = (answer: string, answerIndex: number) => {
    if (isAnswered) return; 
    const newAnswers = [...state.answers];
    const newAnswersIndex = [...state.answersIndex]; 
    newAnswersIndex[state.currentQuestionIndex] = answerIndex;
    newAnswers[state.currentQuestionIndex] = answer;
    setState({ ...state, answers: newAnswers, answersIndex: newAnswersIndex, showExplanation: true });
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < quiz.questions.length - 1) {
      const nextIndex = state.currentQuestionIndex + 1;
      setState({
        ...state,
        currentQuestionIndex: nextIndex,
        showExplanation: state.answers[nextIndex] !== null
      });
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      const prevIndex = state.currentQuestionIndex - 1;
      setState({
        ...state,
        currentQuestionIndex: prevIndex,
        showExplanation: state.answers[prevIndex] !== null
      });
    }
  };

  const completeQuiz = () => {
    const score = state.answersIndex.filter(
      (answerIndex, index) =>
        answerIndex !== null &&
        getCorrectAnswerIndex(answerIndex) === quiz.questions[index].correctAnswer
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
      answersIndex: Array(quiz.questions.length).fill(null), 
      showExplanation: false,
      isCompleted: false
    });
  };

  if (state.isCompleted) {
    const score = state.answersIndex.filter(
      (answerIndex, index) =>
        answerIndex !== null &&
        getCorrectAnswerIndex(answerIndex) === quiz.questions[index].correctAnswer
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
            const correctOptionIndex = ['A','B','C','D'].indexOf(currentQuestion.correctAnswer);
            const isCorrectOption = index === correctOptionIndex;
            const showCorrectness = state.showExplanation;

            let optionClass = 'option';
            if (isSelected) optionClass += ' selected';
            if (showCorrectness && isCorrectOption) optionClass += ' correct';
            if (showCorrectness && isSelected && !isCorrect) optionClass += ' incorrect';

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswer(option, index)}
                disabled={isAnswered}
              >
                <span className="option-label">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showCorrectness && isCorrectOption && isSelected && <CheckCircle size={20} />}
                {showCorrectness && isSelected && !isCorrect && <XCircle size={20} />}
                {showCorrectness && isCorrectOption && !isSelected && !isCorrect && <CheckCircle size={20} className="hint-correct" />}
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