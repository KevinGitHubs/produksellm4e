import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, phone, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const insert = await pool.query(
      'INSERT INTO users (username, phone, password) VALUES ($1, $2, $3) RETURNING id',
      [username, phone, hashed]
    );
    res.json({ id: insert.rows[0].id });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ message: 'Username sudah dipakai' });
    res.status(500).json({ message: 'Gagal register' });
  }
}
