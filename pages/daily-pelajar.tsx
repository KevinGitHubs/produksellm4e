import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useRouter } from 'next/router';
import { BENDA_PELAJAR } from '../lib/bendaPelajar';

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
  const [status, setStatus] = useState<'mencari' | 'ketemu' | 'selesai'>('mencari');
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
    if (!webcamRef.current) return requestAnimationFrame(() => detectLoop(net));
    const predictions = await net.detect(webcamRef.current);
    const found = predictions.some(p => p.class.toLowerCase() === benda.coco.toLowerCase() && p.score > 0.65);
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
    setTimeout(() => { window.location.href = '/'; }, 800);
  };

  const stopCam = () => {
    const stream = webcamRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
  };

  if (status === 'selesai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Benda ditemukan! 🎉</h2>
          <p className="mb-4">Kamu juara ke-{status === 'ketemu' ? 1 : 2} → +{koin} M4E</p>
        </div>
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <span className="text-2xl">✅ Ketemu!</span>
              </div>
            )}
          </div>
          <p className="text-sm opacity-80 mt-4">Deteksi berlangsung otomatis. Pastikan benda asli, bukan layar.</p>
        </div>
      </div>
    </div>
  );
}
