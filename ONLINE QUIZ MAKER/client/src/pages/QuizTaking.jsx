import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ArrowRight, Save } from 'lucide-react';

const QuizTaking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } (questionIndex: optionIndex)
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${id}`);
                setQuiz(res.data);
            } catch (error) {
                toast.error("Could not load quiz");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, navigate]);

    const handleSelectOption = (optionIndex) => {
        setAnswers({ ...answers, [currentStep]: optionIndex });
    };

    const nextQuestion = () => {
        if (currentStep < quiz.questions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const submitQuiz = async () => {
        // Construct answer array based on index
        const answerArray = quiz.questions.map((_, i) => answers[i] ?? -1);
        
        try {
            const res = await api.post(`/quizzes/${id}/submit`, {
                answers: answerArray
            });
            setResult(res.data);
            toast.success("Quiz Submitted!");
        } catch (error) {
            toast.error("Submission failed");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!quiz) return <div>Quiz not found</div>;

    // Result View
    if (result) {
        return (
            <div className="container mx-auto px-4 py-10 flex justify-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Completed!</h2>
                    
                    <div className="text-6xl font-extrabold text-indigo-600 mb-4">
                        {result.score} / {result.totalQuestions}
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-8">
                        {result.score === result.totalQuestions 
                            ? "Perfect Score! You are a genius! 🎉" 
                            : result.score > result.totalQuestions / 2 
                                ? "Great job! Keep learning. 👍" 
                                : "Better luck next time. Don't give up! 💪"}
                    </p>
                    
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Taking View
    const currentQuestion = quiz.questions[currentStep];
    const isLastQuestion = currentStep === quiz.questions.length - 1;
    const progress = ((currentStep + 1) / quiz.questions.length) * 100;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[400px] flex flex-col">
                <div className="mb-6">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Question {currentStep + 1} of {quiz.questions.length}</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentQuestion.questionText}</h2>
                </div>

                <div className="space-y-4 flex-grow">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentStep] === index;
                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectOption(index)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                                    isSelected 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800' 
                                        : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                                }`}
                            >
                                <span className="font-medium text-lg">{option}</span>
                                {isSelected && <CheckCircle size={24} className="text-indigo-600" />}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-end">
                    {isLastQuestion ? (
                         <button
                         onClick={submitQuiz}
                         disabled={answers[currentStep] === undefined} // Force answer? Maybe optional
                         className={`flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition ${answers[currentStep] === undefined ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                         <Save size={20} /> Submit Quiz
                     </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={answers[currentStep] === undefined}
                            className={`flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition ${answers[currentStep] === undefined ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizTaking;
