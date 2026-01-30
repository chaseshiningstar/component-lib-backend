const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api/sys/dict';
const FULL_URL = `${BASE_URL}${API_PREFIX}`;

const testDictCode = `test-dict-${Date.now()}`;
const testDict = {
  dictCode: testDictCode,
  dictName: '测试字典',
  moduleName: 'module1',
  description: '用于测试字典项的字典',
  status: true
};

let testDictId = null;

async function testAddDict(dictData) {
  console.log('\n=== 测试新增字典 ===');
  try {
    const response = await axios.post(`${FULL_URL}`, dictData);
    console.log('状态状态码:', response.status);
    console.log('响应数据:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}
 
async function testFetchDictItems(dictCode) {
  console.log('\n=== 测试查询字典项列表 ===');
  try {
    const response = await axios.get(`${FULL_URL}/item/${dictCode}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

async function testAddDictItem(dictItemData) {
  console.log('\n=== 测试新增单个字典项 ===');
  try {
    const response = await axios.post(`${FULL_URL}/item`, dictItemData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

async function testBatchAddDictItems(dictItemsData) {
  console.log('\n=== 测试批量新增字典项 ===');
  try {
    const response = await axios.post(`${FULL_URL}/items/batch`, dictItemsData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

async function testDeleteDictItem(id) {
  console.log('\n=== 测试删除单个字典项 ===');
  try {
    const response = await axios.delete(`${FULL_URL}/item/${id}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

async function testDeleteAllDictItems(dictCode) {
  console.log('\n=== 测试删除所有字典项 ===');
  try {
    const dictItems = await testFetchDictItems(dictCode);
    if (!dictItems || dictItems.length === 0) {
      console.log('没有字典项需要删除');
      return { message: '没有字典项需要删除' };
    }
    
    const ids = dictItems.map(item => item.id);
    console.log('准备删除的字典项ID:', ids);
    
    let deletedCount = 0;
    for (const id of ids) {
      const result = await testDeleteDictItem(id);
      if (result) {
        deletedCount++;
      }
    }
    
    console.log(`成功删除 ${deletedCount} 个字典项`);
    return { message: `成功删除 ${deletedCount} 个字典项` };
  } catch (error) {
    console.error('错误:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('开始测试字典项接口...');
  console.log('使用的API地址:', FULL_URL);
  console.log('测试字典编码:', testDictCode);

  const dict = await testAddDict(testDict);
  if (!dict) {
    console.error('创建测试字典失败，无法继续测试');
    return;
  }
  testDictId = dict.id;

  const singleItem = {
    dictCode: testDictCode,
    itemLabel: '单个测试项',
    itemValue: 'single_test_value',
    sortOrder: 10,
    status: true
  };
  // await testAddDictItem(singleItem);

  const batchItems = [
    {
      dictCode: testDictCode,
      itemLabel: '批量测试项1',
      itemValue: 'batch_test_value_1',
      sortOrder: 20,
      status: true
    },
    {
      dictCode: testDictCode,
      itemLabel: '批量测试项2',
      itemValue: 'batch_test_value_2',
      sortOrder: 30,
      status: true
    },
    {
      dictCode: testDictCode,
      itemLabel: '批量测试项3',
      itemValue: 'batch_test_value_3',
      sortOrder: 40,
      status: true
    }
  ];
  await testBatchAddDictItems(batchItems);

  // const allItems = await testFetchDictItems(testDictCode);
  // console.log(`当前共有 ${allItems ? allItems.length : 0} 个字典项`);

  // await testDeleteAllDictItems(testDictCode);

  // const remainingItems = await testFetchDictItems(testDictCode);
  // console.log(`删除后剩余 ${remainingItems ? remainingItems.length : 0} 个字典项`);

  console.log('\n所有测试用例执行完毕！');
}

async function checkDependencies() {
  try {
    require('axios');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const hasAxios = await checkDependencies();
  if (!hasAxios) {
    console.error('错误: 请先安装axios依赖');
    console.error('执行命令: npm install axios');
    process.exit(1);
  }
  
  // 查询所有模块
  try {
    const response = await axios.get(`${FULL_URL}/module`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data.data);
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
  }
  
  await runAllTests();
}

main();
