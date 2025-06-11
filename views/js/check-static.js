// Função para verificar se um arquivo existe
function checkFileExists(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log(`Arquivo ${url} existe!`);
          resolve(true);
        } else {
          console.error(`Arquivo ${url} não existe!`);
          resolve(false);
        }
      })
      .catch(error => {
        console.error(`Erro ao verificar ${url}:`, error);
        resolve(false);
      });
  });
}

// Verificar arquivos importantes
async function checkImportantFiles() {
  const files = [
    '/css/auth.css',
    '/assets/logo_tickIN.png',
    '/assets/email.png',
'/assets/lock.png'
  ];
  
  const results = {};
  
  for (const file of files) {
    results[file] = await checkFileExists(file);
  }
  
  console.log('Resultados da verificação:', results);
  return results;
}

// Executar a verificação quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  console.log('Verificando arquivos estáticos...');
  checkImportantFiles().then(results => {
    // Adicionar os resultados à página
    const resultsDiv = document.createElement('div');
    resultsDiv.style.position = 'fixed';
    resultsDiv.style.bottom = '10px';
    resultsDiv.style.right = '10px';
    resultsDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    resultsDiv.style.color = 'white';
    resultsDiv.style.padding = '10px';
    resultsDiv.style.borderRadius = '5px';
    resultsDiv.style.zIndex = '9999';
    
    let html = '<h3>Verificação de arquivos:</h3><ul>';
    for (const [file, exists] of Object.entries(results)) {
      html += `<li>${file}: ${exists ? '✅' : '❌'}</li>`;
    }
    html += '</ul>';
    
    resultsDiv.innerHTML = html;
    document.body.appendChild(resultsDiv);
  });
});