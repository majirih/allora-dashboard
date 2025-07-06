import { useEffect, useState } from 'react';

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [bestModel, setBestModel] = useState(null);

 useEffect(() => {
  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      setPredictions(data);

      const sorted = [...data].sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy));
      setBestModel(sorted[0]?.model);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  fetchPredictions(); // Initial fetch

  const interval = setInterval(fetchPredictions, 1000 * 60 * 5); // Every 5 minutes

  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Allora Model Leaderboard</h1>

      {predictions.length === 0 ? (
        <p className="text-center text-gray-400">Loading predictions...</p>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 shadow-lg border ${
                p.model === bestModel ? 'border-yellow-400 bg-yellow-900/20' : 'border-gray-700 bg-gray-800'
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {p.model} {p.model === bestModel && '🥇'}
              </h2>
              <p><span className="text-gray-400">Asset:</span> {p.asset}</p>
              <p><span className="text-gray-400">Predicted:</span> ${Number(p.predicted).toLocaleString()}</p>
              <p><span className="text-gray-400">Actual:</span> ${Number(p.actual).toLocaleString()}</p>
              <p><span className="text-gray-400">Accuracy:</span> <span className="font-bold">{p.accuracy}%</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
