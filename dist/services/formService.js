"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllForm = getAllForm;
exports.getFormByFormName = getFormByFormName;
exports.getFormById = getFormById;
exports.addForm = addForm;
exports.deleteFormById = deleteFormById;
exports.updateForm = updateForm;
// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');
async function getAllForm() {
    const forms = await prisma.form.findMany();
    return forms;
}
async function getFormByFormName(formName) {
    // 1. 查找所有名称中包含指定字符串的表单 + 关联字段和配置
    const forms = await prisma.form.findMany({
        where: {
            formName: {
                contains: formName
            }
        }
    });
    if (forms.length === 0) {
        throw new Error('Form not found');
    }
    return forms;
}
// 根据ID获取表单
async function getFormById(id) {
    // 1. 先查主表 + 关联字段和配置
    const form = await prisma.form.findUnique({
        where: { id }
    });
    if (!form) {
        throw new Error('Form not found');
    }
    return form;
}
//新增表单
async function addForm(formData) {
    const { creator, modifier, createTime, lastUpdateTime, deleted, formName, formKey, moduleName } = formData;
    const layout = JSON.stringify({
        list: [
            {
                fieldType: "input",
                label: "名称",
                name: "dictName",
                id: "wevaydtztweg",
                require: true,
            },
            {
                fieldType: "input",
                label: "值",
                name: "dictValue",
                id: "beshp4br07f5",
                require: true,
            },
        ],
        config: {
            layoutType: "horizontal",
            labelWidth: "120px",
            labelAlign: "left",
        }
    });
    //创建表单记录
    const form = await prisma.form.create({
        data: {
            formName,
            formKey,
            layout,
            moduleName,
            creator,
            modifier,
            createTime,
            lastUpdateTime,
            deleted,
        },
    });
    return form;
}
//按id删除表单
async function deleteFormById(id) {
    // 删除表单记录
    await prisma.form.delete({
        where: { id },
    });
    return { message: 'Form deleted successfully' };
}
//更新表单
async function updateForm(formData) {
    const { id, creator, modifier, createTime, lastUpdateTime, deleted, formName, formKey, layout, moduleName } = formData;
    // 更新表单记录
    const form = await prisma.form.update({
        where: { id },
        data: {
            formName,
            formKey,
            layout,
            moduleName,
            creator,
            modifier,
            createTime,
            lastUpdateTime,
            deleted,
        },
    });
    return form;
}
//# sourceMappingURL=formService.js.map