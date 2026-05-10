import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../services/api';
import { setAccessToken, setRefreshToken } from '../services/token';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login/', data);
      setAccessToken(response.access);
      setRefreshToken(response.refresh);
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: 'Invalid username or password' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="pastel-card p-8 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🌈</div>
          <h1 className="text-2xl font-bold text-purple-700">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to track your mood</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="your username" className="mt-1" {...register('username')} />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1" {...register('password')} />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
          )}

          <Button type="submit" className="w-full btn-hover mt-2">
            Login 🚀
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:text-purple-800 transition-colors underline underline-offset-2 cursor-pointer"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
