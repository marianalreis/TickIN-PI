# Projeto Individual (COMP Parte 3): Sistema Completo com Funcionalidades e Interface
 Objetivo: Implementar a interface visual do sistema, conectando as páginas à lógica de backend já criada e ao banco de dados. O foco é construir pelo views funcionais que permitam interação real com os dados do sistema, usando HTML/EJS, estilização CSS e consumo de rotas com JavaScript e Fetch API.
 
Prazo de Entrega: até sexta-feira da **semana 7** do módulo.

Entrega:
- Submissão individual (mesmo repositório do projeto).
- Projeto atualizado no GitHub.
- Atualização do README.md com instruções de como executar o sistema
- Atualização do WAD.md com prints das views e mudanças relevantes no backend e banco de dados

---

## Instruções
### Passo 1 — Construção das Views (Interface do Sistema)
Você irá criar páginas visuais do seu sistema usando EJS (ou HTML). Essas views devem estar organizadas na pasta views/ e ligadas a rotas do servidor Express.

#### O que deve conter:
- Página principal (ex: lista de tarefas, eventos ou reservas)
- Página de formulário (para cadastrar ou editar um item)
- Dados exibidos devem vir diretamente do banco de dados, via backend

#### Como funciona:
- O controller busca os dados do banco usando o modelo.
- A rota (routes/*.js) chama o controller.
- A view é renderizada com os dados do controller (com res.render() no caso do EJS).

```
// Exemplo: rota com EJS
app.get('/tarefas', async (req, res) => {
  const tarefas = await Tarefa.findAll();
  res.render('tarefas.ejs', { tarefas });
});
```

### Passo 2 — Integração Frontend com Backend via Fetch API
Nessa etapa você tornará sua interface interativa: botões que adicionam, editam ou removem dados devem se comunicar com o servidor usando fetch().

✨ Exemplos:
```
// Buscar dados
fetch('/api/tarefas')
  .then(res => res.json())
  .then(tarefas => {
    tarefas.forEach(tarefa => {
      // Criar elementos e mostrar na tela
    });
  });

// Enviar dados (POST)
fetch('/api/tarefas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ titulo: 'Nova tarefa' })
});
```
➡️ Dica: mantenha o back separado em rotas específicas de API (/api/tarefas, /api/eventos, etc.)

### Passo 3 — Estilização com CSS
A interface precisa ter:
- Organização visual das informações
- Cores, espaçamentos, fontes adequadas
- Botões e formulários com feedback visual

🧰 Ferramentas que você pode usar: CSS puro (com Flexbox e Grid para organização dos elementos), Bootstrap, Tailwind ou outro framework

---

##  Requisitos Mínimos da Entrega
- Views conectadas: páginas visuais (HTML/EJS) exibindo dados reais do sistema
- Estilização aplicada: CSS nas páginas, com foco em layout organizado e usabilidade
- Integração front-back: fetch API usada para buscar/enviar dados
- Estrutura MVC mantida: separação entre modelos, controladores, views e rotas
- Código executável: aplicação funcionando com npm start ou node server.js