import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [coin, setCoin] = useState(0);
  const [benda, setBenda] = useState({ nama: '', emoji: '', coco: '' });

  useEffect(() => {
    if (!localStorage.getItem('uid')) router.push('/');
    fetchCoin();
    fetchBenda();
  }, []);

  const fetchCoin = async () => {
    const id = localStorage.getItem('uid');
    const res = await axios.get('/api/user/coin', { headers: { uid: id } });
    setCoin(res.data.coin);
  };

  const fetchBenda = async () => {
    const res = await axios.get('/api/daily/item-pelajar');
    setBenda(res.data);
  };

  const logout = () => {
    localStorage.removeItem('uid');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img src="/m4e.png" alt="M4E" className="w-10 h-10" />
            <div>
              <div className="text-sm">M4E Koin</div>
              <div className="font-bold text-xl">{coin.toLocaleString()}</div>
            </div>
          </div>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400">Keluar</button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
          <div className="text-6xl mb-2">{benda.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">Cari Benda Hari Ini</h2>
          <p className="text-lg mb-4"><span className="text-yellow-300 font-semibold">{benda.nama}</span></p>
          <button onClick={() => window.location.href = '/daily-pelajar'} className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300">
            Buka Kamera
          </button>
        </div>

        {coin >= 10000 && (
          <div className="mt-6 bg-green-500/20 border border-green-400 rounded-xl p-4 text-center">
            <p className="mb-2">Kamu punya ≥ 10.000 M4E!</p>
            <button onClick={async () => {
              await axios.post('/api/redeem', {}, { headers: { uid: localStorage.getItem('uid') } });
              alert('Penukaran berhasil! Cek WhatsAppmu.');
              window.location.reload();
            }} className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-400">
              Tukar 10.000 → Rp 10.000 Dana
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
