/**
 * 获取所有数据库表名（Prisma模型名）
 * @returns 表名数组
 */
export declare function getAllTableNames(): string[];
/**
 * 获取所有数据库表列配置
 * @returns 表列配置数组
 */
export declare function getAllTableColumns(): Promise<any>;
/**
 * 获取指定数据库表的所有过滤条件
 * @param tableName 表名
 * @returns 过滤条件数组
 */
export declare function getFilterbyTableName(tableName: string): Promise<unknown[]>;
/**
 * 获取指定数据库表的所有表头配置
 * @param tableName 表名
 * @param filter 过滤条件
 * @returns 列配置数组
 */
export declare function getTableColumns(tableName: string, filter: string): Promise<any>;
export declare function createTableColumn(tableName: string, filter: string, columns: any[]): Promise<any>;
export declare function copyTableColumn(tableName: string, filter: string, newFilter: string): Promise<{
    success: boolean;
}>;
export declare function deleteTableColumn(tableName: string, filter: string): Promise<any>;
export declare function saveTableColumns(tableName: string, changedTableName: string, filter: string, columns: any[]): Promise<any>;
export declare function relateTableColumn(columns: any[]): Promise<any>;
export declare function cancelRelateTableColumn(tableName: string, filter: string, relatedTableName: string): Promise<any>;
