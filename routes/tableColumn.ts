import express from 'express';
const router = express.Router();
import {
    getAllTableNames,
    getAllTableColumns,
    getFilterbyTableName,
    getTableColumns,
    createTableColumn,
    copyTableColumn,
    deleteTableColumn,
    saveTableColumns,
    relateTableColumn,
    cancelRelateTableColumn,
} from '../services/tableColumnService';


router.get('/tableName', async (req: any, res: any) => {
    try {
        const tableNames = await getAllTableNames();
        res.json({ code: 200, message: '获取数据库表名列表成功', data: tableNames });
    } catch (error) {
        console.error('Error in getAllTableNames:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});


/**
 * @route GET /tableColumns
 * @description 获取所有数据库表列
 * @access Public
 */
router.get('/', async (req: any, res: any) => {
    try {
        const columns = await getAllTableColumns();
        const serializedColumns = columns.map((column: any) => ({
            ...column,
            id: column.id.toString()
        }));
        res.json({ code: 200, message: '获取数据库表列列表成功', data: serializedColumns });
    } catch (error) {
        console.error('Error in getAllTableColumns:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

router.get('/filters/:tableName', async (req: any, res: any) => {
    try {
        const tableName = req.params.tableName;
        const filters = await getFilterbyTableName(tableName);
        res.json({ code: 200, message: `获取 ${tableName} 表的条件列表成功`, data: filters });
    } catch (error) {
        console.error(`Error in getFilterbyTableName for ${req.params.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

/**
 * @route POST /tableColumns
 * @description 获取指定数据库表头项
 * @access Public
 */
router.post('/', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        const filter = req.body.filter;
        const columns = await getTableColumns(tableName, filter);
        const serializedColumns = columns.map((column: any) => ({
            ...column,
            id: column.id.toString()
        }));
        // 把后端数据转化成前端所需的格式
        const tableData = [];
        const group = serializedColumns.reduce((acc, item) => {
            if (!item.relatedTableName || item.relatedTableName === "") {
                if (!acc[tableName]) acc[tableName] = [];
                acc[tableName].push(item);
                return acc;
            } else {
                const key = item.relatedTableName;
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
            }
        }, {});

        for (const key in group) {
            tableData.push({
                tableName: key,
                data: group[key],
            })
        }

        tableData.forEach((item, index) => {
            if (!item.isRelated) {
                tableData.splice(index, 1);
                tableData.unshift(item);
            }
        })

        res.json({ code: 200, message: `获取 ${tableName} 表列列表成功`, data: tableData });
    } catch (error) {
        console.error(`Error in getTableColumns for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route POST /create
 * @description 新建指定数据库表列
 * @access Public
 */
router.post('/create', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        const filter = req.body.filter;
        const column = req.body.column;
        const savedColumn = await createTableColumn(tableName, filter, column);
        res.json({ code: 200, message: `新建 ${tableName} 表列成功`, data: savedColumn });
    } catch (error) {
        console.error(`Error in createTableColumn for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

/**
 * @route POST /copy
 * @description 复制指定数据库表列
 * @access Public
 */
router.post('/copy', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        const filter = req.body.filter;
        const newFilter = req.body.newFilter;
        const copiedColumn = await copyTableColumn(tableName, filter, newFilter);
        res.json({ code: 200, message: `复制 ${tableName} 表列成功`, data: copiedColumn });
    } catch (error) {
        console.error(`Error in copyTableColumn for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route POST /delete
 * @description 删除指定数据库表列
 * @access Public
 */
router.post('/delete', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        const filter = req.body.filter;
        const deletedColumn = await deleteTableColumn(tableName, filter);
        res.json({ code: 200, message: `删除 ${tableName} 表列成功`, data: deletedColumn });
    } catch (error) {
        console.error(`Error in deleteTableColumn for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route POST /save
 * @description 保存指定数据库表列
 * @access Public
 */
router.post('/save', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        console.log("tableName:", tableName);
        console.log("changedTableName:", req.body.changedTableName);
        const changedTableName = req.body.changedTableName == tableName ? '' : req.body.changedTableName;
        console.log("changedTableName:", changedTableName);
        const filter = req.body.filter;
        const columns = req.body.tableData;
        console.log("保存的表头项:", columns);
        const savedColumns = await saveTableColumns(tableName, changedTableName, filter, columns);
        res.json({ code: 200, message: `保存 ${tableName} 表列成功`, data: savedColumns });
    } catch (error) {
        console.error(`Error in saveTableColumns for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route POST /relate
 * @description 关联指定数据库表列
 * @access Public
 */
router.post('/relate', async (req: any, res: any) => {
    try {
        const columns = req.body.columns;
        const relatedColumns = await relateTableColumn(columns);
        res.json({ code: 200, message: `关联 ${columns[0].tableName} 表列成功`, data: relatedColumns });
    } catch (error) {
        console.error(`Error in relateTableColumn for ${req.body.columns[0].tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
/**
 * @route POST /cancelRelate
 * @description 取消关联指定数据库表列
 * @access Public
 */
router.post('/cancelRelate', async (req: any, res: any) => {
    try {
        const tableName = req.body.tableName;
        const filter = req.body.filter;
        const relatedTableName = req.body.relatedTableName;
        const updatedColumns = await cancelRelateTableColumn(tableName, filter, relatedTableName);
        res.json({ code: 200, message: `取消关联 ${tableName} 表列成功`, data: updatedColumns });
    } catch (error) {
        console.error(`Error in cancelRelateTableColumn for ${req.body.tableName}:`, error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});
module.exports = router;    