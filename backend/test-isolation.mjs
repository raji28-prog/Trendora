/**
 * Trendora User Isolation and Onboarding Verification Script
 * Run: node test-isolation.mjs
 */

const BASE = 'http://localhost:5000';
const EMAIL_A = `usera_${Date.now()}@example.com`;
const EMAIL_B = `userb_${Date.now()}@example.com`;
const PASSWORD = 'password123';

async function req(method, path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const opts = {
    method,
    headers,
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data: json };
}

function pass(label) { console.log(`  ✅ ${label}`); }
function fail(label, detail) { 
  console.error(`  ❌ ${label}`); 
  if (detail) console.error('     ', detail);
  process.exit(1);
}

console.log('🚀 Starting Authentication & User Isolation Verification...\n');

// ── 1. Register and Login User A ────────────────────────────────────────────
console.log('[1] User A Register and Login');
let tokenA = null;
let userA = null;
{
  const rReg = await req('POST', '/api/auth/register', {
    name: 'User A',
    email: EMAIL_A,
    password: PASSWORD,
    role: 'BUSINESS_OWNER',
  });
  if (rReg.status !== 201 || !rReg.data.success) {
    fail('User A registration failed', JSON.stringify(rReg.data));
  }
  pass(`User A registered successfully: ${EMAIL_A}`);

  const rLog = await req('POST', '/api/auth/login', {
    email: EMAIL_A,
    password: PASSWORD,
  });
  if (!rLog.ok || !rLog.data.data?.accessToken) {
    fail('User A login failed', JSON.stringify(rLog.data));
  }
  tokenA = rLog.data.data.accessToken;
  userA = rLog.data.data.user;
  pass(`User A logged in successfully. JWT obtained.`);
  
  // Verify user hasBusiness is false initially
  if (userA.hasBusiness === false) {
    pass('User A hasBusiness flag is false initially (onboarding required).');
  } else {
    fail('User A hasBusiness flag should be false initially', JSON.stringify(userA));
  }
}

// ── 2. User A Onboarding ────────────────────────────────────────────────────
console.log('\n[2] User A Onboarding (Create Business)');
let businessA = null;
{
  const rBiz = await req('POST', '/api/businesses', {
    name: 'Coffee Shop A',
    category: 'Restaurant',
    address: '123 Coffee Lane',
    phone: '123-456-7890',
    website: 'www.coffeeshopa.com',
    images: []
  }, tokenA);

  if (rBiz.status !== 201 || !rBiz.data.success) {
    fail('User A business onboarding failed', JSON.stringify(rBiz.data));
  }
  businessA = rBiz.data.data;
  pass(`Business profile created for User A: ${businessA.name} (ID: ${businessA.id})`);

  // Verify /me now returns hasBusiness = true
  const rMe = await req('GET', '/api/auth/me', null, tokenA);
  if (!rMe.ok || !rMe.data.data?.user) {
    fail('Failed to fetch /me for User A', JSON.stringify(rMe.data));
  }
  const uMe = rMe.data.data.user;
  if (uMe.hasBusiness === true) {
    pass('User A hasBusiness flag is now true (onboarding completed).');
  } else {
    fail('User A hasBusiness flag should be true after onboarding', JSON.stringify(uMe));
  }
}

// ── 3. User A Creates Campaign ──────────────────────────────────────────────
console.log('\n[3] User A Creates Campaign');
let campaignA = null;
{
  const rCamp = await req('POST', '/api/campaigns', {
    name: 'Promo A',
    type: 'Email',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE',
    businessId: businessA.id
  }, tokenA);

  if (rCamp.status !== 201 || !rCamp.data.success) {
    fail('User A campaign creation failed', JSON.stringify(rCamp.data));
  }
  campaignA = rCamp.data.data;
  pass(`Campaign created for User A: ${campaignA.name} (ID: ${campaignA.id})`);

  // Fetch campaigns for User A
  const rGetCamp = await req('GET', '/api/campaigns', null, tokenA);
  if (!rGetCamp.ok || !Array.isArray(rGetCamp.data.data)) {
    fail('Failed to list campaigns for User A', JSON.stringify(rGetCamp.data));
  }
  const list = rGetCamp.data.data;
  if (list.length === 1 && list[0].id === campaignA.id) {
    pass('User A can see their own campaign.');
  } else {
    fail('User A cannot list their campaign correctly', JSON.stringify(list));
  }
}

