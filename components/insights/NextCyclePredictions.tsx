'use client';

import { motion } from 'framer-motion';

interface PredictionItemProps {
  label: string;
  date: string;
  icon: 'calendar' | 'heart' | 'star';
  color: 'gray' | 'green' | 'purple';
  delay?: number;
}

function PredictionItem({ label, date, icon, color, delay = 0 }: PredictionItemProps) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  const icons = {
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    heart: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    ),
    star: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-lg font-bold text-gray-900">{date}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          {icons[icon]}
        </div>
      </div>
    </motion.div>
  );
}

interface NextCyclePredictionsProps {
  prediction?: {
    ovulation_date: string;
    fertile_window_start: string;
    fertile_window_end: string;
  } | null;
}

export default function NextCyclePredictions({ prediction }: NextCyclePredictionsProps) {
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get best days to conceive (3 days around ovulation)
  const getBestDays = () => {
    if (!prediction) return 'Oct 12, 13, 14';
    
    const ovulation = new Date(prediction.ovulation_date);
    const dayBefore = new Date(ovulation);
    dayBefore.setDate(ovulation.getDate() - 1);
    const dayAfter = new Date(ovulation);
    dayAfter.setDate(ovulation.getDate() + 1);
    
    return `${formatDate(dayBefore.toISOString())}, ${formatDate(prediction.ovulation_date)}, ${formatDate(dayAfter.toISOString())}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Next Cycle Predictions</h3>

      <div className="space-y-3">
        <PredictionItem
          label="NEXT OVULATION DATE"
          date={prediction ? formatDate(prediction.ovulation_date) : "Oct 14th"}
          icon="calendar"
          color="gray"
          delay={0.5}
        />
        <PredictionItem
          label="NEXT FERTILE WINDOW"
          date={
            prediction 
              ? `${formatDate(prediction.fertile_window_start)} - ${formatDate(prediction.fertile_window_end)}`
              : "Oct 10 - 15"
          }
          icon="heart"
          color="green"
          delay={0.6}
        />
        <PredictionItem
          label="BEST DAYS TO CONCEIVE"
          date={getBestDays()}
          icon="star"
          color="purple"
          delay={0.7}
        />
      </div>
    </motion.div>
  );
}
