const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Explicitly load backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('../config/db');
const User = require('../models/User');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('====================================================');
  console.log('   STAGE 2: AUTHENTICATION & RBAC SECURITY AUDIT     ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // Connect to DB directly for hash verification and cleanup
    await connectDB();

    const timestamp = Date.now();
    const testCitizenEmail = `test_citizen_${timestamp}@ecowatch.org`;
    const testPassword = 'Password@123';

    // TEST 1: Citizen Registration Succeeds
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Citizen',
          email: testCitizenEmail,
          password: testPassword,
          phone: '1234567890'
        })
      });
      const data = await res.json();
      assert(
        res.status === 201 && data.success && data.user.role === 'citizen',
        'Test 1: Citizen registration succeeds and assigns citizen role',
        JSON.stringify(data)
      );
    } catch (e) {
      assert(false, 'Test 1: Citizen registration succeeds', e.message);
    }

    // TEST 2: Duplicate Registration Rejected
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Citizen',
          email: testCitizenEmail,
          password: testPassword
        })
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.message.includes('already exists'),
        'Test 2: Duplicate registration is rejected with HTTP 400',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 2: Duplicate registration is rejected', e.message);
    }

    // TEST 3: Invalid Registration Data Rejected (Short Password)
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Invalid User',
          email: `invalid_${timestamp}@ecowatch.org`,
          password: '123'
        })
      });
      const data = await res.json();
      assert(
        res.status === 400,
        'Test 3: Short password (<6 chars) rejected with HTTP 400',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 3: Short password rejected', e.message);
    }

    // TEST 4: Passwords Stored as Bcrypt Hashes (Never Plaintext)
    const dbUser = await User.findOne({ email: testCitizenEmail }).select('+password');
    const isBcrypt = dbUser?.password && dbUser.password.startsWith('$2') && !dbUser.password.includes(testPassword);
    assert(
      isBcrypt,
      'Test 4: Password in MongoDB is hashed with bcrypt and not plaintext',
      `Hash prefix: ${dbUser?.password?.substring(0, 10)}`
    );

    // TEST 5: Login Succeeds With Correct Credentials
    let citizenToken = '';
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testCitizenEmail,
          password: testPassword
        })
      });
      const data = await res.json();
      citizenToken = data.token;
      assert(
        res.status === 200 && citizenToken && data.user.email === testCitizenEmail,
        'Test 5: Login succeeds with correct credentials and returns JWT',
        JSON.stringify(data.user)
      );
    } catch (e) {
      assert(false, 'Test 5: Login succeeds with correct credentials', e.message);
    }

    // TEST 6: Login Fails With Incorrect Password
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testCitizenEmail,
          password: 'WrongPassword@999'
        })
      });
      const data = await res.json();
      assert(
        res.status === 401 && data.message === 'Invalid email or password.',
        'Test 6: Login fails with generic error message on invalid password',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 6: Login fails with generic error', e.message);
    }

    // TEST 7: Missing or Invalid JWT is Rejected
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer invalid_garbage_token' }
      });
      const data = await res.json();
      assert(
        res.status === 401,
        'Test 7: Invalid or missing JWT rejected with HTTP 401',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 7: Invalid JWT rejected', e.message);
    }

    // TEST 8: Expired JWT is Rejected
    const expiredToken = jwt.sign(
      { id: dbUser._id, role: dbUser.role, tokenVersion: dbUser.tokenVersion },
      process.env.JWT_SECRET || 'ecowatch_dev_secret_fallback_key_2026',
      { expiresIn: '-10s' }
    );
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${expiredToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 401 && data.message.includes('expired'),
        'Test 8: Expired JWT rejected with HTTP 401 session expired',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 8: Expired JWT rejected', e.message);
    }

    // TEST 9: Inactive Users Cannot Authenticate
    dbUser.isActive = false;
    await dbUser.save();
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testCitizenEmail,
          password: testPassword
        })
      });
      const data = await res.json();
      assert(
        res.status === 403,
        'Test 9: Inactive user account rejected with HTTP 403',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 9: Inactive user rejected', e.message);
    }
    // Re-activate for subsequent tests
    dbUser.isActive = true;
    await dbUser.save();

    // Re-login to get fresh active token
    const freshLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCitizenEmail,
        password: testPassword
      })
    });
    const freshData = await freshLogin.json();
    citizenToken = freshData.token;

    // TEST 10: Citizen Cannot Access Officer or Admin Routes
    try {
      const res = await fetch(`${BASE_URL}/auth/test/officer`, {
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 403,
        'Test 10: Citizen blocked from officer route with HTTP 403',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 10: Citizen blocked from officer route', e.message);
    }

    // Login as seeded Officer
    const officerLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'officer@ecowatch.org',
        password: 'Password@123'
      })
    });
    const officerData = await officerLogin.json();
    const officerToken = officerData.token;

    // TEST 11: Officer Cannot Access Admin Routes
    try {
      const res = await fetch(`${BASE_URL}/auth/test/admin`, {
        headers: { Authorization: `Bearer ${officerToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 403,
        'Test 11: Officer blocked from admin route with HTTP 403',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 11: Officer blocked from admin route', e.message);
    }

    // Login as seeded Admin
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ecowatch.org',
        password: 'Password@123'
      })
    });
    const adminData = await adminLogin.json();
    const adminToken = adminData.token;

    // TEST 12: Admin Can Access Permitted Admin Routes
    try {
      const res = await fetch(`${BASE_URL}/auth/test/admin`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.role === 'admin',
        'Test 12: Admin granted access to protected admin route with HTTP 200',
        data.message
      );
    } catch (e) {
      assert(false, 'Test 12: Admin can access admin route', e.message);
    }

    // TEST 13: Logout Invalidates Active Session Server-Side
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success,
        'Test 13a: Logout endpoint clears session and increments tokenVersion',
        data.message
      );

      // Verify that the old token is now REJECTED by backend
      const postLogoutRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const postLogoutData = await postLogoutRes.json();
      assert(
        postLogoutRes.status === 401,
        'Test 13b: Post-logout request with invalidated token rejected with HTTP 401',
        postLogoutData.message
      );
    } catch (e) {
      assert(false, 'Test 13: Logout invalidation test', e.message);
    }

    // TEST 14: Authentication Persists via GET /me
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.user.email === 'admin@ecowatch.org',
        'Test 14: Authentication persistence validated via GET /api/auth/me',
        data.user.name
      );
    } catch (e) {
      assert(false, 'Test 14: Authentication persists via GET /me', e.message);
    }

    // TEST 15: Public Registration Privilege Escalation Prevention
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Hacker User',
          email: `hacker_${timestamp}@ecowatch.org`,
          password: testPassword,
          role: 'admin' // Attempted privilege escalation
        })
      });
      const data = await res.json();
      assert(
        data.user.role === 'citizen',
        'Test 15: Public registration payload with role:admin forced to citizen',
        `Assigned role: ${data.user.role}`
      );
    } catch (e) {
      assert(false, 'Test 15: Privilege escalation prevention', e.message);
    }

    // TEST 16: Health Check Still Operational
    try {
      const res = await fetch(`${BASE_URL}/health`);
      const data = await res.json();
      assert(
        res.status === 200 && data.database.status === 'connected',
        'Test 16: System health check operational with live MongoDB connection',
        `Database: ${data.database.database} on ${data.database.host}`
      );
    } catch (e) {
      assert(false, 'Test 16: Health check operational', e.message);
    }

    console.log('\n====================================================');
    console.log(`TOTAL AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
};

runTests();
