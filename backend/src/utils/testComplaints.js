/**
 * Stage 3 Automated Test Suite — Pollution Monitoring System
 * Tests all 16 security and validation scenarios for the complaints API.
 *
 * Prerequisites:
 *  - Backend server running on http://localhost:5000
 *  - DB seeded with citizen@ecowatch.org / Password@123
 *  - npm run dev (backend) must be active
 *
 * Usage: node src/utils/testComplaints.js
 */

'use strict';

const path = require('path');
const fs   = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const BASE_URL       = `http://localhost:${process.env.PORT || 5000}/api`;
const CITIZEN_EMAIL  = 'citizen@ecowatch.org';
const CITIZEN_PASS   = 'Password@123';
const OFFICER_EMAIL  = 'officer@ecowatch.org';
const ADMIN_EMAIL    = 'admin@ecowatch.org';

// ── tiny test harness ────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results = [];

function log(icon, msg) {
  const ts = new Date().toTimeString().slice(0, 8);
  console.log(`[${ts}] ${icon}  ${msg}`);
}

function pass(name) {
  passed++;
  results.push({ name, status: 'PASS' });
  log('✅', `PASS  ${name}`);
}

function fail(name, reason) {
  failed++;
  results.push({ name, status: 'FAIL', reason });
  log('❌', `FAIL  ${name} — ${reason}`);
}

async function json(res) {
  try { return await res.json(); } catch { return {}; }
}

// ── helpers ──────────────────────────────────────────────────────────────────
async function loginAs(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const body = await json(res);
  if (!body.token) throw new Error(`Login failed for ${email}: ${body.message}`);
  return body.token;
}

/** Build a minimal valid FormData payload for a complaint. */
function buildFormData(overrides = {}) {
  // Node 18+ has FormData globally; for Node 23 same applies.
  const fd = new FormData();
  const defaults = {
    title:       'Test Sewage Dumping Near River',
    category:    'Water Pollution',
    description: 'Raw sewage is being discharged directly into the river near the east bank.',
    address:     '14, River Bank Road',
    city:        'Pune'
  };
  const fields = { ...defaults, ...overrides };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== null) fd.append(k, v);
  }
  return fd;
}

/** Create a tiny in-memory Blob/File to simulate image upload. */
function fakeImageFile(mimeType = 'image/jpeg', ext = '.jpg') {
  // 1x1 pixel JPEG bytes (real minimal JPEG)
  const jpegBytes = Buffer.from(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkS' +
    'Ew8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJ' +
    'CQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
    'MjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAA' +
    'AAcI/8QAFBABAAAAAAAAAAAAAAAAAAAAoP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAU' +
    'EQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k=',
    'base64'
  );
  return new Blob([jpegBytes], { type: mimeType });
}

