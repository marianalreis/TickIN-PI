const pool = require('../config/database');

// Criar um novo usuário
exports.criarUsuario = async (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar um usuário
exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
  const values = [name, email, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir um usuário
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
