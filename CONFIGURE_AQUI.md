# 🔐 Configure suas Credenciais

Para ativar o sistema de reservas com envio de email, siga estes passos:

## 1. Copie o arquivo de configuração
```bash
cp .env.example .env
```

## 2. Configure o EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Configure um serviço de email (Gmail recomendado)
4. Crie um template de email
5. Obtenha suas credenciais:
   - Service ID
   - Template ID  
   - Public Key

## 3. Edite o arquivo `.env`

Substitua os valores de exemplo pelos seus dados reais:

```env
# Suas credenciais do EmailJS
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=sua_public_key_aqui

# Emails dos noivos
VITE_BRIDE_EMAIL=carol@gmail.com
VITE_GROOM_EMAIL=yuri@gmail.com
```

## 4. Reinicie a aplicação
```bash
npm run dev
```

## 5. Teste o sistema

1. Abra a aplicação em http://localhost:5173
2. Clique em "Vou Comprar" em qualquer presente
3. Preencha os dados e confirme
4. Verifique se o email foi enviado

---

📧 **Resultado esperado**: Vocês receberão um email a cada reserva de presente!

Para mais detalhes, veja o arquivo `ENV_SETUP.md`.
