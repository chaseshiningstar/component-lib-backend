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
const formService_1 = require("../services/formService");
//查询所有表单
router.get('/', async (req, res) => {
    try {
        console.log('getAllForm');
        const forms = await (0, formService_1.getAllForm)();
        // 处理 BigInt 序列化问题，将 BigInt 转换为字符串
        const serializedForms = forms.map((form) => ({
            ...form,
            id: form.id.toString()
        }));
        res.json({ code: 200, message: '获取表单列表成功', data: serializedForms });
    }
    catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
//按ID查询表单
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const form = await (0, formService_1.getFormById)(id);
        if (!form) {
            res.status(404).json({ code: 404, message: 'Form not found', data: null });
            return;
        }
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.json({ code: 200, message: '获取表单成功', data: serializedForm });
    }
    catch (error) {
        console.error('Error fetching form:', error);
        res.status(404).json({ code: 404, message: 'Form not found', data: null });
    }
});
//按表单名称查询表单
router.get('/formName/:formName', async (req, res) => {
    try {
        const formName = req.params.formName;
        const forms = await (0, formService_1.getFormByFormName)(formName);
        if (!forms || forms.length === 0) {
            res.status(404).json({ code: 404, message: 'Form not found', data: null });
            return;
        }
        // 处理 BigInt 序列化问题
        const serializedForms = forms.map((form) => ({
            ...form,
            id: form.id.toString()
        }));
        res.json({ code: 200, message: '获取表单列表成功', data: serializedForms });
    }
    catch (error) {
        console.error('Error fetching form:', error);
        res.status(404).json({ code: 404, message: 'Form not found', data: null });
    }
});
//新增表单
router.post('/', async (req, res) => {
    try {
        const formData = req.body;
        const form = await (0, formService_1.addForm)(formData);
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.status(201).json({ code: 200, message: '新增表单成功', data: serializedForm });
    }
    catch (error) {
        console.error('Error adding form:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
//按ID删除表单
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, formService_1.deleteFormById)(id);
        res.json({ code: 200, message: '删除表单成功', data: { message: 'Form deleted successfully' } });
    }
    catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
//批量删除表单
router.delete('/batch/:ids', async (req, res) => {
    try {
        const ids = req.params.ids.split(',');
        await Promise.all(ids.map(async (id) => (0, formService_1.deleteFormById)(parseInt(id))));
        res.json({ code: 200, message: '批量删除表单成功', data: ids.map(() => ({ message: 'Form deleted successfully' })) });
    }
    catch (error) {
        console.error('Error deleting forms:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
//按ID更新表单
router.put('/:id', async (req, res) => {
    try {
        const formData = {
            ...req.body,
            id: parseInt(req.params.id) // 将URL中的id合并到formData中
        };
        const form = await (0, formService_1.updateForm)(formData);
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.json({ code: 200, message: '更新表单成功', data: serializedForm });
    }
    catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
});
module.exports = router;
//# sourceMappingURL=form.js.map