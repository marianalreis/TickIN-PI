class InscricaoService {
    static async inscrever(eventoId) {
        try {
            const response = await fetch('/api/inscricoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ evento_id: eventoId })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.erro || 'Erro ao realizar inscrição');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao realizar inscrição:', error);
            throw error;
        }
    }

    static async cancelar(inscricaoId) {
        try {
            const response = await fetch(`/api/inscricoes/${inscricaoId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.erro || 'Erro ao cancelar inscrição');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao cancelar inscrição:', error);
            throw error;
        }
    }

    static async confirmarPresenca(inscricaoId) {
        try {
            const response = await fetch(`/api/inscricoes/${inscricaoId}/presenca`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.erro || 'Erro ao confirmar presença');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao confirmar presença:', error);
            throw error;
        }
    }

    static async listarMinhasInscricoes() {
        try {
            const response = await fetch('/api/inscricoes/minhas', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.erro || 'Erro ao buscar inscrições');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar inscrições:', error);
            throw error;
        }
    }
}

// Funções de manipulação da UI
async function handleInscrever(eventoId) {
    try {
        if (!eventoId) {
            throw new Error('ID do evento não fornecido');
        }

        const response = await InscricaoService.inscrever(eventoId);
        if (response.erro) {
            throw new Error(response.erro);
        }
        
        alert('Inscrição realizada com sucesso!');
        window.location.href = '/minhasInscricoes';
    } catch (error) {
        console.error('Erro ao realizar inscrição:', error);
        alert(error.message || 'Erro ao realizar inscrição. Por favor, tente novamente.');
    }
}

async function handleCancelar(inscricaoId) {
    if (!confirm('Tem certeza que deseja cancelar sua inscrição?')) {
        return;
    }

    try {
        await InscricaoService.cancelar(inscricaoId);
        alert('Inscrição cancelada com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Erro ao cancelar inscrição: ' + error.message);
    }
}

async function handleConfirmarPresenca(inscricaoId) {
    try {
        await InscricaoService.confirmarPresenca(inscricaoId);
        alert('Presença confirmada com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Erro ao confirmar presença: ' + error.message);
    }
}

// Exportar funções e classe para uso global
window.InscricaoService = InscricaoService;
window.handleInscrever = handleInscrever;
window.handleCancelar = handleCancelar;
window.handleConfirmarPresenca = handleConfirmarPresenca;
