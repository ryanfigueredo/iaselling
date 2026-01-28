# 🚀 Guia Rápido de Configuração

## 1. Instalar Dependências

```bash
npm install
```

## 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# Token de acesso do Mercado Pago (obtenha em: https://www.mercadopago.com.br/developers)
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui

# URL base da aplicação
# Desenvolvimento local:
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Produção:
# NEXT_PUBLIC_BASE_URL=https://seusite.com

# Links de contato (opcional - também pode editar diretamente no ContactButton.tsx)
NEXT_PUBLIC_DISCORD_LINK=https://discord.gg/seu-servidor
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/5511999999999
```

## 3. Configurar Links de Contato

Edite o arquivo `components/ContactButton.tsx` e substitua:
- `DISCORD_LINK` pelo link do seu servidor Discord
- `WHATSAPP_LINK` pelo seu número do WhatsApp (formato: `https://wa.me/5511999999999`)

## 4. Obter Token do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login na sua conta
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie o **Access Token** (teste ou produção)
5. Cole no arquivo `.env`

## 5. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 6. Configurar Webhook (Produção)

Para receber notificações de pagamento em produção:

1. No painel do Mercado Pago, configure a URL do webhook:
   ```
   https://seusite.com/api/webhook
   ```

2. Para desenvolvimento local, use ngrok:
   ```bash
   ngrok http 3000
   ```
   Use a URL do ngrok no painel do Mercado Pago

## ✅ Pronto!

Seu e-commerce está configurado e pronto para vender!

---

**Dica:** Teste primeiro com o token de **teste** do Mercado Pago antes de usar em produção.
