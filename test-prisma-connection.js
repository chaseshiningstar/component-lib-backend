const prisma = require('./lib/prisma');

async function testPrismaConnection() {
  console.log('=== 测试 Prisma 连接 ===\n');

  try {
    console.log('尝试连接数据库...');
    
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Prisma 连接成功！');
    console.log('查询结果:', result, '\n');

    console.log('测试查询 dict 表...');
    const dicts = await prisma.dict.findMany({
      take: 3
    });
    console.log('✅ 查询成功，找到', dicts.length, '条记录');
    if (dicts.length > 0) {
      console.log('第一条记录:', dicts[0]);
    }
    console.log('');

    await prisma.$disconnect();
    console.log('✅ Prisma 连接已关闭');

  } catch (error) {
    console.error('❌ Prisma 连接失败！');
    console.error('错误信息:', error.message);
    console.error('错误详情:', error);
    
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('关闭连接时出错:', disconnectError.message);
    }
  }
}

testPrismaConnection();
