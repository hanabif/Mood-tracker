import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { removeTokens } from '../services/token';

const sections = [
  { to: '/dashboard', label: 'Home', icon: '🏠', end: true },
  { to: '/dashboard/calendar', label: 'Mood calendar', icon: '📅' },
  { to: '/dashboard/insights', label: 'Weekly insights', icon: '✨' },
  { to: '/dashboard/trends', label: 'Mood & sleep trends', icon: '📈' },
  { to: '/history', label: 'Mood history', icon: '📖' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export const DashboardLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    removeTokens();
    queryClient.removeQueries({ queryKey: ['user'] });
    navigate('/login');
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="z-20 border-b border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-gray-700/60 dark:bg-[#222231]/90 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:px-4 md:py-6 md:shadow-none">
        <div className="flex items-center justify-between md:block">
          <NavLink to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-purple-700 dark:text-purple-300">
            <span className="text-2xl">🌸</span> MoodTracker
          </NavLink>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-xl bg-purple-50 px-3 py-2 text-sm text-purple-700 dark:bg-gray-800 dark:text-purple-300"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={handleLogout} className="rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Log out</button>
          </div>
        </div>

        <div className="mt-5 hidden rounded-2xl bg-purple-50/80 p-3 dark:bg-purple-900/20 md:block">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-purple-700 dark:text-purple-300">{user?.name || user?.username}</p>
        </div>

        <nav aria-label="Dashboard sections" className="mt-4 flex gap-1 overflow-x-auto pb-1 md:mt-7 md:flex-col md:gap-1.5 md:overflow-visible md:pb-0">
          {sections.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200' : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-purple-300'}`}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-gray-100 pt-4 dark:border-gray-700/60 md:block">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:bg-purple-50 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <span>↪</span> Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-7">
        <Outlet />
      </main>
    </div>
  );
};
