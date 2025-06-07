// Função para verificar o tipo de usuário e configurar a navegação
function setupHeader() {
    // Recuperar informações do usuário da sessão
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName');

    // Atualizar nome do usuário no header
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }

    // Configurar navegação baseada no tipo de usuário
    const inicioLink = document.getElementById('inicioLink');
    const eventosLink = document.getElementById('eventosLink');
    const saldoLink = document.getElementById('saldoLink');
    const perfilLink = document.getElementById('perfilLink');

    if (userType === 'cliente') {
        // Configuração para cliente
        inicioLink.href = '/pages/pesquisar.html';
        eventosLink.href = '/pages/minhasInscricoes.ejs';
        saldoLink.href = '#'; // Não funcional por enquanto
        perfilLink.href = '/pages/minhasInscricoes.ejs';
    } else if (userType === 'organizador') {
        // Configuração para organizador
        inicioLink.href = '/pages/registrar.html';
        eventosLink.href = '/pages/meusEventos.ejs';
        saldoLink.href = '/pages/usuariosInscritos.ejs';
        perfilLink.href = '/pages/meusEventos.ejs';
    }
}

// Verificar se o usuário está logado
function checkAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';  // Removido a extensão .html para usar o template .ejs
    }
}

// Função para fazer logout
function logout() {
    sessionStorage.clear();
    window.location.href = '/pages/login.html';
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupHeader();

    // Links de navegação
    const inicioLink = document.getElementById('inicioLink');
    const eventosLink = document.getElementById('eventosLink');
    const saldoLink = document.getElementById('saldoLink');
    const perfilLink = document.getElementById('perfilLink');

    // Configurar navegação
    inicioLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/';
    });

    eventosLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/meusEventos';
    });

    saldoLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/saldo';
    });

    perfilLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/perfil';
    });

    // Marcar link ativo baseado na URL atual
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}); 