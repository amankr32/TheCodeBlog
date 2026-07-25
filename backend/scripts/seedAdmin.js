// Creates an admin account, or promotes an existing user to admin, in one
// command - no need to open MongoDB Atlas and edit documents by hand.
//
// Usage:
//   npm run seed:admin
//
// By default it uses the email/password below. Override them by setting
// ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_USERNAME env vars if you'd rather
// not hardcode credentials here.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from '../src/models/user.model.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'amankumar@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AmanKumar2004';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'amankumar';

async function run() {
  if (!process.env.MONGO) {
    console.error('MONGO is not set - check your backend/.env file.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: ADMIN_EMAIL });

  if (user) {
    user.isAdmin = true;
    user.isAuthor = true;
    user.authorRequestPending = false;
    await user.save();
    console.log(`Existing user "${user.email}" promoted to admin.`);
  } else {
    const hashedPassword = bcryptjs.hashSync(ADMIN_PASSWORD, 10);
    user = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
      isAuthor: true,
    });
    console.log(`Admin account created: ${user.email} / ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to seed admin:', err.message);
  process.exit(1);
});
