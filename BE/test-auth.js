import mongoose from 'mongoose';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

// Load Environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportalDB';
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 STARTING AUTHENTICATION FLOW INTEGRATION TESTS...\n');

  // 1. Database Connection
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (dbErr) {
    console.error('❌ MongoDB Connection failed:', dbErr.message);
    process.exit(1);
  }

  // 2. Clear clean slate for repeating test
  try {
    const db = mongoose.connection.db;
    await db.collection('users').deleteOne({ email: 'testuser@example.com' });
    console.log('✅ Cleared any existing test user "testuser@example.com" to ensure clean slate.');
  } catch (clearErr) {
    console.error('⚠️ Clear slate error:', clearErr.message);
  }

  const testUser = {
    name: 'Automation Tester',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'jobseeker'
  };

  let cookies = [];

  // 3. Test REGISTER endpoint
  console.log('\n--- [TEST 1: REGISTER] ---');
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    if (response.status === 201) {
      console.log('✅ User Registration Succeeded!');
      console.log('Response User:', JSON.stringify(data));
    } else {
      throw new Error(`Registration failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ REGISTER TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 4. Test LOGIN endpoint
  console.log('\n--- [TEST 2: LOGIN] ---');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    if (response.status === 200) {
      console.log('✅ User Login Succeeded!');
      console.log('Response User:', JSON.stringify(data));
      // Capture cookies
      const cookieHeader = response.headers.get('set-cookie');
      if (cookieHeader) {
        cookies = cookieHeader.split(',').map(c => c.split(';')[0].trim());
        console.log('Captured Cookies:', cookies);
      }
    } else {
      throw new Error(`Login failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ LOGIN TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 5. Test FORGOT PASSWORD endpoint (Trigger OTP)
  console.log('\n--- [TEST 3: FORGOT PASSWORD (OTP GENERATION)] ---');
  try {
    // Delete any old temp file before starting
    if (fs.existsSync('temp-otp.txt')) {
      fs.unlinkSync('temp-otp.txt');
    }

    const response = await fetch(`${API_URL}/auth/forgotpassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email })
    });
    
    const data = await response.json();
    if (response.status === 200) {
      console.log('✅ Forgot Password OTP Triggered successfully!');
      console.log('Response:', JSON.stringify(data));
    } else {
      throw new Error(`Forgot password failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ FORGOT PASSWORD TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 6. Test OTP RETRIEVAL (Read programmatically from temp file)
  console.log('\n--- [TEST 4: READ OTP FROM SERVER WORKSPACE] ---');
  let rawOtp = '';
  // Give it a tiny moment to write
  await new Promise(r => setTimeout(r, 1000));
  
  try {
    if (fs.existsSync('temp-otp.txt')) {
      rawOtp = fs.readFileSync('temp-otp.txt', 'utf8').trim();
      console.log(`✅ Programmatically retrieved raw OTP code: "${rawOtp}"`);
    } else {
      throw new Error('temp-otp.txt not found. Check if server controller was updated.');
    }
  } catch (err) {
    console.error('❌ OTP RETRIEVAL FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 7. Test RESET PASSWORD endpoint using OTP
  const newPassword = 'newpassword123';
  console.log('\n--- [TEST 5: RESET PASSWORD WITH OTP] ---');
  try {
    const response = await fetch(`${API_URL}/auth/resetpassword`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        otp: rawOtp,
        newPassword: newPassword
      })
    });
    
    const data = await response.json();
    if (response.status === 200) {
      console.log('✅ Password Reset Succeeded using verified OTP!');
      console.log('Response:', JSON.stringify(data));
    } else {
      throw new Error(`Reset password failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ RESET PASSWORD TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 8. Test LOGIN WITH NEW PASSWORD
  console.log('\n--- [TEST 6: LOGIN WITH NEW PASSWORD] ---');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: newPassword
      })
    });
    
    const data = await response.json();
    if (response.status === 200) {
      console.log('✅ Login with new password succeeded!');
      console.log('Response User:', JSON.stringify(data));
      
      const cookieHeader = response.headers.get('set-cookie');
      if (cookieHeader) {
        cookies = cookieHeader.split(',').map(c => c.split(';')[0].trim());
        console.log('Captured New Cookies:', cookies);
      }
    } else {
      throw new Error(`Login with new password failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ NEW PASSWORD LOGIN TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 9. Test LOGOUT endpoint
  console.log('\n--- [TEST 7: LOGOUT] ---');
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      }
    });
    
    const data = await response.json();
    if (response.status === 200) {
      console.log('✅ User Logged Out successfully (Cookies cleared)!');
      console.log('Response:', JSON.stringify(data));
    } else {
      throw new Error(`Logout failed with status ${response.status}: ${data.message}`);
    }
  } catch (err) {
    console.error('❌ LOGOUT TEST FAILED:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 10. CLEAN UP
  console.log('\n--- [CLEANING UP TEST ARTIFACTS] ---');
  try {
    if (fs.existsSync('temp-otp.txt')) {
      fs.unlinkSync('temp-otp.txt');
      console.log('✅ Deleted temp-otp.txt.');
    }
    const db = mongoose.connection.db;
    await db.collection('users').deleteOne({ email: 'testuser@example.com' });
    console.log('✅ Cleaned test user from DB.');
  } catch (cleanupErr) {
    console.error('⚠️ Cleanup error:', cleanupErr.message);
  }

  // Disconnect from DB
  await mongoose.disconnect();
  console.log('\n🎉 ALL AUTHENTICATION FLOW INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests();
