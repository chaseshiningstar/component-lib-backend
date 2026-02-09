// 导入 mysql2/promise
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'component_lib_db_2026_1_20',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function getDepartmentColumn() {
    try {
        const [departments] = await pool.execute('SELECT * FROM department');
        return departments;
    } catch (error) {
        console.error('Error in getDepartment:', error);
        throw error;
    }
}

/**
 * @route GET /department
 * @description 获取所有部门
 * @access Public
 */
export async function getDepartment() {
    try {
        const [departments] = await pool.execute('SELECT * FROM department');
        return departments;
    } catch (error) {
        console.error('Error in getDepartment:', error);
        throw error;
    }
}

/**
 * @route GET /employee
 * @description 获取所有员工
 * @access Public
 */
export async function getEmployee() {
    try {
        const [employees] = await pool.execute('SELECT * FROM employee');
        return employees;
    } catch (error) {
        console.error('Error in getEmployee:', error);
        throw error;
    }
}

/**
 * @route GET /salesRecord
 * @description 获取所有销售记录
 * @access Public
 */
export async function getSalesRecord() {
    try {
        const [salesRecords] = await pool.execute('SELECT * FROM sales_record');
        return salesRecords;
    } catch (error) {
        console.error('Error in getSalesRecord:', error);
        throw error;
    }
}

/**
 * 验证表名是否在白名单中
 */
function isValidTableName(tableName: string): boolean {
    const allowedTables = [
        'department',
        'dict',
        'dictItem',
        'employee',
        'form',
        'salesRecord',
    ];
    return allowedTables.includes(tableName);
}
/**
 * 动态获取业务表表头
 */
export async function dynamicGetBusinessFormColumn(tableName: string) {
    try {
        if (!isValidTableName(tableName)) {
            throw new Error(`表名不在白名单中: ${tableName}`);
        }
        // 做表名映射防止找不到表
        switch (tableName) {
            case 'salesRecord':
                tableName = 'sales_record';
                break;
            case 'dictItem':
                tableName = 'dict_item';
                break;
            default:
                tableName = tableName;
                break;
        }
        // 使用 mysql2/promise 执行查询
        const [businessFormColumn] = await pool.execute(`SHOW FULL COLUMNS FROM ${tableName}`);

        console.log(`获取到的${tableName}的业务表单数据:`);

        // 处理结果，直接返回 field 和 comment
        const result = businessFormColumn.map((column: any) => {
            return {
                field: column.Field,
                comment: column.Comment || ''
            };
        });

        return result;
    } catch (error) {
        console.error('Error in dynamicGetBusinessFormColumn:', error);
        throw error;
    }
}
