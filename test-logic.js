// 测试 saveTableColumns 函数的逻辑
function testSaveTableColumnsLogic() {
    console.log('\n=== 测试 saveTableColumns 函数逻辑 ===');
    
    // 模拟参数
    const tableName = 'form';
    const changedTableName = 'form'; // 没有关联的情况
    const filter = 'default';
    const columns = [
        { columnName: 'id', dataKey: 'id' },
        { columnName: 'creator', dataKey: 'creator' },
        { columnName: 'modifier', dataKey: 'modifier' }
    ];
    
    // 测试修改后的逻辑
    const relatedTableNameValue = changedTableName === tableName ? '' : changedTableName;
    
    console.log('测试参数:');
    console.log(`tableName: ${tableName}`);
    console.log(`changedTableName: ${changedTableName}`);
    console.log(`filter: ${filter}`);
    console.log(`columns: ${JSON.stringify(columns, null, 2)}`);
    
    console.log('\n测试结果:');
    console.log(`relatedTableNameValue: "${relatedTableNameValue}"`);
    
    // 模拟创建数据
    const createdColumns = columns.map((column) => ({
        ...column,
        tableName: tableName,
        conditionName: filter,
        relatedTableName: relatedTableNameValue,
    }));
    
    console.log('\n模拟创建的数据:');
    console.log(JSON.stringify(createdColumns, null, 2));
    
    // 检查是否有问题
    const problematicRecords = createdColumns.filter(col => 
        col.relatedTableName === 'form' && col.tableName === 'form'
    );
    
    console.log('\n=== 检查问题记录 ===');
    if (problematicRecords.length > 0) {
        console.log('❌ 发现问题记录:');
        problematicRecords.forEach(col => {
            console.log(`  TableName: ${col.tableName}, RelatedTableName: ${col.relatedTableName}`);
        });
    } else {
        console.log('✅ 没有发现问题记录');
    }
    
    // 测试有关联的情况
    console.log('\n=== 测试有关联的情况 ===');
    const changedTableNameWithRelation = 'department';
    const relatedTableNameValueWithRelation = changedTableNameWithRelation === tableName ? '' : changedTableNameWithRelation;
    
    console.log(`changedTableName: ${changedTableNameWithRelation}`);
    console.log(`relatedTableNameValue: "${relatedTableNameValueWithRelation}"`);
    
    // 模拟创建数据
    const createdColumnsWithRelation = columns.map((column) => ({
        ...column,
        tableName: tableName,
        conditionName: filter,
        relatedTableName: relatedTableNameValueWithRelation,
    }));
    
    console.log('\n模拟创建的数据:');
    console.log(JSON.stringify(createdColumnsWithRelation, null, 2));
}

testSaveTableColumnsLogic();
