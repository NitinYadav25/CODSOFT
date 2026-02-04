import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quizzes');
                setQuizzes(res.data);
            } catch (error) {
                toast.error('Failed to load quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return <div className="text-center mt-20">Loading quizzes...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Quizzes</h1>
            
            {quizzes.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-xl">No quizzes available yet.</p>
                    <Link to="/create-quiz" className="text-indigo-600 font-semibold mt-2 inline-block">Create the first one!</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col">
                            <div className="p-6 flex-grow">
                                <h2 className="text-xl font-bold text-indigo-700 mb-2">{quiz.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                                <div className="flex items-center text-xs text-gray-400 gap-4 mt-auto">
                                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(quiz.createdAt).toLocaleDateString()}</span>
                                    <span>By {quiz.creator?.username || 'Unknown'}</span>
                                    <span>{quiz.questions?.length || 0} Questions</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4">
                                <Link 
                                    to={`/quiz/${quiz._id}`}
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
                                >
                                    <PlayCircle size={18} />
                                    Take Quiz
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
