// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');

/**
 * 获取所有字典
 */
export async function getAllDict() {
  const dicts = await prisma.dict.findMany();
  return dicts;
}

/**
 * 根据 ID 获取字典
 */
export async function getDictById(id: number) {
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
export async function getDictByDictCode(dictCode: string) {
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
export async function getDictByDictName(dictName: string) {
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
export async function getDictByModuleName(moduleName: string) {
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
 * 新增字典
 */
export async function addDict(dictData: any) {
  const { dictCode, dictName, moduleName, description, status } = dictData;

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
export async function updateDict(dictData: any) {
  const { id, dictCode, dictName, moduleName, description, status } = dictData;

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
export async function deleteDictById(id: number) {
  await prisma.dict.delete({
    where: { id }
  });

  return { message: 'Dict deleted successfully' };
}

/**
 * 根据 dictCode 获取字典项
 */
export async function getDictItemsByDictCode(dictCode: string) {
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
export async function addDictItem(dictItemData: any) {
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
 * 更新字典项
 */
export async function updateDictItem(dictItemData: any) {
  const { id, dictCode, itemValue, itemLabel, sortOrder, status } = dictItemData;

  const dictItem = await prisma.dictItem.update({
    where: { id },
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
 * 删除字典项
 */
export async function deleteDictItemById(id: number) {
  await prisma.dictItem.delete({
    where: { id }
  });

  return { message: 'DictItem deleted successfully' };
}

/**
 * 批量删除字典项
 */
export async function batchDeleteDictItems(ids: number[]) {
  await prisma.dictItem.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  return { message: 'DictItems deleted successfully' };
}
