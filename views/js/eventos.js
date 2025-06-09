// Manipulação do formulário de eventos
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isEditing = form.dataset.isEditing === 'true';
        const eventoId = form.dataset.eventoId;
        const apiUrl = isEditing ? `/api/eventos/${eventoId}` : '/api/eventos';

        // Limpar mensagens anteriores
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Coletar dados do formulário
        const dadosEvento = {
            titulo: document.getElementById('title').value,
            descricao: document.getElementById('description').value,
            data: document.getElementById('date').value,
            horario: document.getElementById('time').value,
            local: document.getElementById('location').value,
            usuario_id: window.organizadorId
        };

        try {
            console.log('Enviando dados:', dadosEvento);
            
            const response = await fetch(apiUrl, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dadosEvento)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Resposta inválida do servidor. Por favor, faça login novamente.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao criar evento');
            }

            console.log('Evento criado:', data);
            
            // Mostrar mensagem de sucesso
            successMessage.style.display = 'block';
            successMessage.textContent = 'Evento criado com sucesso!';

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = '/meusEventos';
            }, 2000);

        } catch (error) {
            console.error('Erro:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Erro ao criar evento';
            
            // Se não estiver autenticado, redirecionar para login
            if (error.message.includes('não autenticado')) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
    });

    // Preview de imagens
    const imageInput = document.getElementById('images');
    const previewContainer = document.getElementById('imagePreviewContainer');
    
    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function(e) {
            previewContainer.innerHTML = '';
            const files = Array.from(e.target.files);

            files.forEach(file => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'image-preview';
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(file);
            });
        });
    }

    // Drag and drop para imagens
    const dropZone = document.querySelector('.image-upload');
    if (dropZone && imageInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        dropZone.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            dropZone.classList.add('drag-over');
        }

        function unhighlight() {
            dropZone.classList.remove('drag-over');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            imageInput.files = files;
            
            // Disparar evento change para atualizar preview
            const event = new Event('change');
            imageInput.dispatchEvent(event);
        }
    }
});

async function deleteEvento(eventoId) {
  if (!confirm('Tem certeza que deseja deletar este evento?')) return;
  try {
    const response = await fetch(`/api/eventos/${eventoId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
    // Remover o card do DOM
    const card = document.getElementById(`evento-${eventoId}`);
    if (card) card.remove();
    alert('Evento deletado com sucesso!');
    // Não recarregue a página aqui!
  } catch (error) {
    alert(error.message);
  }
}

// --- SUPABASE UPLOAD E ENVIO DE EVENTO ---
const supabaseUrl = 'https://fmcsjnwxvzauxnvpdrnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtY3Nqbnd4dnphdXhudnBkcm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDEwMjQsImV4cCI6MjA2MzU3NzAyNH0.IQYFz_6W3-8kYIiD9kJnDJM5ucQmgsE8-Nn8Y3dnKCo'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let imagemUrl = '';

// Upload da imagem para o Supabase Storage
const uploadInput = document.getElementById('uploadImagem');
if (uploadInput) {
  uploadInput.addEventListener('change', async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const nomeUnico = `${Date.now()}-${arquivo.name}`;
    const { error: uploadError } = await supabase.storage
      .from('imagens-eventos')
      .upload(`eventos/${nomeUnico}`, arquivo);
    if (uploadError) {
      alert('Erro ao enviar imagem!');
      return;
    }
    const { data: urlData } = supabase
      .storage
      .from('imagens-eventos')
      .getPublicUrl(`eventos/${nomeUnico}`);
    imagemUrl = urlData.publicUrl;
    alert('Imagem enviada com sucesso!');
  });
}

// Envio do evento para o backend
const form = document.getElementById('eventForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dadosEvento = {
      titulo: document.getElementById('title').value,
      descricao: document.getElementById('description').value,
      data: document.getElementById('date').value,
      horario: document.getElementById('time').value,
      local: document.getElementById('location').value,
      imagem: imagemUrl // <-- a URL da imagem do Supabase
    };
    const response = await fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosEvento)
    });
    if (response.ok) {
      alert('Evento criado com sucesso!');
      window.location.href = '/meusEventos';
    } else {
      alert('Erro ao criar evento!');
    }
  });
}