// ─────────────────────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n' + '═'.repeat(70));
  console.log('  STAGE 3 TEST SUITE — Pollution Monitoring System (EcoWatch PMS)');
  console.log('═'.repeat(70) + '\n');

  let citizenToken, officerToken, adminToken;

  // Obtain tokens ─────────────────────────────────────────────────────────────
  try {
    citizenToken = await loginAs(CITIZEN_EMAIL, CITIZEN_PASS);
    officerToken = await loginAs(OFFICER_EMAIL, CITIZEN_PASS);
    adminToken   = await loginAs(ADMIN_EMAIL,   CITIZEN_PASS);
    log('🔑', `Tokens obtained for citizen, officer, admin\n`);
  } catch (err) {
    console.error('\n❌ Could not obtain auth tokens. Is the server running?\n', err.message);
    process.exit(1);
  }

  // ── TEST 1: Unauthenticated submission → 401 ──────────────────────────────
  try {
    const fd = buildFormData();
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    const res = await fetch(`${BASE_URL}/complaints`, { method: 'POST', body: fd });
    const body = await json(res);
    res.status === 401 && body.success === false
      ? pass('T01 — Unauthenticated submission → 401')
      : fail('T01 — Unauthenticated submission → 401', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T01 — Unauthenticated submission → 401', e.message); }

  // ── TEST 2: Officer cannot submit complaint (RBAC) → 403 ─────────────────
  try {
    const fd = buildFormData();
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${officerToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 403 && body.success === false
      ? pass('T02 — Officer cannot submit complaint → 403')
      : fail('T02 — Officer cannot submit complaint → 403', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T02 — Officer cannot submit complaint → 403', e.message); }

  // ── TEST 3: Admin cannot submit complaint (RBAC) → 403 ───────────────────
  try {
    const fd = buildFormData();
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 403 && body.success === false
      ? pass('T03 — Admin cannot submit complaint → 403')
      : fail('T03 — Admin cannot submit complaint → 403', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T03 — Admin cannot submit complaint → 403', e.message); }

  // ── TEST 4: Missing required fields → 400 ────────────────────────────────
  try {
    const fd = new FormData();
    // Only title provided — missing category, description, address, city, image
    fd.append('title', 'Incomplete');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 400 && body.success === false
      ? pass('T04 — Missing required fields → 400')
      : fail('T04 — Missing required fields → 400', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T04 — Missing required fields → 400', e.message); }

  // ── TEST 5: Invalid category → 400 ───────────────────────────────────────
  try {
    const fd = buildFormData({ category: 'Nuclear Pollution' });
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 400 && body.success === false
      ? pass('T05 — Invalid category → 400')
      : fail('T05 — Invalid category → 400', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T05 — Invalid category → 400', e.message); }

  // ── TEST 6: Missing image → 400 ──────────────────────────────────────────
  try {
    const fd = buildFormData();
    // intentionally no image appended
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 400 && body.success === false
      ? pass('T06 — Missing image → 400')
      : fail('T06 — Missing image → 400', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T06 — Missing image → 400', e.message); }

  // ── TEST 7: Unsupported file type → 400 ──────────────────────────────────
  try {
    const fd = buildFormData();
    fd.append('image', new Blob(['fake text content'], { type: 'text/plain' }), 'malicious.txt');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    res.status === 400 && body.success === false
      ? pass('T07 — Unsupported file type (.txt) → 400')
      : fail('T07 — Unsupported file type (.txt) → 400', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T07 — Unsupported file type (.txt) → 400', e.message); }

  // ── TEST 8: Successful complaint submission → 201 ─────────────────────────
  let firstComplaintId;
  try {
    const fd = buildFormData();
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    if (res.status === 201 && body.success && body.complaint?.complaintId) {
      firstComplaintId = body.complaint.complaintId;
      pass(`T08 — Successful submission → 201 (ID: ${firstComplaintId})`);
    } else {
      fail('T08 — Successful submission → 201', `Got ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e) { fail('T08 — Successful submission → 201', e.message); }

  // ── TEST 9: Unique tracking IDs (5 submissions, all unique) ───────────────
  try {
    const ids = new Set();
    if (firstComplaintId) ids.add(firstComplaintId);

    for (let i = 0; i < 4; i++) {
      const fd = buildFormData({ title: `Uniqueness Test Complaint ${i + 2}` });
      fd.append('image', fakeImageFile(), 'evidence.jpg');
      const res = await fetch(`${BASE_URL}/complaints`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${citizenToken}` },
        body: fd
      });
      const body = await json(res);
      if (body.complaint?.complaintId) ids.add(body.complaint.complaintId);
    }
    ids.size >= 5
      ? pass(`T09 — Unique IDs: ${ids.size} complaints, all distinct`)
      : fail('T09 — Unique IDs', `Only ${ids.size} unique IDs from 5 submissions`);
  } catch (e) { fail('T09 — Unique IDs', e.message); }

  // ── TEST 10: GET /complaints/my returns citizen's complaints ──────────────
  try {
    const res = await fetch(`${BASE_URL}/complaints/my`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const body = await json(res);
    res.status === 200 && body.success && Array.isArray(body.complaints) && body.total >= 5
      ? pass(`T10 — GET /complaints/my → 200 (${body.total} complaints)`)
      : fail('T10 — GET /complaints/my', `Got ${res.status}: ${JSON.stringify(body)}`);
  } catch (e) { fail('T10 — GET /complaints/my', e.message); }

  // ── TEST 11: Status filter on GET /complaints/my ─────────────────────────
  try {
    const res = await fetch(`${BASE_URL}/complaints/my?status=SUBMITTED`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const body = await json(res);
    res.status === 200 && body.success && body.complaints.every(c => c.status === 'SUBMITTED')
      ? pass(`T11 — Status filter ?status=SUBMITTED works (${body.complaints.length} results)`)
      : fail('T11 — Status filter', `Got ${res.status}: ${JSON.stringify(body)}`);
  } catch (e) { fail('T11 — Status filter', e.message); }

  // ── TEST 12: GET /complaints/:complaintId — own complaint ─────────────────
  try {
    if (!firstComplaintId) throw new Error('No complaintId from T08');
    const res = await fetch(`${BASE_URL}/complaints/${firstComplaintId}`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const body = await json(res);
    res.status === 200 && body.success && body.complaint?.complaintId === firstComplaintId
      ? pass(`T12 — GET /complaints/:id → 200 (${firstComplaintId})`)
      : fail('T12 — GET /complaints/:id', `Got ${res.status}: ${JSON.stringify(body)}`);
  } catch (e) { fail('T12 — GET /complaints/:id', e.message); }

  // ── TEST 13: Cross-citizen access prevention → 403 ────────────────────────
  // Register a second citizen and try to access the first citizen's complaint
  try {
    if (!firstComplaintId) throw new Error('No complaintId from T08');
    // Use a temporary unique email for second citizen
    const email2 = `test_citizen_2_${Date.now()}@ecowatch.test`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Citizen Two', email: email2, password: 'Password@123', phone: '9999999999' })
    });
    const regBody = await json(regRes);
    const token2 = regBody.token;

    if (!token2) throw new Error('Could not register second citizen');

    const res = await fetch(`${BASE_URL}/complaints/${firstComplaintId}`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    const body = await json(res);
    res.status === 403 && body.success === false
      ? pass('T13 — Cross-citizen access prevention → 403')
      : fail('T13 — Cross-citizen access prevention → 403', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T13 — Cross-citizen access prevention → 403', e.message); }

  // ── TEST 14: Officer cannot access citizen GET /my → 403 ─────────────────
  try {
    const res = await fetch(`${BASE_URL}/complaints/my`, {
      headers: { Authorization: `Bearer ${officerToken}` }
    });
    const body = await json(res);
    res.status === 403 && body.success === false
      ? pass('T14 — Officer cannot access GET /complaints/my → 403')
      : fail('T14 — Officer cannot access GET /complaints/my → 403', `Got ${res.status}: ${body.message}`);
  } catch (e) { fail('T14 — Officer cannot access GET /complaints/my → 403', e.message); }

  // ── TEST 15: citizenId cannot be set via body (security) ─────────────────
  try {
    const fd = buildFormData();
    fd.append('image', fakeImageFile(), 'evidence.jpg');
    fd.append('citizenId', '000000000000000000000000'); // tampered value
    fd.append('status', 'RESOLVED'); // tampered status
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: fd
    });
    const body = await json(res);
    if (res.status === 201 && body.complaint) {
      const dbCitizenIdNotTampered = body.complaint.citizenId !== '000000000000000000000000';
      const dbStatusNotTampered = body.complaint.status === 'SUBMITTED';
      dbCitizenIdNotTampered && dbStatusNotTampered
        ? pass('T15 — Server ignores body citizenId/status injection (security enforced)')
        : fail('T15 — Server-side citizenId/status enforcement', `citizenId or status was tampered`);
    } else {
      fail('T15 — Server-side citizenId/status enforcement', `Got ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e) { fail('T15 — Server-side citizenId/status enforcement', e.message); }

  // ── TEST 16: Auth regression — login and getMe still work ────────────────
  try {
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const meBody = await json(meRes);
    meRes.status === 200 && meBody.success && meBody.user?.role === 'citizen'
      ? pass('T16 — Auth regression: /auth/me still operational')
      : fail('T16 — Auth regression', `Got ${meRes.status}: ${JSON.stringify(meBody)}`);
  } catch (e) { fail('T16 — Auth regression', e.message); }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log(`  RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log('─'.repeat(70));
  results.forEach((r, i) => {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    const detail = r.reason ? ` (${r.reason})` : '';
    console.log(`  ${icon}  ${r.name}${detail}`);
  });
  console.log('─'.repeat(70) + '\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('\nUnhandled error in test suite:', err);
  process.exit(1);
});