// ── 4. Register and Login User B ────────────────────────────────────────────
console.log('\n[4] User B Register and Login');
let tokenB = null;
let userB = null;
{
  const rReg = await req('POST', '/api/auth/register', {
    name: 'User B',
    email: EMAIL_B,
    password: PASSWORD,
    role: 'BUSINESS_OWNER',
  });
  if (rReg.status !== 201 || !rReg.data.success) {
    fail('User B registration failed', JSON.stringify(rReg.data));
  }
  pass(`User B registered successfully: ${EMAIL_B}`);

  const rLog = await req('POST', '/api/auth/login', {
    email: EMAIL_B,
    password: PASSWORD,
  });
  if (!rLog.ok || !rLog.data.data?.accessToken) {
    fail('User B login failed', JSON.stringify(rLog.data));
  }
  tokenB = rLog.data.data.accessToken;
  userB = rLog.data.data.user;
  pass(`User B logged in successfully. JWT obtained.`);
  
  if (userB.hasBusiness === false) {
    pass('User B hasBusiness flag is false initially (onboarding required).');
  } else {
    fail('User B hasBusiness flag should be false initially', JSON.stringify(userB));
  }
}

// ── 5. User B Onboarding ────────────────────────────────────────────────────
console.log('\n[5] User B Onboarding (Create Business)');
let businessB = null;
{
  const rBiz = await req('POST', '/api/businesses', {
    name: 'Bakeshop B',
    category: 'Restaurant',
    address: '456 Baker St',
    phone: '987-654-3210',
    website: 'www.bakeshopb.com',
    images: []
  }, tokenB);

  if (rBiz.status !== 201 || !rBiz.data.success) {
    fail('User B business onboarding failed', JSON.stringify(rBiz.data));
  }
  businessB = rBiz.data.data;
  pass(`Business profile created for User B: ${businessB.name} (ID: ${businessB.id})`);

  // Verify /me now returns hasBusiness = true
  const rMe = await req('GET', '/api/auth/me', null, tokenB);
  if (!rMe.ok || !rMe.data.data?.user) {
    fail('Failed to fetch /me for User B', JSON.stringify(rMe.data));
  }
  const uMe = rMe.data.data.user;
  if (uMe.hasBusiness === true) {
    pass('User B hasBusiness flag is now true (onboarding completed).');
  } else {
    fail('User B hasBusiness flag should be true after onboarding', JSON.stringify(uMe));
  }
}

// ── 6. Verify Complete Isolation of User A Data ──────────────────────────────
console.log('\n[6] Verify Complete Isolation (User B cannot see User A data)');
{
  // User B tries to fetch campaigns
  const rGetCamp = await req('GET', '/api/campaigns', null, tokenB);
  if (!rGetCamp.ok || !Array.isArray(rGetCamp.data.data)) {
    fail('Failed to list campaigns for User B', JSON.stringify(rGetCamp.data));
  }
  const list = rGetCamp.data.data;
  if (list.length === 0) {
    pass('User B cannot see User A\'s campaigns (list is empty as expected).');
  } else {
    fail('User B was able to see campaigns!', JSON.stringify(list));
  }

  // User B tries to fetch User A's business directly or modify it
  const rUpdateBiz = await req('PUT', `/api/businesses/${businessA.id}`, {
    name: 'Hacked Coffee Shop',
    category: 'Restaurant',
    address: 'Hacked address',
    phone: '000-000-0000',
    images: []
  }, tokenB);

  if (rUpdateBiz.status === 403) {
    pass('User B is blocked with 403 Forbidden when trying to update User A\'s business.');
  } else {
    fail(`Expected 403 Forbidden on update, got ${rUpdateBiz.status}`, JSON.stringify(rUpdateBiz.data));
  }
}

// ── 7. User B Creates Campaign and Scopes Check ──────────────────────────────
console.log('\n[7] User B Creates Campaign');
let campaignB = null;
{
  const rCamp = await req('POST', '/api/campaigns', {
    name: 'Promo B',
    type: 'Social',
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'DRAFT',
    businessId: businessB.id
  }, tokenB);

  if (rCamp.status !== 201 || !rCamp.data.success) {
    fail('User B campaign creation failed', JSON.stringify(rCamp.data));
  }
  campaignB = rCamp.data.data;
  pass(`Campaign created for User B: ${campaignB.name} (ID: ${campaignB.id})`);

  // Fetch campaigns for User B
  const rGetCampB = await req('GET', '/api/campaigns', null, tokenB);
  const listB = rGetCampB.data.data;
  if (listB.length === 1 && listB[0].id === campaignB.id) {
    pass('User B can list only their own campaign.');
  } else {
    fail('User B campaign list scoping failed', JSON.stringify(listB));
  }

  // Fetch campaigns for User A again
  const rGetCampA = await req('GET', '/api/campaigns', null, tokenA);
  const listA = rGetCampA.data.data;
  if (listA.length === 1 && listA[0].id === campaignA.id) {
    pass('User A still lists only their own campaign.');
  } else {
    fail('User A campaign list scoping corrupted', JSON.stringify(listA));
  }
}

console.log('\n✨ All authentication, onboarding, and multi-user isolation tests passed successfully!\n');
process.exit(0);
