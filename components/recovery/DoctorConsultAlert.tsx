'use client';

import { AlertTriangle } from 'lucide-react';

export default function DoctorConsultAlert() {
  const warnings = [
    'Fever over 100.4°F (38°C)',
    'Heavy bleeding (soaking a pad per hour)',
    'Severe abdominal pain or calf swelling',
    'Shortness of breath or chest pain',
    'Extreme sadness or anxiety'
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-red-200">
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">When to consult a doctor</h3>
      </div>
      
      <ul className="space-y-2 mb-6">
        {warnings.map((warning, index) => (
          <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="text-red-500 mt-0.5">•</span>
            <span>{warning}</span>
          </li>
        ))}
      </ul>

      <button className="w-full py-3 bg-white border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors">
        Emergency Contacts
      </button>
    </div>
  );
}
