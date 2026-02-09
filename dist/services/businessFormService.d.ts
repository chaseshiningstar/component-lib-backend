export declare function getDepartmentColumn(): Promise<any>;
/**
 * @route GET /department
 * @description 获取所有部门
 * @access Public
 */
export declare function getDepartment(): Promise<any>;
/**
 * @route GET /employee
 * @description 获取所有员工
 * @access Public
 */
export declare function getEmployee(): Promise<any>;
/**
 * @route GET /salesRecord
 * @description 获取所有销售记录
 * @access Public
 */
export declare function getSalesRecord(): Promise<any>;
/**
 * 动态获取业务表表头
 */
export declare function dynamicGetBusinessFormColumn(tableName: string): Promise<any>;
