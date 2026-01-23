// 测试字典接口的脚本
const axios = require('axios');

// 后端服务基础 URL，根据实际情况修改
const BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api/sys/dict';
const FULL_URL = `${BASE_URL}${API_PREFIX}`;

// 生成唯一的 dictCode，避免唯一约束错误
const generateUniqueDictCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test-dict-${timestamp}-${random}`;
};

// 测试数据
const testDict = {
  dictCode: generateUniqueDictCode(),
  dictName: '测试字典',
  moduleName: 'test-module',
  description: '这是一个用于测试的字典',
  status: true
};

const testDictItem1 = {
  itemValue: '1',
  itemLabel: '选项1',
  sortOrder: 1,
  status: true
};

const testDictItem2 = {
  itemValue: '2',
  itemLabel: '选项2',
  sortOrder: 2,
  status: true
};

let createdDictId = null;
let createdDictItemId1 = null;
let createdDictItemId2 = null;

/**
 * 测试查询所有字典
 */
async function testGetAllDicts() {
  console.log('\n=== 测试查询所有字典 ===');
  try {
    const response = await axios.get(FULL_URL);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试按ID查询字典
 */
async function testGetDictById(id) {
  if (!id) {
    console.log('\n=== 测试按ID查询字典 ===');
    console.log('请提供字典ID');
    return null;
  }
  console.log('\n=== 测试按ID查询字典 ===');
  try {
    const response = await axios.get(`${FULL_URL}/${id}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试按dictCode查询字典
 */
