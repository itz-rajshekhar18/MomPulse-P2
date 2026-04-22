import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCycles } from './firestore';

interface PredictionData {
  next_period_start: string;
  next_period_end: string;
  predicted_cycle_length: number;
  ovulation_date: string;
  fertile_window_start: string;
  fertile_window_end: string;
  avg_cycle_length: number;
  avg_period_duration: number;
  cycle_regularity: string;
  confidence: string;
  data_points: number;
  cycle_lengths?: number[];
  period_durations?: number[];
}

interface Insight {
  type: 'info' | 'warning' | 'success';
  text: string;
}

interface UsePeriodPredictionReturn {
  prediction: PredictionData | null;
  insights: Insight[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePeriodPrediction(): UsePeriodPredictionReturn {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get cycles from Firestore
      const cycles = await getUserCycles(user.uid);

      if (cycles.length === 0) {
        setPrediction(null);
        setInsights([]);
        setLoading(false);
        return;
      }

      // Format cycles for ML backend
      const formattedCycles = cycles.map(cycle => ({
        start_date: cycle.start_date,
        end_date: cycle.end_date,
        symptoms: cycle.symptoms,
        flow_intensity: cycle.flow_intensity,
        notes: cycle.notes,
      }));

      // Get prediction from ML backend
      const predictionResponse = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cycles: formattedCycles }),
      });

      if (!predictionResponse.ok) {
        throw new Error('Failed to get prediction');
      }

      const predictionData = await predictionResponse.json();
      setPrediction(predictionData);

      // Get insights from ML backend
      const insightsResponse = await fetch('/api/ml/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cycles: formattedCycles }),
      });

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [user]);

  return {
    prediction,
    insights,
    loading,
    error,
    refetch: fetchPrediction,
  };
}
