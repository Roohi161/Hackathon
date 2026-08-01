import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'prisma/schema.prisma',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://hackathon_user:hackathon_pass@localhost:5432/hackathon_central',
  },
});