async function testGetDictByDictCode(dictCode) {
  if (!dictCode) {
    console.log('\n=== 测试按dictCode查询字典 ===');
    console.log('请提供dictCode');
    return null;
  }
  console.log('\n=== 测试按dictCode查询字典 ===');
  try {
    const response = await axios.get(`${FULL_URL}/dictCode/${dictCode}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试新增字典
 */
async function testAddDict(dictData) {
  console.log('\n=== 测试新增字典 ===');
  try {
    const response = await axios.post(FULL_URL, dictData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试更新字典
 */
async function testUpdateDict(id, updateData) {
  if (!id) {
    console.log('\n=== 测试更新字典 ===');
    console.log('请提供字典ID');
    return null;
  }
  console.log('\n=== 测试更新字典 ===');
  try {
    const response = await axios.put(`${FULL_URL}/${id}`, updateData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试删除字典
 */
async function testDeleteDict(id) {
  if (!id) {
    console.log('\n=== 测试删除字典 ===');
    console.log('请提供字典ID');
    return null;
  }
  console.log('\n=== 测试删除字典 ===');
  try {
    const response = await axios.delete(`${FULL_URL}/${id}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试按dictCode查询字典项
 */
async function testGetDictItemsByDictCode(dictCode) {
  if (!dictCode) {
    console.log('\n=== 测试按dictCode查询字典项 ===');
    console.log('请提供dictCode');
    return null;
  }
  console.log('\n=== 测试按dictCode查询字典项 ===');
  try {
    const response = await axios.get(`${FULL_URL}/item/${dictCode}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试按dictName查询字典
 */
async function testGetDictByDictName(dictName) {
  if (!dictName) {
    console.log('\n=== 测试按dictName查询字典 ===');
    console.log('请提供dictName');
    return null;
  }
  console.log('\n=== 测试按dictName查询字典 ===');
  try {
    const response = await axios.get(`${FULL_URL}/dictName/${dictName}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试按moduleName查询字典
 */
async function testGetDictByModuleName(moduleName) {
  if (!moduleName) {
    console.log('\n=== 测试按moduleName查询字典 ===');
    console.log('请提供moduleName');
    return null;
  }
  console.log('\n=== 测试按moduleName查询字典 ===');
  try {
    const response = await axios.get(`${FULL_URL}/moduleName/${moduleName}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试新增字典项
 */
async function testAddDictItem(dictItemData) {
  console.log('\n=== 测试新增字典项 ===');
  try {
    const response = await axios.post(`${FULL_URL}/item`, dictItemData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试更新字典项
 */
async function testUpdateDictItem(id, updateData) {
  if (!id) {
    console.log('\n=== 测试更新字典项 ===');
    console.log('请提供字典项ID');
    return null;
  }
  console.log('\n=== 测试更新字典项 ===');
  try {
    const response = await axios.put(`${FULL_URL}/item/${id}`, updateData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试删除字典项
 */
async function testDeleteDictItem(id) {
  if (!id) {
    console.log('\n=== 测试删除字典项 ===');
    console.log('请提供字典项ID');
    return null;
  }
  console.log('\n=== 测试删除字典项 ===');
  try {
    const response = await axios.delete(`${FULL_URL}/item/${id}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}



/**
 * 运行所有测试用例
 */
async function runAllTests() {
  console.log('开始测试字典接口...');
  console.log('使用的API地址:', FULL_URL);

  // 1. 查询所有字典
  await testGetAllDicts();

  // 2. 新增字典
  const addedDict = await testAddDict(testDict);
  if (addedDict && addedDict.id) {
    createdDictId = addedDict.id;
    testDict.dictCode = addedDict.dictCode;

    // 3. 按ID查询字典
    await testGetDictById(createdDictId);

    // 4. 按dictCode查询字典
    await testGetDictByDictCode(testDict.dictCode);

    // 5. 按dictName查询字典
    await testGetDictByDictName(testDict.dictName);

    // 6. 按moduleName查询字典
    await testGetDictByModuleName(testDict.moduleName);

    // 7. 更新字典
    const updatedDict = {
      ...testDict,
      dictName: '更新后的测试字典',
      description: '这是更新后的字典描述',
      status: false
    };
    await testUpdateDict(createdDictId, updatedDict);

    // 8. 新增字典项1
    const dictItem1WithCode = {
      ...testDictItem1,
      dictCode: testDict.dictCode
    };
    const addedDictItem1 = await testAddDictItem(dictItem1WithCode);
    if (addedDictItem1 && addedDictItem1.id) {
      createdDictItemId1 = addedDictItem1.id;
    }

    // 9. 新增字典项2
    const dictItem2WithCode = {
      ...testDictItem2,
      dictCode: testDict.dictCode
    };
    const addedDictItem2 = await testAddDictItem(dictItem2WithCode);
    if (addedDictItem2 && addedDictItem2.id) {
      createdDictItemId2 = addedDictItem2.id;
    }

    // 10. 按dictCode查询字典项
    await testGetDictItemsByDictCode(testDict.dictCode);

    // 11. 更新字典项1
    const updatedDictItem1 = {
      ...testDictItem1,
      dictCode: testDict.dictCode,
      itemLabel: '更新后的选项1',
      sortOrder: 3
    };
    await testUpdateDictItem(createdDictItemId1, updatedDictItem1);

    // 12. 删除字典项1
    if (createdDictItemId1) {
      await testDeleteDictItem(createdDictItemId1);
      createdDictItemId1 = null;
    }

    // 13. 删除字典项2
    if (createdDictItemId2) {
      await testDeleteDictItem(createdDictItemId2);
      createdDictItemId2 = null;
    }

    // 14. 删除字典
    await testDeleteDict(createdDictId);
    createdDictId = null;
  }

  // 15. 再次查询所有字典，确认删除效果
  await testGetAllDicts();

  console.log('\n所有测试用例执行完毕！');
}

// 检查是否安装了axios
async function checkDependencies() {
  try {
    require('axios');
    return true;
  } catch (error) {
    return false;
  }
}

// 主函数
async function main() {
  const hasAxios = await checkDependencies();
  if (!hasAxios) {
    console.error('错误: 请先安装axios依赖');
    console.error('执行命令: npm install axios');
    process.exit(1);
  }

  await runAllTests();
}

// 执行测试
main();
