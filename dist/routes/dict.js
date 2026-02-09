"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const router = express.Router();
// 导入字典相关的服务函数
const dictService_1 = require("../services/dictService");
// ===== 字典相关路由 =====
{
    // 查询所有字典
    router.get('/', async (req, res) => {
        try {
            const dicts = await (0, dictService_1.getAllDict)();
            res.json({ code: 200, message: '获取字典列表成功', data: dicts });
        }
        catch (error) {
            console.error('Error fetching dicts:', error);
            res.status(500).json({ code: 500, message: 'Internal server error', data: null });
        }
    });
    // 查询所有模块（module_management的字典项）
    router.get('/allModule', async (req, res) => {
        try {
            const dictItems = await (0, dictService_1.getDictItemsByDictCode)('module_management');
            const modules = dictItems.map(item => ({
                label: item.itemLabel,
                value: item.itemValue,
            }));
            res.json({ code: 200, message: '获取模块列表成功', data: modules });
        }
        catch (error) {
            console.error('Error fetching modules:', error);
            res.status(500).json({ code: 500, message: 'Internal server error', data: null });
        }
    });
    // 查询数据库已有数据的模块
    router.get('/module', async (req, res) => {
        try {
            const modules = await (0, dictService_1.getExistingModules)();
            res.json({ code: 200, message: '获取模块列表成功', data: modules });
        }
        catch (error) {
            console.error('Error fetching modules:', error);
            res.status(500).json({ code: 500, message: 'Internal server error', data: null });
        }
    });
    // 按ID查询字典
    router.get('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const dict = await (0, dictService_1.getDictById)(id);
            if (!dict) {
                res.status(404).json({ code: 404, message: 'Dict not found', data: null });
                return;
            }
            res.json({ code: 200, message: '获取字典成功', data: dict });
        }
        catch (error) {
            console.error('Error fetching dict:', error);
            res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        }
    });
    // 按dictCode查询字典
    router.get('/dictCode/:dictCode', async (req, res) => {
        try {
            const dictCode = req.params.dictCode;
            const dict = await (0, dictService_1.getDictByDictCode)(dictCode);
            if (!dict) {
                res.status(404).json({ code: 404, message: 'Dict not found', data: null });
                return;
            }
            res.json({ code: 200, message: '获取字典成功', data: dict });
        }
        catch (error) {
            console.error('Error fetching dict:', error);
            res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        }
    });
    // 按dictName查询字典
    router.get('/dictName/:dictName', async (req, res) => {
        try {
            const dictName = req.params.dictName;
            const dict = await (0, dictService_1.getDictByDictName)(dictName);
            if (!dict) {
                res.status(404).json({ code: 404, message: 'Dict not found', data: null });
                return;
            }
            res.json({ code: 200, message: '获取字典成功', data: dict });
        }
        catch (error) {
            console.error('Error fetching dict:', error);
            res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        }
    });
    // 按moduleName查询字典
    router.get('/moduleName/:moduleName', async (req, res) => {
        try {
            const moduleName = req.params.moduleName;
            const dict = await (0, dictService_1.getDictByModuleName)(moduleName);
            if (!dict) {
                res.status(404).json({ code: 404, message: 'Dict not found', data: null });
                return;
            }
            res.json({ code: 200, message: '获取字典成功', data: dict });
        }
        catch (error) {
            console.error('Error fetching dict:', error);
            res.status(404).json({ code: 404, message: 'Dict not found', data: null });
        }
    });
}
// 新增字典
router.post('/', async (req, res) => {
    try {
        const dictData = req.body;
        const dict = await (0, dictService_1.addDict)(dictData);
        res.status(201).json({ code: 200, message: '新增字典成功', data: dict });
    }
    catch (error) {
        console.error('Error adding dict:', error);
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
});
// 按ID更新字典
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dictData = {
            ...req.body,
            id
        };
        const dict = await (0, dictService_1.updateDict)(dictData);
        res.json({ code: 200, message: '更新字典成功', data: dict });
    }
    catch (error) {
        console.error('Error updating dict:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 按ID删除字典
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, dictService_1.deleteDictById)(id);
        res.json({ code: 200, message: '删除字典成功', data: { message: 'Dict deleted successfully' } });
    }
    catch (error) {
        console.error('Error deleting dict:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// ===== 字典项相关路由 =====
// 按dictCode查询字典项
router.get('/item/:dictCode', async (req, res) => {
    try {
        const dictCode = req.params.dictCode;
        const dictItems = await (0, dictService_1.getDictItemsByDictCode)(dictCode);
        if (!dictItems) {
            res.status(404).json({ code: 404, message: 'DictItems not found', data: null });
            return;
        }
        const sortedDictItems = dictItems.sort((a, b) => a.sortOrder - b.sortOrder);
        res.json({ code: 200, message: '获取字典项列表成功', data: sortedDictItems });
    }
    catch (error) {
        console.error('Error fetching dict items:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 按dictCode查询字典项
router.post('/item', async (req, res) => {
    try {
        const dictCode = req.body.dictCode;
        const dictItems = await (0, dictService_1.getDictItemsByDictCode)(dictCode);
        if (!dictItems) {
            res.status(404).json({ code: 404, message: 'DictItems not found', data: null });
            return;
        }
        const sortedDictItems = dictItems.sort((a, b) => a.sortOrder - b.sortOrder);
        res.json({ code: 200, message: '获取字典项列表成功', data: sortedDictItems });
    }
    catch (error) {
        console.error('Error fetching dict items:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 新增字典项
router.post('/item', async (req, res) => {
    try {
        const dictItemData = req.body;
        const dictItem = await (0, dictService_1.addDictItem)(dictItemData);
        res.status(201).json({ code: 200, message: '新增字典项成功', data: dictItem });
    }
    catch (error) {
        console.error('Error adding dict item:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 批量新增字典项
router.post('/items/batch', async (req, res) => {
    try {
        const dictItemsData = req.body;
        const result = await (0, dictService_1.batchAddDictItems)(dictItemsData);
        res.status(201).json({ code: 200, message: '批量新增字典项成功', data: result });
    }
    catch (error) {
        console.error('Error batch adding dict items:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 按ID删除字典项
router.delete('/item/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, dictService_1.deleteDictItemById)(id);
        res.json({ code: 200, message: '删除字典项成功', data: { message: 'Dict item deleted successfully' } });
    }
    catch (error) {
        console.error('Error deleting dict item:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
// 按字典编码删除一个字典的所有字典项
router.delete('/item/batch/:dictCode', async (req, res) => {
    try {
        const dictCode = req.params.dictCode;
        await (0, dictService_1.batchDeleteDictItems)(dictCode);
        res.json({ code: 200, message: '删除字典项成功', data: { message: 'Dict items deleted successfully' } });
    }
    catch (error) {
        console.error('Error deleting dict items:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
module.exports = router;
//# sourceMappingURL=dict.js.map