-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS tickin;
USE tickin;

-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS presencas;
DROP TABLE IF EXISTS lembretes;
DROP TABLE IF EXISTS inscricoes;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS organizadores;
DROP TABLE IF EXISTS usuarios;

-- Create tables in order
CREATE TABLE IF NOT EXISTS usuarios (
  CPF varchar(255) PRIMARY KEY,
  nome varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  endereco varchar(255),
  telefone varchar(255),
  senha varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS organizadores (
  organizador_ID int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(255) NOT NULL,
  colaboradores varchar(255),
  funcao varchar(255),
  CPF varchar(255),
  evento_ID int,
  FOREIGN KEY (CPF) REFERENCES usuarios(CPF) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS eventos (
  evento_ID int AUTO_INCREMENT PRIMARY KEY,
  data date NOT NULL,
  descricao varchar(255) NOT NULL,
  valor decimal(10,2) NOT NULL,
  local varchar(255) NOT NULL,
  horario time NOT NULL,
  organizador_ID int,
  FOREIGN KEY (organizador_ID) REFERENCES organizadores(organizador_ID) ON DELETE SET NULL
);

-- Add foreign key for evento_ID in organizadores
ALTER TABLE organizadores 
  ADD CONSTRAINT fk_evento
  FOREIGN KEY (evento_ID) REFERENCES eventos(evento_ID)
  ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS inscricoes (
  compra_ID int AUTO_INCREMENT PRIMARY KEY,
  status varchar(255) NOT NULL DEFAULT 'Pendente',
  data_inscricao date DEFAULT CURRENT_DATE,
  CPF varchar(255),
  evento_ID int,
  FOREIGN KEY (CPF) REFERENCES usuarios(CPF) ON DELETE CASCADE,
  FOREIGN KEY (evento_ID) REFERENCES eventos(evento_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lembretes (
  mensagem_ID int AUTO_INCREMENT PRIMARY KEY,
  mensagem text NOT NULL,
  CPF varchar(255),
  evento_ID int,
  FOREIGN KEY (CPF) REFERENCES usuarios(CPF) ON DELETE CASCADE,
  FOREIGN KEY (evento_ID) REFERENCES eventos(evento_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presencas (
  presenca_ID int AUTO_INCREMENT PRIMARY KEY,
  presente boolean DEFAULT false,
  horario_entrada time,
  compra_ID int,
  FOREIGN KEY (compra_ID) REFERENCES inscricoes(compra_ID) ON DELETE CASCADE
); 