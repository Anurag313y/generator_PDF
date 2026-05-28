import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const bootstrapAdmin = async () => {
  const shouldBootstrap = String(process.env.ADMIN_BOOTSTRAP || '').toLowerCase() === 'true';
  if (!shouldBootstrap) return;

  const email = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || '');
  const name = String(process.env.ADMIN_NAME || 'Admin').trim() || 'Admin';

  if (!email || !password) {
    console.warn(
      'ADMIN_BOOTSTRAP=true but ADMIN_EMAIL/ADMIN_PASSWORD missing. Skipping admin bootstrap.',
    );
    return;
  }

  const existing = await User.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!existing) {
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isDisabled: false,
    });
    console.log(`Bootstrapped admin user: ${email}`);
    return;
  }

  existing.role = 'admin';
  existing.isDisabled = false;
  existing.password = hashedPassword;
  if (!existing.name?.trim()) existing.name = name;
  await existing.save();
  console.log(`Updated admin user credentials: ${email}`);
};

const startServer = async () => {
  await connectDB();
  await bootstrapAdmin();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
