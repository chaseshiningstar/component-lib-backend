import * as express from 'express';
const router = express.Router();

// 导入字典相关的服务函数
import {
  getAllDict,
  getDictById,
  getDictByDictCode,
  getDictByDictName,
  getDictByModuleName,
  addDict,
  updateDict,
  deleteDictById,
  getDictItemsByDictCode,
  addDictItem,
  updateDictItem,
  deleteDictItemById,
  batchDeleteDictItems
} from '../services/dictService';

// ===== 字典相关路由 =====

{
  // 查询所有字典
router.get('/', async (req: any, res: any) => {
  try {
    const dicts = await getAllDict();
    res.json(dicts);
  } catch (error) {
    console.error('Error fetching dicts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 按ID查询字典
router.get('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const dict = await getDictById(id);
    if (!dict) {
      res.status(404).json({ error: 'Dict not found' });
      return;
    }
    res.json(dict);
  } catch (error) {
    console.error('Error fetching dict:', error);
    res.status(404).json({ error: 'Dict not found' });
  }
});

// 按dictCode查询字典
router.get('/dictCode/:dictCode', async (req: any, res: any) => {
  try {
    const dictCode = req.params.dictCode;
    const dict = await getDictByDictCode(dictCode);
    if (!dict) {
      res.status(404).json({ error: 'Dict not found' });
      return;
    }
    res.json(dict);
  } catch (error) {
    console.error('Error fetching dict:', error);
    res.status(404).json({ error: 'Dict not found' });
  }
});
// 按dictName查询字典
router.get('/dictName/:dictName', async (req: any, res: any) => {
  try {
    const dictName = req.params.dictName;
    const dict = await getDictByDictName(dictName);
    if (!dict) {
      res.status(404).json({ error: 'Dict not found' });
      return;
    }
    res.json(dict);
  } catch (error) {
    console.error('Error fetching dict:', error);
    res.status(404).json({ error: 'Dict not found' });
  }
});
// 按moduleName查询字典
router.get('/moduleName/:moduleName', async (req: any, res: any) => {
  try {
    const moduleName = req.params.moduleName;
    const dict = await getDictByModuleName(moduleName);
    if (!dict) {
      res.status(404).json({ error: 'Dict not found' });
      return;
    }
    res.json(dict);
  } catch (error) {
    console.error('Error fetching dict:', error);
    res.status(404).json({ error: 'Dict not found' });
  }
});
}

// 新增字典
router.post('/', async (req: any, res: any) => {
  try {
    const dictData = req.body;
    const dict = await addDict(dictData);
    res.status(201).json(dict);
  } catch (error) {
    console.error('Error adding dict:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.json(dict);
  } catch (error) {
    console.error('Error updating dict:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 按ID删除字典
router.delete('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const dict = await deleteDictById(id);
    res.json(dict);
  } catch (error) {
    console.error('Error deleting dict:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== 字典项相关路由 =====

// 查询所有字典项
router.get('/item/:dictCode', async (req: any, res: any) => {
  try {
    const dictCode = req.params.dictCode;
    const dictItems = await getDictItemsByDictCode(dictCode);
    if (!dictItems) {
      res.status(404).json({ error: 'DictItems not found' });
      return;
    }
    res.json(dictItems);
  } catch (error) {
    console.error('Error fetching dict items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// 新增字典项
router.post('/item', async (req: any, res: any) => {
  try {
    const dictItemData = req.body;
    const dictItem = await addDictItem(dictItemData);
    res.status(201).json(dictItem);
  } catch (error) {
    console.error('Error adding dict item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 按ID更新字典项
router.put('/item/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const dictItemData = {
      ...req.body,
      id
    };
    const dictItem = await updateDictItem(dictItemData);
    res.json(dictItem);
  } catch (error) {
    console.error('Error updating dict item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 按ID删除字典项
router.delete('/item/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const dictItem = await deleteDictItemById(id);
    res.json(dictItem);
  } catch (error) {
    console.error('Error deleting dict item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 批量删除字典项
// router.delete('/item/batch/:ids', async (req: any, res: any) => {
//   try {
//     const ids = req.params.ids.split(',').map((id: any) => parseInt(id));
//     const result = await batchDeleteDictItems(ids);
//     res.json(result);
//   } catch (error) {
//     console.error('Error deleting dict items:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;
