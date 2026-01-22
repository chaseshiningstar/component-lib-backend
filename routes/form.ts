import * as express from 'express';
const router = express.Router();
import { getAllForm, getFormByFormName, addForm, deleteFormById, updateForm, getFormById } from '../services/formService';


//查询所有表单
router.get('/', async (req: any, res: any) => {
    try {
        const forms = await getAllForm();
        // 处理 BigInt 序列化问题，将 BigInt 转换为字符串
        const serializedForms = forms.map((form: any) => ({
            ...form,
            id: form.id.toString()
        }));
        res.json(serializedForms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//按ID查询表单
router.get('/:id', async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        const form = await getFormById(id);
        if (!form) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.json(serializedForm);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(404).json({ error: 'Form not found' });
    }
});
//按表单名称查询表单
router.get('/formName/:formName', async (req: any, res: any) => {
    try {
        const formName = req.params.formName;
        const forms = await getFormByFormName(formName);
        if (!forms || forms.length === 0) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }
        // 处理 BigInt 序列化问题
        const serializedForms = forms.map((form: any) => ({
            ...form,
            id: form.id.toString()
        }));
        res.json(serializedForms);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(404).json({ error: 'Form not found' });
    }
});

//新增表单
router.post('/', async (req: any, res: any) => {
    try {
        const formData = req.body;
        const form = await addForm(formData);
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.status(201).json(serializedForm);
    } catch (error) {
        console.error('Error adding form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//按ID删除表单
router.delete('/:id', async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        const form = await deleteFormById(id);
        res.json(form);
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//批量删除表单
router.delete('/batch/:ids', async (req: any, res: any) => {
    try {
        const ids = req.params.ids.split(',');
        const forms = await Promise.all(ids.map(async (id: any) => deleteFormById(parseInt(id))));
        res.json(forms);
    } catch (error) {
        console.error('Error deleting forms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//按ID更新表单
router.put('/:id', async (req: any, res: any) => {
    try {
        const formData = {
            ...req.body,
            id: parseInt(req.params.id) // 将URL中的id合并到formData中
        };
        const form = await updateForm(formData);
        // 处理 BigInt 序列化问题
        const serializedForm = {
            ...form,
            id: form.id.toString()
        };
        res.json(serializedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});







module.exports = router;
