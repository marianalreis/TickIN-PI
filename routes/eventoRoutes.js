const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/eventos')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// GET all eventos
router.get('/', async (req, res) => {
  try {
    console.log('Buscando todos os eventos...');
    const [rows] = await pool.query('SELECT * FROM eventos ORDER BY data DESC');
    console.log('Eventos encontrados:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar eventos', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST new evento
router.post('/', upload.array('images'), async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { title, description, date, time, location, price } = req.body;
    
    // Validação dos campos
    if (!title || !description || !date || !time || !location || !price) {
      console.log('Campos obrigatórios faltando');
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios',
        missingFields: {
          title: !title,
          description: !description,
          date: !date,
          time: !time,
          location: !location,
          price: !price
        }
      });
    }

    // Usar ID 1 como organizador padrão para testes
    const organizador_ID = req.session.organizadorId || 1;

    console.log('Inserindo evento no banco de dados...');
    const [result] = await pool.query(
      'INSERT INTO eventos (descricao, data, horario, local, valor, organizador_ID) VALUES (?, ?, ?, ?, ?, ?)',
      [title + '\n' + description, date, time, location, price, organizador_ID]
    );

    // Processar imagens se houver
    const images = req.files;
    if (images && images.length > 0) {
      // Aqui você pode salvar os caminhos das imagens em uma tabela separada
      // ou em um campo JSON no evento
      console.log('Imagens recebidas:', images.length);
    }

    console.log('Evento criado com sucesso:', result);
    res.status(201).json({ 
      message: 'Evento criado com sucesso',
      eventoId: result.insertId,
      redirect: '/meusEventos'
    });
  } catch (error) {
    console.error('Erro detalhado ao criar evento:', error);
    res.status(500).json({ 
      message: 'Erro ao criar evento', 
      error: error.message,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET evento by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Buscando evento:', req.params.id);
    const [rows] = await pool.query('SELECT * FROM eventos WHERE evento_ID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      console.log('Evento não encontrado');
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    console.log('Evento encontrado:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar evento', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

