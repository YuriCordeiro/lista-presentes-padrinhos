# 🚀 Deploy no Vercel - Guia Completo

## 🔧 Problema Resolvido

O erro que você viu acontece porque a aplicação estava tentando acessar `http://localhost:3001` em produção. No Vercel, você precisa usar **Serverless Functions**.

### ❌ Erro anterior:
```
Access to fetch at 'http://localhost:3001/api/health' from origin 'https://lista-presentes-padrinhos-cy.vercel.app' has been blocked by CORS policy
```

### ✅ Solução implementada:
- ✅ **Serverless Functions** criadas na pasta `/api/`
- ✅ **Auto-detecção** de ambiente (dev/prod)
- ✅ **CORS configurado** corretamente
- ✅ **Google Sheets API** funcionando em produção

## 📁 Arquivos Criados

### 1. `/api/health.js` - Health Check
```javascript
// Endpoint: https://seu-app.vercel.app/api/health
// Retorna status da aplicação
```

### 2. `/api/reserve-gift.js` - Reservar Presente
```javascript
// Endpoint: https://seu-app.vercel.app/api/reserve-gift
// Integração completa com Google Sheets
```

### 3. `vercel.json` - Configuração do Vercel
```json
{
  "version": 2,
  "builds": [
    { "src": "dist/**/*", "use": "@vercel/static" },
    { "src": "api/**/*.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/dist/$1" }
  ]
}
```

## 🔑 Configurar Variáveis de Ambiente no Vercel

### 1. Acesse o Painel Vercel
1. Vá em https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **Settings** → **Environment Variables**

### 2. Adicione as Variáveis:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `lista-presentes-service@lista-de-padrinhos-cloud.iam.gserviceaccount.com` | Production |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Production |
| `GOOGLE_SPREADSHEET_ID` | `1IYr_m43FUPYilTQz_bICKZjHTPg7CUWVXVlS09N-LJI` | Production |

⚠️ **IMPORTANTE**: Para `GOOGLE_PRIVATE_KEY`, cole o valor completo incluindo:
- `-----BEGIN PRIVATE KEY-----`
- Todo o conteúdo da chave
- `-----END PRIVATE KEY-----`
- Mantenha as quebras de linha (`\n`)

### 3. Exemplo de GOOGLE_PRIVATE_KEY:
```
-----BEGIN PRIVATE KEY-----
...
...resto da chave...
-----END PRIVATE KEY-----
```

## 🚀 Deploy Atualizado

### 1. Build e Deploy:
```bash
npm run build
git add .
git commit -m "feat: add Vercel serverless functions"
git push
```

### 2. Deploy no Vercel:
```bash
vercel --prod
```

Ou use a integração automática do GitHub se configurada.

## 🧪 Testar em Produção

### 1. Health Check:
- Acesse: `https://seu-app.vercel.app/api/health`
- Deve retornar: `{"status":"OK","timestamp":"...","environment":"vercel-production"}`

### 2. Teste de Reserva:
1. Acesse sua aplicação no Vercel
2. Clique em "Quero Este!" em qualquer presente
3. Preencha nome e mensagem
4. Confirme a reserva
5. ✅ Deve funcionar sem erros CORS
6. ✅ Planilha deve ser atualizada
7. ✅ Email deve ser enviado

## 🔍 Debugging

### Logs do Vercel:
```bash
vercel logs
```

### Console do Browser:
- Deve mostrar: `✅ Servidor backend conectado - funcionalidade completa ativada`
- **NÃO** deve mostrar: `⚠️ Servidor backend não disponível`

### Se ainda houver problemas:

1. **Verificar variáveis de ambiente**:
   - Vá em Vercel Dashboard → Settings → Environment Variables
   - Certifique-se que todas estão configuradas

2. **Verificar logs**:
   - `vercel logs` para ver erros do servidor
   - Console do browser para erros do frontend

3. **Testar endpoints individualmente**:
   - `https://seu-app.vercel.app/api/health`
   - POST para `https://seu-app.vercel.app/api/reserve-gift`

## 🎉 Resultado Final

✅ **Funcionando em produção**:
- Frontend estático servido pelo Vercel
- APIs como Serverless Functions 
- Auto-detecção de ambiente (dev/prod)
- CORS configurado corretamente
- Google Sheets atualizado em tempo real
- Emails enviados automaticamente

---

**🔄 Next Steps**: Após o deploy, teste uma reserva completa para confirmar que tudo está funcionando!
