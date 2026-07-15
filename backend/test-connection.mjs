import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':***@'));

try {
  // MongoDB-compatible ping
  const result = await prisma.$runCommandRaw({ ping: 1 });
  console.log('\n✅ DATABASE CONNECTION: OK');
  console.log('   Ping result:', JSON.stringify(result));

  // Test user query
  const count = await prisma.user.count();
  console.log(`   User count: ${count}`);
} catch (err) {
  console.error('\n❌ DATABASE CONNECTION FAILED');
  console.error('   Code:', err.code);
  console.error('   Message:', err.meta?.message || err.message);

  if (err.meta?.message?.includes('InternalError') || err.meta?.message?.includes('server selection timeout')) {
    console.error('\n⚠️  ROOT CAUSE: MongoDB Atlas is rejecting the connection.');
    console.error('   Most likely cause: Your current IP address is NOT in the Atlas IP Access List.');
    console.error('\n   FIX: Go to https://cloud.mongodb.com');
    console.error('   → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
  }
} finally {
  await prisma.$disconnect();
  process.exit(0);
}
