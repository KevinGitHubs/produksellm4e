import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const res = await axios.get('/api/admin/winners');
    setWinners(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin - Pemenang Harian</h1>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          {winners.length === 0 ? (
            <p>Belum ada pemenang hari ini.</p>
          ) : (
            <ol className="list-decimal list-inside space-y-2">
              {winners.map((w) => (
                <li key={w.username}>
                  {w.username} - Juara {w.rank_place} (+{w.coin} M4E)
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
