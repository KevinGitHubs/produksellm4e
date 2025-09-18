// pages/dashboard.tsx  ← ini file dashboard saja
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [coin, setCoin] = useState(0);
  const [benda, setBenda] = useState({ nama: '', emoji: '', coco: '' });
  const [showRedeem, setShowRedeem] = useState(false);

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

  const handleRedeem = async () => {
    await axios.post('/api/redeem', {}, { headers: { uid: localStorage.getItem('uid') } });
    alert('Penukaran berhasil! Dana akan dikirim ke WhatsApp-mu.');
    fetchCoin();
    setShowRedeem(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3"
          >
            <img src="/favicon.ico" alt="M4E" className="w-10 h-10" />
            <div>
              <div className="text-sm">M4E Koin</div>
              <motion.div
                key={coin}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-bold text-xl"
              >
                {coin.toLocaleString()}
              </motion.div>
            </div>
          </motion.div>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400 transition"
          >
            Keluar
          </button>
        </div>

        {/* Card Benda Hari Ini */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="text-6xl mb-2"
          >
            {benda.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Cari Benda Hari Ini</h2>
          <p className="text-lg mb-4">
            Arahkan kamera ke: <span className="text-yellow-300 font-semibold">{benda.nama}</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/daily-pelajar')}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Buka Kamera
          </motion.button>
        </motion.div>

        {/* Redeem Section */}
        {coin >= 10000 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-green-500/20 border border-green-400 rounded-xl p-4 text-center"
          >
            <p className="mb-2">Kamu punya ≥ 10.000 M4E!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRedeem(true)}
              className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Tukar 10.000 → Rp 10.000 Dana
            </motion.button>
          </motion.div>
        )}

        {/* Modal Redeem */}
        <AnimatePresence>
          {showRedeem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/10 backdrop-blur rounded-xl p-6 max-w-sm w-full text-center"
              >
                <h3 className="text-xl font-bold mb-2">Konfirmasi Tukar</h3>
                <p className="mb-4">10.000 M4E → Rp 10.000 Dana</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRedeem}
                    className="flex-1 bg-green-500 py-2 rounded-lg hover:bg-green-400 transition"
                  >
                    Ya, Tukar
                  </button>
                  <button
                    onClick={() => setShowRedeem(false)}
                    className="flex-1 bg-white/20 py-2 rounded-lg hover:bg-white/30 transition"
                  >
                    Batal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
