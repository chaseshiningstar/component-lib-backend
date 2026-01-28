// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');

interface DictItem {
  id: number;
  itemLabel: string;
  itemValue: string;
  dictCode: string;
  sortOrder: number;
  status: boolean;
}

/**
 * 获取所有字典
 */
export async function getAllDict() {
  const dicts = await prisma.dict.findMany();
  return dicts;
}

/**
 * 获取所有模块
 */
export async function getExistingModules() {
  const modules = await prisma.dict.findMany({
    select: {
      moduleName: true
    }
  });
  const result = new Set(modules.map((item: any) => item.moduleName));
  const resultWithName = await prisma.dictItem.findMany({
    where: {
      itemValue: {
        in: Array.from(result)
      }
    }
  });
  
  return Array.from(resultWithName.map((item: any) => ({moduleName: item.itemValue, moduleLabel: item.itemLabel})));
  // return [...resultWithName]
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
 * 检查是否有重复的字典
 */
export async function checkDuplicateDict(
  dictCode: string,
  dictName: string,
  excludeId?: number // 编辑时传入当前字典 ID
) {
  // 构造查询条件：查 dictCode 或 dictName 重复的记录（排除自身）
  const where: any = {
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
  const dictCodeExists = existing?.dictCode === dictCode;
  const dictNameExists = existing?.dictName === dictName;

  return { dictCodeExists, dictNameExists };
}


/**
 * 新增字典
 */
export async function addDict(dictData: any) {
  const { dictCode, dictName, moduleName, description, status } = dictData;

  // 检查是否有重复
  const { dictCodeExists, dictNameExists } = await checkDuplicateDict(dictCode, dictName);
  if (dictCodeExists && dictNameExists) {
    throw new Error('Dict code and name already exists');
  } else if (dictCodeExists) {
    throw new Error('Dict code already exists');
  } else if (dictNameExists) {
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
export async function updateDict(dictData: any) {
  const { id, dictCode, dictName, moduleName, description, status } = dictData;

  // 检查是否有重复
  const { dictCodeExists, dictNameExists } = await checkDuplicateDict(dictCode, dictName, id);
  if (dictCodeExists && dictNameExists) {
    throw new Error('Dict code and name already exists');
  } else if (dictCodeExists) {
    throw new Error('Dict code already exists');
  } else if (dictNameExists) {
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
export async function deleteDictById(id: number) {
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
 * 批量新增字典项
 */
export async function batchAddDictItems(dictItemsData: any[]) {
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
export async function deleteDictItemById(id: number) {
  await prisma.dictItem.delete({
    where: { id }
  });

  return { message: 'DictItem deleted successfully' };
}

/**
 * 按字典编码删除一个字典的所有字典项
 */
export async function batchDeleteDictItems(dictCode: string) {
  await prisma.dictItem.deleteMany({
    where: {
      dictCode
    }
  });
}
