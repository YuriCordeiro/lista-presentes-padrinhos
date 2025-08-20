# 🔐 Configuração Google Service Account

## Visão Geral
Para permitir que a aplicação escreva na planilha sem torná-la pública, vamos usar um Google Service Account. Isso é mais seguro que deixar a planilha pública.

## 📋 Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar projeto" → "Novo projeto"
3. Nome: `lista-presentes-padrinhos`
4. Clique em "Criar"

### 2. Ativar Google Sheets API

1. No menu lateral → "APIs e serviços" → "Biblioteca"
2. Pesquise por "Google Sheets API"
3. Clique na API e depois em "Ativar"

### 3. Criar Service Account

1. No menu lateral → "APIs e serviços" → "Credenciais"
2. Clique em "Criar credenciais" → "Conta de serviço"
3. **Nome**: `lista-presentes-service`
4. **ID**: `lista-presentes-service` (será gerado automaticamente)
5. **Descrição**: `Service account para escrita na planilha de presentes`
6. Clique em "Criar e continuar"
7. **Função**: Deixe em branco por enquanto
8. Clique em "Concluir"

### 4. Gerar Chave Privada

1. Na tela de credenciais, clique na conta de serviço criada
2. Vá na aba "Chaves"
3. Clique em "Adicionar chave" → "Criar nova chave"
4. Selecione **JSON**
5. Clique em "Criar" - um arquivo JSON será baixado

### 5. Configurar Permissões na Planilha

1. Abra o arquivo JSON baixado
2. Copie o valor do campo `"client_email"` (algo como `lista-presentes-service@projeto.iam.gserviceaccount.com`)
3. Na sua planilha Google Sheets:
   - Clique em "Compartilhar"
   - Cole o email da service account
   - Selecione "Editor" (para permitir escrita)
   - **DESMARQUE** "Notificar pessoas"
   - Clique em "Compartilhar"

### 6. Configurar Variáveis de Ambiente

Do arquivo JSON baixado, extraia estas informações:

```json
{
  "client_email": "lista-presentes-service@projeto.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
}
```

No seu arquivo `.env`:

```env
# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=lista-presentes-service@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1IYr_m43FUPYilTQz_bICKZjHTPg7CUWVXVlS09N-LJI
```

⚠️ **Importante**: Mantenha as quebras de linha `\n` na chave privada!

### 7. Atualizar Estrutura da Planilha

Adicione duas novas colunas à sua planilha:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Título** | **URL Produto** | **URL Imagem** | **Ordem** | **Exibir** | **Reservado** | **Reservado Por** |
| Panela | http://... | http://... | 1 | Sim | | |
| Cafeteira | http://... | http://... | 2 | Sim | Sim | João Silva |

- **Coluna F (Reservado)**: Será preenchida com "Sim" quando reservado
- **Coluna G (Reservado Por)**: Nome do padrinho que reservou

### 8. Testar a Configuração

1. **Inicie o servidor backend:**
   ```bash
   npm run server
   ```

2. **Em outro terminal, inicie o frontend:**
   ```bash
   npm run dev
   ```

3. **Ou execute ambos simultaneamente:**
   ```bash
   npm run dev:full
   ```

4. **Teste uma reserva:**
   - Abra http://localhost:5173
   - Clique em "Vou Comprar" em qualquer presente
   - Complete o processo de reserva
   - Verifique se a planilha foi atualizada automaticamente

### 9. Verificação de Segurança

✅ **O que está protegido:**
- Planilha não é pública (apenas você e a service account têm acesso)
- Chave privada está no `.env` (não vai para o Git)
- Service account tem acesso limitado apenas às Sheets API

✅ **Logs esperados:**
```
🚀 Servidor backend rodando na porta 3001
✅ Servidor backend conectado - funcionalidade completa ativada
🔄 Sincronização concluída: X presentes reservados
✅ Planilha atualizada: [Nome do Presente] reservado por [Nome do Padrinho]
```

### 🚨 Solução de Problemas

**Erro de autenticação:**
- Verifique se o email da service account foi adicionado à planilha
- Confirme se as quebras de linha `\n` estão corretas na chave privada

**Servidor não conecta:**
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se a Google Sheets API está ativada no projeto

**Planilha não atualiza:**
- Verifique se a service account tem permissão de "Editor"
- Confirme se o SPREADSHEET_ID está correto

---

**🎉 Após a configuração, sua aplicação poderá escrever na planilha de forma segura!**
