import { BENDA_PELAJAR } from '../../../lib/bendaPelajar';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const idx = new Date().getDate() % 7;
  res.json(BENDA_PELAJAR[idx]);
}
