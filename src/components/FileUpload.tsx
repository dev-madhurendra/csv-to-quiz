import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseFile, storage, generateQuizId } from '../utils';
import { Quiz } from '../types';

interface FileUploadProps {
  onQuizCreated: (quiz: Quiz) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onQuizCreated }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const questions = await parseFile(file);
      
      const quiz: Quiz = {
        id: generateQuizId(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        questions,
        createdAt: new Date()
      };

      storage.saveQuiz(quiz);
      onQuizCreated(quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept=".csv,.xlsx,.xls,.tsv"
          onChange={handleFileInput}
          disabled={isProcessing}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file-input" className="upload-label">
          {isProcessing ? (
            <div className="processing">
              <div className="spinner"></div>
              <p>Processing {fileName}...</p>
            </div>
          ) : (
            <>
              <Upload size={48} strokeWidth={1.5} />
              <h2>Upload Your Quiz</h2>
              <p>Drag & drop or click to select</p>
              <span className="file-types">CSV, XLSX, XLS, TSV</span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="format-info">
        <FileText size={20} />
        <div>
          <h3>Required Columns</h3>
          <p>question, option1, option2, option3, option4, correctAnswer, explanation</p>
        </div>
      </div>
    </div>
  );
};
