const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const pool = require('../config/database');

async function updateDatabase() {
    try {
        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, 'update_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Executar o SQL
        await pool.query(sql);
        console.log('Banco de dados atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar banco de dados:', error);
        throw error;
    } finally {
        // Fechar a conexão
        await pool.end();
    }
}

// Executar a atualização
updateDatabase().catch(console.error); 