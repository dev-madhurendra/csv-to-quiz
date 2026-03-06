import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Quiz, QuizAttempt, Question } from './types';

// Storage utilities using in-memory storage
const quizHistory: Quiz[] = [];
const attemptHistory: QuizAttempt[] = [];

export const storage = {
  saveQuiz: (quiz: Quiz) => {
    const index = quizHistory.findIndex(q => q.id === quiz.id);
    if (index !== -1) {
      quizHistory[index] = quiz;
    } else {
      quizHistory.push(quiz);
    }
  },

  getQuizzes: (): Quiz[] => {
    return [...quizHistory];
  },

  getQuiz: (id: string): Quiz | undefined => {
    return quizHistory.find(q => q.id === id);
  },

  deleteQuiz: (id: string) => {
    const index = quizHistory.findIndex(q => q.id === id);
    if (index !== -1) {
      quizHistory.splice(index, 1);
    }
  },

  saveAttempt: (attempt: QuizAttempt) => {
    attemptHistory.push(attempt);
  },

  getAttempts: (): QuizAttempt[] => {
    return [...attemptHistory].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  },

  clearAll: () => {
    quizHistory.length = 0;
    attemptHistory.length = 0;
  }
};

// File parsing utilities
export const parseFile = async (file: File): Promise<Question[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv' || extension === 'tsv') {
    return parseCSV(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file format. Please upload CSV, TSV, XLSX, or XLS files.');
  }
};

const parseCSV = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const questions = processRawData(results.data as any[]);
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

const parseExcel = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const questions = processRawData(jsonData as any[]);
        resolve(questions);
      } catch (error) {
        reject(new Error(`Excel parsing error: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

const processRawData = (data: any[]): Question[] => {
  if (data.length === 0) {
    throw new Error('File is empty');
  }

  const questions: Question[] = [];

  // Debug: log the first row to see column names
  if (data.length > 0) {
    console.log('First row columns:', Object.keys(data[0]));
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Flexible column name mapping (case-insensitive)
    const question = findValue(row, ['question', 'Question', 'QUESTION', 'q', 'Q']);
    const correctAnswer = findValue(row, ['correctAnswer', 'correctanswer', 'correct_answer', 'answer', 'correct', 'CorrectAnswer', 'Answer', 'CORRECTANSWER']);
    const explanation = findValue(row, ['explanation', 'Explanation', 'EXPLANATION', 'exp', 'Exp']) || 'No explanation provided';
    
    // Parse options - support various formats
    let options: string[] = [];
    
    // Try to find option columns
    const option1 = findValue(row, ['option1', 'Option1', 'OPTION1', 'a', 'A', 'options1']);
    const option2 = findValue(row, ['option2', 'Option2', 'OPTION2', 'b', 'B', 'options2']);
    const option3 = findValue(row, ['option3', 'Option3', 'OPTION3', 'c', 'C', 'options3']);
    const option4 = findValue(row, ['option4', 'Option4', 'OPTION4', 'd', 'D', 'options4']);
    
    if (option1) options.push(option1);
    if (option2) options.push(option2);
    if (option3) options.push(option3);
    if (option4) options.push(option4);
    
    // If options field exists as a comma-separated string
    const optionsString = findValue(row, ['options', 'Options', 'OPTIONS']);
    if (optionsString && options.length === 0) {
      options = optionsString.split(',').map((opt: string) => opt.trim()).filter(Boolean);
    }

    if (!question || !correctAnswer || options.length < 2) {
      console.warn(`Skipping row ${i + 1}: incomplete data. Question: ${!!question}, Answer: ${!!correctAnswer}, Options: ${options.length}`);
      console.warn('Row data:', row);
      continue;
    }

    questions.push({
      question,
      options,
      correctAnswer,
      explanation
    });
  }

  if (questions.length === 0) {
    const sampleRow = data[0] || {};
    const availableColumns = Object.keys(sampleRow).join(', ');
    throw new Error(`No valid questions found in file. Available columns: ${availableColumns}. Please ensure your file has columns: question, option1, option2, option3, option4, correctAnswer, explanation`);
  }

  return questions;
};

const findValue = (obj: any, keys: string[]): string => {
  // First try exact match
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return String(obj[key]).trim();
    }
  }
  
  // If no exact match, try case-insensitive match
  const objKeys = Object.keys(obj);
  for (const searchKey of keys) {
    const found = objKeys.find(k => k.toLowerCase() === searchKey.toLowerCase());
    if (found && obj[found] !== undefined && obj[found] !== null && obj[found] !== '') {
      return String(obj[found]).trim();
    }
  }
  
  return '';
};

export const generateQuizId = (): string => {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCorrectAnswerIndex = (key: number): string => {
  const map = new Map<number, string>([
    [0, "A"],
    [1, "B"],
    [2, "C"],
    [3, "D"]
  ]);

  return map.get(key) ?? "";
};