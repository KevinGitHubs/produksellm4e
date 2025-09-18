import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', phone: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', form);
      router.push('/');
    } catch (e: any) {
      setMsg(e.response?.data?.message || 'Gagal daftar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur rounded-xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Daftar M4E</h1>
        {msg && <p className="text-red-300 text-center mb-2">{msg}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            placeholder="Nomor WA"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-400">Daftar</button>
        </form>
        <button onClick={() => router.push('/')} className="w-full mt-4 bg-white/20 py-2 rounded-lg hover:bg-white/30">Kembali</button>
      </div>
    </div>
  );
}
