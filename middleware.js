import { jwtVerify } from 'jose';

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export default async function middleware(request) {
  const url = new URL(request.url);

  // Allow the login page through (avoid redirect loop)
  if (url.pathname === '/admin/login' || url.pathname === '/admin/login.html') {
    return;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) {
    return Response.redirect(new URL('/admin/login', request.url), 307);
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return new Response(
      'admin not configured: set ADMIN_JWT_SECRET in Vercel project envs',
      { status: 500, headers: { 'content-type': 'text/plain' } }
    );
  }

  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(match[1], key);
  } catch {
    return Response.redirect(new URL('/admin/login', request.url), 307);
  }
}
