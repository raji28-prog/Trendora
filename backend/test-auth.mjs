/**
 * Trendora Auth API Test Script
 * Run: node test-auth.mjs
 * Tests: register → login → /me → logout
 */

const BASE = 'http://localhost:5000';
const TEST_EMAIL = `trendora_test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123';
let accessToken = null;
let cookieHeader = null;

async function req(method, path, body, headers = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, headers: res.headers, data: json };
}

function pass(label) { console.log(`  ✅ ${label}`); }
function fail(label, detail) { console.error(`  ❌ ${label}`); if (detail) console.error('     ', detail); }

// ── 1. Health ──────────────────────────────────────────────────────────────
console.log('\n[1] Health Check');
{
  const r = await req('GET', '/api/health');
  if (r.ok && r.data.status === 'UP') {
    pass(`Status: ${r.data.status}, DB: ${r.data.database}`);
  } else {
    fail('Health check failed', JSON.stringify(r.data));
  }
}

// ── 2. Register ────────────────────────────────────────────────────────────
console.log('\n[2] Register');
{
  const r = await req('POST', '/api/auth/register', {
    name: 'Test User',
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    role: 'BUSINESS_OWNER',
  });
  if (r.status === 201 && r.data.success) {
    pass(`Created user: ${r.data.data?.user?.email}`);
  } else {
    fail(`Register failed (${r.status})`, JSON.stringify(r.data));
  }
}

// ── 3. Login ───────────────────────────────────────────────────────────────
console.log('\n[3] Login');
{
  const r = await req('POST', '/api/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (r.ok && r.data.data?.accessToken) {
    accessToken = r.data.data.accessToken;
    cookieHeader = r.headers.get('set-cookie');
    pass(`Access token received (${accessToken.substring(0, 20)}...)`);
    if (cookieHeader?.includes('refreshToken')) {
      pass('Refresh token cookie set');
    } else {
      fail('Refresh token cookie missing');
    }
  } else {
    fail(`Login failed (${r.status})`, JSON.stringify(r.data));
  }
}

// ── 4. Get Current User (/me) ─────────────────────────────────────────────
console.log('\n[4] Get /me');
{
  if (!accessToken) { fail('Skipped — no access token'); }
  else {
    const r = await req('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    if (r.ok && r.data.data?.user) {
      const u = r.data.data.user;
      pass(`User: ${u.email} | Role: ${u.role}`);
    } else {
      fail(`/me failed (${r.status})`, JSON.stringify(r.data));
    }
  }
}

// ── 5. Token Refresh ───────────────────────────────────────────────────────
console.log('\n[5] Token Refresh');
{
  if (!cookieHeader) { fail('Skipped — no refresh cookie'); }
  else {
    const r = await req('POST', '/api/auth/refresh', {}, { Cookie: cookieHeader });
    if (r.ok && r.data.data?.accessToken) {
      pass(`New access token (${r.data.data.accessToken.substring(0, 20)}...)`);
    } else {
      fail(`Refresh failed (${r.status})`, JSON.stringify(r.data));
    }
  }
}

// ── 6. Logout ──────────────────────────────────────────────────────────────
console.log('\n[6] Logout');
{
  const r = await req('POST', '/api/auth/logout', {}, {
    Cookie: cookieHeader ?? '',
    Authorization: `Bearer ${accessToken}`,
  });
  if (r.ok && r.data.success) {
    pass('Logged out successfully');
  } else {
    fail(`Logout failed (${r.status})`, JSON.stringify(r.data));
  }
}

// ── 7. Verify refresh token is revoked after logout ───────────────────────
// Note: Access tokens are stateless JWTs — they remain valid until expiry
// (1 hour). Logout only revokes the refresh token in the DB.
// The correct post-logout check is to verify the refresh token is rejected.
console.log('\n[7] Refresh after logout (should be 401 — refresh token revoked)');
{
  if (!cookieHeader) { fail('Skipped — no refresh cookie captured'); }
  else {
    const r = await req('POST', '/api/auth/refresh', {}, { Cookie: cookieHeader });
    if (r.status === 401) {
      pass('Refresh token correctly revoked after logout');
    } else {
      fail(`Expected 401, got ${r.status}`, JSON.stringify(r.data));
    }
  }
}

console.log('\n── Done ────────────────────────────────────────\n');
