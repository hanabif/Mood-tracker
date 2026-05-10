import { MOOD_OPTIONS } from '../utils/moodUtils';

interface EmojiMoodPickerProps {
    value: number | null;
    onChange: (value: number) => void;
}

export const EmojiMoodPicker = ({ value, onChange }: EmojiMoodPickerProps) => {
    return (
        <div className="flex justify-around items-center py-2">
            {MOOD_OPTIONS.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        title={option.label}
                        className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2
              transition-all duration-150 cursor-pointer select-none
              hover:scale-110
              ${isSelected
                                ? 'border-purple-300 bg-pastel-lavender shadow-md scale-110 animate-bounce-in'
                                : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-pastel-gray dark:hover:bg-gray-800'}
            `}
                    >
                        <span className="text-3xl leading-none">{option.emoji}</span>
                        <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
