// /pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch('/api/predictions');
        const data = await res.json();
        setPrediction(data);
      } catch (err) {
        console.error("❌ Failed to fetch prediction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center justify-center font-sans">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-400">
        🔮 Allora Real-Time BTC Price Forecast
      </h1>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Fetching latest prediction...</p>
      ) : prediction ? (
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 text-center">
          <div>
            <h2 className="text-lg text-gray-400 mb-1">Timestamp</h2>
            <p className="text-xl font-medium">{prediction.timestamp}</p>
          </div>
          <div>
            <h2 className="text-lg text-gray-400 mb-1">Asset</h2>
            <p className="text-2xl font-bold text-yellow-300">{prediction.asset}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm md:text-base">
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="text-gray-300 mb-1">Predicted</h3>
              <p className="text-green-400 font-semibold">${prediction.predicted}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="text-gray-300 mb-1">Actual</h3>
              <p className="text-red-400 font-semibold">${prediction.actual}</p>
            </div>
          </div>
          <div className="pt-4">
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p className="text-2xl font-bold text-purple-300">{prediction.accuracy}%</p>
          </div>
        </div>
      ) : (
        <p className="text-red-500">No prediction data found.</p>
      )}
    </main>
  );
}
