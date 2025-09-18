import pool from '../../../lib/db';
import { sendDiscordRedeem } from '../../../lib/discord';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const userId = (req as any).user.id;

  const user = await pool.query('SELECT username, phone, coin FROM users WHERE id=$1', [userId]);
  const { coin, username, phone } = user.rows[0];
  if (coin < 10000) return res.status(400).json({ message: 'Koin belum cukup' });

  await pool.query('UPDATE users SET coin=coin-10000 WHERE id=$1', [userId]);
  await pool.query('INSERT INTO redeems(user_id, amount_coin, amount_dana) VALUES ($1,10000,10000)', [userId]);
  await sendDiscordRedeem(username, phone, 10000, 10000);

  res.json({ message: 'Penukaran berhasil! Dana akan dikirim ke nomormu.' });
}
