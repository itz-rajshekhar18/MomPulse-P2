import { useState, useCallback } from 'react';

export interface PregnancyWellnessInput {
  week: number;
  energy: number;
  sleep: number;
  symptom_count: number;
  water_pct: number;
  diet_pct: number;
}

export interface PregnancyWellnessOutput {
  wellness_score: number;
  risk_level: string;
  risk_class: number;
  recommendations: string[];
  insights: {
    energy_status: string;
    sleep_status: string;
    hydration_status: string;
    diet_status: string;
    symptom_status: string;
  };
}

export function usePregnancyWellness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PregnancyWellnessOutput | null>(null);

  const predict = useCallback(async (input: PregnancyWellnessInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ml/pregnancy-wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const data: PregnancyWellnessOutput = await response.json();
      setPrediction(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Pregnancy wellness prediction error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPrediction(null);
    setError(null);
  }, []);

  return {
    predict,
    prediction,
    loading,
    error,
    reset,
  };
}
