import pool from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).user.id;
  const result = await pool.query('SELECT coin FROM users WHERE id=$1', [userId]);
  res.json({ coin: result.rows[0].coin });
}
