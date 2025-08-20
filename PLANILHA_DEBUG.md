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
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDt+7gsr2Bhnu8T
Ybog0mynEKJBMU/6u0r5ewPs2DwibqqfZGxJT/auOgilCroXsv9Crp0Be7S4KBKW
6OaWL6lPSZsAdFM4CRngGg+D3fmcmuN8QNslHxF5wh8cUnnZxsAqjEqYK+tKFYd5
O5KVy8JtRvHuW8OVkK+A8c7bT0hk6sY7Zpbz/Mx47uTW4cC+htU/323k+41VEVN7
gAe46xvCY0wm9d1D0bwbIht6+XskE/heJD9Ewna2J/HmY2c0veMNLj59VZEfV8fN
NWwzH0MZOEnYeuzNOIOlWphFESROalYRsJs5yYcuxeSDvxpCscnXgUavLN9aNkpJ
TeEsFte5AgMBAAECggEAEUkM3ukDlP+aYZPh9SeXhvhrMpVCeAWRy+ZamgG4N2+G
ktJ0V4xYcF3sehFaBCXnCri8VGrf7NbTR9UFh4/Raj4ARUONtlaZ46g864DsVAq/
fmtHB46Wwjteb1wRt+bK1yROuDgLbFt9Ninkqx7sQavrH1sYrQS/7JuToOQEr/im
HDkXbTDmG0sb+4mw1Hhq431err0OhKItR9CHKP+yRWgxE9c2VEuia4PLrRzUFIny
QslqiTTbdAhF9XJ5I+65t4Cqt4GUa2mHsr4t+GENWK+5v1TjRZO5l2VXAWM41aod
1L+UMRu1s6ovqRJoRRZ5sdqRPUMt5tdgLdqEqMWF0QKBgQD9c95kWaTrYywbYSvU
5168NIPAZCqiqcVXoioJ5dll18MRITppEnncamfdxpwYBp1IcdI0smMeu6+qlMS5
u4fb/3ix7J7nIHBjSzHRqfml0UgGEsSV6iXzhFRRBlpx1HIp1couLeQnzzhlHiso
WVITcznNgydpXpws3rCBbcruqQKBgQDwYAxarkc34el3hk5QdFDPauzGHzZmPSUJ
xZGN6Brb33tiouwwjqB1Z/cCTXn7KJg8kNMD+GtQiSnET+VTl4KJADrmAzBOIFS3
AxRWhVqu5r2WV4QrouEhSdcxQcDiHkboN1VpQGrkUVPCuqJcHTfYocatrV3p4LlT
kUIyJHSakQKBgQC4eKEhQO38NU5hDzSr3UriiQZr/XvasN5lji4yzgyRR50+1oSA
/WWcvAWlMW1jP00y8UUh/cSPFeQhr+4PkSKtSSA7wBFYABBM9OnpxGFkAxL8+KQE
yUueFm6YGpuxxgLh2C0zt0scfoJ5dp/K2lgWuAMWRaNl2eqp7dtiGNtfIQKBgEVc
gdQc3AIdF0BdKfX/Sl4/zWjyEsF3vVtPfkvDgRSXLURuHNd6IIUgZd9tOdimgx9e
7vUDVvwbSEkUgOkZHBqqTVSX8PVqUOeqZND+lAdKH8TlJgdtbacsZoMZJS5abD2P
0f6YDwApE5FqR3VrHPVO4US2dRYKuY+Kp95ONLNxAoGBAIDPNua9ei/bR5Z5wNNl
kvlPuCSKlOCmnZPxmp48QT3uTt1XLF/e8DYjOQ8jM2V/9zrvI7jSwIzC69NIQNUs
eEr8iUy+CQQKrSs+PFAR1XW2vuCuUCHi6T2ddDSdW9OWT5yC8gXJloJaurxpyJOH
BhA9WiIojuqwC719e++isFFS
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
