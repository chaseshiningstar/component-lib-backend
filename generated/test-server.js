const http = require('http');
const fs = require('fs');
const path = require('path');

// 服务器配置
const serverConfig = {
  hostname: 'localhost',
  port: 3000
};

/**
 * 测试GET请求
 * @param {string} endpoint - API端点路径
 * @returns {Promise<Object>} 响应结果
 */
function testGetRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      ...serverConfig,
      path: endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * 测试POST请求
 * @param {string} endpoint - API端点路径
 * @param {Object} data - 请求体数据
 * @returns {Promise<Object>} 响应结果
 */
function testPostRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      ...serverConfig,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseData)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 测试404错误
 * @param {string} endpoint - 不存在的API端点路径
 * @returns {Promise<Object>} 响应结果
 */
function test404(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      ...serverConfig,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * 运行所有测试用例
 */
async function runTests() {
  console.log('🚀 开始测试服务器功能...');
  console.log('=' .repeat(50));

  try {
    // 测试1: GET /api
    console.log('\n🔍 测试1: GET /api');
    const getResponse = await testGetRequest('/api');
    console.log(`✅ 状态码: ${getResponse.statusCode}`);
    console.log(`📦 响应体:`, JSON.stringify(getResponse.body, null, 2));

    // 测试2: POST /api/users
    console.log('\n🔍 测试2: POST /api/users');
    const testUserData = {
      name: '测试用户',
      email: 'test@example.com',
      age: 25
    };
    const postResponse = await testPostRequest('/api/users', testUserData);
    console.log(`✅ 状态码: ${postResponse.statusCode}`);
    console.log(`📦 响应体:`, JSON.stringify(postResponse.body, null, 2));

    // 测试3: 404错误处理
    console.log('\n🔍 测试3: 404错误处理 (GET /api/nonexistent)');
    const errorResponse = await test404('/api/nonexistent');
    console.log(`✅ 状态码: ${errorResponse.statusCode}`);
    console.log(`📦 响应体:`, JSON.stringify(errorResponse.body, null, 2));

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 所有测试用例执行完成!');
    console.log('✅ 服务器功能正常');

  } catch (error) {
    console.log('\n' + '=' .repeat(50));
    console.error('❌ 测试过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 执行测试
runTests();
