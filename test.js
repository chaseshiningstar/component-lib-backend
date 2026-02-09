const axios = require('axios');

async function testRelateInterface() {
    console.log('开始测试 /relate 接口...');

    try {

        // const response = await axios.post(url, requestData, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        const response = await axios.get('http://localhost:3000/api/sys/form');

        console.log('\n响应状态码:', response.status);
        console.log('响应数据:', JSON.stringify(response.data, null, 2));

        console.log('\n测试完成！');

    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
    }
}

testRelateInterface();