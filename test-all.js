const axios = require('axios');

const baseURL = 'http://localhost:3000/api/sys/tableColumn';

async function testGetAllTableNames() {
    console.log('\n=== 测试 getAllTableNames 接口 ===');
    try {
        const response = await axios.get(`${baseURL}/tableName`);
        console.log('响应状态码:', response.status);

        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testGeAllTableColumns() {
    console.log('\n=== 测试 getAllTableColumns 接口 ===');
    try {
        const response = await axios.get(`${baseURL}/`);
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testGetFilterbyTableName() {
    console.log('\n=== 测试 getFilterbyTableName 接口 ===');
    try {
        const tableName = 'employee'; // 假设存在的表名
        const response = await axios.get(`${baseURL}/filters/${tableName}`);
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testGetTableColumns() {
    console.log('\n=== 测试 getTableColumns 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/`, {
            tableName: 'employee',
            filter: 'default'
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testCreateTableColumn() {
    console.log('\n=== 测试 createTableColumn 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/create`, {
            tableName: 'employee',
            filter: 'test',
            column: [{
                columnName: 'test_column',
                dataKey: 'test_column',
                columnOrder: 1,
                relatedTableName: ''
            }]
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testCopyTableColumn() {
    console.log('\n=== 测试 copyTableColumn 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/copy`, {
            tableName: 'employee',
            filter: 'default',
            newFilter: 'copy_test'
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testDeleteTableColumn() {
    console.log('\n=== 测试 deleteTableColumn 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/delete`, {
            tableName: 'employee',
            filter: 'test'
        });
        console.log('响应状态码:', response.status);

        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testSaveTableColumns() {
    console.log('\n=== 测试 saveTableColumns 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/save`, {
            tableName: 'employee',
            changedTableName: 'employee',
            filter: 'default',
            tableData: [{
                columnName: 'id',
                dataKey: 'id',
                columnOrder: 1,
                relatedTableName: ''
            }]
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testRelateTableColumn() {
    console.log('\n=== 测试 relateTableColumn 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/relate`, {
            columns: [{
                tableName: 'employee',
                conditionName: 'default',
                columnName: 'department_name',
                dataKey: 'department_name',
                columnOrder: 1,
                relatedTableName: 'department'
            }]
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function testCancelRelateTableColumn() {
    console.log('\n=== 测试 cancelRelateTableColumn 接口 ===');
    try {
        const response = await axios.post(`${baseURL}/cancelRelate`, {
            tableName: 'employee',
            filter: 'default',
            relatedTableName: 'department'
        });
        console.log('响应状态码:', response.status);
        return response.data;
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
        return null;
    }
}

async function runAllTests() {
    console.log('开始测试所有接口...');
    
    await testGetAllTableNames();
    await testGeAllTableColumns();
    await testGetFilterbyTableName();
    await testGetTableColumns();
    await testCreateTableColumn();
    await testCopyTableColumn();
    await testDeleteTableColumn();
    await testSaveTableColumns();
    await testRelateTableColumn();
    await testCancelRelateTableColumn();
    
    console.log('\n所有接口测试完成！');
}

runAllTests();
