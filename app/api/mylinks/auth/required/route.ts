import { NextResponse } from 'next/server';

// Where an API call lands when the session has ended. A fetch follows the
// redirect here and gets a JSON 401 it can show, instead of the login page's
// HTML, which every caller failed to parse.
const body = { error: 'Your session has ended. Sign in again to continue.', code: 'unauthenticated' };
const respond = () => NextResponse.json(body, { status: 401 });

export { respond as GET, respond as POST, respond as PATCH, respond as PUT, respond as DELETE };
