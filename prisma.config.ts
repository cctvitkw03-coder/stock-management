import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

// DIRECT_URL (port 5432) ใช้สำหรับ migrate/db push
// DATABASE_URL (port 6543, pgbouncer) ใช้สำหรับ runtime queries

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL as string,
  },
})
