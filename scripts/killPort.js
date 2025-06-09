const { exec } = require('child_process');

const port = 3000;

const platform = process.platform;
let command;

if (platform === 'win32') {
    command = `netstat -ano | findstr :${port} | findstr LISTENING`;
} else {
    command = `lsof -i :${port} -t`;
}

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`No process found running on port ${port}`);
        return;
    }

    const pid = platform === 'win32' 
        ? stdout.split('\n')[0].split(' ').filter(Boolean).pop()
        : stdout.trim();

    if (!pid) {
        console.log(`No process found running on port ${port}`);
        return;
    }

    const killCommand = platform === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;

    exec(killCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error killing process on port ${port}:`, error);
            return;
        }
        console.log(`Process on port ${port} killed successfully`);
    });
}); 