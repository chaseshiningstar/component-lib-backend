const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('=== 测试数据库连接 ===\n');

  const connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'component_lib_db_2026_1_20',
    connectTimeout: 10000,
    acquireTimeout: 10000
  };

  try {
    console.log('尝试连接数据库...');
    console.log('配置信息:', {
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      database: connectionConfig.database
    });

    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ 数据库连接成功！\n');

    console.log('测试查询...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ 查查询成功，结果:', rows, '\n');

    console.log('测试数据库表...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ 数据库表列表:');
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${Object.values(table)[0]}`);
    });
    console.log('');

    await connection.end();
    console.log('✅ 连接已关闭');

  } catch (error) {
    console.error('❌ 数据库连接失败！');
    console.error('错误信息:', error.message);
    console.error('错误代码:', error.code);
    console.error('错误详情:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 建议: 请检查数据库服务器是否正在运行');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 建议: 请检查用户名和密码是否正确');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 建议: 数据库不存在，请先创建数据库');
    }
  }
}

testDatabaseConnection();
