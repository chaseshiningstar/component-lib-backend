// 导入 Prisma 客户端实例
const prisma = require('../lib/prisma');
export async function getAllForm() {
  const forms = await prisma.form.findMany()
  return forms
}
export async function getFormByFormName(formName: string) {
  // 1. 查找所有名称中包含指定字符串的表单 + 关联字段和配置
  const forms = await prisma.form.findMany({
    where: {
      formName: {
        contains: formName
      }
    }})

  if (forms.length === 0) {
    throw new Error('Form not found')
  }

  return forms;
}

// 根据ID获取表单
export async function getFormById(id: number) {
  // 1. 先查主表 + 关联字段和配置
  const form = await prisma.form.findUnique({
    where: { id }
  })

  if (!form) {
    throw new Error('Form not found')
  }

  return form;
}

//新增表单
export async function addForm(formData: any) {
  const { creator,modifier, createTime ,lastUpdateTime, deleted , formName, formKey, layout , moduleName  } = formData;

  // 1. 先创建主表记录
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
  })

  return form;
}

//按id删除表单
export async function deleteFormById(id: number) {
  // 删除表单记录
  await prisma.form.delete({
    where: { id },
  })

  return { message: 'Form deleted successfully' };
}

//更新表单
export async function updateForm(formData: any) {
  const { id, creator,modifier, createTime ,lastUpdateTime, deleted , formName, formKey, layout , moduleName } = formData;

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
  })

  return form;
}
