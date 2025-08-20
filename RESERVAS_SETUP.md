# Configuração do Sistema de Reservas com EmailJS

## Funcionalidade Implementada

✅ **Sistema de Reservas Completo:**
- Botão "Vou Comprar" em cada presente
- Modal para inserir nome do padrinho e mensagem opcional
- Modal de confirmação da reserva
- Estado visual para presentes reservados (desabilitados)
- Persistência local das reservas
- Integração com serviço de email

## Como Configurar o EmailJS

### 1. Criar conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Faça login no dashboard

### 2. Configurar o Serviço de Email
1. Vá em **Email Services** no dashboard
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure as credenciais do email dos noivos
5. Anote o **Service ID** gerado

### 3. Criar Template de Email
1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Configure o template com as seguintes variáveis:
   - `{{to_email}}` - Email dos destinatários
   - `{{guest_name}}` - Nome do padrinho/madrinha
   - `{{gift_title}}` - Nome do presente
   - `{{message}}` - Mensagem personalizada
   - `{{reservation_date}}` - Data da reserva

### 4. Exemplo de Template:
```
Assunto: 🎁 Novo Presente Reservado - {{gift_title}}

Olá Carol e Yuri!

Vocês receberam uma nova reserva de presente:

👤 Padrinho/Madrinha: {{guest_name}}
🎁 Presente: {{gift_title}}
📅 Data da Reserva: {{reservation_date}}

💌 Mensagem:
{{message}}

---
Lista de Presentes dos Noivos
```

### 5. Configurar as Credenciais com Variáveis de Ambiente

Para proteger suas credenciais, configure as variáveis de ambiente:

1. **Copie o arquivo de exemplo:**
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env` com suas credenciais reais:**
```env
# Configurações do EmailJS
VITE_EMAILJS_SERVICE_ID=service_seu_id_aqui
VITE_EMAILJS_TEMPLATE_ID=template_seu_id_aqui
VITE_EMAILJS_PUBLIC_KEY=sua_public_key_aqui

# Emails dos noivos
VITE_BRIDE_EMAIL=carol@exemplo.com
VITE_GROOM_EMAIL=yuri@exemplo.com
```

3. **Reinicie o servidor de desenvolvimento:**
```bash
npm run dev
```

⚠️ **Importante:** O arquivo `.env` está no `.gitignore` e não será versionado, mantendo suas credenciais seguras.

### 6. Ativar o Envio Real

### 7. Instalar EmailJS
```bash
npm install @emailjs/browser
```

## Funcionalidades do Sistema

### Para os Padrinhos:
- ✅ Visualizar lista de presentes
- ✅ Clicar em "Vou Comprar" para reservar
- ✅ Preencher nome e mensagem personalizada
- ✅ Confirmar a reserva
- ✅ Ver presentes já reservados (desabilitados)

### Para os Noivos:
- ✅ Receber email automático com cada reserva
- ✅ Controlar visibilidade dos presentes na planilha (coluna "Exibir")
- ✅ Acompanhar reservas localmente no navegador

### Estrutura da Planilha:
| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E |
|----------|----------|----------|----------|----------|
| Título | URL Produto | URL Imagem | Ordem | Exibir |
| Nome do Presente | Link da loja | Link da imagem | 1,2,3... | Sim/Não |

## Melhorias Futuras Possíveis:
- [ ] Dashboard administrativo para os noivos
- [ ] Integração com planilha para marcar reservas
- [ ] Sistema de notificações push
- [ ] Backup das reservas em nuvem
- [ ] Analytics de presentes mais populares

## Suporte
Em caso de dúvidas, consulte a [documentação do EmailJS](https://www.emailjs.com/docs/) ou entre em contato.
