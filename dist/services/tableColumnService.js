"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTableNames = getAllTableNames;
exports.getAllTableColumns = getAllTableColumns;
exports.getFilterbyTableName = getFilterbyTableName;
exports.getTableColumns = getTableColumns;
exports.createTableColumn = createTableColumn;
exports.copyTableColumn = copyTableColumn;
exports.deleteTableColumn = deleteTableColumn;
exports.saveTableColumns = saveTableColumns;
exports.relateTableColumn = relateTableColumn;
exports.cancelRelateTableColumn = cancelRelateTableColumn;
// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');
/**
 * 获取所有数据库表名（Prisma模型名）
 * @returns 表名数组
 */
function getAllTableNames() {
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
        console.log('从 Prisma 客户端获取的表名列表:');
        return modelNames;
    }
    catch (error) {
        console.error('Error getting table names:', error);
        return [];
    }
}
/**
 * 获取所有数据库表列配置
 * @returns 表列配置数组
 */
async function getAllTableColumns() {
    try {
        console.log('尝试getAllTableColumns');
        const columns = await prisma.tableColumnConfig.findMany();
        return columns;
    }
    catch (error) {
        console.error('Error querying tableColumnConfig:', error);
    }
}
/**
 * 获取指定数据库表的所有过滤条件
 * @param tableName 表名
 * @returns 过滤条件数组
 */
async function getFilterbyTableName(tableName) {
    try {
        console.log(`尝试从 ${tableName} 表中查询过滤条件...`);
        const filters = await prisma.tableColumnConfig.findMany({
            where: {
                tableName: tableName,
            },
            select: {
                conditionName: true,
            }
        });
        // 去重并返回条件名称数组
        const uniqueConditions = [...new Set(filters.map((item) => item.conditionName))];
        return uniqueConditions;
    }
    catch (error) {
        console.error('Error querying tableColumnConfig:', error);
        throw error;
    }
}
/**
 * 获取指定数据库表的所有表头配置
 * @param tableName 表名
 * @param filter 过滤条件
 * @returns 列配置数组
 */
