import { FEELINGS_OPTIONS } from '../utils/moodUtils';

interface FeelingsSelectorProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export const FeelingsSelector = ({ value, onChange }: FeelingsSelectorProps) => {
    const toggle = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {FEELINGS_OPTIONS.map((feeling) => {
                const isSelected = value.includes(feeling.id);
                return (
                    <button
                        key={feeling.id}
                        type="button"
                        onClick={() => toggle(feeling.id)}
                        className={`
              feeling-chip
              ${isSelected
                                ? 'bg-pastel-mint border-pastel-mint-dark text-green-700 shadow-sm animate-bounce-in'
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-pastel-mint-dark hover:bg-pastel-mint/40'}
            `}
                    >
                        <span>{feeling.emoji}</span>
                        <span>{feeling.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
