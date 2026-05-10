import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register/', data);
      navigate('/login');
    } catch (error: any) {
      setError('root', { message: error.message || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="pastel-card p-8 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">✨</div>
          <h1 className="text-2xl font-bold text-purple-700">Join MoodTracker</h1>
          <p className="text-gray-500 text-sm mt-1">Start your emotional wellness journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" className="mt-1" {...register('name')} />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="johndoe123" className="mt-1" {...register('username')} />
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
            Register 🚀
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:text-purple-800 transition-colors underline underline-offset-2 cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
