// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');

/**
 * 获取所有数据库表名（Prisma模型名）
 * @returns 表名数组
 */
export function getAllTableNames(): string[] {
    // 使用 Prisma 的 DMMF 获取所有模型名
    try {
        // 检查 Prisma 客户端上的模型属性
        const modelNames = [];
        for (const key in prisma) {
            if (typeof prisma[key] === 'object' && prisma[key] !== null &&
                typeof prisma[key].findMany === 'function') {
                modelNames.push(key);
            }
        }

        console.log('从 Prisma 客户端获取的表名列表:', modelNames);
        return modelNames;
    } catch (error) {
        console.error('Error getting table names:', error);
        return [];
    }
}
/**
 * 获取所有数据库表列配置
 * @returns 表列配置数组
 */
export async function getAllTableColumns() {
    try {
        console.log('尝试从 tableColumnConfig 表中查询数据...');
        const columns = await prisma.tableColumnConfig.findMany();
        console.log('查询结果:', columns);
        return columns;
    } catch (error) {
        console.error('Error querying tableColumnConfig:', error);
    }
}
/**
 * 获取指定数据库表的所有过滤条件
 * @param tableName 表名
 * @returns 过滤条件数组
 */
export async function getFilterbyTableName(tableName: string) {
    try {
        console.log('尝试从 tableColumnConfig 表中查询数据...');
        const filters = await prisma.tableColumnConfig.findMany({
            where: {
                tableName: tableName
            },
            select: {
                conditionName: true,
            }
        });
        console.log('查询结果:', filters);
        return filters;
    } catch (error) {
        console.error('Error querying tableColumnConfig:', error);
    }
}
/**
 * 获取指定数据库表的所有表头配置
 * @param tableName 表名
 * @param filter 过滤条件
 * @returns 列配置数组
 */
export async function getTableColumns(tableName: string, filter: string) {
    try {
        console.log(`尝试找到 ${tableName} 的表头项...`);
        const columns = await prisma.tableColumnConfig.findMany({
            where: {
                tableName: tableName,
                conditionName: filter
            },
            omit: {
                conditionName: true,
                tableName: true,
            }
        });
        console.log(`查询结果:`, columns);
        return columns;
    } catch (error) {
        console.error(`Error querying ${tableName}:`, error);
    }
}

// 新建表头项
export async function createTableColumn(tableName: string, filter: string, columns: any[]) {
    try {
        console.log(`尝试新建表头项...`);
        const savedColumns = await prisma.tableColumnConfig.createMany({
            data: columns.map((column: any) => ({
                ...column,
                tableName: tableName,
                conditionName: filter,
                relatedTableName: column.relatedTableName || ''
            }))
        });
        console.log(`保存结果:`, savedColumns);
        return savedColumns;
    } catch (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
    }
}

// 复制表头项 
export async function copyTableColumn(tableName: string, filter: string, newFilter: string) {
    try {
        console.log(`尝试复制 ${tableName} 的 ${filter} 表头项到 ${newFilter}`);
        const columns = await prisma.tableColumnConfig.findMany({
            where: {
                tableName: tableName,
                conditionName: filter
            },
            omit: {
                tableName: true,
                id: true,
                conditionName: true
            }
        });
        await createTableColumn(tableName, newFilter, columns);
        console.log(`复制 ${tableName} 的 ${filter} 表头项到 ${newFilter} 成功`);
        return { success: true };
    } catch (error) {
        console.error(`Error querying ${tableName}:`, error);
        throw error;
    }
}

// 删除表头配置项
export async function deleteTableColumn(tableName: string, filter: string) {
    try {
        console.log(`尝试删除 ${tableName} 的 ${filter} 表头项...`);
        const deletedColumns = await prisma.tableColumnConfig.deleteMany({
            where: {
                tableName: tableName,
                conditionName: filter
            }
        });
        console.log(`删除结果:`, deletedColumns);
        return deletedColumns;
    } catch (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
    }
}

// 保存表头配置
export async function saveTableColumns(tableName: string, filter: string[], columns: any[]) {
    try {
        console.log(`尝试更新 ${tableName} 的表头项...`);
        // 先删除旧数据
        await prisma.tableColumnConfig.deleteMany({
            where: {
                tableName: tableName,
                conditionName: filter
            }
        });
        const savedColumns = await prisma.tableColumnConfig.createMany({
            data: columns.map((column: any) => ({
                ...column,
                tableName: tableName,
                conditionName: filter,
                relatedTableName: column.relatedTableName || ''
            }))
        });
        console.log(`保存结果:`, savedColumns);
        return savedColumns;
    } catch (error) {
        console.error(`Error saving ${tableName}:`, error);
        throw error;
    }
}
