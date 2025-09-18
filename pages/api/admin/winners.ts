import pool from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ambil juara 1-2-3 hari ini
  const today = new Date().toISOString().slice(0, 10);
  const winners = await pool.query(
    `SELECT u.username, w.rank_place, w.coin
     FROM daily_wins w
     JOIN users u ON u.id = w.user_id
     WHERE w.created_at::date = $1
     ORDER BY w.rank_place`,
    [today]
  );
  res.json(winners.rows);
}
