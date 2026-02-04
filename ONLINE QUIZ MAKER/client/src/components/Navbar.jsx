import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <HomeIcon size={24} />
                    QuizMaker
                </Link>
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-200 transition">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                            <Link to="/create-quiz" className="flex items-center gap-1 hover:text-indigo-200 transition">
                                <PlusCircle size={20} />
                                Create Quiz
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-indigo-200 transition">
                                <LogOut size={20} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
                            <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
