const prisma = require('./lib/prisma');

async function testTableColumnConfig() {
    console.log('\n=== 测试 table_column_config 表数据 ===');
    try {
        const columns = await prisma.tableColumnConfig.findMany({
            select: {
                id: true,
                tableName: true,
                conditionName: true,
                relatedTableName: true,
                columnName: true,
                dataKey: true
            },
            orderBy: {
                id: 'asc'
            }
        });
        
        console.log('表数据:');
        console.log('ID\tTableName\tConditionName\tRelatedTableName\tColumnName\tDataKey');
        console.log('---\t--------\t------------\t----------------\t--------\t-------');
        
        columns.forEach(col => {
            console.log(`${col.id}\t${col.tableName}\t${col.conditionName}\t${col.relatedTableName || '(EMPTY)'}\t${col.columnName}\t${col.dataKey}`);
        });
        
        // 检查是否有 relatedTableName 为 'form' 的记录，且 tableName 也为 'form'
        const problematicRecords = columns.filter(col => 
            col.relatedTableName === 'form' && col.tableName === 'form'
        );
        
        console.log('\n=== 检查问题记录 ===');
        if (problematicRecords.length > 0) {
            console.log('发现问题记录:');
            problematicRecords.forEach(col => {
                console.log(`ID: ${col.id}, TableName: ${col.tableName}, ConditionName: ${col.conditionName}, RelatedTableName: ${col.relatedTableName}`);
            });
        } else {
            console.log('没有发现问题记录');
        }
        
    } catch (error) {
        console.error('测试过程中出错:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testTableColumnConfig();
