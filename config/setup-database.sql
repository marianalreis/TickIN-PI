-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS tickin;

-- Usar o banco de dados
USE tickin;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `CPF` varchar(255) PRIMARY KEY,
  `nome` varchar(255),
  `email` varchar(255),
  `endereco` varchar(255),
  `telefone` varchar(255),
  `senha` varchar(255)
);

-- Criar tabela de eventos
CREATE TABLE IF NOT EXISTS `eventos` (
  `evento_ID` int AUTO_INCREMENT PRIMARY KEY,
  `data` date,
  `descricao` varchar(255),
  `valor` decimal(10,2),
  `local` varchar(255),
  `horario` time,
  `organizador_ID` int
);

-- Criar tabela de organizadores
CREATE TABLE IF NOT EXISTS `organizadores` (
  `organizador_ID` int AUTO_INCREMENT PRIMARY KEY,
  `nome` varchar(255),
  `colaboradores` varchar(255),
  `funcao` varchar(255),
  `evento_ID` int,
  `CPF` varchar(255)
);

-- Adicionar as chaves estrangeiras
ALTER TABLE `eventos` 
ADD FOREIGN KEY (`organizador_ID`) REFERENCES `organizadores` (`organizador_ID`);

ALTER TABLE `organizadores` 
ADD FOREIGN KEY (`CPF`) REFERENCES `usuarios` (`CPF`);

-- Inserir dados de teste
INSERT INTO `usuarios` (`CPF`, `nome`, `email`, `senha`) 
VALUES ('12345678900', 'Usuário Teste', 'teste@teste.com', 'senha123')
ON DUPLICATE KEY UPDATE
`nome` = VALUES(`nome`);

INSERT INTO `organizadores` (`organizador_ID`, `nome`, `funcao`, `CPF`) 
VALUES (1, 'Organizador Teste', 'Admin', '12345678900')
ON DUPLICATE KEY UPDATE
`nome` = VALUES(`nome`); 