document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorMessage = document.querySelector('.error-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpa mensagem de erro anterior
            if (errorMessage) {
                errorMessage.textContent = '';
            }

            // Coleta os dados do formulário
            const formData = {
                nome: form.querySelector('input[type="text"]').value,
                telefone: form.querySelector('input[type="tel"]').value,
                email: form.querySelector('input[type="email"]').value
            };

            try {
                // Envia os dados para o servidor
                const response = await fetch('/api/usuarios/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include' // Importante para a sessão
                });

                const data = await response.json();

                if (data.success) {
                    // Redireciona para a página de eventos em caso de sucesso
                    window.location.href = data.redirect;
                } else {
                    // Mostra mensagem de erro
                    if (errorMessage) {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'Erro ao conectar ao servidor. Por favor, tente novamente.';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    // Função para validar email em tempo real
    const emailInput = form?.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', async () => {
            const email = emailInput.value;
            if (email) {
                try {
                    const response = await fetch(`/api/usuarios/verificar-email/${encodeURIComponent(email)}`);
                    const data = await response.json();
                    
                    if (data.exists) {
                        if (errorMessage) {
                            errorMessage.textContent = 'Este email já está cadastrado.';
                            errorMessage.style.display = 'block';
                        }
                    }
                } catch (error) {
                    console.error('Erro ao verificar email:', error);
                }
            }
        });
    }
}); 