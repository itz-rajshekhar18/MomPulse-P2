'use client';

import { useAuth } from '@/contexts/AuthContext';
import { saveCycleData, getUserCycles } from '@/lib/firestore';
import { useState, useEffect } from 'react';

export default function TestFirestorePage() {
  const { user } = useAuth();
  const [result, setResult] = useState('');
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCycles();
  }, [user]);

  const loadCycles = async () => {
    if (!user) return;
    
    try {
      const userCycles = await getUserCycles(user.uid);
      setCycles(userCycles);
      setResult(`📊 Found ${userCycles.length} cycles in Firestore`);
    } catch (error: any) {
      setResult(`❌ Error loading cycles: ${error.message}`);
    }
  };

  const testSave = async () => {
    if (!user) {
      setResult('❌ No user logged in. Please log in first.');
      return;
    }

    setLoading(true);
    setResult('⏳ Saving cycle...');

    try {
      const today = new Date();
      const fiveDaysAgo = new Date(today);
      fiveDaysAgo.setDate(today.getDate() - 5);

      const cycleId = await saveCycleData(user.uid, {
        start_date: fiveDaysAgo.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        symptoms: ['Cramps', 'Headache', 'Fatigue'],
        flow_intensity: 'medium',
        notes: `Test cycle created at ${new Date().toLocaleString()}`
      });
      
      setResult(`✅ Success! Cycle saved with ID: ${cycleId}`);
      
      // Reload cycles
      await loadCycles();
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    if (user) {
      setResult(`✅ User authenticated\nUID: ${user.uid}\nEmail: ${user.email}`);
    } else {
      setResult('❌ No user logged in');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Firestore Cycle Logging Test</h1>
        <p className="text-gray-600 mb-8">Use this page to test if cycles are being saved to Firestore</p>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Tests</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={checkAuth}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              1. Check Authentication
            </button>
            <button
              onClick={testSave}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? '⏳ Saving...' : '2. Test Save Cycle'}
            </button>
            <button
              onClick={loadCycles}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              3. Load All Cycles
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 mb-6 font-mono text-sm">
            <h3 className="text-white font-bold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        {/* Cycles List */}
        {cycles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Saved Cycles ({cycles.length})</h2>
            <div className="space-y-4">
              {cycles.map((cycle, index) => (
                <div key={cycle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-600">Cycle #{cycles.length - index}</span>
                    <span className="text-xs text-gray-500">ID: {cycle.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Start:</span> {cycle.start_date}
                    </div>
                    <div>
                      <span className="text-gray-600">End:</span> {cycle.end_date}
                    </div>
                    <div>
                      <span className="text-gray-600">Flow:</span> {cycle.flow_intensity}
                    </div>
                    <div>
                      <span className="text-gray-600">Symptoms:</span> {cycle.symptoms?.length || 0}
                    </div>
                  </div>
                  {cycle.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Notes:</span> {cycle.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click "Check Authentication" to verify you're logged in</li>
            <li>Click "Test Save Cycle" to save a test cycle to Firestore</li>
            <li>Click "Load All Cycles" to see all saved cycles</li>
            <li>Check the result box for success/error messages</li>
            <li>If successful, go to Firebase Console → Firestore to verify data</li>
          </ol>
        </div>

        {/* Firebase Console Link */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-yellow-900 mb-2">🔍 Verify in Firebase Console:</h3>
          <p className="text-yellow-800 mb-2">
            After saving, check your Firebase Console:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" className="underline">Firebase Console</a></li>
            <li>Select your project</li>
            <li>Navigate to Firestore Database</li>
            <li>Look for: <code className="bg-yellow-100 px-1">users → [your-uid] → cycles</code></li>
            <li>You should see your saved cycle documents</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
