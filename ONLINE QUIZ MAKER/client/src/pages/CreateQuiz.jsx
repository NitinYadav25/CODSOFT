import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!title) return toast.error("Title is required");
        for (let q of questions) {
            if (!q.questionText) return toast.error("All questions must have text");
            if (q.options.some(opt => !opt)) return toast.error("All options must be filled");
        }

        try {
            console.log("Submitting quiz:", { title, description, questions });
            const res = await api.post('/quizzes', {
                title,
                description,
                questions
            });
            console.log("Server response:", res.data);
            toast.success('Quiz Created Successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Quiz Creation Error:", error);
            const message = error.response?.data?.message || 'Failed to create quiz';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Quiz</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Quiz Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-600">Quiz Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., World Geography"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description of the quiz..."
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Question {qIndex + 1}</h3>
                                {questions.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter question text here"
                                    value={q.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`correct-${qIndex}`}
                                                checked={q.correctOptionIndex === oIndex}
                                                onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                className={`flex-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${q.correctOptionIndex === oIndex ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">* Select the radio button next to the correct answer.</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
                    >
                        <Plus size={20} /> Add Question
                    </button>
                    
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition"
                    >
                        <Save size={20} /> Publish Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
