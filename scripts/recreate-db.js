const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco de dados
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function recreateDatabase() {
    try {
        console.log('Iniciando recriação do banco de dados...');

        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, '..', 'database.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Executar o script SQL
        await pool.query(sqlContent);

        console.log('Banco de dados recriado com sucesso!');
    } catch (error) {
        console.error('Erro ao recriar banco de dados:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    recreateDatabase()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = recreateDatabase; 