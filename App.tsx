import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Download, Plus, Trash, Edit, RefreshCw, LogIn, User, Brain, ArrowLeft, Image as ImageIcon, Printer, Save, Home, Share2, Link as LinkIcon } from 'lucide-react';
import { Question, StudentResult, AppView, MOCK_IMAGES } from './types';
import { parseQuestionsFromText } from './services/geminiService';
import { StudentExam } from './components/StudentExam';

// --- Components defined inline for single-file structure (except StudentExam/AnalogClock which were complex) ---

const StudentDetailsForm = ({ onSubmit, onBack }: { onSubmit: (details: Partial<StudentResult>) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    rollNumber: '',
    village: '',
    mobileNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobileNumber) {
        alert("Mobile Number is compulsory!");
        return;
    }
    if (!formData.name) {
        alert("Student Name is compulsory!");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-600 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center mt-6">Final Submission</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Please provide your details to view your results.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name <span className="text-red-500">*</span></label>
            <input required type="text" placeholder="Enter Full Name" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">School Name</label>
            <input required type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input required type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Village</label>
            <input required type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
            <input required type="tel" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4 flex justify-center items-center gap-2">
            <Save size={18} /> Submit & View Result
          </button>
        </form>
      </div>
    </div>
  );
};

const ResultView = ({ result, questions, onBack, backLabel = "Back" }: { result: StudentResult, questions: Question[], onBack: () => void, backLabel?: string }) => {
    
    useEffect(() => {
        // Simulate sending email
        console.log(`Sending email report to sp2dada123@gmail.com for student ${result.rollNumber}`);
    }, [result]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-visible print:shadow-none print:w-full print:max-w-none">
                 <div className="bg-blue-900 text-white p-6 flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-black print:p-0 print:mb-4">
                    <div className="flex items-center gap-4">
                        <img src={MOCK_IMAGES.TEACHING_LOGO} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white print:hidden" />
                        <div>
                            <h1 className="text-2xl font-bold uppercase">Science Tutor (SPR SIR)</h1>
                            <p className="text-blue-200 print:text-gray-600">Student Performance Report</p>
                        </div>
                    </div>
                    <div className="flex gap-2 no-print">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-blue-50 transition shadow-sm">
                            <Printer size={18} /> Print / Download
                        </button>
                        <button onClick={onBack} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition shadow-sm">
                             <ArrowLeft size={18} /> {backLabel}
                        </button>
                    </div>
                 </div>

                 <div className="p-8 print:p-0 print:mt-4">
                    <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 print:border-none print:bg-white print:p-0">
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Student Name</p>
                            <p className="font-bold text-lg text-blue-900 capitalize">{result.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">School Name</p>
                            <p className="font-bold text-lg">{result.school}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Roll Number</p>
                            <p className="font-bold text-lg">{result.rollNumber}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Village</p>
                            <p className="font-bold text-lg">{result.village}</p>
                        </div>
                        <div className="col-span-2 border-t pt-4 mt-2 flex justify-between items-center print:border-black">
                            <div>
                                <p className="text-sm text-gray-500">Mobile</p>
                                <p className="font-medium">{result.mobileNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Score</p>
                                <p className="text-4xl font-bold text-blue-600">{result.score} <span className="text-xl text-gray-400">/ {result.totalQuestions}</span></p>
                            </div>
                        </div>
                        <div className="col-span-2 text-right">
                            <p className="text-xs text-gray-400">Date: {new Date(result.date).toLocaleString()}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 border-b pb-2 print:break-before-auto">Detailed Analysis</h3>
                    <div className="space-y-4">
                        {questions.map((q, idx) => {
                            const userAnswer = result.answers[q.id];
                            const isCorrect = userAnswer === q.correctAnswer;
                            const isSkipped = userAnswer === undefined;
                            
                            return (
                                <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : isSkipped ? 'border-yellow-500 bg-yellow-50' : 'border-red-500 bg-red-50'} print:break-inside-avoid print:bg-white print:border-gray-300 print:border print:mb-2`}>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-gray-700">{idx + 1}.</span>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className={`px-2 py-1 rounded flex items-center gap-2
                                                        ${i === q.correctAnswer ? 'bg-green-200 text-green-900 font-bold print:font-bold print:underline' : ''}
                                                        ${i === userAnswer && i !== q.correctAnswer ? 'bg-red-200 text-red-900 line-through' : ''}
                                                        ${i !== userAnswer && i !== q.correctAnswer ? 'text-gray-600' : ''}
                                                    `}>
                                                        {i === userAnswer && i === q.correctAnswer && <CheckCircleIcon size={14} className="text-green-700"/>}
                                                        <span className="w-5 h-5 border rounded-full flex items-center justify-center text-xs border-gray-400">{String.fromCharCode(65+i)}</span>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                            {isSkipped && <p className="text-xs text-yellow-600 mt-2 italic">Skipped</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 </div>
            </div>
        </div>
    );
};

const CheckCircleIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
)


// --- Main App Component ---

const AppWithAuth = () => {
    const [view, setView] = useState<AppView>(AppView.LANDING);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [results, setResults] = useState<StudentResult[]>([]);
    const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);
    const [timerPerQuestion, setTimerPerQuestion] = useState(60); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // Moderator State
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [rawAiText, setRawAiText] = useState("");
    const [modPassword, setModPassword] = useState("");
    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
        text: '', options: ['', '', '', ''], correctAnswer: 0, imageUrl: ''
    });
    
    // Student State
    const [tempExamAnswers, setTempExamAnswers] = useState<Record<string, number>>({});
  
    // Persistence & Init
    useEffect(() => {
        // Load data
        const savedQuestions = localStorage.getItem('questions');
        if (savedQuestions) {
            try { setQuestions(JSON.parse(savedQuestions)); } catch (e) { console.error("Error loading questions", e); }
        }
        
        const savedResults = localStorage.getItem('results');
        if (savedResults) {
            try { setResults(JSON.parse(savedResults)); } catch (e) { console.error("Error loading results", e); }
        }

        const savedTimer = localStorage.getItem('timerPerQuestion');
        if (savedTimer) setTimerPerQuestion(Number(savedTimer));

        // Check for share link (simple mode switch based on URL hash or query)
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'student') {
            setView(AppView.STUDENT_INTRO);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('questions', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('results', JSON.stringify(results));
    }, [results]);

    useEffect(() => {
        localStorage.setItem('timerPerQuestion', String(timerPerQuestion));
    }, [timerPerQuestion]);

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (modPassword === '1982') {
        setIsLoggedIn(true);
        setView(AppView.MODERATOR);
        setModPassword('');
      } else {
        alert("Invalid Password");
      }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView(AppView.LANDING);
    }

    const handleAiParse = async () => {
        if (!rawAiText) return;
        setIsAiLoading(true);
        try {
            const parsedQuestions = await parseQuestionsFromText(rawAiText);
            setQuestions([...questions, ...parsedQuestions]);
            setRawAiText("");
        } catch (e) {
            alert("Failed to parse questions using AI. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };
  
    const handleManualAdd = () => {
        if (!newQuestion.text || newQuestion.options?.some(o => !o)) {
            alert("Please fill all fields");
            return;
        }
        const q: Question = {
            id: uuidv4(),
            text: newQuestion.text!,
            options: newQuestion.options as string[],
            correctAnswer: newQuestion.correctAnswer!,
            imageUrl: newQuestion.imageUrl
        };
        setQuestions([...questions, q]);
        setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0, imageUrl: '' });
    };
  
    const handleDeleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };
  
    const handleExamSubmit = (answers: Record<string, number>) => {
        setTempExamAnswers(answers);
        setView(AppView.STUDENT_FORM);
    };
  
    const handleStudentDetailsSubmit = (details: Partial<StudentResult>) => {
        let score = 0;
        questions.forEach(q => {
            if (tempExamAnswers[q.id] === q.correctAnswer) score++;
        });
  
        const result: StudentResult = {
            id: uuidv4(),
            name: details.name || "Student",
            studentName: details.name || "Student", // redundant but kept for type compat
            school: details.school || "",
            rollNumber: details.rollNumber || "",
            village: details.village || "",
            mobileNumber: details.mobileNumber || "",
            score,
            totalQuestions: questions.length,
            date: new Date().toISOString(),
            answers: tempExamAnswers
        };
  
        setResults([...results, result]);
        setCurrentResult(result);
        setView(AppView.STUDENT_RESULT);
    };

    const handleSaveQuestions = () => {
        localStorage.setItem('questions', JSON.stringify(questions));
        localStorage.setItem('timerPerQuestion', String(timerPerQuestion));
        alert("Exam Data Saved Successfully!\n\nQuestions and settings are now stored on this device. Students can now access the exam.");
    };

    const copyStudentLink = async () => {
        const url = `${window.location.origin}${window.location.pathname}?mode=student`;
        try {
            await navigator.clipboard.writeText(url);
            alert("Link copied! Share this link with students.\n\n" + url);
        } catch (err) {
            // Fallback if clipboard API fails
            prompt("Copy this link to share with students:", url);
        }
    };

    function renderLanding() {
        return (
            <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative" style={{ backgroundImage: `url(${MOCK_IMAGES.LANDING_BG})` }}>
              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
              <div className="z-10 bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full mx-4">
                <img src={MOCK_IMAGES.TEACHING_LOGO} alt="Logo" className="w-24 h-24 mx-auto rounded-full mb-6 border-4 border-blue-100" />
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Science Tutor</h1>
                <p className="text-gray-500 mb-8 font-medium">Online Examination Portal (SPR SIR)</p>
                
                <div className="space-y-4">
                    <button onClick={() => setView(AppView.STUDENT_INTRO)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        <User /> I am a Student
                    </button>
                    <button onClick={() => setView(AppView.LOGIN)} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-lg shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        <LogIn /> Moderator Login
                    </button>
                </div>
              </div>
            </div>
        );
    }

    function renderLogin() {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center" style={{ backgroundImage: `url(${MOCK_IMAGES.LANDING_BG})`, backgroundSize: 'cover' }}>
               <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full z-10 relative">
                  <button onClick={() => setView(AppView.LANDING)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"><ArrowLeft size={16}/> Back</button>
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Moderator Access</h2>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={modPassword}
                            onChange={(e) => setModPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 transition text-white p-3 rounded font-bold shadow-md">Access Dashboard</button>
                    </form>
                  </div>
               </div>
            </div>
        );
    }

    function renderModerator() {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
              <nav className="bg-white shadow p-4 sticky top-0 z-30 no-print">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView(AppView.LANDING)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-1 rounded hover:bg-gray-100 transition">
                            <Home size={20} /> Back / Home
                        </button>
                        <h1 className="text-xl font-bold text-blue-900 flex items-center gap-2 border-l pl-4 border-gray-300">
                            <Brain className="text-blue-600"/> Moderator Dashboard
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleLogout} className="text-red-600 font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded transition">
                            Logout <LogIn size={16} className="transform rotate-180"/>
                        </button>
                    </div>
                </div>
              </nav>

              <div className="hidden print-only text-center p-8 border-b-2 border-black mb-8">
                  <h1 className="text-3xl font-bold uppercase">Science Tutor (SPR SIR)</h1>
                  <p className="text-lg">Examination Question Paper</p>
                  <div className="flex justify-between mt-4 text-sm font-bold">
                      <span>Subject: Science</span>
                      <span>Total Marks: {questions.length}</span>
                      <span>Time: {Math.floor((questions.length * timerPerQuestion) / 60)} Mins</span>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Total Questions</h3>
                        <p className="text-3xl font-bold text-blue-600">{questions.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                         <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Results Collected</h3>
                        <p className="text-3xl font-bold text-green-600">{results.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                        <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Timer (Sec/Q)</h3>
                        <select 
                            value={timerPerQuestion} 
                            onChange={(e) => setTimerPerQuestion(Number(e.target.value))}
                            className="w-full p-1 border rounded font-bold text-gray-700 text-sm"
                        >
                            <option value={30}>30 Seconds</option>
                            <option value={60}>60 Seconds</option>
                            <option value={120}>2 Minutes</option>
                            <option value={300}>5 Minutes</option>
                        </select>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500 flex flex-col justify-center gap-2">
                        <button onClick={handleSaveQuestions} className="bg-purple-600 text-white text-sm font-bold py-1 px-2 rounded hover:bg-purple-700 flex items-center justify-center gap-1 transition">
                            <Save size={14}/> Save Questions
                        </button>
                        <button onClick={copyStudentLink} className="bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1 transition">
                            <LinkIcon size={14}/> Share Student Link
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm no-print">
                    <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2"><Brain /> AI Question Import</h2>
                    <p className="text-sm text-gray-600 mb-4">Paste your raw text (English or Bengali) below. The AI will automatically extract questions, options, and answers.</p>
                    <textarea 
                        className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-4 font-mono text-sm"
                        placeholder="Paste your questions here..."
                        value={rawAiText}
                        onChange={(e) => setRawAiText(e.target.value)}
                    ></textarea>
                    <button 
                        onClick={handleAiParse}
                        disabled={isAiLoading || !rawAiText}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isAiLoading ? <RefreshCw className="animate-spin"/> : <Brain />} 
                        {isAiLoading ? "AI Processing..." : "Generate Questions"}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 no-print">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Plus className="text-green-600"/> Add Question Manually</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Question Text (Eng/Ben)" 
                                className="w-full p-3 border rounded"
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                            />
                             <input 
                                type="text" 
                                placeholder="Image URL (Optional - from Google Images)" 
                                className="w-full p-3 border rounded text-sm text-gray-600"
                                value={newQuestion.imageUrl}
                                onChange={(e) => setNewQuestion({...newQuestion, imageUrl: e.target.value})}
                            />
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <ImageIcon size={14}/> Paste an image address here
                            </div>
                        </div>
                        <div className="space-y-4">
                            {newQuestion.options?.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="font-bold text-gray-400 w-6">{String.fromCharCode(65+idx)}</span>
                                    <input 
                                        type="text" 
                                        placeholder={`Option ${idx + 1}`} 
                                        className="w-full p-2 border rounded"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...(newQuestion.options || [])];
                                            newOpts[idx] = e.target.value;
                                            setNewQuestion({...newQuestion, options: newOpts});
                                        }}
                                    />
                                    <input 
                                        type="radio" 
                                        name="correct"
                                        checked={newQuestion.correctAnswer === idx}
                                        onChange={() => setNewQuestion({...newQuestion, correctAnswer: idx})}
                                    />
                                </div>
                            ))}
                            <button onClick={handleManualAdd} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Add to List</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-visible print:shadow-none print:border-none">
                    <div className="p-4 bg-gray-100 border-b flex justify-between items-center no-print">
                        <h2 className="font-bold text-gray-700">Question Bank ({questions.length})</h2>
                         <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm font-bold shadow-sm">
                            <Download size={16}/> Download Question Paper
                         </button>
                    </div>
                    {questions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No questions added yet.</div>
                    ) : (
                        <div className="divide-y print:divide-gray-400">
                            {questions.map((q, i) => (
                                <div key={q.id} className="p-6 hover:bg-gray-50 print:hover:bg-white print:break-inside-avoid print:p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-blue-900 text-lg print:text-black">Q{i+1}. {q.text}</span>
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:bg-red-50 p-2 rounded no-print">
                                            <Trash size={18}/>
                                        </button>
                                    </div>
                                    {q.imageUrl && <img src={q.imageUrl} alt="Q ref" className="h-32 mb-4 object-contain rounded border print:h-48 print:border-gray-400" />}
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                        {q.options.map((opt, idx) => (
                                            <div key={idx} className={`flex items-center gap-2 ${idx === q.correctAnswer ? 'text-green-700 font-bold print:text-black print:font-normal' : 'text-gray-600 print:text-black'}`}>
                                                <span className="text-xs border w-5 h-5 flex items-center justify-center rounded-full print:border-black">{String.fromCharCode(65+idx)}</span>
                                                {opt}
                                                <style>{`@media print { .text-green-700 { color: black !important; font-weight: normal !important; } }`}</style>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 <div className="bg-white rounded-xl shadow overflow-hidden no-print">
                    <div className="p-4 bg-gray-100 border-b">
                        <h2 className="font-bold text-gray-700">Student Reports</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Name / School</th>
                                    <th className="p-4">Roll</th>
                                    <th className="p-4">Mobile</th>
                                    <th className="p-4">Score</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {results.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="p-4">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium capitalize">{r.name} <br/><span className="text-xs text-gray-500">{r.school}</span></td>
                                        <td className="p-4">{r.rollNumber}</td>
                                        <td className="p-4">{r.mobileNumber}</td>
                                        <td className="p-4 font-bold text-blue-600">{r.score}/{r.totalQuestions}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => {setCurrentResult(r); setView(AppView.STUDENT_RESULT);}}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
              </div>
            </div>
        );
    }
    
    function renderStudentIntro() {
        return (
            <div className="min-h-screen bg-white flex flex-col">
               <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.STUDENT_INTRO})` }}>
                  <div className="w-full h-full bg-blue-900 bg-opacity-70 flex items-center justify-center">
                     <h1 className="text-4xl md:text-5xl font-bold text-white text-center shadow-black drop-shadow-lg">Ready for the Exam?</h1>
                  </div>
               </div>
               <div className="flex-grow flex flex-col items-center p-8 max-w-4xl mx-auto w-full">
                   <div className="bg-white border shadow-xl rounded-xl p-8 -mt-20 w-full relative">
                        <button onClick={() => setView(AppView.LANDING)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16}/> Back</button>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <img src={MOCK_IMAGES.TEACHING_LOGO} className="w-20 h-20 rounded-full border shadow-sm" alt="Teacher"/>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Science Tutor Exam Portal</h2>
                                <p className="text-gray-500">Instructor: SPR SIR</p>
                            </div>
                        </div>
        
                        <div className="space-y-4 mb-8 text-gray-700">
                            <h3 className="font-bold text-lg mb-2">Instructions:</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The exam contains <strong>{questions.length} questions</strong>.</li>
                                <li>Total time allocated: <strong>{Math.floor(questions.length * timerPerQuestion / 60)} minutes</strong>.</li>
                                <li>You can skip questions and return to them later.</li>
                                <li>Watermarked security is active.</li>
                                <li><strong>Note:</strong> You must enter your Name, Roll Number and Mobile Number after the exam to see your result.</li>
                            </ul>
                        </div>
        
                        {questions.length > 0 ? (
                            <button 
                                onClick={() => setView(AppView.STUDENT_EXAM)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg transition transform hover:scale-105"
                            >
                                Start Online Exam Now
                            </button>
                        ) : (
                            <div className="p-4 bg-yellow-100 text-yellow-800 rounded text-center">
                                No questions available at the moment. Please contact the moderator.
                            </div>
                        )}
                         <button onClick={() => setView(AppView.LANDING)} className="mt-4 text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center w-full">Cancel</button>
                   </div>
               </div>
            </div>
        );
    }
    
    return (
        <>
            {view === AppView.LANDING && renderLanding()}
            {view === AppView.LOGIN && renderLogin()}
            {view === AppView.MODERATOR && renderModerator()}
            {view === AppView.STUDENT_INTRO && renderStudentIntro()}
            {view === AppView.STUDENT_EXAM && <StudentExam questions={questions} timerDuration={timerPerQuestion} onSubmit={handleExamSubmit} />}
            {view === AppView.STUDENT_FORM && <StudentDetailsForm onSubmit={handleStudentDetailsSubmit} onBack={() => setView(AppView.STUDENT_INTRO)} />}
            {view === AppView.STUDENT_RESULT && currentResult && (
                <ResultView 
                    result={currentResult} 
                    questions={questions} 
                    onBack={() => setView(isLoggedIn ? AppView.MODERATOR : AppView.LANDING)}
                    backLabel={isLoggedIn ? "Back to Dashboard" : "Home"}
                />
            )}
        </>
    );
}

export default AppWithAuth;