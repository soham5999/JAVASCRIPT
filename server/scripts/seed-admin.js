import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dbRepo } from '../db.js';

dotenv.config();

async function run() {
  const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'antigravity2026!';

  console.log(`Checking admin user: ${username}...`);

  const existing = dbRepo.getAdminByUsername(username);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  if (existing) {
    dbRepo.updateAdminPassword(existing.id, hash);
    console.log(`✅ Admin user "${username}" password has been updated.`);
  } else {
    dbRepo.createAdmin(username, hash, 'admin');
    console.log(`✅ Admin user "${username}" created successfully.`);
  }

  console.log(`Credentials:`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`\n⚠️  Keep these credentials safe and change your password in the dashboard settings!`);
  process.exit(0);
}

run().catch(err => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
