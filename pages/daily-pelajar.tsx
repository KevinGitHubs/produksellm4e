// pages/daily-pelajar.tsx
import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useRouter } from 'next/router';
import { BENDA_PELAJAR } from '../lib/bendaPelajar';
import { motion } from 'framer-motion';

const LABEL_MAP: Record<string, string> = {
  pensil: 'pencil',
  penggaris: 'scissors',
  penghapus: 'eraser',
  buku: 'book',
  'botol air': 'bottle',
  tas: 'backpack',
  'kipas angin': 'fan',
};

export default function DailyPelajar() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [benda, setBenda] = useState({ nama: '', emoji: '', coco: '' });
  const [status, setStatus] = useState<'mencari' | 'ketemu' | 'gagal' | 'selesai'>('mencari');
  const [koin, setKoin] = useState(0);
  const [model, setModel] = useState<cocoSsd.ObjectDetection>();

  useEffect(() => {
    fetchBenda();
    loadModel();
    return () => stopCam();
  }, []);

  const fetchBenda = async () => {
    const res = await axios.get('/api/daily/item-pelajar');
    setBenda(res.data);
  };

  const loadModel = async () => {
    const net = await cocoSsd.load({ base: 'mobilenet_v2' });
    setModel(net);
    detectLoop(net);
  };

  const detectLoop = async (net: cocoSsd.ObjectDetection) => {
    if (status !== 'mencari') return;
    const video = webcamRef.current?.video; // ✅ ambil elemen <video>
    if (!video) return requestAnimationFrame(() => detectLoop(net));

    const predictions = await net.detect(video); // ✅ pakai video
    const found = predictions.some(p => p.class.toLowerCase() === benda.coco.toLowerCase() && p.score > 0.65);
    const fake = predictions.some(p => p.class.toLowerCase() === 'cell phone' && p.score > 0.7);

    if (fake) {
      setStatus('gagal');
      setTimeout(() => setStatus('mencari'), 1500);
      return;
    }
    if (found) {
      setStatus('ketemu');
      await kirimMenang();
      setStatus('selesai');
      return;
    }
    requestAnimationFrame(() => detectLoop(net));
  };

  const kirimMenang = async () => {
    const res = await axios.post('/api/daily/menang-pelajar', {}, { headers: { uid: localStorage.getItem('uid') } });
    setKoin(res.data.coin);
    setTimeout(() => { router.push('/'); }, 1800);
  };

  const stopCam = () => {
    const stream = webcamRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
  };

  if (status === 'selesai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur rounded-xl p-8 text-center text-white"
        >
          <div className="text-3xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Benda ditemukan!</h2>
          <p className="mb-4">Kamu juara ke-1 → +{koin} M4E</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Cari Benda Pelajar - Live Scan</h1>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
          <div className="text-5xl mb-2">{benda.emoji}</div>
          <div className="text-xl font-semibold mb-4">Arahkan kamera ke: <span className="text-yellow-300">{benda.nama}</span></div>
          <div className="relative">
            <Webcam ref={webcamRef} autoPlay playsInline muted className="rounded-lg w-full" />
            {status === 'ketemu' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
              >
                <div className="text-3xl">✅ Ketemu!</div>
              </motion.div>
            )}
            {status === 'gagal' && (
              <motion.div
                animate={{ x: [-6, 6, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center bg-red-500/50 rounded-lg"
              >
                <div className="text-2xl">❌ Layar HP terdeteksi</div>
              </motion.div>
            )}
          </div>
          <p className="text-sm opacity-80 mt-4">Deteksi berlangsung otomatis. Pastikan benda asli, bukan layar.</p>
        </div>
      </div>
    </div>
  );
}
