# Web Application Document - Projeto Individual - Módulo 2 - Inteli

## TickIN

#### [Mariana Lacerda Reis](https://www.linkedin.com/in/marianalacerdareis/)

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

Personas são arquétipos detalhados de usuários que capturam padrões de comportamento, motivações, objetivos e necessidades, criados a partir da análise de dados qualitativos e quantitativos, como entrevistas, observações e análises de mercado; ao traduzirem dados complexos em perfis humanos compreensíveis, facilitam a criação de produtos mais centrados no usuário, impactando diretamente a eficácia de projetos de design e tecnologia, sendo que, segundo a Interaction Design Foundation[¹](#5-referências), o uso de personas pode aumentar em até 18  % a taxa de adoção de novos produtos e melhorar a retenção de usuários em projetos digitais.
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

User Stories são descrições curtas e informais de uma funcionalidade desejada, escritas do ponto de vista do usuário, que ajudam a capturar requisitos de forma colaborativa e incremental; geralmente seguem o formato "Como [tipo de usuário], quero [objetivo], para que [benefício]", permitindo que equipes de desenvolvimento mantenham o foco nas necessidades reais dos usuários. Para garantir a qualidade das User Stories, aplica-se o critério INVEST, que estabelece que cada história deve ser Independente, Negociável, Valiosa, Estimável, Pequena e Testável, princípios que, segundo Cohn (2004)[²](#5-referências), aumentam significativamente a eficácia da comunicação entre times de produto, desenvolvimento e stakeholders.

<a id="US01"></a> 
 #### US01 | Inscrição rápida
> Como participante interessado, quero me inscrever em eventos com poucos cliques, para que eu possa garantir minha vaga rapidamente sem complicações.

<a id="US02"></a>
#### US02 | Gerenciamento de inscrições
> Como usuário inscrito, quero visualizar e gerenciar minhas inscrições em um painel, para que eu tenha controle sobre os eventos que participarei.

<a id="US03"></a>
#### US03 | Visualizar lista de inscritos
> Como organizador de eventos, quero visualizar a lista de participantes inscritos, para que eu possa organizar o check-in e o controle de presença no evento.
>
<div align="center">
  <sub>TABELA 1 - INVEST (US01)</sub><br>
</div>

| Critério | Justificativa |
|:---|:---|
| **I – Independente** | A inscrição rápida é uma funcionalidade que não depende diretamente de outras (como lembretes ou painel de gerenciamento). |
| **N – Negociável** | Pode ser ajustada: por exemplo, decidir se a inscrição deve ter autenticação ou não, ou quantos campos serão exigidos. |
| **V – Valiosa** | Aumenta diretamente a satisfação do usuário ao oferecer uma experiência simples e ágil. |
| **E – Estimável** | Pode ser estimada em termos de esforço: integrar formulário simples, botão de confirmação, e banco de dados para armazenar a inscrição. |
| **S – Pequena** | A US é pequena e objetiva, podendo ser implementada em poucos dias de desenvolvimento. |
| **T – Testável** | Pode ser testada verificando se o usuário consegue se inscrever em poucos passos e se a inscrição é salva corretamente. |

<div align="center">
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)
Modelagem de banco de dados é o processo de representar de maneira estruturada os dados e suas relações, com o objetivo de garantir organização, integridade e eficiência no armazenamento e recuperação de informações em sistemas computacionais. Essa prática permite que desenvolvedores e analistas visualizem como os dados se interconectam antes de implementá-los fisicamente, facilitando decisões técnicas e de negócio. A modelagem geralmente ocorre em três níveis: conceitual (representação abstrata com entidades e relacionamentos), lógico (ajuste ao modelo de dados do SGBD) e físico (estrutura real no banco). Segundo o Instituto de Ciências Matemáticas e de Computação da USP (ICMC-USP)[³](#5-referências), essa abordagem contribui para a construção de sistemas robustos e escaláveis, além de promover uma comunicação clara entre os stakeholders envolvidos no projeto.

<div align="center">
  <sub>FIGURA 3 - Modelagem banco de dados</sub><br>
  <img src= "assets/modelo-banco.jpg" width="100%" 
  alt="Modelagem banco de dados"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

[Clique aqui para acessar o schema do banco de dados no SQL](config/modelo-dados.sql)

A modelagem do banco de dados do sistema **TickIN** foi desenvolvida com o objetivo de garantir uma estrutura organizada, normalizada e escalável para o gerenciamento de eventos, inscrições, presenças, lembretes e usuários. A estrutura é composta por seis tabelas principais: `usuarios`, `eventos`, `inscricoes`, `presencas`, `lembretes` e `organizadores`.

A tabela `usuarios` armazena os dados essenciais dos participantes e organizadores, sendo identificados unicamente pelo CPF. Entre os atributos presentes, estão o nome, e-mail, telefone e senha, permitindo o controle de acesso e personalização das funcionalidades oferecidas pelo sistema.

A tabela `eventos` registra os eventos disponíveis no sistema. Cada evento possui um identificador único, uma descrição, a data de realização, valor, local, horário e um campo que referencia o organizador responsável (relacionado à tabela `organizadores`). Essa associação caracteriza uma relação do tipo um-para-muitos (1:N), na qual um organizador pode ser responsável por vários eventos.

A tabela `inscricoes` estabelece a relação entre usuários e eventos, indicando quais participantes estão inscritos em quais eventos. Cada inscrição referencia um usuário e um evento, formando assim uma estrutura que permite consultas como "eventos por usuário" ou "participantes por evento".

Para controle de participação, a tabela `presencas` está vinculada diretamente às inscrições. Ela registra se o participante compareceu ao evento, criando uma relação um-para-um (1:1) com a tabela `inscricoes`. Isso garante que cada inscrição possa ter, no máximo, um registro de presença vinculado.

A tabela `lembretes` complementa o sistema com a funcionalidade de comunicação automatizada. Ela armazena mensagens programadas para os inscritos em determinados eventos, promovendo maior engajamento. Cada lembrete está relacionado a um evento específico, configurando outra relação do tipo 1:N.

Por fim, a tabela `organizadores` é utilizada para vincular usuários responsáveis por eventos. Essa estrutura reforça a separação entre participantes e administradores, garantindo maior segurança e rastreabilidade no sistema.

Todas essas tabelas estão interligadas por meio de chaves primárias(PK) e estrangeiras(FK), garantindo integridade referencial e suporte a operações complexas de consulta, inserção e exclusão sem perda de consistência. As relações foram pensadas para permitir a expansão futura do sistema, como a adição de funcionalidades de notificação em tempo real, histórico de eventos ou múltiplos organizadores por evento.


### 3.1.1 BD e Models (Semana 5)

#### Execução das Migrações

Para que a aplicação se conecte corretamente ao banco de dados PostgreSQL no Supabase, é necessário criar um arquivo chamado `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_segura
DB_NAME=postgres
```
Substitua os valores acima pelos dados reais do seu projeto no Supabase.
A tabela utilizada neste projeto está em `config/modelo-dados.sql`, é necessário subir para o supabase.
O sistema utiliza o pacote `dotenv` para carregar essas variáveis no momento da execução. A configuração é feita automaticamente no arquivo `config/database.js` com o seguinte trecho:

```js
require('dotenv').config();
```

As migrações foram realizadas diretamente pela interface web do Supabase, utilizando a aba de SQL Editor para criação da tabela `users`. Alternativamente, também é possível executar o script SQL localmente, caso esteja utilizando um arquivo como `init.sql`.

No Supabase, o processo de migração consiste em:

1. Acessar o projeto no [Supabase](https://app.supabase.com/)
2. Navegar até a aba **SQL Editor**
3. Executar o script de criação da tabela:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
```

Caso o projeto utilize migração local via terminal, o seguinte comando deve ser executado:

```bash
npm run init-db
```

Esse comando deve estar configurado no `package.json` para rodar o arquivo de migração que cria a estrutura básica do banco.


#### Testes da API

Os testes da API podem ser realizados utilizando o Postman, Insomnia ou outro cliente HTTP.

A base URL da API em ambiente local é:

```
http://localhost:3000/api/users
```

**Criar usuário (POST)**
```http
POST /api/users
Content-Type: application/json
```
Body:
```json
{
  "name": "Mariana Reis",
  "email": "mari@email.com"
}
```

**Listar usuários (GET)**
```http
GET /api/users
```

**Atualizar usuário (PUT)**
```http
PUT /api/users/:id
```
Body:
```json
{
  "name": "Mariana Atualizada",
  "email": "nova@email.com"
}
```

#### Deletar usuário (DELETE)
```http
DELETE /api/users/:id
```

As respostas são retornadas em formato **JSON**, seguindo os princípios de uma API.

#### Explicação DB e Models

O sistema utiliza o banco de dados PostgreSQL, hospedado na plataforma Supabase, como solução de persistência de dados.

Nesta etapa, foi implementado um model dedicado, representado pelo arquivo `models/User.js`, responsável por realizar todas as operações com a tabela `users`. Essa abordagem proporciona maior modularização e facilita a manutenção e reutilização da lógica de acesso aos dados.

A tabela `users` contém os seguintes campos principais:

- `id`: identificador único do usuário (chave primária, auto-incremento)
- `name`: nome completo do usuário (texto)
- `email`: endereço de e-mail (texto)

O model `User` encapsula os métodos de acesso ao banco de dados, utilizando o pacote `pg` por meio da conexão configurada em `config/database.js`. As principais operações implementadas são:

- `getAll()`: retorna todos os usuários cadastrados;
- `getById(id)`: retorna um usuário específico pelo ID;
- `create(data)`: insere um novo usuário na base de dados;
- `update(id, data)`: atualiza os dados de um usuário existente;
- `delete(id)`: remove um usuário da base de dados.

A separação entre o model e o controller garante maior organização no código, alinhando-se às boas práticas do padrão arquitetural MVC.


### 3.2 Arquitetura (Semana 5)

A aplicação segue a arquitetura **MVC (Model-View-Controller)**, com o objetivo de garantir organização, separação de responsabilidades e escalabilidade no desenvolvimento do sistema.

- **Model**: responsável pela camada de dados da aplicação. Está representado pelo arquivo `models/User.js`, que centraliza todas as operações de leitura, escrita, atualização e remoção de registros da tabela `users` no banco de dados PostgreSQL (hospedado no Supabase). A conexão com o banco é feita por meio do módulo `pg`, configurado no arquivo `config/database.js`, que utiliza variáveis de ambiente do `.env`.

- **Controller**: é a camada que recebe as requisições HTTP, valida os dados recebidos, aciona os métodos do Model e envia as respostas apropriadas. Essa lógica está implementada nos arquivos como `controllers/UserController.js`, que se comunicam diretamente com `models/User.js`.

- **View**: neste projeto, a camada de visualização é representada pelas respostas em formato JSON geradas pelos controllers. Elas podem ser consumidas por ferramentas de teste como o Postman, ou futuramente por uma interface front-end.

Essa separação facilita a manutenção do código, a expansão do sistema e o trabalho em equipe, permitindo que diferentes partes da aplicação evoluam de forma independente.
A ordem de fluxo é:
```text
Cliente → Rota → Controller → Model → Banco de Dados → Resposta (JSON) → Cliente
```
#### Diagrama de Componentes (Fluxo MVC)

```mermaid
flowchart TD
    subgraph View
        Client[Cliente / Postman]
    end

    subgraph Controller
        Router --> UserController
    end

    subgraph Model
        UserModel[models/User.js]
        configDB[config/database.js]
        DB[(Supabase - PostgreSQL)]
    end

    Client -->|HTTP Request| Router
    UserController -->|Chama métodos do Model| UserModel
    UserModel -->|Executa consultas| configDB
    configDB --> DB
    UserController -->|Resposta JSON| Client
```

Esse diagrama representa a estrutura em camadas da aplicação, demonstrando o fluxo de dados da requisição até a resposta, e a separação entre responsabilidades, conforme os princípios do padrão arquitetural MVC.


### 3.3. Wireframes (Semana 03)

Wireframe é uma representação visual simplificada da estrutura de uma interface, utilizada no processo de design para mapear a disposição e hierarquia dos elementos de navegação, entrada e saída de dados em uma aplicação digital. Essa técnica permite que equipes de desenvolvimento, design e stakeholders validem rapidamente a lógica de funcionamento do sistema antes da implementação gráfica ou técnica. Os wireframes podem variar em fidelidade, de esboços manuais até versões digitais mais detalhadas, e são fundamentais para garantir clareza, eficiência e alinhamento entre os envolvidos no projeto. Segundo a Interaction Design Foundation[⁴](#5-referências), wireframes funcionam como o "esqueleto" de uma interface, ajudando a identificar problemas de usabilidade ainda nas fases iniciais do desenvolvimento, o que reduz retrabalho e melhora a experiência do usuário final.

<div align="center">
  <sub>FIGURA X - Wireframes do TickIN</sub><br>
  <img src="assets/Wireframes.png" width="100%" alt="Wireframes do TickIN"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

Esses wireframes representam o fluxo de navegação da aplicação Web TickIN, contemplando tanto a visão do participante quanto do organizador de eventos. O objetivo é estruturar de forma clara e funcional as principais interações da plataforma, com foco na inscrição, visualização de eventos, confirmação de presença e gestão de participantes.

As telas foram desenhadas em baixa fidelidade, sem elementos gráficos finais, priorizando a estrutura e posicionamento dos elementos da interface. A navegação foi planejada com base nas [User Stories](#22-user-stories-semana-01) 

#### Telas apresentadas e suas funcionalidades:

1. **Tela de Login**  
   Acesso ao sistema por e-mail e senha (presente em todos os fluxos).

2. **Listagem de eventos**  
   Exibição de eventos disponíveis com botão de inscrição rápida.  
   [US01](#us01--inscrição-rápida) – Inscrição rápida

3. **Detalhes do evento**  
   Visualização do organizador, informações e botão para inscrição.  
   [US01](#us01--inscrição-rápida)

4. **Minhas inscrições** (visão do participante)  
   Exibe eventos nos quais o usuário está inscrito, com opções para baixar ticket e confirmar presença.  
   [US02](#US02)  – Gerenciamento de inscrições

5. **Registrar evento** (visão do organizador)  
   Tela de cadastro de evento com campos essenciais e envio de imagens.  
   Etapa inicial da [US03](#us03--visualizar-lista-de-inscritos)

6. **Meus eventos**  
   Lista de eventos criados pelo organizador com opção de acessar participantes.  
   [US03](#us03--visualizar-lista-de-inscritos)

7. **Participantes inscritos**  
   Visualização dos nomes, status de confirmação e botões para contato direto com os inscritos.  
   [US03](#us03--visualizar-lista-de-inscritos) – Lista de participantes


[ Clique aqui para acessar os wireframes digitais no Figma](https://www.figma.com/design/QKcpPYIEc1QaPUepKMleID/Wireframe--tickIN?node-id=0-1&t=CWrtH7aFNK75SHtu-1)


### 3.4. Guia de estilos (Semana 05)
Guia de estilos é um documento essencial no processo de design de interfaces, reunindo de forma organizada os principais elementos visuais e funcionais de um produto — como tipografia, paleta de cores, espaçamentos, componentes e ícones. Ele serve como referência unificada para equipes de design, desenvolvimento e produto, garantindo consistência visual, eficiência na construção de interfaces e coerência na comunicação da marca em diferentes contextos. Além de padronizar, o guia ajuda a reduzir retrabalho e a facilitar a manutenção de produtos escaláveis e responsivos. Segundo a Nielsen Norman Group[⁵](#5-referências), guias de estilo promovem uniformidade e melhoram a colaboração entre disciplinas, contribuindo diretamente para a usabilidade e a experiência final do usuário.

<div align="center">
  <sub>FIGURA X - Guia de estilos</sub><br>
  <img src="assets/styleGuide.png" width="100%" alt="Guia de estilos do TickIN"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>

O guia de estilo da plataforma tickIN foi desenvolvido para garantir consistência visual, clareza tipográfica e harmonia entre os elementos da interface. Ele define regras claras para o uso de cores, tipografia, grid, componentes e ícones, servindo como base para o design e desenvolvimento de experiências coesas e escaláveis.

#### Tipografia
A fonte adotada é Poppins, uma sans-serif moderna e versátil, ideal para interfaces digitais. A hierarquia tipográfica foi organizada da seguinte forma:

H1 Black – 48px / Line-height: 120%

H2 ExtraBold / Bold / Itálicos – 32px / Line-height: 140%

Body Regular / Medium – 16px / Line-height: 150%

Caption Light / ExtraLight / Thin – 12px / Line-height: 140%

Estilos itálicos estão presentes na mesma formatação.

### Cores
A paleta cromática é dividida em três categorias:

**Primárias e secundárias:**

Vermelho (Principal): #B30303

Coral (Destaque): #F88379

**Neutras:**

Tons de cinza para textos e fundos: #7A7A7A, #FFFFFF e #000000

As cores foram selecionadas para garantir contraste adequado, acessibilidade e hierarquia visual clara.

#### Grid e Layout
O layout segue uma estrutura de 12 colunas com espaçamento definido:

Gutter: 16px

Margens laterais mínimas: 24px

Margens verticais mínimas: 40px

Altura-base modular: múltiplos de 8px

A grid de linhas foi definida com 6 linhas para facilitar o ritmo vertical.

#### Botões
Os botões foram padronizados com base em função e hierarquia:

Primário (vermelho): para ações principais

Secundário (outline ou coral): para ações complementares

Tertiário (texto): para ações sutis

Tamanhos recomendados: Altura 48px, padding interno 16px 24px

Estados: normal, hover, desabilitado (em desenvolvimento)

#### Ícones e componentes
Os ícones seguem tamanho padrão de 24px e estão centralizados em layouts com Auto Layout no Figma. A padronização foi feita para garantir alinhamento e harmonia visual.

#### Logotipo
O logotipo foi aplicado em variações com fundo transparente e versões em branco, vermelho, azul institucional e coral para diferentes contextos (claro, escuro e institucional). Ele é compatível com espaços de header e materiais promocionais.

### 3.5. Protótipo de alta fidelidade (Semana 05)

Protótipos são representações interativas de uma interface digital, utilizadas para simular a navegação, o comportamento e a experiência do usuário em um produto ainda em desenvolvimento. Eles variam em fidelidade, desde fluxos simples com links clicáveis até simulações completas com transições, microinterações e respostas dinâmicas. Prototipar permite validar decisões de design, testar fluxos de uso, comunicar ideias de forma visual e reduzir falhas antes da implementação técnica. Segundo a Interaction Design Foundation⁶, protótipos funcionam como "laboratórios visuais" que facilitam a descoberta de problemas de usabilidade, fortalecem o alinhamento entre equipes e usuários e tornam o processo iterativo mais eficiente e acessível.

<div align="center">
  <sub>FIGURA X - Protótipos de alta fidelidade</sub><br>
  <img src="assets/prototypes.png" width="100%" alt="Protótipos da Aplicação WEB"><br>
  <sup>Fonte: Material produzido pela autora, 2025</sup>
</div>
O protótipo da plataforma tickIN apresenta um fluxo completo para gerenciamento de eventos, com interfaces voltadas tanto para organizadores quanto para participantes. A navegação é intuitiva e baseada em uma identidade visual consistente, com uso predominante das cores vermelho e coral, tipografia Poppins e componentes reutilizáveis.

O fluxo contempla:

- Tela de login e cadastro, com campos simples e acessíveis.

- Cadastro de evento, onde o organizador insere informações como nome, descrição, valor, endereço, horário e imagens ilustrativas.

- Listagem de eventos, destacando dados do evento e permitindo ações como "Inscrever-se", "Confirmar presença" ou visualizar detalhes.

- Gestão de participantes inscritos, com tabela de status (confirmado, ainda não, cancelado) e ação rápida de contato.

- Visão pública do evento, com informações completas, imagem destacada e botão de inscrição visível.

- Área do participante, exibindo seus eventos inscritos com status atualizado e ações disponíveis.

O protótipo foi desenvolvido com foco em clareza visual, fluxo objetivo e usabilidade, simulando a jornada real de usuários em um sistema de ingressos digital.

### 3.6. Testes (Semana 05)

Os testes do TickIN foram realizados em diferentes níveis:

1. **Testes de Usabilidade**
   - Realizados com 5 usuários
   - Foco em fluxos principais:
     - Inscrição em eventos
     - Criação de eventos
     - Gerenciamento de inscritos
   - Métricas coletadas:
     - Taxa de conclusão de tarefas
     - Tempo de execução
     - Nível de satisfação

2. **Testes de Integração**
   - Validação da integração com Supabase
   - Testes de upload de imagens
   - Verificação de fluxos de autenticação

3. **Testes de Performance**
   - Tempo de carregamento das páginas
   - Performance do upload de imagens
   - Responsividade em diferentes dispositivos

### 3.7. Deploy (Semana 05)

O deploy do TickIN foi realizado utilizando as seguintes tecnologias e plataformas:

1. **Backend**
   - Hospedado no Render
   - Configuração de variáveis de ambiente
   - Integração contínua com GitHub

2. **Banco de Dados**
   - PostgreSQL no Supabase
   - Backup automático configurado
   - Políticas de segurança implementadas

3. **Armazenamento**
   - Supabase Storage para imagens
   - Configuração de CORS
   - Políticas de acesso definidas

4. **Monitoramento**
   - Logs de erro configurados
   - Métricas de performance
   - Alertas de disponibilidade

[Clique aqui para acessar a aplicação em produção](https://tickin.onrender.com)

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

³ UNIVERSIDADE DE SÃO PAULO. Instituto de Ciências Matemáticas e de Computação – Banco de Dados I. São Carlos: ICMC-USP, 2021. Disponível em: https://www.icmc.usp.br. Acesso em: 8 maio 2025.
<br>

⁴ INTERACTION DESIGN FOUNDATION. Wireframing: The Beginner's Guide. 2023. Disponível em: https://www.interaction-design.org/literature/topics/wireframing. Acesso em: 13 maio 2025.

⁵ NIELSEN NORMAN GROUP. Style Guides for Interfaces. 2007. Disponível em: https://www.nngroup.com/articles/style-guides/. Acesso em: 22 maio 2025.

⁶ INTERACTION DESIGN FOUNDATION. Prototyping. Disponível em: https://www.interaction-design.org/literature/topics/prototyping. Acesso em: 22 maio 2025.




---
