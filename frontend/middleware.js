import { NextResponse } from 'next/server';

export function middleware() {
  // Pincher is a local prototype with a built-in demo user. All application
  // routes are intentionally public so opening the dashboard never requires a session.
  return NextResponse.next();
}
