# Guia de Deploy em Produção - Lista de Presentes

## 📋 Pré-requisitos

### 1. Build da Aplicação
```bash
npm run build
```
✅ **Concluído** - A pasta `dist/` foi criada com sucesso.

### 2. Configuração de Variáveis de Ambiente
Certifique-se de que todas as variáveis estão configuradas no servidor de produção:

```env
# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Google Sheets API (Backend)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id

# Servidor
PORT=3001
NODE_ENV=production
```

## 🚀 Opções de Deploy

### Opção 1: Vercel (Recomendado para Iniciantes)

#### Frontend + Backend (Serverless)
1. **Instale o Vercel CLI:**
```bash
npm i -g vercel
```

2. **Configure o projeto:**
```bash
vercel
```

3. **Crie arquivo `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**/*",
      "use": "@vercel/static"
    },
    {
      "src": "server/api.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/api.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "GOOGLE_SERVICE_ACCOUNT_EMAIL": "@google_service_account_email",
    "GOOGLE_PRIVATE_KEY": "@google_private_key",
    "GOOGLE_SPREADSHEET_ID": "@google_spreadsheet_id"
  }
}
```

4. **Configure as variáveis de ambiente no painel Vercel**

5. **Deploy:**
```bash
vercel --prod
```

**Custo:** Gratuito para uso pessoal

### Opção 2: Netlify

#### Frontend Apenas
1. **Build e deploy:**
```bash
npm run build
# Arraste a pasta dist/ para o Netlify Drop
```

#### Com Netlify Functions (Backend)
1. **Crie `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. **Mova as funções:**
```bash
mkdir -p netlify/functions
cp server/* netlify/functions/
```

**Custo:** Gratuito para uso pessoal

### Opção 3: Servidor VPS/Cloud

#### Frontend (Nginx)
1. **Transfira a pasta `dist/` para o servidor:**
```bash
scp -r dist/ user@your-server:/var/www/lista-presentes/
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/lista-presentes;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Backend (PM2)
1. **Instale dependências no servidor:**
```bash
npm install --production
npm install -g pm2
```

2. **Crie `ecosystem.config.js`:**
```javascript
module.exports = {
  apps: [{
    name: 'lista-presentes-api',
    script: './server/api.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

3. **Deploy com PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Custo:** A partir de $5/mês (DigitalOcean, Linode)

## 🔧 Scripts de Produção

### Para facilitar o deploy, adicione no `package.json`:

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "start:prod": "cd server && node api.js",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "npm run build && netlify deploy --prod --dir=dist"
  }
}
```

## 📊 Monitoramento

### Logs e Debugging
```bash
# Vercel
vercel logs

# Netlify
netlify logs

# PM2
pm2 logs
pm2 monit
```

### Health Check
Acesse: `https://your-domain.com/api/health`

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "environment": "production"
}
```

## 🔒 Segurança

### HTTPS
- **Vercel/Netlify:** Automático
- **VPS:** Use Certbot (Let's Encrypt)

### Variáveis de Ambiente
- ✅ Nunca commitar arquivos `.env`
- ✅ Use secrets do provedor de hosting
- ✅ Validate todas as variáveis no startup

### CORS
O backend já está configurado para aceitar requisições do frontend.

## 🚨 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se o backend está rodando
- Confirme as URLs da API
- Verifique CORS

### Erro: "Google Sheets API"
- Verifique as credenciais do Service Account
- Confirme as permissões da planilha
- Teste com: `https://your-domain.com/api/health`

### Build Error
```bash
# Limpe e rebuilde
rm -rf dist/ node_modules/
npm install
npm run build
```

## 📈 Próximos Passos

1. **CDN:** Configure CloudFlare para melhor performance
2. **Analytics:** Adicione Google Analytics ou Plausible
3. **PWA:** A aplicação já está configurada como PWA
4. **Backup:** Configure backup automático da planilha
5. **Domain:** Configure domínio personalizado

---

**✅ Status:** Pronto para produção!
**🔄 Last Update:** 2024-01-20
