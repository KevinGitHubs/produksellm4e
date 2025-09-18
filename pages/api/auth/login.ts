import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password } = req.body;
  const user = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
  if (user.rows.length === 0) return res.status(401).json({ message: 'Username atau password salah' });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ message: 'Username atau password salah' });

  res.json({ token: username, id: user.rows[0].id });
}
