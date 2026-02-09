import * as express from 'express';
const router = express.Router();

// 导入字典相关的服务函数
import {
  getAllDict,
  getExistingModules,
  getDictById,
  getDictByDictCode,
  getDictByDictName,
  getDictByModuleName,
  addDict,
  updateDict,
  deleteDictById,
  getDictItemsByDictCode,
  addDictItem,
  deleteDictItemById,
  batchDeleteDictItems,
  batchAddDictItems
} from '../services/dictService';

// ===== 字典相关路由 =====

{
  // 查询所有字典
  router.get('/', async (req: any, res: any) => {
    try {
      const dicts = await getAllDict();
      res.json({ code: 200, message: '获取字典列表成功', data: dicts });
    } catch (error) {
      console.error('Error fetching dicts:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  });

  // 查询所有模块（module_management的字典项）
  router.get('/allModule', async (req: any, res: any) => {
    try {
      const dictItems = await getDictItemsByDictCode('module_management');
      const modules = dictItems.map(item => ({
        label: item.itemLabel,
        value: item.itemValue,
      }));
      res.json({ code: 200, message: '获取模块列表成功', data: modules });
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  });

  // 查询数据库已有数据的模块
  router.get('/module', async (req: any, res: any) => {
    try {
      const modules = await getExistingModules();
      res.json({ code: 200, message: '获取模块列表成功', data: modules });
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  });

  // // 按ID查询字典
  // router.get('/:id', async (req: any, res: any) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const dict = await getDictById(id);
  //     if (!dict) {
  //       res.status(404).json({ code: 404, message: 'Dict not found', data: null });
  //       return;
  //     }
  //     res.json({ code: 200, message: '获取字典成功', data: dict });
  //   } catch (error) {
  //     console.error('Error fetching dict:', error);
  //     res.status(404).json({ code: 404, message: 'Dict not found', data: null });
  //   }
  // });

  // 按dictCode查询字典
  router.get('/dictCode/:dictCode', async (req: any, res: any) => {
    try {
      const dictCode = req.params.dictCode;
      const dict = await getDictByDictCode(dictCode);
      if (!dict) {
        res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        return;
      }
      res.json({ code: 200, message: '获取字典成功', data: dict });
    } catch (error) {
      console.error('Error fetching dict:', error);
      res.status(404).json({ code: 404, message: 'Dict not found', data: null });
    }
  });

  // 按dictName查询字典
  router.get('/dictName/:dictName', async (req: any, res: any) => {
    try {
      const dictName = req.params.dictName;
      const dict = await getDictByDictName(dictName);
      if (!dict) {
        res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        return;
      }
      res.json({ code: 200, message: '获取字典成功', data: dict });
    } catch (error) {
      console.error('Error fetching dict:', error);
      res.status(404).json({ code: 404, message: 'Dict not found', data: null });
    }
  });
  // 按moduleName查询字典
  router.get('/moduleName/:moduleName', async (req: any, res: any) => {
    try {
      const moduleName = req.params.moduleName;
      const dict = await getDictByModuleName(moduleName);
      if (!dict) {
        res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        return;
      }
      res.json({ code: 200, message: '获取字典成功', data: dict });
    } catch (error) {
      console.error('Error fetching dict:', error);
      res.status(404).json({ code: 404, message: 'Dict not found', data: null });
    }
  });
}

// 新增字典
router.post('/', async (req: any, res: any) => {
  try {
    const dictData = req.body;
    const dict = await addDict(dictData);
    res.status(201).json({ code: 200, message: '新增字典成功', data: dict });
  } catch (error) {
    console.error('Error adding dict:', error);
    res.status(500).json({ code: 500, message: error.message, data: null });
  }
});

// 按ID更新字典
router.put('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const dictData = {
      ...req.body,
      id
    };
    const dict = await updateDict(dictData);
    res.json({ code: 200, message: '更新字典成功', data: dict });
  } catch (error) {
    console.error('Error updating dict:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 按ID删除字典
router.delete('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await deleteDictById(id);
    res.json({ code: 200, message: '删除字典成功', data: { message: 'Dict deleted successfully' } });
  } catch (error) {
    console.error('Error deleting dict:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// ===== 字典项相关路由 =====

// 按dictCode查询字典项
router.get('/item/:dictCode', async (req: any, res: any) => {
  try {
    const dictCode = req.params.dictCode;
    const dictItems = await getDictItemsByDictCode(dictCode);
    if (!dictItems) {
      res.status(404).json({ code: 404, message: 'DictItems not found', data: null });
      return;
    }
    const sortedDictItems = dictItems.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    res.json({ code: 200, message: '获取字典项列表成功', data: sortedDictItems });
  } catch (error) {
    console.error('Error fetching dict items:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 按dictCode查询字典项
router.post('/item', async (req: any, res: any) => {
  try {
    const dictCode = req.body.dictCode; 
    const dictItems = await getDictItemsByDictCode(dictCode);
    if (!dictItems) {
      res.status(404).json({ code: 404, message: 'DictItems not found', data: null });
      return;
    }
    const sortedDictItems = dictItems.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    res.json({ code: 200, message: '获取字典项列表成功', data: sortedDictItems });
  } catch (error) {
    console.error('Error fetching dict items:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 新增字典项
router.post('/item', async (req: any, res: any) => {
  try {
    const dictItemData = req.body;
    const dictItem = await addDictItem(dictItemData);
    res.status(201).json({ code: 200, message: '新增字典项成功', data: dictItem });
  } catch (error) {
    console.error('Error adding dict item:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 批量新增字典项
router.post('/items/batch', async (req: any, res: any) => {
  try {
    const dictItemsData = req.body;
    const result = await batchAddDictItems(dictItemsData);
    res.status(201).json({ code: 200, message: '批量新增字典项成功', data: result });
  } catch (error) {
    console.error('Error batch adding dict items:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 按ID删除字典项
router.delete('/item/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await deleteDictItemById(id);
    res.json({ code: 200, message: '删除字典项成功', data: { message: 'Dict item deleted successfully' } });
  } catch (error) {
    console.error('Error deleting dict item:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// 按字典编码删除一个字典的所有字典项
router.delete('/item/batch/:dictCode', async (req: any, res: any) => {
  try {
    const dictCode = req.params.dictCode;
    await batchDeleteDictItems(dictCode);
    res.json({ code: 200, message: '删除字典项成功', data: { message: 'Dict items deleted successfully' } });
  } catch (error) {
    console.error('Error deleting dict items:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});


module.exports = router;
