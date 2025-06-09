// Função para verificar o tipo de usuário e configurar a navegação
function setupHeader() {
    // Recuperar informações do usuário da sessão
    const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    // Atualizar nome do usuário no header se existir um elemento para isso
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
        inicioLink.href = '/pesquisar';
        eventosLink.href = '/minhas-inscricoes';
        saldoLink.href = '#'; // Não funcional por enquanto
        perfilLink.href = '/minhas-inscricoes';
    } else if (userType === 'organizador') {
        // Configuração para organizador
        inicioLink.href = '/registrar';
        eventosLink.href = '/meusEventos';
        saldoLink.href = '/usuariosInscritos';
        perfilLink.href = '/meusEventos';
    } else {
        // Usuário não logado ou tipo desconhecido
        inicioLink.href = '/';
        eventosLink.href = '/pesquisar';
        saldoLink.href = '/login';
        perfilLink.href = '/login';
    }
}

// Verificar se o usuário está logado
function checkAuth() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
    
    // Se não estiver em uma página de autenticação e não tiver token, redirecionar
    const isAuthPage = ['/login', '/cadastro', '/'].includes(window.location.pathname);
    if (!isAuthPage && !userType) {
        window.location.href = '/login';
    }
}

// Função para fazer logout
function logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setupHeader();
    
    // Não verificar autenticação em páginas públicas
    const publicPages = ['/login', '/cadastro', '/'];
    if (!publicPages.includes(window.location.pathname)) {
        checkAuth();
    }

    // Marcar link ativo baseado na URL atual
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Adicionar evento de logout se existir um botão para isso
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});