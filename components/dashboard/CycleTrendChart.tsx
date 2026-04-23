'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface CycleData {
  id: string;
  start_date: string;
  end_date: string;
  symptoms: string[];
  flow_intensity: 'light' | 'medium' | 'heavy';
  notes: string;
}

interface CycleTrendChartProps {
  cycles: CycleData[];
}

export default function CycleTrendChart({ cycles }: CycleTrendChartProps) {
  // Process cycle data for visualization
  const chartData = useMemo(() => {
    if (!cycles || cycles.length === 0) return [];

    // Sort cycles by date
    const sortedCycles = [...cycles].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    // Get last 6 cycles
    const recentCycles = sortedCycles.slice(-6);

    return recentCycles.map((cycle, index) => {
      const startDate = new Date(cycle.start_date);
      const endDate = new Date(cycle.end_date);
      
      // Calculate cycle length (days from this cycle start to next cycle start)
      const nextCycle = sortedCycles[sortedCycles.indexOf(cycle) + 1];
      const cycleLength = nextCycle 
        ? Math.floor((new Date(nextCycle.start_date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      // Calculate period length
      const periodLength = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Flow intensity score
      const flowScore = cycle.flow_intensity === 'heavy' ? 3 : cycle.flow_intensity === 'medium' ? 2 : 1;
      
      // Symptom count
      const symptomCount = cycle.symptoms?.length || 0;

      return {
        month: startDate.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cycleLength: cycleLength,
        periodLength: periodLength,
        flowIntensity: flowScore,
        symptoms: symptomCount,
        date: startDate.getTime()
      };
    });
  }, [cycles]);

  // Calculate averages
  const averages = useMemo(() => {
    if (chartData.length === 0) return { cycleLength: 0, periodLength: 0 };
    
    const validCycleLengths = chartData.filter(d => d.cycleLength !== null).map(d => d.cycleLength!);
    const avgCycleLength = validCycleLengths.length > 0
      ? Math.round(validCycleLengths.reduce((sum, len) => sum + len, 0) / validCycleLengths.length)
      : 0;
    
    const avgPeriodLength = Math.round(
      chartData.reduce((sum, d) => sum + d.periodLength, 0) / chartData.length
    );

    return { cycleLength: avgCycleLength, periodLength: avgPeriodLength };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{data.fullDate}</p>
          {data.cycleLength && (
            <p className="text-sm text-purple-600">
              <span className="font-semibold">Cycle Length:</span> {data.cycleLength} days
            </p>
          )}
          <p className="text-sm text-pink-600">
            <span className="font-semibold">Period Length:</span> {data.periodLength} days
          </p>
          <p className="text-sm text-orange-600">
            <span className="font-semibold">Flow:</span> {data.flowIntensity === 3 ? 'Heavy' : data.flowIntensity === 2 ? 'Medium' : 'Light'}
          </p>
          <p className="text-sm text-teal-600">
            <span className="font-semibold">Symptoms:</span> {data.symptoms}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!cycles || cycles.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cycle Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Past 6 months cycle comparison</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium">No cycle data yet</p>
            <p className="text-sm mt-1">Log your cycles to see trends</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cycle Trend</h2>
          <p className="text-sm text-gray-500 mt-1">Past 6 months cycle comparison</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">Avg Cycle</p>
          <p className="text-2xl font-bold text-purple-900">{averages.cycleLength || 'N/A'}</p>
          <p className="text-xs text-purple-600 mt-1">days</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-4">
          <p className="text-xs text-pink-600 font-semibold uppercase tracking-wide mb-1">Avg Period</p>
          <p className="text-2xl font-bold text-pink-900">{averages.periodLength}</p>
          <p className="text-xs text-pink-600 mt-1">days</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">Total Cycles</p>
          <p className="text-2xl font-bold text-orange-900">{cycles.length}</p>
          <p className="text-xs text-orange-600 mt-1">logged</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4">
          <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-1">Regularity</p>
          <p className="text-2xl font-bold text-teal-900">
            {averages.cycleLength >= 26 && averages.cycleLength <= 32 ? '✓' : '~'}
          </p>
          <p className="text-xs text-teal-600 mt-1">
            {averages.cycleLength >= 26 && averages.cycleLength <= 32 ? 'Regular' : 'Variable'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCycle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#9ca3af' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="cycleLength"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#colorCycle)"
              name="Cycle Length"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="periodLength"
              stroke="#ec4899"
              strokeWidth={3}
              fill="url(#colorPeriod)"
              name="Period Length"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full mt-1"></div>
            <div>
              <p className="font-semibold text-gray-900">Cycle Length</p>
              <p className="text-gray-600 text-xs">Days from period start to next period start (typical: 21-35 days)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-pink-500 rounded-full mt-1"></div>
            <div>
              <p className="font-semibold text-gray-900">Period Length</p>
              <p className="text-gray-600 text-xs">Days of menstrual bleeding (typical: 3-7 days)</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
