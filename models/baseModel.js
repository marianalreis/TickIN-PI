const pool = require('../config/database');

class BaseModel {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }
  
  async findAll() {
    const result = await pool.query(`SELECT * FROM ${this.tableName}`);
    return result.rows;
  }
  
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [id]
    );
    return result.rows[0];
  }
  
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const result = await pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }
  
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const result = await pool.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }
  
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = BaseModel;