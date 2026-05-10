import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateMoodEntry } from '../hooks/useCreateMoodEntry';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Input } from './ui/Input';
import { EmojiMoodPicker } from './EmojiMoodPicker';
import { FeelingsSelector } from './FeelingsSelector';

const moodLogSchema = z.object({
  mood: z.number({ required_error: 'Please select a mood' }).min(1).max(5),
  feelings: z.array(z.string()).min(1, 'Please select at least one feeling'),
  reflection: z.string().optional(),
  sleep_hours: z.coerce.number().min(0).max(24),
});

type MoodLogFormData = z.infer<typeof moodLogSchema>;

interface MoodLogFormProps {
  onSuccess?: () => void;
}

export const MoodLogForm = ({ onSuccess }: MoodLogFormProps) => {
  const createMoodEntry = useCreateMoodEntry();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MoodLogFormData>({
    resolver: zodResolver(moodLogSchema),
    defaultValues: { feelings: [] },
  });

  const handleMoodChange = (value: number) => {
    setSelectedMood(value);
    setValue('mood', value, { shouldValidate: true });
  };

  const handleFeelingsChange = (values: string[]) => {
    setSelectedFeelings(values);
    setValue('feelings', values, { shouldValidate: true });
  };

  const onSubmit = (data: MoodLogFormData) => {
    createMoodEntry.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <div className="pastel-card p-6 animate-fade-in shadow-lg">
      <h2 className="text-xl font-semibold mb-5 text-purple-700 dark:text-purple-400">🌸 How are you feeling today?</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Mood Picker */}
        <div>
          <Label>Your mood</Label>
          <div className="mt-2">
            <EmojiMoodPicker value={selectedMood} onChange={handleMoodChange} />
          </div>
          {errors.mood && <p className="text-red-400 text-sm mt-1">{errors.mood.message}</p>}
        </div>

        {/* Feelings Selector */}
        <div>
          <Label>How does it feel?</Label>
          <div className="mt-2">
            <FeelingsSelector value={selectedFeelings} onChange={handleFeelingsChange} />
          </div>
          {errors.feelings && <p className="text-red-400 text-sm mt-1">{errors.feelings.message}</p>}
        </div>

        {/* Sleep Hours */}
        <div>
          <Label htmlFor="sleep_hours">😴 Sleep Hours</Label>
          <Input
            id="sleep_hours"
            type="number"
            step="0.5"
            placeholder="e.g. 7.5"
            className="mt-1"
            {...register('sleep_hours')}
          />
          {errors.sleep_hours && <p className="text-red-400 text-sm mt-1">{errors.sleep_hours.message}</p>}
        </div>

        {/* Reflection */}
        <div>
          <Label htmlFor="reflection">✏️ Reflection <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span></Label>
          <Textarea
            id="reflection"
            placeholder="Write a few thoughts about your day..."
            className="mt-1"
            {...register('reflection')}
          />
        </div>

        <Button
          type="submit"
          disabled={createMoodEntry.isPending}
          className="w-full btn-hover"
        >
          {createMoodEntry.isPending ? '⏳ Saving...' : '✨ Save Entry'}
        </Button>

        {createMoodEntry.isError && (
          <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
};
