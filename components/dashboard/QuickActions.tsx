export default function QuickActions() {
  const actions = [
    {
      icon: '🤖',
      label: 'Ask AI',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: '📅',
      label: 'Book Pro',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: '📚',
      label: 'Library',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: '👥',
      label: 'Community',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`${action.bgColor} rounded-2xl p-6 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group`}
        >
          <div className="text-4xl">{action.icon}</div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
