# 系统管理模块数据库设计

## 1. 项目需求分析

### 1.1 表单管理
- 表单基本信息：名称、模块、唯一标识、创建人、更新时间
- 表单配置：字段列表（类型、标签、名称、必填等）
- 布局配置：布局类型、标签宽度、标签对齐方式

### 1.2 字典管理
- 字典类型：编码、名称、模块、描述
- 字典数据：键值对、排序、状态

### 1.3 表头管理
- 表头配置：模块、表格标识、列配置（字段、标题、宽度、排序等）

## 2. 数据库表设计

### 2.1 系统用户表（sys_user）
```sql
CREATE TABLE sys_user (
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
```

### 2.2 模块表（sys_module）
```sql
CREATE TABLE sys_module (
  id VARCHAR(36) PRIMARY KEY COMMENT '模块ID',
  module_name VARCHAR(50) NOT NULL COMMENT '模块名称',
  module_code VARCHAR(50) NOT NULL UNIQUE COMMENT '模块编码',
  description VARCHAR(200) COMMENT '模块描述',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  sort_order INT DEFAULT 0 COMMENT '排序',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT '系统模块表';
```

### 2.3 表单表（sys_form）
```sql
CREATE TABLE sys_form (
  id VARCHAR(36) PRIMARY KEY COMMENT '表单ID',
  form_name VARCHAR(100) NOT NULL COMMENT '表单名称',
  module_id VARCHAR(36) NOT NULL COMMENT '所属模块ID',
  form_key VARCHAR(50) NOT NULL UNIQUE COMMENT '表单唯一标识',
  create_user_id VARCHAR(36) NOT NULL COMMENT '创建人ID',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (module_id) REFERENCES sys_module(id) ON DELETE CASCADE,
  FOREIGN KEY (create_user_id) REFERENCES sys_user(id) ON DELETE CASCADE
) COMMENT '表单表';
```

### 2.4 表单字段表（sys_form_field）
```sql
CREATE TABLE sys_form_field (
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
```

### 2.5 表单布局配置表（sys_form_config）
```sql
CREATE TABLE sys_form_config (
  id VARCHAR(36) PRIMARY KEY COMMENT '配置ID',
  form_id VARCHAR(36) NOT NULL UNIQUE COMMENT '所属表单ID',
  layout_type VARCHAR(20) DEFAULT 'horizontal' COMMENT '布局类型：horizontal、vertical',
  label_width VARCHAR(10) DEFAULT '120px' COMMENT '标签宽度',
  label_align VARCHAR(10) DEFAULT 'left' COMMENT '标签对齐方式：left、right',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (form_id) REFERENCES sys_form(id) ON DELETE CASCADE
) COMMENT '表单布局配置表';
```

### 2.6 字典类型表（sys_dict_type）
```sql
CREATE TABLE sys_dict_type (
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
```

### 2.7 字典数据表（sys_dict_data）
```sql
CREATE TABLE sys_dict_data (
  id VARCHAR(36) PRIMARY KEY COMMENT '字典数据ID',
  dict_type_id VARCHAR(36) NOT NULL COMMENT '所属字典类型ID',
  dict_label VARCHAR(100) NOT NULL COMMENT '字典标签',
  dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (dict_type_id) REFERENCES sys_dict_type(id) ON DELETE CASCADE
) COMMENT '字典数据表';
```

### 2.8 表头管理表（sys_table_header）
```sql
CREATE TABLE sys_table_header (
  id VARCHAR(36) PRIMARY KEY COMMENT '表头配置ID',
  module_id VARCHAR(36) NOT NULL COMMENT '所属模块ID',
  table_key VARCHAR(50) NOT NULL COMMENT '表格唯一标识',
  column_config TEXT NOT NULL COMMENT '列配置（JSON格式）',
  create_user_id VARCHAR(36) NOT NULL COMMENT '创建人ID',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (module_id) REFERENCES sys_module(id) ON DELETE CASCADE,
  FOREIGN KEY (create_user_id) REFERENCES sys_user(id) ON DELETE CASCADE
) COMMENT '表头管理表';
```

## 3. 表关系图

