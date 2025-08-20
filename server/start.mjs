import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, 'api.ts');

// Usar tsx para executar TypeScript diretamente
const server = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  cwd: join(__dirname, '..')
});

server.on('close', (code) => {
  console.log(`Servidor encerrado com código ${code}`);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit(0);
});
