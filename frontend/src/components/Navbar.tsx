import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { removeTokens } from '../services/token';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeTokens();
    navigate('/login');
  };

  return (
    <nav className="bg-white/70 dark:bg-[#2A2A3B]/70 backdrop-blur-md shadow-sm border-b border-white dark:border-gray-700/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors">
            <span className="text-2xl">🌸</span>
            <span>MoodTracker</span>
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-pastel-lavender dark:bg-gray-700 text-purple-700 dark:text-purple-300 hover:scale-110 transition-transform"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user ? (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Hi, <span className="font-semibold text-purple-600 dark:text-purple-400">{user.name || user.username}</span> 👋
                </span>
                <Link
                  to="/history"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-pastel-lavender dark:hover:bg-gray-700"
                >
                  📖 History
                </Link>
                <Link
                  to="/settings"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-pastel-lavender dark:hover:bg-gray-700"
                >
                  ⚙️ Settings
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="btn-hover text-sm border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-pastel-lavender dark:hover:bg-gray-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-pastel-lavender dark:hover:bg-gray-700">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="text-sm btn-hover">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
