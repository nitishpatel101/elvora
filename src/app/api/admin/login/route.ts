import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@elvora.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'elvora2026';

    if (email === expectedEmail && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        admin: {
          id: 'admin-01',
          email: expectedEmail,
          name: 'ELVORA Executive Admin',
          role: 'super_admin',
        },
      });

      // Set secure HTTP-only cookie for server-side route protection
      response.cookies.set({
        name: 'elvora_admin_token',
        value: 'authenticated_' + Date.now(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid administrative credentials' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error during admin authentication' },
      { status: 500 }
    );
  }
}
