-- 数据库初始化脚本
-- 适用于MySQL 8.0+

-- 1. 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS system_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 选择数据库
USE system_management;

-- 3. 创建表结构（按依赖顺序）

-- 3.1 模块表
CREATE TABLE IF NOT EXISTS sys_module (
  id VARCHAR(36) PRIMARY KEY COMMENT '模块ID',
  module_name VARCHAR(50) NOT NULL COMMENT '模块名称',
  module_code VARCHAR(50) NOT NULL UNIQUE COMMENT '模块编码',
  description VARCHAR(200) COMMENT '模块描述',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  sort_order INT DEFAULT 0 COMMENT '排序',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT '系统模块表';

-- 3.2 系统用户表
CREATE TABLE IF NOT EXISTS sys_user (
  id VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  nickname VARCHAR(50) COMMENT '昵称',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  email VARCHAR(100) COMMENT '邮箱',
  phone VARCHAR(20) COMMENT '手机号',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '系统用户表';

-- 3.3 表单表
CREATE TABLE IF NOT EXISTS sys_form (
  id VARCHAR(36) PRIMARY KEY COMMENT '表单ID',
  form_name VARCHAR(100) NOT NULL COMMENT '表单名称',
  module_id VARCHAR(36) NOT NULL COMMENT '所属模块ID',
  form_key VARCHAR(50) NOT NULL UNIQUE COMMENT '表单唯一标识',
  create_user_id VARCHAR(36) NOT NULL COMMENT '创建人ID',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (module_id) REFERENCES sys_module(id) ON DELETE CASCADE,
  FOREIGN KEY (create_user_id) REFERENCES sys_user(id) ON DELETE CASCADE
) COMMENT '表单表';

-- 3.4 表单字段表
CREATE TABLE IF NOT EXISTS sys_form_field (
  id VARCHAR(36) PRIMARY KEY COMMENT '字段ID',
  form_id VARCHAR(36) NOT NULL COMMENT '所属表单ID',
  field_type VARCHAR(20) NOT NULL COMMENT '字段类型：input、select、radio等',
  label VARCHAR(50) NOT NULL COMMENT '字段标签',
  name VARCHAR(50) NOT NULL COMMENT '字段名称',
  require TINYINT DEFAULT 0 COMMENT '是否必填：0否，1是',
  placeholder VARCHAR(100) COMMENT '占位符',
  default_value VARCHAR(255) COMMENT '默认值',
  options TEXT COMMENT '选项配置（JSON格式）',
  sort_order INT DEFAULT 0 COMMENT '排序',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (form_id) REFERENCES sys_form(id) ON DELETE CASCADE
) COMMENT '表单字段表';

-- 3.5 表单布局配置表
CREATE TABLE IF NOT EXISTS sys_form_config (
  id VARCHAR(36) PRIMARY KEY COMMENT '配置ID',
  form_id VARCHAR(36) NOT NULL UNIQUE COMMENT '所属表单ID',
  layout_type VARCHAR(20) DEFAULT 'horizontal' COMMENT '布局类型：horizontal、vertical',
  label_width VARCHAR(10) DEFAULT '120px' COMMENT '标签宽度',
  label_align VARCHAR(10) DEFAULT 'left' COMMENT '标签对齐方式：left、right',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (form_id) REFERENCES sys_form(id) ON DELETE CASCADE
) COMMENT '表单布局配置表';

-- 3.6 字典类型表
CREATE TABLE IF NOT EXISTS sys_dict_type (
  id VARCHAR(36) PRIMARY KEY COMMENT '字典类型ID',
  dict_code VARCHAR(50) NOT NULL UNIQUE COMMENT '字典编码',
  dict_name VARCHAR(50) NOT NULL COMMENT '字典名称',
  module_id VARCHAR(36) NOT NULL COMMENT '所属模块ID',
  description VARCHAR(200) COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (module_id) REFERENCES sys_module(id) ON DELETE CASCADE
) COMMENT '字典类型表';

-- 3.7 字典数据表
CREATE TABLE IF NOT EXISTS sys_dict_data (
  id VARCHAR(36) PRIMARY KEY COMMENT '字典数据ID',
  dict_type_id VARCHAR(36) NOT NULL COMMENT '所属字典类型ID',
  dict_label VARCHAR(100) NOT NULL COMMENT '字典标签',
  dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (dict_type_id) REFERENCES sys_dict_type(id) ON DELETE CASCADE
) COMMENT '字典数据表';

-- 3.8 表头管理表
CREATE TABLE IF NOT EXISTS sys_table_header (
  id VARCHAR(36) PRIMARY KEY COMMENT '表头配置ID',
  module_id VARCHAR(36) NOT NULL COMMENT '所属模块ID',
  table_key VARCHAR(50) NOT NULL COMMENT '表格唯一标识',
  column_config TEXT NOT NULL COMMENT '列配置（JSON格式）',
  create_user_id VARCHAR(36) NOT NULL COMMENT '创建人ID',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (module_id) REFERENCES sys_module(id) ON DELETE CASCADE,
  FOREIGN KEY (create_user_id) REFERENCES sys_user(id) ON DELETE CASCADE
) COMMENT '表头管理表';

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_form_module ON sys_form(module_id);
CREATE INDEX IF NOT EXISTS idx_form_key ON sys_form(form_key);
CREATE INDEX IF NOT EXISTS idx_dict_type_module ON sys_dict_type(module_id);
CREATE INDEX IF NOT EXISTS idx_dict_code ON sys_dict_type(dict_code);
CREATE INDEX IF NOT EXISTS idx_dict_data_type ON sys_dict_data(dict_type_id);
CREATE INDEX IF NOT EXISTS idx_dict_data_value ON sys_dict_data(dict_value);
CREATE INDEX IF NOT EXISTS idx_table_header_module ON sys_table_header(module_id);
CREATE INDEX IF NOT EXISTS idx_table_key ON sys_table_header(table_key);

-- 5. 插入初始数据

-- 5.1 插入模块数据
INSERT INTO sys_module (id, module_name, module_code, description, status, sort_order) VALUES
('1', '系统管理', 'system', '系统管理模块', 1, 1),
('2', '表单管理', 'form', '表单管理模块', 1, 2),
('3', '字典管理', 'dict', '字典管理模块', 1, 3),
('4', '表头管理', 'table', '表头管理模块', 1, 4);

-- 5.2 插入初始用户数据（密码：123456，已加密）
INSERT INTO sys_user (id, username, nickname, password, email, phone, status) VALUES
('1', 'admin', '管理员', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin@example.com', '13800138000', 1);

-- 5.3 插入字典类型数据
INSERT INTO sys_dict_type (id, dict_code, dict_name, module_id, description, status) VALUES
('1', 'status', '状态', '1', '通用状态字典', 1),
('2', 'field_type', '字段类型', '2', '表单字段类型', 1);

-- 5.4 插入字典数据
INSERT INTO sys_dict_data (id, dict_type_id, dict_label, dict_value, sort_order, status) VALUES
('1', '1', '启用', '1', 1, 1),
('2', '1', '禁用', '0', 2, 1),
('3', '2', '文本输入', 'input', 1, 1),
('4', '2', '下拉选择', 'select', 2, 1),
('5', '2', '单选框', 'radio', 3, 1),
('6', '2', '复选框', 'checkbox', 4, 1),
('7', '2', '日期选择', 'date', 5, 1),
('8', '2', '文本域', 'textarea', 6, 1);

-- 5.5 插入示例表单数据
INSERT INTO sys_form (id, form_name, module_id, form_key, create_user_id) VALUES
('1', '示例表单', '2', 'sample_form', '1');

-- 5.6 插入示例表单字段
INSERT INTO sys_form_field (id, form_id, field_type, label, name, require, placeholder, sort_order) VALUES
('1', '1', 'input', '姓名', 'username', 1, '请输入姓名', 1),
('2', '1', 'input', '邮箱', 'email', 1, '请输入邮箱', 2),
('3', '1', 'select', '性别', 'gender', 0, '请选择性别', 3),
('4', '1', 'date', '出生日期', 'birthday', 0, '请选择出生日期', 4),
('5', '1', 'textarea', '备注', 'remark', 0, '请输入备注信息', 5);

-- 5.7 设置表单字段选项
UPDATE sys_form_field SET options = '{"type":"select","multiple":false,"options":[{"label":"男","value":"male"},{"label":"女","value":"female"},{"label":"其他","value":"other"}]}' WHERE id = '3';

-- 5.8 插入表单布局配置
INSERT INTO sys_form_config (id, form_id, layout_type, label_width, label_align) VALUES
('1', '1', 'horizontal', '120px', 'left');

-- 5.9 插入示例表头配置
INSERT INTO sys_table_header (id, module_id, table_key, column_config, create_user_id) VALUES
('1', '2', 'form_list', '[{"name":"表单名称","dataIndex":"formName","resizable":true,"search":true,"width":150,"show":true},{"name":"所属模块","dataIndex":"moduleName","resizable":true,"width":120,"show":true},{"name":"创建人","dataIndex":"createUser","resizable":true,"width":100,"show":true},{"name":"更新时间","dataIndex":"updateTime","resizable":true,"width":150,"show":true},{"name":"操作","dataIndex":"action","resizable":false,"width":120,"show":true}]', '1');

-- 6. 显示创建结果
SELECT '数据库初始化完成' AS result;
SELECT '已创建的表:' AS info;
SHOW TABLES;
