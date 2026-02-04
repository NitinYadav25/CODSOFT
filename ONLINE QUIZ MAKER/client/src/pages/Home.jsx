import { Link } from 'react-router-dom';
import { BrainCircuit, CheckCircle, Smartphone } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="text-center max-w-3xl">
                <h1 className="text-5xl font-extrabold text-indigo-600 mb-6 drop-shadow-sm">
                    Master Your Knowledge with QuizMaker
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    Create engaging quizzes, challenge your friends, and track your progress along the way.
                </p>
                <div className="flex justify-center gap-4 mb-16">
                    <Link to="/dashboard" className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                        Start Quizzing
                    </Link>
                    <Link to="/create-quiz" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1">
                        Create a Quiz
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <BrainCircuit size={48} className="text-indigo-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Create & Share</h3>
                        <p className="text-gray-500">Easily build quizzes with our intuitive creator tool.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <CheckCircle size={48} className="text-green-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
                        <p className="text-gray-500">Get immediate scores and correct answers after every quiz.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                        <Smartphone size={48} className="text-purple-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                        <p className="text-gray-500">Take quizzes on the go, anytime, anywhere.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
