const { exec } = require('child_process');

const port = 3000;

// No Windows, primeiro encontramos o PID
const findPid = () => {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -i :${port} -t`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                // Se não encontrar nenhum processo, não é um erro
                if (error.code === 1) {
                    resolve(null);
                    return;
                }
                reject(error);
                return;
            }

            if (stderr) {
                reject(new Error(stderr));
                return;
            }

            if (!stdout) {
                resolve(null);
                return;
            }

            // No Windows, extrair o PID da última coluna
            if (process.platform === 'win32') {
                const lines = stdout.trim().split('\n');
                for (const line of lines) {
                    if (line.includes(`${port}`)) {
                        const pid = line.match(/\s+(\d+)\s*$/);
                        if (pid && pid[1]) {
                            resolve(pid[1]);
                            return;
                        }
                    }
                }
                resolve(null);
            } else {
                // No Unix, o stdout já é o PID
                resolve(stdout.trim());
            }
        });
    });
};

// Função para matar o processo
const killProcess = (pid) => {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32'
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
};

// Função principal
async function main() {
    try {
        const pid = await findPid();
        if (!pid) {
            console.log(`Nenhum processo encontrado usando a porta ${port}`);
            return;
        }

        console.log(`Encontrado processo ${pid} usando a porta ${port}`);
        await killProcess(pid);
        console.log(`Processo ${pid} finalizado com sucesso`);
    } catch (error) {
        console.error('Erro:', error.message);
        process.exit(1);
    }
}

// Executar
main(); 