async function getTableColumns(tableName, filter) {
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
        return columns;
    }
    catch (error) {
        console.error(`Error querying ${tableName}:`, error);
    }
}
// 新建表头项
async function createTableColumn(tableName, filter, columns) {
    try {
        // 输入参数验证
        if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
            throw new Error('Invalid tableName parameter');
        }
        if (!filter || typeof filter !== 'string' || filter.trim() === '') {
            throw new Error('Invalid filter parameter');
        }
        if (!Array.isArray(columns)) {
            throw new Error('Invalid columns parameter, must be an array');
        }
        // 限制记录数量
        if (columns.length > 1000) {
            throw new Error('Too many columns to create, please contact administrator');
        }
        console.log(`尝试新建表头项...`);
        const savedColumns = await prisma.tableColumnConfig.createMany({
            data: columns.map((column) => ({
                ...column,
                tableName: tableName,
                conditionName: filter,
                relatedTableName: column.relatedTableName || ''
            }))
        });
        return savedColumns;
    }
    catch (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
    }
}
// 复制表头项 
async function copyTableColumn(tableName, filter, newFilter) {
    try {
        // 输入参数验证
        if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
            throw new Error('Invalid tableName parameter');
        }
        if (!filter || typeof filter !== 'string' || filter.trim() === '') {
            throw new Error('Invalid filter parameter');
        }
        if (!newFilter || typeof newFilter !== 'string' || newFilter.trim() === '') {
            throw new Error('Invalid newFilter parameter');
        }
        console.log(`尝试复制 ${tableName} 的 ${filter} 表头项到 ${newFilter}`);
        // 查询符合条件的记录
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
        // 限制记录数量
        if (columns.length > 1000) {
            throw new Error('Too many columns to copy, please contact administrator');
        }
        await createTableColumn(tableName, newFilter, columns);
        console.log(`复制 ${tableName} 的 ${filter} 表头项到 ${newFilter} 成功`);
        return { success: true };
    }
    catch (error) {
        console.error(`Error querying ${tableName}:`, error);
        throw error;
    }
}
// 删除表头配置项
async function deleteTableColumn(tableName, filter) {
    try {
        // 输入参数验证
        if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
            throw new Error('Invalid tableName parameter');
        }
        if (!filter || typeof filter !== 'string' || filter.trim() === '') {
            throw new Error('Invalid filter parameter');
        }
        console.log(`尝试删除 ${tableName} 的 ${filter} 表头项...`);
        // 查询符合条件的记录数量
        const count = await prisma.tableColumnConfig.count({
            where: {
                tableName: tableName,
                conditionName: filter
            }
        });
        // 限制删除的记录数量
        if (count > 1000) {
            throw new Error('Too many records to delete, please contact administrator');
        }
        const deletedColumns = await prisma.tableColumnConfig.deleteMany({
            where: {
                tableName: tableName,
                conditionName: filter
            }
        });
        console.log(`删除结果:`, deletedColumns);
        return deletedColumns;
    }
    catch (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
    }
}
// 保存表头配置
async function saveTableColumns(tableName, changedTableName, filter, columns) {
    try {
        // 输入参数验证
        if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
            throw new Error('Invalid tableName parameter');
        }
        if (!changedTableName || typeof changedTableName !== 'string' || changedTableName.trim() === '') {
            throw new Error('Invalid changedTableName parameter');
        }
        if (!filter || typeof filter !== 'string' || filter.trim() === '') {
            throw new Error('Invalid filter parameter');
        }
        if (!Array.isArray(columns)) {
            throw new Error('Invalid columns parameter, must be an array');
        }
        // 限制记录数量
        if (columns.length > 1000) {
            throw new Error('Too many columns to save, please contact administrator');
        }
        console.log(`尝试保存 ${tableName} 的表头项...`);
        // 使用事务处理，确保数据一致性
        const result = await prisma.$transaction(async (prisma) => {
            // 先查询符合条件的记录数量
            const deleteCount = await prisma.tableColumnConfig.count({
                where: {
                    tableName: tableName,
                    conditionName: filter,
                    relatedTableName: changedTableName === tableName ? '' : changedTableName,
                }
            });
            // 限制删除的记录数量
            if (deleteCount > 1000) {
                throw new Error('Too many records to delete, please contact administrator');
            }
            // 先删除旧数据
            await prisma.tableColumnConfig.deleteMany({
                where: {
                    tableName: tableName,
                    conditionName: filter,
                    relatedTableName: changedTableName === tableName ? '' : changedTableName,
                }
            });
            // 再创建新数据
            const savedColumns = await prisma.tableColumnConfig.createMany({
                data: columns.map((column) => ({
                    ...column,
                    tableName: tableName,
                    conditionName: filter,
                    relatedTableName: changedTableName === tableName ? '' : changedTableName,
                }))
            });
            return savedColumns;
        });
        console.log(`保存结果:`, result);
        return result;
    }
    catch (error) {
        console.error(`Error saving ${tableName}:`, error);
        throw error;
    }
}
// 关联新表
async function relateTableColumn(columns) {
    try {
        // 输入参数验证
        if (!Array.isArray(columns)) {
            throw new Error('Invalid columns parameter, must be an array');
        }
        // 处理空数组情况
        if (columns.length === 0) {
            throw new Error('Columns array cannot be empty');
        }
        // 限制记录数量
        if (columns.length > 1000) {
            throw new Error('Too many columns to relate, please contact administrator');
        }
        // 验证数组元素
        const firstColumn = columns[0];
        if (!firstColumn || typeof firstColumn !== 'object') {
            throw new Error('Invalid column format');
        }
        const tableName = firstColumn.tableName;
        const conditionName = firstColumn.conditionName;
        const relatedTableName = firstColumn.relatedTableName;
        console.log(`尝试给 ${tableName} 的 ${conditionName} 表头项关联 ${relatedTableName}`);
        const addColumns = await prisma.tableColumnConfig.createMany({
            data: columns.map((column) => ({
                ...column,
            }))
        });
        console.log(`关联结果:`, addColumns);
        return addColumns;
    }
    catch (error) {
        console.error(`Error relating table columns:`, error);
        throw error;
    }
}
// 取消关联新表
async function cancelRelateTableColumn(tableName, filter, relatedTableName) {
    try {
        // 输入参数验证
        if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
            throw new Error('Invalid tableName parameter');
        }
        if (!filter || typeof filter !== 'string' || filter.trim() === '') {
            throw new Error('Invalid filter parameter');
        }
        if (!relatedTableName || typeof relatedTableName !== 'string') {
            throw new Error('Invalid relatedTableName parameter');
        }
        console.log(`尝试取消关联 ${tableName} 的 ${filter} 表头项的关联...`);
        // 查询符合条件的记录数量
        const count = await prisma.tableColumnConfig.count({
            where: {
                tableName: tableName,
                conditionName: filter,
                relatedTableName: relatedTableName
            }
        });
        // 限制删除的记录数量
        if (count > 1000) {
            throw new Error('Too many records to delete, please contact administrator');
        }
        const deletedColumns = await prisma.tableColumnConfig.deleteMany({
            where: {
                tableName: tableName,
                conditionName: filter,
                relatedTableName: relatedTableName
            }
        });
        console.log(`取消关联结果:`, deletedColumns);
        return deletedColumns;
    }
    catch (error) {
        console.error(`Error canceling relating ${tableName}:`, error);
        throw error;
    }
}
//# sourceMappingURL=tableColumnService.js.map