// 导入生成的 Prisma 客户端
const { PrismaClient } = require('../generated/prisma');

// 创建 Prisma 客户端实例
const prisma = new PrismaClient();

// 导出 Prisma 客户端实例
module.exports = prisma;
