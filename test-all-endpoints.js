const axios = require('axios');
const baseURL = 'http://localhost:3000/api/sys/tableColumn';

// 测试数据
const testData = {
    tableName: 'department',
    filter: 'default',
    newFilter: 'new_default',
    column: [
        {
            columnName: 'test_column',
            dataKey: '测试列',
        }
    ]
};

async function testEndpoints() {
    console.log('开始测试所有接口...');
    
    try {
        // // 1. 测试获取所有表名
        // console.log('\n1. 测试获取所有表名:');
        // const tableNamesResponse = await axios.get(`${baseURL}/tableName`);
        // console.log('状态码:', tableNamesResponse.status);
        // console.log('响应数据:', tableNamesResponse.data);
        
        // // 2. 测试获取所有表列
        // console.log('\n2. 测试获取所有表列:');
        // const allColumnsResponse = await axios.get(baseURL);
        // console.log('状态码:', allColumnsResponse.status);
        // console.log('响应数据:', allColumnsResponse.data);
        
        // 3. 测试获取指定表的过滤器
        console.log('\n3. 测试获取指定表的过滤器:');
        const filtersResponse = await axios.get(`${baseURL}/filters/department`);
        console.log('状态码:', filtersResponse.status);
        console.log('响应数据:', filtersResponse.data);
        
        // 4. 测试获取指定表列
        console.log('\n4. 测试获取指定表列:');
        const tableColumnsResponse = await axios.post(`${baseURL}/`, {
            tableName: testData.tableName,
            filter: testData.filter
        });
        console.log('状态码:', tableColumnsResponse.status);
        console.log('响应数据:', tableColumnsResponse.data);
        
        // 5. 测试新建表列
        console.log('\n5. 测试新建表列:');
        const createResponse = await axios.post(`${baseURL}/create`, {
            tableName: testData.tableName,
            filter: testData.filter,
            column: testData.column
        });
        console.log('状态码:', createResponse.status);
        console.log('响应数据:', createResponse.data);
        
        // 6. 测试复制表列
        console.log('\n6. 测试复制表列:');
        const copyResponse = await axios.post(`${baseURL}/copy`, {
            tableName: testData.tableName,
            filter: testData.filter,
            newFilter: testData.newFilter
        });
        console.log('状态码:', copyResponse.status);
        console.log('响应数据:', copyResponse.data);
        
        // 7. 测试删除表列
        console.log('\n7. 测试删除表列:');
        const deleteResponse = await axios.post(`${baseURL}/delete`, {
            tableName: testData.tableName,
            filter: testData.newFilter
        });
        console.log('状态码:', deleteResponse.status);
        console.log('响应数据:', deleteResponse.data);
        
        // 8. 测试保存表列
        console.log('\n8. 测试保存表列:');
        const saveResponse = await axios.post(`${baseURL}/save`, {
            tableName: testData.tableName,
            filter: testData.newFilter,
            columns: testData.column
        });
        console.log('状态码:', saveResponse.status);
        console.log('响应数据:', saveResponse.data);
        
        console.log('\n所有接口测试完成！');
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
    }
}

testEndpoints();
