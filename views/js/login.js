document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorDiv = document.querySelector('.error-message');
    
    // Se houver uma mensagem de erro na URL, mostrar
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage && errorDiv) {
        errorDiv.textContent = decodeURIComponent(errorMessage);
        errorDiv.style.display = 'block';
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: form.querySelector('input[name="email"]').value,
                senha: form.querySelector('input[name="senha"]').value
            };

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include' // Importante para a sessão
                });

                const data = await response.json();

                if (data.success || data.sucesso) {
                    // Redireciona para a página apropriada
                    window.location.href = data.redirect || data.redirecionamento;
                } else {
                    // Mostra mensagem de erro
                    const errorDiv = document.querySelector('.error-message');
                    if (errorDiv) {
                        errorDiv.textContent = data.message || 'Erro ao fazer login';
                        errorDiv.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                const errorDiv = document.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.textContent = 'Erro ao conectar ao servidor. Por favor, tente novamente.';
                    errorDiv.style.display = 'block';
                }
            }
        });
    }
}); 