import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.cookies.authToken;
  
  if (authToken) {
    return res.status(200).json({ isValid: true });
  } else {
    return res.status(401).json({ isValid: false, message: 'Invalid or missing token' });
  }
}
