import React, { useState, useEffect } from 'react';
import { Question, MOCK_IMAGES } from '../types';
import { AnalogClock } from './AnalogClock';
import { Clock, SkipForward, SkipBack, ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';

interface StudentExamProps {
  questions: Question[];
  timerDuration: number; // in seconds per question effectively, or total. Requirement says "Timer... as 30s, 60s" usually implies per question or total exam. Let's do total countdown based on standard exam practices or per question if specified. Requirement: "Question timer should increase to 2 min for each if required". Let's implement a global timer for simplicity or per question. Let's do a total timer based on (questions * duration).
  onSubmit: (answers: Record<string, number>) => void;
}

export const StudentExam: React.FC<StudentExamProps> = ({ questions, timerDuration, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(questions.length * timerDuration); // Total time
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answers, onSubmit]);

  const handleOptionSelect = (optionIndex: number) => {
    const currentQ = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      {/* Watermark */}
      <div className="watermark pointer-events-none select-none text-gray-300 font-bold text-6xl opacity-20 transform -rotate-45 fixed inset-0 flex items-center justify-center z-0">
        SCIENCE TUTOR ( SPR SIR )
      </div>

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <img src={MOCK_IMAGES.TEACHING_LOGO} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
            <h1 className="text-xl font-bold hidden md:block">Online Examination</h1>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200 uppercase">Time Remaining</span>
                <span className="text-xl font-mono font-bold text-yellow-400">{formatTime(timeLeft)}</span>
            </div>
            <div className="hidden md:block">
                <AnalogClock />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 z-10 flex justify-center items-start pt-10">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-100">
            
            {/* Question Header */}
            <div className="bg-blue-50 p-6 border-b border-blue-100 flex justify-between items-center">
                <span className="text-blue-800 font-bold text-lg">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {answers[currentQuestion.id] !== undefined ? 'Answered' : 'Not Answered'}
                </span>
            </div>

            {/* Question Body */}
            <div className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h2>

                {currentQuestion.imageUrl && (
                    <div className="mb-6">
                        <img src={currentQuestion.imageUrl} alt="Question Reference" className="max-h-64 rounded-lg shadow-md object-contain border" />
                    </div>
                )}

                <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full text-left p-5 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 text-xl
                                ${answers[currentQuestion.id] === idx 
                                    ? 'border-blue-600 bg-blue-50 shadow-inner' 
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                                ${answers[currentQuestion.id] === idx ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-300'}`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={`${answers[currentQuestion.id] === idx ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}>
                                {option}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 p-6 flex flex-wrap gap-4 justify-between items-center border-t border-gray-200">
                <div className="flex gap-2">
                     <button 
                        onClick={() => setCurrentQuestionIndex(0)}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <SkipBack size={16} /> First
                    </button>
                    <button 
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>
                </div>

                <div className="flex gap-2">
                    {currentQuestionIndex < questions.length - 1 ? (
                         <>
                            <button 
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                className="flex items-center gap-1 px-6 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-md"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                             <button 
                                onClick={() => setCurrentQuestionIndex(questions.length - 1)}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Last <SkipForward size={16} />
                            </button>
                         </>
                    ) : (
                        <button 
                            onClick={() => onSubmit(answers)}
                            className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-green-600 rounded hover:bg-green-700 shadow-lg transform hover:scale-105 transition-transform"
                        >
                            <CheckCircle size={20} /> Submit Exam
                        </button>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};