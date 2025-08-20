# 🔧 Planilha Não Atualiza - Diagnóstico e Solução

## 🔍 Diagnóstico

A planilha não está sendo atualizada provavelmente porque as **variáveis de ambiente não estão configuradas no Vercel**.

### 1. **Teste o Endpoint de Debug**
Acesse: `https://lista-presentes-padrinhos-cy.vercel.app/api/debug`

**Se as variáveis estiverem configuradas**, você verá:
```json
{
  "status": "Environment Check",
  "variables": {
    "hasGoogleEmail": true,
    "hasGoogleKey": true,
    "hasSpreadsheetId": true,
    "emailPrefix": "lista-presentes-service@...",
    "keyPrefix": "-----BEGIN PRIVATE KEY-----...",
    "spreadsheetPrefix": "1IYr_m43FUPYilTQz_bICKZ..."
  },
  "allConfigured": true
}
```

**Se NÃO estiverem configuradas**, você verá:
```json
{
  "variables": {
    "hasGoogleEmail": false,
    "hasGoogleKey": false,
    "hasSpreadsheetId": false
  },
  "allConfigured": false
}
```

## ✅ Solução: Configurar Variáveis no Vercel

### 1. **Acesse o Painel Vercel**
1. Vá em https://vercel.com/dashboard
2. Clique no projeto **lista-presentes-padrinhos**
3. Vá em **Settings** → **Environment Variables**

### 2. **Adicione as 3 Variáveis**

#### A. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
- **Name**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: `lista-presentes-service@lista-de-padrinhos-cloud.iam.gserviceaccount.com`
- **Environment**: `Production` (marcar apenas Production)

#### B. **GOOGLE_SPREADSHEET_ID**
- **Name**: `GOOGLE_SPREADSHEET_ID`
- **Value**: `1IYr_m43FUPYilTQz_bICKZjHTPg7CUWVXVlS09N-LJI`
- **Environment**: `Production`

#### C. **GOOGLE_PRIVATE_KEY**
- **Name**: `GOOGLE_PRIVATE_KEY`
- **Value**: Cole a chave completa (veja seção abaixo)
- **Environment**: `Production`

### 3. **Configurar GOOGLE_PRIVATE_KEY Corretamente**

**⚠️ IMPORTANTE**: A chave privada deve ser colada **EXATAMENTE** como está no seu `.env` local:

```
-----BEGIN PRIVATE KEY-----
<some_real_value>
-----END PRIVATE KEY-----
```

**Dicas importantes**:
- ✅ Mantenha as quebras de linha (`\n`)
- ✅ Inclua `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- ✅ Copie EXATAMENTE do seu arquivo `.env` local

### 4. **Redeploy Obrigatório**

Após adicionar as variáveis, você DEVE fazer redeploy:

#### Opção A: **Trigger pelo Dashboard**
1. Vá em **Deployments**
2. Clique nos 3 pontos de um deploy recente
3. Clique **Redeploy**

#### Opção B: **Push qualquer mudança**
```bash
# Qualquer mudança para trigger o redeploy
git commit --allow-empty -m "trigger redeploy with env vars"
git push
```

## 🧪 Testar Após Configuração

### 1. **Aguarde o Redeploy** (2-3 minutos)

### 2. **Teste o Debug**
```
GET https://lista-presentes-padrinhos-cy.vercel.app/api/debug
```
Deve mostrar `"allConfigured": true`

### 3. **Teste uma Reserva**
1. Acesse sua aplicação
2. Clique "Quero Este!" em qualquer presente
3. Preencha nome e mensagem
4. Confirme

### 4. **Verificar Logs**
```bash
vercel logs --follow
```

### 5. **Verificar Planilha**
- Abra sua planilha Google Sheets
- Verifique se a coluna F foi marcada como "Sim"
- Verifique se a coluna G tem o nome do padrinho

## ⚠️ Problemas Comuns

### Erro: "Google Sheets não configurado"
- Variáveis não foram adicionadas no Vercel
- Redeploy não foi feito após adicionar variáveis

### Erro: "Failed to authenticate"
- Chave privada incorreta (faltam quebras de linha)
- Service Account sem permissão na planilha

### Planilha não atualiza mas não dá erro
- Verificar se o Service Account tem acesso de **Editor** na planilha
- Verificar se o `GOOGLE_SPREADSHEET_ID` está correto

---

**🎯 Primeiro passo: Teste o `/api/debug` para confirmar se as variáveis estão configuradas!**
