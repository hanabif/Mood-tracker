interface SelfCareSuggestionsProps {
    mood: number;
}

const SUGGESTIONS: Record<number, { title: string; list: string[]; emoji: string }> = {
    1: {
        title: "You seem very low today. Be extra kind to yourself.",
        list: ["Reach out to a trusted friend", "Take a 5-minute deep breathing break", "Gentle stretching or a short walk", "Hydrate and have a small snack"],
        emoji: "🕯️"
    },
    2: {
        title: "Things seem a bit tough. Small steps help.",
        list: ["Listen to your favorite calming music", "step outside for fresh air", "Write down one thing you're proud of", "Limit screen time for an hour"],
        emoji: "🌱"
    },
    3: {
        title: "Stay steady. Every day is a new start.",
        list: ["Take a mindful coffee or tea break", "Organize one small area around you", "Call someone you haven't talked to in a while", "Read 10 pages of a book"],
        emoji: "✨"
    },
    4: {
        title: "Glad you're doing well! Keep the momentum.",
        list: ["Do something creative (draw, write, cook)", "Share your positive energy with someone", "Review your goals for the week", "Try a new healthy recipe"],
        emoji: "☀️"
    },
    5: {
        title: "Wonderful! You're thriving today.",
        list: ["Celebrate this feeling!", "Write a 'thank you' note to yourself", "Begin a project you've been excited about", "Help someone else feel good too"],
        emoji: "🌈"
    }
};

export const SelfCareSuggestions = ({ mood }: SelfCareSuggestionsProps) => {
    const suggestion = SUGGESTIONS[mood] || SUGGESTIONS[3];

    return (
        <div className="pastel-card p-5 animate-fade-in border-l-4 border-pastel-peach-dark dark:border-amber-600/50">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{suggestion.emoji}</span>
                <h3 className="font-bold text-gray-700 dark:text-gray-100">{suggestion.title}</h3>
            </div>
            <ul className="space-y-2">
                {suggestion.list.map((item, id) => (
                    <li key={id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-pastel-peach-dark dark:bg-amber-600/50" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};
