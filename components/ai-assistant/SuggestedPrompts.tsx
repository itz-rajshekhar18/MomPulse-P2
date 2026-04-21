interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function SuggestedPrompts({ prompts, onPromptClick }: SuggestedPromptsProps) {
  const colors = [
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-teal-100 text-teal-700 hover:bg-teal-200',
    'bg-purple-100 text-purple-700 hover:bg-purple-200',
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className={`${colors[index % colors.length]} px-4 py-2 rounded-full text-sm font-medium transition-colors`}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
