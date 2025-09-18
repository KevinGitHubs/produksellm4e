import pool from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

function getDayIndex() { return new Date().getDate() % 7; }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const userId = (req as any).user.id;
  const dayIndex = getDayIndex();

  const cek = await pool.query('SELECT 1 FROM daily_wins WHERE user_id=$1 AND day_seq=$2', [userId, dayIndex]);
  if (cek.rows.length > 0) return res.status(400).json({ message: 'Kamu sudah menang hari ini' });

  const rankQ = await pool.query('SELECT COUNT(*) AS c FROM daily_wins WHERE day_seq=$1', [dayIndex]);
  const rank = parseInt(rankQ.rows[0].c) + 1;

  const coin = rank === 1 ? 600 : rank === 2 ? 400 : rank === 3 ? 200 : 20;
  await pool.query('INSERT INTO daily_wins(user_id, day_seq, rank_place, coin) VALUES ($1,$2,$3,$4)', [userId, dayIndex, rank, coin]);
  await pool.query('UPDATE users SET coin=coin+$1 WHERE id=$2', [coin, userId]);

  res.json({ rank, coin });
}
