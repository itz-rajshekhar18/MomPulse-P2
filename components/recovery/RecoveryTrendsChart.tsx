'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getRecoveryLogs } from '@/lib/firestore';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartData {
  day: number;
  recoveryScore: number;
  sleep: number;
  pain: number;
  energy: number;
  mood: number;
  bleeding: number;
}

export default function RecoveryTrendsChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'recoveryScore' | 'sleep' | 'pain' | 'energy' | 'mood' | 'bleeding'>('recoveryScore');
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [trendValue, setTrendValue] = useState(0);

  const metrics = [
    { key: 'recoveryScore' as const, label: 'Recovery Score', color: 'bg-purple-500', max: 100 },
    { key: 'sleep' as const, label: 'Sleep (hrs)', color: 'bg-blue-500', max: 12 },
    { key: 'pain' as const, label: 'Pain Level', color: 'bg-red-500', max: 10, inverse: true },
    { key: 'energy' as const, label: 'Energy', color: 'bg-yellow-500', max: 10 },
    { key: 'mood' as const, label: 'Mood', color: 'bg-pink-500', max: 10 },
    { key: 'bleeding' as const, label: 'Bleeding', color: 'bg-rose-500', max: 5, inverse: true },
  ];

  useEffect(() => {
    const loadChartData = async () => {
      if (!user) return;

      try {
        const logs = await getRecoveryLogs(user.uid);
        
        const data: ChartData[] = logs.map(log => ({
          day: log.day,
          recoveryScore: log.recoveryScore,
          sleep: log.sleep,
          pain: log.pain,
          energy: log.energy,
          mood: log.mood,
          bleeding: log.bleeding,
        }));

        setChartData(data);

        // Calculate trend
        if (data.length >= 2) {
          const recent = data.slice(-3);
          const previous = data.slice(-6, -3);
          
          if (recent.length > 0 && previous.length > 0) {
            const recentAvg = recent.reduce((sum, d) => sum + d[selectedMetric], 0) / recent.length;
            const prevAvg = previous.reduce((sum, d) => sum + d[selectedMetric], 0) / previous.length;
            const diff = recentAvg - prevAvg;
            
            setTrendValue(Math.abs(diff));
            
            const currentMetric = metrics.find(m => m.key === selectedMetric);
            const isInverse = currentMetric?.inverse || false;
            
            if (Math.abs(diff) < 0.5) {
              setTrend('stable');
            } else if ((diff > 0 && !isInverse) || (diff < 0 && isInverse)) {
              setTrend('up');
            } else {
              setTrend('down');
            }
          }
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [user, selectedMetric]);

  const getBarHeight = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const currentMetric = metrics.find(m => m.key === selectedMetric)!;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recovery Trends</h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recovery Trends</h3>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-600 text-sm">
            Start logging daily to see your recovery trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recovery Trends</h3>
          <p className="text-sm text-gray-500 mt-1">{chartData.length} days logged</p>
        </div>
        
        {/* Trend Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          trend === 'up' ? 'bg-green-50 text-green-700' :
          trend === 'down' ? 'bg-red-50 text-red-700' :
          'bg-gray-50 text-gray-700'
        }`}>
          {trend === 'up' && <TrendingUp className="w-4 h-4" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4" />}
          {trend === 'stable' && <Minus className="w-4 h-4" />}
          <span className="text-sm font-semibold">
            {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedMetric === metric.key
                ? `${metric.color} text-white shadow-md`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>{currentMetric.max}</span>
          <span>{Math.round(currentMetric.max / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 pl-4 border-l border-b border-gray-200 relative">
          <div className="relative h-48 pb-2">
            {/* Line chart with SVG */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="0" y1="0" x2="100%" y2="0" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Line path */}
              {chartData.slice(-14).length > 1 && (
                <>
                  {/* Area fill */}
                  <path
                    d={(() => {
                      const points = chartData.slice(-14).map((data, index) => {
                        const x = (index / (chartData.slice(-14).length - 1)) * 100;
                        const y = 100 - getBarHeight(data[selectedMetric], currentMetric.max);
                        return `${x},${y}`;
                      });
                      return `M 0,100 L ${points.join(' L ')} L 100,100 Z`;
                    })()}
                    fill={currentMetric.color.replace('bg-', '')}
                    fillOpacity="0.1"
                  />
                  
                  {/* Line */}
                  <path
                    d={(() => {
                      const points = chartData.slice(-14).map((data, index) => {
                        const x = (index / (chartData.slice(-14).length - 1)) * 100;
                        const y = 100 - getBarHeight(data[selectedMetric], currentMetric.max);
                        return `${x}% ${y}%`;
                      });
                      return `M ${points.join(' L ')}`;
                    })()}
                    fill="none"
                    stroke={(() => {
                      const colorMap: Record<string, string> = {
                        'bg-purple-500': '#a855f7',
                        'bg-blue-500': '#3b82f6',
                        'bg-red-500': '#ef4444',
                        'bg-yellow-500': '#eab308',
                        'bg-pink-500': '#ec4899',
                        'bg-rose-500': '#f43f5e',
                      };
                      return colorMap[currentMetric.color] || '#a855f7';
                    })()}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>

            {/* Data points */}
            <div className="absolute inset-0 flex items-end justify-between">
              {chartData.slice(-14).map((data, index) => {
                const value = data[selectedMetric];
                const height = getBarHeight(value, currentMetric.max);
                
                return (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center group relative"
                    style={{ height: '100%' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10">
                      Day {data.day}: {value.toFixed(1)}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                    
                    {/* Data point dot */}
                    <div 
                      className="absolute"
                      style={{ bottom: `${height}%` }}
                    >
                      <div className={`w-3 h-3 ${currentMetric.color} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-150 transition-transform`}></div>
                    </div>
                    
                    {/* Day label */}
                    <span className="absolute -bottom-6 text-xs text-gray-400">
                      {data.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis label */}
        <div className="text-center text-xs text-gray-500 mt-8">
          Days Post-Delivery
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-xl p-3">
          <p className="text-xs text-purple-600 font-semibold mb-1">CURRENT</p>
          <p className="text-lg font-bold text-purple-900">
            {chartData[chartData.length - 1]?.[selectedMetric].toFixed(1)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-blue-600 font-semibold mb-1">AVERAGE</p>
          <p className="text-lg font-bold text-blue-900">
            {(chartData.reduce((sum, d) => sum + d[selectedMetric], 0) / chartData.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-green-600 font-semibold mb-1">BEST</p>
          <p className="text-lg font-bold text-green-900">
            {currentMetric.inverse
              ? Math.min(...chartData.map(d => d[selectedMetric])).toFixed(1)
              : Math.max(...chartData.map(d => d[selectedMetric])).toFixed(1)
            }
          </p>
        </div>
      </div>
    </div>
  );
}
