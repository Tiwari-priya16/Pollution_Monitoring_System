const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');

dotenv.config();

const usersToSeed = [
  {
    name: 'Aarav Sharma',
    email: 'citizen@ecowatch.org',
    password: 'Password@123',
    role: 'citizen',
    phone: '+91 98765 43210',
    department: '',
    isActive: true
  },
  {
    name: 'Officer Priya Verma',
    email: 'officer@ecowatch.org',
    password: 'Password@123',
    role: 'officer',
    department: 'Air Quality & Industrial Emissions',
    phone: '+91 98765 43211',
    isActive: true
  },
  {
    name: 'System Administrator',
    email: 'admin@ecowatch.org',
    password: 'Password@123',
    role: 'admin',
    department: 'Environmental Protection Bureau',
    phone: '+91 98765 43212',
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      throw new Error('Database connection could not be established. Check MONGODB_URI in backend/.env.');
    }

    for (const userData of usersToSeed) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        existing.name = userData.name;
        existing.password = userData.password; // Pre-save hook will hash
        existing.role = userData.role;
        existing.department = userData.department;
        existing.phone = userData.phone;
        existing.isActive = true;
        existing.tokenVersion = 0;
        await existing.save();
        console.log(`[Seed] Updated existing ${userData.role}: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`[Seed] Created new ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n✅ User seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Default Credentials:');
    console.log('1. Citizen: citizen@ecowatch.org / Password@123');
    console.log('2. Officer: officer@ecowatch.org / Password@123');
    console.log('3. Admin:   admin@ecowatch.org   / Password@123');
    console.log('--------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error] Failed to seed users:', error);
    process.exit(1);
  }
};

seedUsers();
