const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api/sys/dict';
const FULL_URL = `${BASE_URL}${API_PREFIX}`;

async function testGetExistingModules() {
  console.log('\n=== 测试 getExistingModules 接口 ===');
  console.log('API 地址:', `${FULL_URL}/module`);
  
  try {
    const response = await axios.get(`${FULL_URL}/module`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log(`\n成功获取到 ${response.data.data.length} 个模块:`);
      response.data.data.forEach((module, index) => {
        console.log(`  ${index + 1}. moduleName: ${module.moduleName}, moduleLabel: ${module.moduleLabel}`);
      });
    } else {
      console.log('返回的数据格式不是数组');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

async function main() {
  console.log('开始测试 getExistingModules 接口...');
  console.log('使用的API地址:', FULL_URL);
  
  const modules = await testGetExistingModules();
  
  if (modules && modules.length > 0) {
    console.log('\n✓ 测试通过：成功获取到模块列表');
  } else if (modules && modules.length === 0) {
    console.log('\n⚠ 测试通过：数据库中暂无模块数据');
  } else {
    console.log('\n✗ 测试失败：无法获取模块列表');
  }
}

main();
