import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('uid', res.data.id);
      router.push('/dashboard');
    } catch (e: any) {
      setMsg(e.response?.data?.message || 'Gagal login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur rounded-xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Masuk M4E</h1>
        {msg && <p className="text-red-300 text-center mb-2">{msg}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300">Masuk</button>
        </form>
        <button onClick={() => router.push('/register')} className="w-full mt-4 bg-white/20 py-2 rounded-lg hover:bg-white/30">Daftar Baru</button>
      </div>
    </div>
  );
}
