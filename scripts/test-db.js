const pool = require('../config/database');

async function testDatabaseConnection() {
    try {
        // Test basic connection
        const client = await pool.connect();
        console.log('✅ Successfully connected to the database');

        // Test eventos table structure
        const { rows: columns } = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'eventos'
        `);
        
        console.log('\nEventos table structure:');
        columns.forEach(col => {
            console.log(`${col.column_name}: ${col.data_type}`);
        });

        // Test basic query
        const { rows: events } = await client.query('SELECT COUNT(*) FROM eventos');
        console.log(`\n✅ Found ${events[0].count} events in the database`);

        client.release();
        console.log('\n✅ All database tests passed');
    } catch (error) {
        console.error('\n❌ Database test failed:');
        console.error(error);
        if (error.code === '42P01') {
            console.error('\nThe "eventos" table does not exist. Please ensure your database is properly initialized.');
        } else if (error.code === '28P01') {
            console.error('\nAuthentication failed. Please check your database credentials in the .env file.');
        }
    } finally {
        await pool.end();
    }
}

testDatabaseConnection().catch(console.error); 