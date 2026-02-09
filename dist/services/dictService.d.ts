/**
 * 获取所有字典
 */
export declare function getAllDict(): Promise<any>;
/**
 * 获取所有模块
 */
export declare function getExistingModules(): Promise<unknown[]>;
/**
 * 根据 ID 获取字典
 */
export declare function getDictById(id: number): Promise<any>;
/**
 * 根据 dictCode 获取字典
 */
export declare function getDictByDictCode(dictCode: string): Promise<any>;
/**
 * 根据 dictName 获取字典
 */
export declare function getDictByDictName(dictName: string): Promise<any>;
/**
 * 根据 moduleName 获取字典
 */
export declare function getDictByModuleName(moduleName: string): Promise<any>;
/**
 * 检查是否有重复的字典
 */
export declare function checkDuplicateDict(dictCode: string, dictName: string, excludeId?: number): Promise<{
    dictCodeExists: boolean;
    dictNameExists: boolean;
}>;
/**
 * 新增字典
 */
export declare function addDict(dictData: any): Promise<any>;
/**
 * 更新字典
 */
export declare function updateDict(dictData: any): Promise<any>;
/**
 * 删除字典
 */
export declare function deleteDictById(id: number): Promise<{
    message: string;
}>;
/**
 * 字典项相关
 * /
 *
/**
 * 根据 dictCode 获取字典项
 */
export declare function getDictItemsByDictCode(dictCode: string): Promise<any>;
/**
 * 新增字典项
 */
export declare function addDictItem(dictItemData: any): Promise<any>;
/**
 * 批量新增字典项
 */
export declare function batchAddDictItems(dictItemsData: any[]): Promise<any>;
/**
 * 删除字典项
 */
export declare function deleteDictItemById(id: number): Promise<{
    message: string;
}>;
/**
 * 按字典编码删除一个字典的所有字典项
 */
export declare function batchDeleteDictItems(dictCode: string): Promise<void>;
