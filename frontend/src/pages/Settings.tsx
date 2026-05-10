import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../services/api';
import { getAccessToken } from '../services/token';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.any().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const Settings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const avatarFile = watch('avatar');

  if (avatarFile && avatarFile[0] instanceof File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(avatarFile[0]);
  }

  const onSubmit = async (data: SettingsFormData) => {
    setIsUpdating(true);
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.avatar && data.avatar[0] instanceof File) {
        formData.append('avatar', data.avatar[0]);
      }

      await api.patchForm('/auth/user/update/', formData);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      setSuccessMsg('Settings updated successfully! ✨');
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-sm">
      <div className="pastel-card p-6 animate-fade-in shadow-lg">
        <h1 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <span>⚙️</span> Settings
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-pastel-lavender overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-300">👤</span>
                )}
              </div>
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-md"
                title="Change Avatar"
              >
                📷
                <input id="avatar" type="file" className="hidden" {...register('avatar')} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-gray-400">Click icon to change avatar</p>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" className="mt-1" {...register('name')} />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {successMsg && (
            <p className="text-green-600 font-medium text-sm text-center bg-pastel-mint p-2 rounded-lg animate-bounce-in">
              {successMsg}
            </p>
          )}

          <Button type="submit" disabled={isUpdating} className="w-full btn-hover">
            {isUpdating ? 'Saving...' : 'Save Changes ✨'}
          </Button>
        </form>

        <hr className="my-8 border-gray-100 dark:border-gray-700/50" />

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span>📊</span> Data Export
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Download your entire mood history in your preferred format.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              className="border-pastel-mint-dark/50 text-green-700 dark:text-emerald-400 hover:bg-pastel-mint dark:hover:bg-emerald-900/20"
            >
              📥 Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('json')}
              className="border-pastel-blue-dark/50 text-blue-700 dark:text-blue-400 hover:bg-pastel-blue dark:hover:bg-blue-900/20"
            >
              📥 Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleExport = async (format: 'csv' | 'json') => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://moodtrace.onrender.com/api';
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/mood-entries/export_data/?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Export request failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mood_history.${format}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  }
};
