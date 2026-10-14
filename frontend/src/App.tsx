import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { MoodHistory } from './pages/MoodHistory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';
import { Navbar } from './components/Navbar';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardSkeleton } from './components/DashboardSkeleton';

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <DashboardSkeleton />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<MoodHistory />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
