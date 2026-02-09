"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDict = getAllDict;
exports.getExistingModules = getExistingModules;
exports.getDictById = getDictById;
exports.getDictByDictCode = getDictByDictCode;
exports.getDictByDictName = getDictByDictName;
exports.getDictByModuleName = getDictByModuleName;
exports.checkDuplicateDict = checkDuplicateDict;
exports.addDict = addDict;
exports.updateDict = updateDict;
exports.deleteDictById = deleteDictById;
exports.getDictItemsByDictCode = getDictItemsByDictCode;
exports.addDictItem = addDictItem;
exports.batchAddDictItems = batchAddDictItems;
exports.deleteDictItemById = deleteDictItemById;
exports.batchDeleteDictItems = batchDeleteDictItems;
// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');
/**
 * 获取所有字典
 */
async function getAllDict() {
    const dicts = await prisma.dict.findMany();
    return dicts;
}
/**
 * 获取所有模块
 */
async function getExistingModules() {
    const modules = await prisma.dict.findMany({
        select: {
            moduleName: true
        }
    });
    const result = new Set(modules.map((item) => item.moduleName));
    const resultWithName = await prisma.dictItem.findMany({
        where: {
            itemValue: {
                in: Array.from(result)
            }
        }
    });
    return Array.from(resultWithName.map((item) => ({ moduleName: item.itemValue, moduleLabel: item.itemLabel })));
    // return [...resultWithName]
}
/**
 * 根据 ID 获取字典
 */
async function getDictById(id) {
    const dict = await prisma.dict.findUnique({
        where: { id }
    });
    if (!dict) {
        throw new Error('Dict not found');
    }
    return dict;
}
/**
 * 根据 dictCode 获取字典
 */
async function getDictByDictCode(dictCode) {
    const dict = await prisma.dict.findFirst({
        where: {
            dictCode
        }
    });
    if (!dict) {
        throw new Error('Dict not found');
    }
    return dict;
}
/**
 * 根据 dictName 获取字典
 */
async function getDictByDictName(dictName) {
    const dict = await prisma.dict.findFirst({
        where: {
            dictName
        }
    });
    if (!dict) {
        throw new Error('Dict not found');
    }
    return dict;
}
/**
 * 根据 moduleName 获取字典
 */
async function getDictByModuleName(moduleName) {
    const dict = await prisma.dict.findMany({
        where: {
            moduleName
        }
    });
    if (!dict) {
        throw new Error('Dict not found');
    }
    return dict;
}
/**
 * 检查是否有重复的字典
 */
async function checkDuplicateDict(dictCode, dictName, excludeId // 编辑时传入当前字典 ID
) {
    // 构造查询条件：查 dictCode 或 dictName 重复的记录（排除自身）
    const where = {
        OR: [
            { dictCode },
            { dictName }
        ]
    };
    // 如果是编辑，排除当前记录
    if (excludeId !== undefined) {
        where.id = { not: excludeId };
    }
    // 查询是否存在重复
    const existing = await prisma.dict.findFirst({
        where,
        select: {
            dictCode: true,
            dictName: true
        }
    });
    // 判断具体哪个字段重复
    const dictCodeExists = (existing === null || existing === void 0 ? void 0 : existing.dictCode) === dictCode;
    const dictNameExists = (existing === null || existing === void 0 ? void 0 : existing.dictName) === dictName;
    return { dictCodeExists, dictNameExists };
}
/**
 * 新增字典
 */
async function addDict(dictData) {
    const { dictCode, dictName, moduleName, description, status } = dictData;
    // 检查是否有重复
    const { dictCodeExists, dictNameExists } = await checkDuplicateDict(dictCode, dictName);
    if (dictCodeExists && dictNameExists) {
        throw new Error('Dict code and name already exists');
    }
    else if (dictCodeExists) {
        throw new Error('Dict code already exists');
    }
    else if (dictNameExists) {
        throw new Error('Dict name already exists');
    }
    const dict = await prisma.dict.create({
        data: {
            dictCode,
            dictName,
            moduleName,
            description,
            status
        }
    });
    return dict;
}
/**
 * 更新字典
 */
async function updateDict(dictData) {
    const { id, dictCode, dictName, moduleName, description, status } = dictData;
    // 检查是否有重复
    const { dictCodeExists, dictNameExists } = await checkDuplicateDict(dictCode, dictName, id);
    if (dictCodeExists && dictNameExists) {
        throw new Error('Dict code and name already exists');
    }
    else if (dictCodeExists) {
        throw new Error('Dict code already exists');
    }
    else if (dictNameExists) {
        throw new Error('Dict name already exists');
    }
    const dict = await prisma.dict.update({
        where: { id },
        data: {
            dictCode,
            dictName,
            moduleName,
            description,
            status
        }
    });
    return dict;
}
/**
 * 删除字典
 */
async function deleteDictById(id) {
    await prisma.dict.delete({
        where: { id }
    });
    return { message: 'Dict deleted successfully' };
}
// ------------------------------------------------------------------------------------
/**
 * 字典项相关
 * /
 *
/**
 * 根据 dictCode 获取字典项
 */
async function getDictItemsByDictCode(dictCode) {
    const dictItems = await prisma.dictItem.findMany({
        where: {
            dictCode,
            status: true
        },
        orderBy: {
            sortOrder: 'asc'
        }
    });
    return dictItems;
}
/**
 * 新增字典项
 */
async function addDictItem(dictItemData) {
    const { dictCode, itemValue, itemLabel, sortOrder, status } = dictItemData;
    const dictItem = await prisma.dictItem.create({
        data: {
            dictCode,
            itemValue,
            itemLabel,
            sortOrder,
            status
        }
    });
    return dictItem;
}
/**
 * 批量新增字典项
 */
async function batchAddDictItems(dictItemsData) {
    const dictItems = await prisma.dictItem.createMany({
        data: Object.values(dictItemsData).map((item) => ({
            dictCode: item.dictCode,
            itemValue: item.itemValue,
            itemLabel: item.itemLabel,
            sortOrder: item.sortOrder,
            status: item.status
        }))
    });
    return dictItems;
}
/**
 * 删除字典项
 */
async function deleteDictItemById(id) {
    await prisma.dictItem.delete({
        where: { id }
    });
    return { message: 'DictItem deleted successfully' };
}
/**
 * 按字典编码删除一个字典的所有字典项
 */
async function batchDeleteDictItems(dictCode) {
    await prisma.dictItem.deleteMany({
        where: {
            dictCode
        }
    });
}
//# sourceMappingURL=dictService.js.map