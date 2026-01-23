// 测试表单接口的脚本
const axios = require('axios');

// 后端服务基础 URL 和路由前缀
const BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api/sys/form';
const FULL_URL = `${BASE_URL}${API_PREFIX}`;

// 生成唯一的 formKey，避免唯一约束错误
const generateUniqueFormKey = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test-form-${timestamp}-${random}`;
};

// 测试数据
const testForm = {
  formName: '测试表单',
  formKey: generateUniqueFormKey(),
  layout: 'vertical',
  moduleName: 'test-module',
  creator: 'test-user',
  modifier: 'test-user',
  createTime: new Date().toISOString(),
  lastUpdateTime: new Date().toISOString(),
  deleted: false
};

let testFormId = null;

/**
 * 测试查询所有表单接口
 */
async function testFetchAllForms() {
  console.log('\n=== 测试查询所有表单接口 ===');
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
 * 测试按ID查询表单接口
 */
async function testFetchFormById(id) {
  if (!id) {
    console.log('\n=== 测试按ID查询表单接口 ===');
    console.log('请提供表单ID');
    return null;
  }
  console.log('\n=== 测试按ID查询表单接口 ===');
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
 * 测试按表单名称查询表单接口
 */
async function testFetchFormByFormName(formName) {
  if (!formName) {
    console.log('\n=== 测试按表单名称查询表单接口 ===');
    console.log('请提供表单名称');
    return null;
  }
  console.log('\n=== 测试按表单名称查询表单接口 ===');
  try {
    const encodedFormName = encodeURIComponent(formName);
    const response = await axios.get(`${FULL_URL}/formName/${encodedFormName}`);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试新增表单接口
 */
async function testAddForm(formData) {
  console.log('\n=== 测试新增表单接口 ===');
  try {
    const response = await axios.post(FULL_URL, formData);
    console.log('状态码:', response.status);
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
    return null;
  }
}

/**
 * 测试更新表单接口
 */
async function testUpdateForm(id, updateData) {
  if (!id) {
    console.log('\n=== 测试更新表单接口 ===');
    console.log('请提供表单ID');
    return null;
  }
  console.log('\n=== 测试更新表单接口 ===');
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
 * 测试删除表单接口
 */
async function testDeleteForm(id) {
  if (!id) {
    console.log('\n=== 测试删除表单接口 ===');
    console.log('请提供表单ID');
    return null;
  }
  console.log('\n=== 测试删除表单接口 ===');
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
 * 测试批量删除表单接口
 */
async function testBatchDeleteForms(ids) {
  if (!ids || ids.length === 0) {
    console.log('\n=== 测试批量删除表单接口 ===');
    console.log('请提供表单ID列表');
    return null;
  }
  console.log('\n=== 测试批量删除表单接口 ===');
  try {
    const idsStr = ids.join(',');
    const response = await axios.delete(`${FULL_URL}/batch/${idsStr}`);
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
  console.log('开始测试表单接口...');
  console.log('使用的API地址:', FULL_URL);

  // 1. 查询所有表单
  await testFetchAllForms();

  // 2. 新增表单
  const addedForm = await testAddForm(testForm);
  if (addedForm && addedForm.id) {
    testFormId = addedForm.id;

    // 3. 按ID查询表单
    await testFetchFormById(testFormId);

    // 4. 按表单名称查询表单
    await testFetchFormByFormName(testForm.formName);

    // 5. 更新表单
    const updatedForm = {
      ...testForm,
      id: testFormId,
      formName: '更新后的测试表单',
      formKey: generateUniqueFormKey(),
      lastUpdateTime: new Date().toISOString()
    };
    await testUpdateForm(testFormId, updatedForm);

    // 6. 批量删除测试 - 先创建两个表单，使用唯一的formKey
    const form1 = await testAddForm({
      ...testForm,
      formName: '批量删除测试1',
      formKey: generateUniqueFormKey()
    });
    const form2 = await testAddForm({
      ...testForm,
      formName: '批量删除测试2',
      formKey: generateUniqueFormKey()
    });
    if (form1 && form1.id && form2 && form2.id) {
      await testBatchDeleteForms([form1.id, form2.id]);
    }

    // 7. 删除之前创建的表单
    await testDeleteForm(testFormId);
  }

  // 8. 再次查询所有表单，确认删除效果
  await testFetchAllForms();

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
