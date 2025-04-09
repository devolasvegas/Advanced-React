import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';

const databaseUrl =
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseUrl,
    // TODO: Add data seeding here
  },
  lists: createSchema({
    // Schema items go here
  }),
  ui: {
    // TODO: Set this for dev/admin access
    isAccessAllowed: ({ session }) => true,
  },
  // TODO: Add session management
});
