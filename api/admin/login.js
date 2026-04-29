import { SignJWT } from 'jose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { ADMIN_PASSWORD, ADMIN_JWT_SECRET } = process.env;
  if (!ADMIN_PASSWORD || !ADMIN_JWT_SECRET) {
    return res.status(500).json({
      error: 'server_misconfigured',
      detail: 'Set ADMIN_PASSWORD and ADMIN_JWT_SECRET in Vercel project envs.',
    });
  }

  const password = req.body && typeof req.body === 'object' ? req.body.password : undefined;
  if (typeof password !== 'string' || password.length === 0 || password !== ADMIN_PASSWORD) {
    await new Promise((r) => setTimeout(r, 250));
    return res.status(401).json({ error: 'invalid_password' });
  }

  const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
  const token = await new SignJWT({ sub: 'karim', role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const maxAge = 60 * 60 * 24 * 7;
  res.setHeader(
    'Set-Cookie',
    `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
  return res.status(200).json({ ok: true });
}
