# Quem Paga o Café? ☕

Um Web App mobile-first (SPA) para organizar e gerenciar de forma justa as famosas "rodadas de café" no escritório ou entre amigos. Diga adeus àquela dúvida: *"quem foi que pagou o último café mesmo?"* ou *"quem está só tomando de graça?"*!

**Acesse o app ao vivo:** [https://quempagacafe.web.app/](https://quempagacafe.web.app/)

## 🌟 Funcionalidades Principais

- **Registro Ágil de Rodadas**: Registre os pagadores e os presentes em cada rodada com apenas alguns toques.
- **Cálculo de Saldos Inteligente**: O app calcula automaticamente o saldo de cada pessoa (créditos e débitos) com base em quanto ela pagou e quantos cafés consumiu.
- **Rodadas Bônus (Ex: Kop Club)**: Suporte para rodadas onde o café é de graça (usando pontos acumulados da cafeteria), com regras estritas: validade de 6 meses (se não for usado, expira) e direito de participar exclusivo para quem contribuiu pagando cafés nos últimos 6 meses.
- **Estatísticas Detalhadas e "Cobrança"**:
  - **☕ Pagou a rodada**: Quantas vezes a pessoa puxou o cartão.
  - **☕ Total de cafés bancados**: Quantos cafezinhos individuais saíram do bolso daquela pessoa para a galera.
  - **🧛 Tomou de graça**: O famoso "sanguessuga".
  - **👋 Marcou presença**: Quem nunca perde a hora do café.
  - **🎁 Rodadas Kop Club**: Quem mais aproveita os bônus.
- **Gestão de Acesso (RBAC)**: Login via Google. Apenas administradores do grupo (whitelist configurada na nuvem) podem registrar lançamentos, editar bônus, adicionar participantes ou estornar histórico. Membros comuns têm acesso apenas de leitura (Dashboard, Histórico e Estatísticas).
- **PWA (Progressive Web App)**: O app pode ser instalado na tela inicial do celular (Android/iOS) para uso como aplicativo nativo e possui cache via Service Worker.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties e CSS Grid/Flexbox) e Vanilla Javascript. Arquitetura Single Page Application (SPA) centralizada.
- **Backend & Banco de Dados**: [Firebase Firestore](https://firebase.google.com/docs/firestore) para banco de dados NoSQL e sincronização em tempo real (onSnapshot).
- **Autenticação**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google Sign-In).
- **Hospedagem**: [Firebase Hosting](https://firebase.google.com/docs/hosting). (Anteriormente hospedado via GitHub Pages, que agora atua apenas como redirecionador imediato).

## 🚀 Como Executar Localmente

1. Ter o Node.js e o Firebase CLI instalados.
2. Fazer login no Firebase CLI:
   ```bash
   firebase login
   ```
3. Iniciar um servidor local para testar as Firebase Rules e Hosting:
   ```bash
   firebase serve
   ```
   *Ou apenas abrir o arquivo `quempagaocafe.html` no seu navegador (algumas funcionalidades do Firebase exigem rodar em um servidor web `http://localhost` para não bloquearem requisições de origem `file://`).*

## 📦 Deploy

O deploy é feito através de comandos git (que atualizam o redirecionador no GitHub Pages) e Firebase CLI:
```bash
git add .
git commit -m "seu commit"
git push origin main
firebase deploy --only hosting
```

## 📜 Migração do GitHub Pages

O projeto originalmente vivia em `luizbrasilfgv.github.io`. Um script de interceptação via `<head>` redireciona imediatamente qualquer acesso à URL legada para o novo domínio Firebase, poupando banco de dados e processamento desnecessário na plataforma antiga.
