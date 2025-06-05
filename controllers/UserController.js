const pool = require('../config/database');

const UserController = {
  listarUsuarios: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM usuarios ORDER BY nome');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Erro ao listar usuários:', err);
      res.status(500).json({ error: err.message });
    }
  },

  obterUsuario: async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE usuario_id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao obter usuário:', err);
      res.status(500).json({ error: err.message });
    }
  },

  criarUsuario: async (req, res) => {
    const { nome, email, cpf, telefone } = req.body;
    
    // Validação básica
    if (!nome || !email || !cpf) {
      return res.status(400).json({ 
        message: 'Dados incompletos. Nome, email e CPF são obrigatórios.' 
      });
    }
    
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nome, email, cpf, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, email, cpf, telefone]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ error: err.message });
    }
  },

  atualizarUsuario: async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, telefone } = req.body;
    
    try {
      const result = await pool.query(
        'UPDATE usuarios SET nome = $1, email = $2, cpf = $3, telefone = $4 WHERE usuario_id = $5 RETURNING *',
        [nome, email, cpf, telefone, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).json({ error: err.message });
    }
  },

  excluirUsuario: async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query('DELETE FROM usuarios WHERE usuario_id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = UserController;