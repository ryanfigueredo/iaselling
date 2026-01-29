# GoVIP E-commerce

E-commerce moderno para venda do GoVIP Plano Beta com integração Mercado Pago.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Mercado Pago** - Gateway de pagamento

## 🎨 Design

- **Glassmorphism** - Cards com fundo semi-transparente e bordas neon
- **Tema Verde/Preto** - Identidade visual moderna
- **Animações Suaves** - Fade-in, slide-up, glitch effects
- **Bento Grid** - Layout moderno para exibir ferramentas
- **Botão Flutuante** - Contato aparece apenas após pagamento

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione:
- `MERCADOPAGO_ACCESS_TOKEN` - Seu token de acesso do Mercado Pago (credenciais privadas)
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` - Chave pública do Mercado Pago (para pagamento com cartão - painel MP > Credenciais > Chaves públicas)
- `NEXT_PUBLIC_BASE_URL` - URL base da aplicação (ex: `https://seusite.com`)

3. Configure os links de contato no componente `ContactButton.tsx`:
- Discord: Substitua `DISCORD_LINK`
- WhatsApp: Substitua `WHATSAPP_LINK`

## 🏃 Executar

Desenvolvimento:
```bash
npm run dev
```

Produção:
```bash
npm run build
npm start
```

## 💳 Configuração Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha seu **Access Token**
4. Adicione no arquivo `.env`

### Webhook

Para receber notificações de pagamento:
1. Configure a URL do webhook no painel do Mercado Pago: `https://seusite.com/api/webhook`
2. Ou use um serviço como ngrok para desenvolvimento local

## 🔐 Sistema de Verificação

O sistema verifica pagamentos de duas formas:
1. **Redirect após pagamento** - Usuário é redirecionado para `/payment/success`
2. **Webhook** - Mercado Pago notifica quando pagamento é aprovado

Após pagamento aprovado:
- `localStorage` é atualizado com `payment_approved: true`
- Botão de contato (Discord/WhatsApp) aparece automaticamente

## 📝 Próximos Passos

- [ ] Implementar banco de dados para armazenar pagamentos
- [ ] Sistema de autenticação para área de membros
- [ ] Dashboard administrativo
- [ ] Email de confirmação após pagamento
- [ ] Sistema de geração automática de acessos

## 📄 Licença

Este projeto é privado e proprietário.
