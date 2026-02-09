const { PrismaClient } = require('../generated/prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// 从环境变量拆解连接参数
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'component_lib_db_2026_1_20',
  connectionLimit: 20,
  connectTimeout: 10000,
  acquireTimeout: 10000
})

const prisma = new PrismaClient({ adapter })

module.exports = prisma