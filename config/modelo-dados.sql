CREATE TABLE `usuarios` (
  `CPF` varchar(255) PRIMARY KEY,
  `nome` varchar(255),
  `email` varchar(255),
  `endereco` varchar(255),
  `telefone` varchar(255)
);

CREATE TABLE `eventos` (
  `evento_ID` int PRIMARY KEY,
  `data` date,
  `descricao` varchar(255),
  `valor` decimal,
  `local` varchar(255),
  `horario` time,
  `organizador_ID` int
);

CREATE TABLE `organizadores` (
  `organizador_ID` int PRIMARY KEY,
  `nome` varchar(255),
  `colaboradores` varchar(255),
  `funcao` varchar(255),
  `evento_ID` int,
  `CPF` varchar(255)
);

CREATE TABLE `inscricoes` (
  `compra_ID` int PRIMARY KEY,
  `status` varchar(255),
  `data_inscricao` date,
  `CPF` varchar(255),
  `evento_ID` int
);

CREATE TABLE `lembretes` (
  `mensagem_ID` int PRIMARY KEY,
  `mensagem` text,
  `CPF` varchar(255),
  `evento_ID` int
);

CREATE TABLE `presencas` (
  `presenca_ID` int PRIMARY KEY,
  `presente` boolean,
  `horario_entrada` time,
  `compra_ID` int
);

ALTER TABLE `eventos` ADD FOREIGN KEY (`organizador_ID`) REFERENCES `organizadores` (`organizador_ID`);

ALTER TABLE `organizadores` ADD FOREIGN KEY (`evento_ID`) REFERENCES `eventos` (`evento_ID`);

ALTER TABLE `organizadores` ADD FOREIGN KEY (`CPF`) REFERENCES `usuarios` (`CPF`);

ALTER TABLE `inscricoes` ADD FOREIGN KEY (`CPF`) REFERENCES `usuarios` (`CPF`);

ALTER TABLE `inscricoes` ADD FOREIGN KEY (`evento_ID`) REFERENCES `eventos` (`evento_ID`);

ALTER TABLE `lembretes` ADD FOREIGN KEY (`CPF`) REFERENCES `usuarios` (`CPF`);

ALTER TABLE `lembretes` ADD FOREIGN KEY (`evento_ID`) REFERENCES `eventos` (`evento_ID`);

ALTER TABLE `presencas` ADD FOREIGN KEY (`compra_ID`) REFERENCES `inscricoes` (`compra_ID`);
