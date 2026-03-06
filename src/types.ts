export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
  createdAt: Date;
}

export interface QuizAttempt {
  quizId: string;
  quizName: string;
  answers: (string | null)[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (string | null)[];
  showExplanation: boolean;
  isCompleted: boolean;
}