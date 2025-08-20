# 🔐 Configuração de Variáveis de Ambiente

## Segurança das Credenciais

Para proteger suas credenciais do EmailJS, o sistema utiliza variáveis de ambiente. Isso evita que informações sensíveis sejam expostas no código fonte.

## Setup Inicial

### 1. Copiar o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Configurar suas credenciais reais

Edite o arquivo `.env` criado:

```env
# Configurações do EmailJS
# Obtenha essas credenciais em https://www.emailjs.com/
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxx

# Emails dos noivos para receber as notificações
VITE_BRIDE_EMAIL=carol@gmail.com
VITE_GROOM_EMAIL=yuri@gmail.com
```

### 3. Reiniciar o servidor
```bash
npm run dev
```

## Variáveis Disponíveis

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_EMAILJS_SERVICE_ID` | ID do serviço EmailJS | `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do template de email | `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | Chave pública do EmailJS | `abcdefgh123456` |
| `VITE_BRIDE_EMAIL` | Email da noiva | `carol@gmail.com` |
| `VITE_GROOM_EMAIL` | Email do noivo | `yuri@gmail.com` |

## Segurança

✅ **O que está protegido:**
- Arquivo `.env` está no `.gitignore`
- Credenciais não aparecem no código fonte
- Não são enviadas para o repositório Git

⚠️ **Importante:**
- Nunca commite o arquivo `.env`
- Use apenas o prefixo `VITE_` para variáveis do frontend
- Mantenha o `.env.example` atualizado (sem valores reais)

## Verificação

Quando o sistema estiver rodando, você verá no console:

**✅ Configurado corretamente:**
```
📧 Enviando email de reserva: ...
✅ Email enviado com sucesso!
```

**⚠️ Não configurado:**
```
⚠️ EmailJS não configurado - simulando envio
💡 Configure as variáveis de ambiente VITE_EMAILJS_* no arquivo .env
✅ Email simulado enviado com sucesso!
```

## Deploy em Produção

Para fazer deploy (Vercel, Netlify, etc.), configure as variáveis de ambiente na plataforma:

### Vercel:
1. Dashboard do projeto
2. Settings → Environment Variables
3. Adicionar cada variável `VITE_*`

### Netlify:
1. Site dashboard
2. Site settings → Environment variables
3. Adicionar cada variável `VITE_*`

---

**🔒 Suas credenciais estão agora protegidas e o sistema pode ser usado com segurança!**
