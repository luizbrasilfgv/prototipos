# Quem Paga o Café? ☕

Um Web App mobile-first (SPA) para organizar e gerenciar de forma justa as famosas "rodadas de café" no escritório ou entre amigos. Diga adeus àquela dúvida: *"quem foi que pagou o último café mesmo?"* ou *"quem está só tomando de graça?"*!

**Acesse o app ao vivo:** [https://quempagacafe.web.app/](https://quempagacafe.web.app/)

## 🌟 Funcionalidades Principais

- **Registro Ágil de Rodadas**: Registre os pagadores e os presentes em cada rodada com apenas alguns toques.
- **Cálculo de Saldos Inteligente**: O app calcula automaticamente o saldo de cada pessoa (créditos e débitos) com base em quanto ela pagou e quantos cafés consumiu.
- **Rodadas Bônus (Kop Club) — Regra: Catraca do Devedor**: Suporte para rodadas onde o café é de graça (usando pontos acumulados da cafeteria). A regra aprovada: todo mundo é elegível por padrão, exceto quem tem saldo devedor acima de +3 ou não pagou nenhuma conta nos últimos 30 dias. Nome riscado e bloqueado na interface para os inadimplentes.
- **Estatísticas Detalhadas e "Cobrança"**:
  - **☕ Pagou a rodada**: Quantas vezes a pessoa puxou o cartão.
  - **☕ Total de cafés bancados**: Quantos cafezinhos individuais saíram do bolso daquela pessoa para a galera.
  - **🧛 Tomou de graça**: O famoso "sanguessuga".
  - **👋 Marcou presença**: Quem nunca perde a hora do café.
  - **🎁 Rodadas Kop Club**: Quem mais aproveita os bônus.
- **Gestão de Acesso (RBAC)**: Login via Google, com aprovação da conta por um administrador. Três perfis:
  - **Membro**: uso do dia a dia (sorteio, rodada bônus, saldos, histórico e estatísticas).
  - **Editor**: tudo do membro + editar e excluir lançamentos (café comum ou rodada bônus).
  - **Admin**: tudo do editor + gestão de participantes e controle de acessos (inclusive dar/tirar o perfil Editor).
- **Confirmação em 3 etapas**: editar ou excluir um lançamento passa por (1) uma pergunta de sim/não, (2) segurar a xícara por 5 segundos até ela encher de café, vendo o impacto nos saldos, e (3) digitar `CONFIRMO`. A ação fica registrada na auditoria.
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
