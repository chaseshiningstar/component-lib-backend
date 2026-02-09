import express from 'express';
const router = express.Router();
import {
    dynamicGetBusinessFormColumn,
    getDepartment,
    getEmployee,
    getSalesRecord,
} from '../services/businessFormService';

/**
 * @route GET /department
 * @description 获取所有部门
 * @access Public
 */
router.get('/department', async (req: any, res: any) => {
    try {
        const departments = await getDepartment();
        res.json({ code: 200, message: '获取部门列表成功', data: departments });
    } catch (error) {
        console.error('Error in getDepartment:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route GET /employee
 * @description 获取所有员工
 * @access Public
 */
router.get('/employee', async (req: any, res: any) => {
    try {
        const employees = await getEmployee();
        res.json({ code: 200, message: '获取员工列表成功', data: employees });
    } catch (error) {
        console.error('Error in getEmployee:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route GET /salesRecord
 * @description 获取所有销售记录
 * @access Public
 */
router.get('/salesRecord', async (req: any, res: any) => {
    try {
        const salesRecords = await getSalesRecord();
        res.json({ code: 200, message: '获取销售记录列表成功', data: salesRecords });
    } catch (error) {
        console.error('Error in getSalesRecord:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route GET /businessFormColumn/:tableName
 * @description 动态获取业务表表头
 * @access Public
 */
router.get('/businessFormColumn/:tableName', async (req: any, res: any) => {
    try {
        const tableName = req.params.tableName;
        const businessFormColumn = await dynamicGetBusinessFormColumn(tableName);
        res.json({ code: 200, message: '获取业务表表头成功', data: businessFormColumn });
    } catch (error) {
        console.error('Error in dynamicGetBusinessFormColumn:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

module.exports = router;