```
+-----------------+     +-----------------+     +-----------------+
|   sys_module    |     |     sys_user    |     |  sys_dict_type  |
+-----------------+     +-----------------+     +-----------------+
| id              |<----| id              |     | id              |
| module_name     |     | username        |     | dict_code       |
| module_code     |     | nickname        |     | dict_name       |
| description     |     | password        |     | module_id       |<--+   +-----------------+
| status          |     | email           |     | description     |    |   |  sys_dict_data  |
| sort_order      |     | phone           |     | status          |    |   +-----------------+
| create_time     |     | status          |     | create_time     |    |   | id              |
+-----------------+     | create_time     |     | update_time     |    |   | dict_type_id    |<--+---+
                        | update_time     |     +-----------------+    |   | dict_label      |    |   |
                        +-----------------+                              |   | dict_value      |    |   |
                                                                         |   | sort_order      |    |   |
+-----------------+     +-----------------+                              |   | status          |    |   |
|   sys_form      |     | sys_form_field  |                              |   | create_time     |    |   |
+-----------------+     +-----------------+                              |   +-----------------+    |   |
| id              |<----| id              |                              |                          |   |
| form_name       |     | form_id         |<--+                          |   +-----------------+    |   |
| module_id       |     | field_type      |   |                          |   | sys_table_header|    |   |
| form_key        |     | label           |   |                          |   +-----------------+    |   |
| create_user_id  |     | name            |   |                          |   | id              |    |   |
| update_time     |     | require         |   |                          |   | module_id       |    |   |
+-----------------+     | placeholder     |   |                          |   | table_key       |    |   |
                        | default_value   |   |                          |   | column_config   |    |   |
                        | options         |   |                          |   | create_user_id  |    |   |
                        | sort_order      |   |                          |   | update_time     |    |   |
                        | create_time     |   |                          |   +-----------------+    |   |
                        +-----------------+   |                          |                          |   |
                                              |   +-----------------+    |                          |   |
                                              +---| sys_form_config |    |                          |   |
                                                  +-----------------+    |                          |   |
                                                  | id              |    |                          |   |
                                                  | form_id         |<---+                          |   |
                                                  | layout_type     |                               |   |
                                                  | label_width     |                               |   |
                                                  | label_align     |                               |   |
                                                  | update_time     |                               |   |
                                                  +-----------------+                               |   |
                                                                                                  |   |
                                                                                                  |   |
                                                                                                  +---+
```

## 4. 数据结构说明

### 4.1 表单字段options结构（JSON）
```json
{
  "type": "select",
  "multiple": false,
  "options": [
    { "label": "选项1", "value": "option1" },
    { "label": "选项2", "value": "option2" }
  ]
}
```

### 4.2 列配置column_config结构（JSON）
```json
[
  {
    "name": "字段名称",
    "dataIndex": "fieldName",
    "resizable": true,
    "search": true,
    "sortable": true,
    "width": 150,
    "show": true,
    "searchConfig": {
      "type": "input"
    }
  }
]
```

## 5. 索引设计

### 5.1 表单表索引
```sql
CREATE INDEX idx_form_module ON sys_form(module_id);
CREATE INDEX idx_form_key ON sys_form(form_key);
```

### 5.2 字典类型表索引
```sql
CREATE INDEX idx_dict_type_module ON sys_dict_type(module_id);
CREATE INDEX idx_dict_code ON sys_dict_type(dict_code);
```

### 5.3 字典数据表索引
```sql
CREATE INDEX idx_dict_data_type ON sys_dict_data(dict_type_id);
CREATE INDEX idx_dict_data_value ON sys_dict_data(dict_value);
```

### 5.4 表头管理表索引
```sql
CREATE INDEX idx_table_header_module ON sys_table_header(module_id);
CREATE INDEX idx_table_key ON sys_table_header(table_key);
```

## 6. 数据初始化

### 6.1 初始模块数据
```sql
INSERT INTO sys_module (id, module_name, module_code, description, status, sort_order) VALUES
('1', '系统管理', 'system', '系统管理模块', 1, 1),
('2', '表单管理', 'form', '表单管理模块', 1, 2),
('3', '字典管理', 'dict', '字典管理模块', 1, 3),
('4', '表头管理', 'table', '表头管理模块', 1, 4);
```

### 6.2 初始字典类型数据
```sql
INSERT INTO sys_dict_type (id, dict_code, dict_name, module_id, description, status) VALUES
('1', 'status', '状态', '1', '通用状态字典', 1),
('2', 'field_type', '字段类型', '2', '表单字段类型', 1);
```

### 6.3 初始字典数据
```sql
INSERT INTO sys_dict_data (id, dict_type_id, dict_label, dict_value, sort_order, status) VALUES
('1', '1', '启用', '1', 1, 1),
('2', '1', '禁用', '0', 2, 1),
('3', '2', '文本输入', 'input', 1, 1),
('4', '2', '下拉选择', 'select', 2, 1),
('5', '2', '单选框', 'radio', 3, 1),
('6', '2', '复选框', 'checkbox', 4, 1);
```

## 7. 技术选型建议

### 7.1 数据库选型
- **MySQL 8.0+**：支持JSON数据类型，适合存储表单配置和列配置
- **PostgreSQL 14+**：如果需要更强大的JSON支持和复杂查询

### 7.2 后端ORM
- **Sequelize**：支持多种数据库，适合Node.js项目
- **TypeORM**：TypeScript支持良好，适合大型项目

### 7.3 缓存策略
- 字典数据和模块数据可使用Redis缓存，减少数据库查询
- 表单配置可根据更新频率设置适当的缓存时间

## 8. 安全考虑

1. **数据加密**：敏感字段如密码使用bcrypt等算法加密存储
2. **权限控制**：实现RBAC权限模型，控制用户对表单和字典的操作权限
3. **SQL注入防护**：使用ORM框架参数化查询，避免SQL注入
4. **XSS防护**：对用户输入进行过滤和转义
5. **CSRF防护**：实现CSRF令牌验证机制
