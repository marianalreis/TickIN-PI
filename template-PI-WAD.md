# Web Application Document - Projeto Individual - Módulo 2 - Inteli

## TickIN

#### Mariana Lacerda Reis

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

O projeto TickIN propõe o desenvolvimento de uma plataforma digital especializada no gerenciamento de eventos e no controle de inscrições de participantes. A proposta visa atender dois públicos principais: usuários interessados em participar de eventos, que buscam processos de inscrição ágeis, confirmações rápidas e acompanhamento das suas atividades, e organizadores de eventos, que necessitam de ferramentas práticas para criação, divulgação, gerenciamento de participantes e comunicação eficiente.

A plataforma oferecerá funcionalidades como a inscrição simplificada em poucos cliques, a visualização de eventos cadastrados, o gerenciamento de inscrições realizadas, o envio automatizado de lembretes próximos à data dos eventos, além de permitir que organizadores visualizem listas de inscritos, realizem controle de presença e comuniquem atualizações ou informações importantes aos participantes.

O TickIN será desenvolvido com foco na experiência do usuário (UX), priorizando interfaces intuitivas, processos desburocratizados e interação fluida. Será aplicado um modelo de desenvolvimento ágil, utilizando práticas de prototipação, validação contínua e ajustes iterativos com base no feedback dos usuários, a fim de maximizar a eficiência e a aderência da solução às necessidades reais do público-alvo.

Ao integrar as perspectivas tanto dos participantes quanto dos organizadores, o sistema visa otimizar o ecossistema de eventos, aumentando a satisfação dos usuários, a eficiência operacional dos organizadores e a qualidade geral das experiências proporcionadas.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01)

Personas são arquétipos detalhados de usuários que capturam padrões de comportamento, motivações, objetivos e necessidades, criados a partir da análise de dados qualitativos e quantitativos, como entrevistas, observações e análises de mercado; ao traduzirem dados complexos em perfis humanos compreensíveis, facilitam a criação de produtos mais centrados no usuário, impactando diretamente a eficácia de projetos de design e tecnologia, sendo que, segundo a Interaction Design Foundation[¹](#5-referências), o uso de personas pode aumentar em até 18 % a taxa de adoção de novos produtos e melhorar a retenção de usuários em projetos digitais.
<div align="center">
  <sub>FIGURA 1 - Persona 1</sub><br>
  <img src= "assets/Persona1-PI.png" width="100%" 
  alt="Persona 1- Isabela"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

<div align="center">
  <sub>FIGURA 2 - Persona 2</sub><br>
  <img src= "assets/Persona2-PI.png" width="100%" 
  alt="Persona 2- Rafael"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

As personas desenvolvidas para o projeto TickIN representam dois perfis-chave de usuários: Isabela Souza, participante de eventos, e Rafael Silva, organizador de eventos. Isabela é uma profissional que valoriza processos de inscrição simples, confirmações automáticas e lembretes que facilitem sua gestão de tempo. Já Rafael é um coordenador de eventos analítico e focado em resultados, que busca ferramentas eficientes para criação de eventos, controle de inscrições e comunicação com os participantes. A aplicação TickIN foi projetada para atender diretamente às necessidades desses perfis, oferecendo uma plataforma intuitiva, ágil e organizada, que facilita tanto a experiência do participante quanto a gestão operacional do organizador.


### 2.2. User Stories (Semana 01)

User Stories são descrições curtas e informais de uma funcionalidade desejada, escritas do ponto de vista do usuário, que ajudam a capturar requisitos de forma colaborativa e incremental; geralmente seguem o formato "Como [tipo de usuário], quero [objetivo], para que [benefício]", permitindo que equipes de desenvolvimento mantenham o foco nas necessidades reais dos usuários. Para garantir a qualidade das User Stories, aplica-se o critério INVEST[²](#5-referências), que estabelece que cada história deve ser Independente, Negociável, Valiosa, Estimável, Pequena e Testável, princípios que, segundo Cohn (2004), aumentam significativamente a eficácia da comunicação entre times de produto, desenvolvimento e stakeholders.

#### US01 | Inscrição rápida
> Como participante interessado, quero me inscrever em eventos com poucos cliques, para que eu possa garantir minha vaga rapidamente sem complicações.

#### US02 | Gerenciamento de inscrições
> Como usuário inscrito, quero visualizar e gerenciar minhas inscrições em um painel, para que eu tenha controle sobre os eventos que participarei.


#### US03 | Visualizar lista de inscritos
> Como organizador de eventos, quero visualizar a lista de participantes inscritos, para que eu possa organizar o check-in e o controle de presença no evento.
>
> <div align="center">
  <sub>TABELA 1 - INVEST (US01)</sub><br>
## Análise INVEST (US01)
| Critério | Justificativa |
|:---|:---|
| **I – Independente** | A inscrição rápida é uma funcionalidade que não depende diretamente de outras (como lembretes ou painel de gerenciamento). |
| **N – Negociável** | Pode ser ajustada: por exemplo, decidir se a inscrição deve ter autenticação ou não, ou quantos campos serão exigidos. |
| **V – Valiosa** | Aumenta diretamente a satisfação do usuário ao oferecer uma experiência simples e ágil. |
| **E – Estimável** | Pode ser estimada em termos de esforço: integrar formulário simples, botão de confirmação, e banco de dados para armazenar a inscrição. |
| **S – Pequena** | A US é pequena e objetiva, podendo ser implementada em poucos dias de desenvolvimento. |
| **T – Testável** | Pode ser testada verificando se o usuário consegue se inscrever em poucos passos e se a inscrição é salva corretamente. |
---
<sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

*Posicione aqui os diagramas de modelos relacionais do seu banco de dados, apresentando todos os esquemas de tabelas e suas relações. Utilize texto para complementar suas explicações, se necessário.*

*Posicione também o modelo físico com o Schema do BD (arquivo .sql)*

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

¹ INTERACTION DESIGN FOUNDATION. Personas – A Simple Introduction. [S.l.], 2022. Disponível em: https://www.interaction-design.org/literature/topics/personas. Acesso em: 25 abr. 2025.


² COHN, Mike. User Stories Applied: For Agile Software Development. Boston: Addison-Wesley, 2004.

<br>

---
---