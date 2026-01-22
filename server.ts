require('dotenv').config();
const express = require('express');
const cors = require('cors');
const readline = require('readline');
const formRoutes = require('./routes/form'); // ts-node 会自动处理 .ts 文件
const dictRoutes = require('./routes/dict'); // 导入字典路由

const app = express();
const PORT = process.env.PORT || 3000;

// ===== 中间件 =====
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体（关键！）
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded

// ===== 路由 =====
app.use('/api/sys/form', formRoutes);
app.use('/api/sys/dict', dictRoutes); // 注册字典路由

// ===== 全局错误处理（可选）=====
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ===== 404 处理 =====
app.use((req: any, res: any) => {
    res.status(404).json({ error: 'Route not found' });
});

// ===== 启动服务器 =====
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📌 Press Ctrl+C to stop the server gracefully`);
});

// ===== 关闭服务器 =====
const shutdownServer = () => {
    console.log('\n🔄 Shutting down server...');

    // 关闭HTTP服务器
    server.close((err: any) => {
        if (err) {
            console.error('❌ Error while shutting down server:', err);
            process.exit(1); // 非零退出表示出错
        }

        console.log('✅ Server closed gracefully');
        process.exit(0); // 零退出表示成功
    });
};

// 监听终止信号
process.on('SIGINT', shutdownServer); // Ctrl+C
process.on('SIGTERM', shutdownServer); // kill命令

// Windows特殊处理
if (process.platform === 'win32') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        shutdownServer();
    });
};
