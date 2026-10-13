# Quem Paga o Café? ☕

Um Web App mobile-first (SPA) para organizar e gerenciar de forma justa as famosas "rodadas de café" no escritório ou entre amigos. Diga adeus àquela dúvida: *"quem foi que pagou o último café mesmo?"* ou *"quem está só tomando de graça?"*!

**Acesse o app ao vivo:** [https://quempagacafe.web.app/](https://quempagacafe.web.app/)

## 🌟 Funcionalidades Principais

- **Registro Ágil de Rodadas**: Registre os pagadores e os presentes em cada rodada com apenas alguns toques.
- **Cálculo de Saldos Inteligente**: O app calcula automaticamente o saldo de cada pessoa (créditos e débitos) com base em quanto ela pagou e quantos cafés consumiu.
- **Rodadas Bônus (Kop Club) — Regra: Catraca do Devedor**: Suporte para rodadas onde o café é de graça (usando pontos acumulados da cafeteria). A regra aprovada: todo mundo é elegível por padrão, exceto quem tem saldo devedor acima de +3 ou não pagou nenhuma conta nos últimos 30 dias. Nome riscado e bloqueado na interface para os inadimplentes.
- **🎁 Kop Club no dia do café**: no sorteio, quem vai tomar pelo Kop Club (ex.: faltou na rodada bônus e o café ficou pendente) é marcado com o botão 🎁. A pessoa continua concorrendo para pagar; se for a escolhida, paga só os cafés dos outros, e o dela vira a rodada bônus do dia (vale a Catraca do Devedor). Um café pago e uma rodada bônus podem coexistir no mesmo dia, e a Trava de Repetição ignora rodadas bônus.
- **👤 Meu Dash**: aba com tudo sobre uma pessoa em todo o histórico: dias de café, cafés tomados, de graça, rodadas pagas, cafés bancados, maior sequência, saldo agora e de todos os tempos, cafés por mês (quem pagou cada café), quem pagou pra quem, dia favorito, parceiro de café e maior rodada paga. No primeiro acesso a pessoa diz quem é (fica em `users/{uid}.participante`); dá para espiar o dash de qualquer um.
- **Estatísticas Detalhadas e "Cobrança"** (aba **Ranking**):
  - **☕ Pagou a rodada**: Quantas vezes a pessoa puxou o cartão.
  - **☕ Total de cafés bancados**: Quantos cafezinhos individuais saíram do bolso daquela pessoa para a galera.
  - **🧛 Tomou de graça**: O famoso "sanguessuga".
  - **👋 Marcou presença**: Quem nunca perde a hora do café.
  - **🎁 Rodadas Kop Club**: Quem mais aproveita os bônus.
- **Gestão de Acesso (RBAC)**: Login via Google, com aprovação da conta por um administrador. Três perfis:
  - **Membro**: uso do dia a dia (sorteio, rodada bônus, saldos, histórico e estatísticas).
  - **Editor**: tudo do membro + editar e excluir lançamentos (café comum ou rodada bônus).
  - **Admin**: tudo do editor + gestão de participantes (apelido e personagem) e controle de acessos (inclusive dar/tirar o perfil Editor).
  - O banco também confere os perfis (ver [Segurança](#-segurança-regras-do-firestore)). A diferença entre Membro e Editor é só na tela.
- **Confirmação em 3 etapas**: editar ou excluir um lançamento passa por (1) uma pergunta de sim/não, (2) segurar a xícara por 5 segundos até ela encher de café, vendo o impacto nos saldos, e (3) digitar `CONFIRMO`. A ação fica registrada na auditoria.
- **Trolagem do escolhido**: quando o sorteio define quem paga, abre uma tela cheia com o personagem de homem das cavernas da pessoa (imagens em `avatares/`), o apelido e o motivo do veredito.
- **Apelido e personagem**: cada participante tem um apelido (o que aparece em todo o app) e um dos 5 personagens, fixo. O nome original continua sendo a chave no histórico. O admin edita em Painel → Participantes → Editar. Fica em `coffee/config_v3.perfis`.
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

## 🗂️ Dados (Firestore)

| Documento | Conteúdo |
|---|---|
| `coffee/data_v3` | `events`: todos os lançamentos. Café pago: `{ id, date, payer, present[] }`. Rodada bônus: `{ id, date, isBonus: true, payer: 'Kop Club', present[], timestamp }`. Pagador fora de `present` = **pagou sem tomar** (foi pelo Kop Club). Um café pago e uma rodada bônus por dia, no máximo. |
| `coffee/config_v3` | `participants` (nomes, que são a chave no histórico) e `perfis[nome] = { apelido, avatar }`. |
| `coffee/logs_v3` | `list`: auditoria, os 100 registros mais recentes. |
| `users/{uid}` | `email`, `status` (`pending`/`approved`), `roles` (`member`, `editor`, `admin`) e `participante` (quem a pessoa é, usado no Meu Dash). |

`coffee/data_v2` é legado e está vazio.

## 🔐 Segurança (regras do Firestore)

As regras ficam em `firestore.rules` e são publicadas junto com o projeto. Até 13/10/2026 o banco estava publicado aberto (`if true`); hoje vale:

| Quem | Pode |
|---|---|
| Sem login | nada |
| Conta pendente | ler o próprio cadastro |
| Aprovado (membro/editor) | ler e gravar lançamentos e logs; ler participantes; mudar só o próprio `participante` |
| Admin | tudo acima + participantes/apelidos, aprovar contas, mudar perfis, ler todos os cadastros, apagar documentos |
| Conta nova | criar o próprio cadastro só como `pending` + `['member']`, com o e-mail do login (só o e-mail do dono nasce admin) |

**Antes de mudar as regras, teste.** Uma regra errada tranca todo mundo fora do app:
```bash
node scripts/testar_regras.js
```
O script roda 35 casos (cada tipo de pessoa fazendo o que o app faz) na API de testes de regras do Firebase, sem publicar nada. Se o app ganhar um acesso novo ao banco, acrescente o caso no script.

Ponto conhecido: um membro aprovado consegue alterar `data_v3` por fora do app, porque editar/excluir lançamento só é controlado na tela. Fechar isso exigiria um documento por lançamento.

## 💾 Backup

```bash
node scripts/backup_firestore.js
```
Lê `coffee` e `users` (somente leitura, com o login do Firebase CLI) e salva em `.backups/`. A pasta começa com ponto para ficar fora do site publicado e do git: os backups têm e-mails. Faça um antes de qualquer mudança em dados ou regras.

## 📦 Deploy

1. Suba a versão do cache em `sw.js` (`VERSAO`) quando mudar o app, senão o celular pode ficar na versão antiga.
2. Envie e publique:
```bash
git push origin main
firebase deploy --only hosting
```
3. Só se mudou `firestore.rules`, depois de `node scripts/testar_regras.js` passar:
```bash
firebase deploy --only firestore:rules
```

O `firebase.json` publica a raiz do projeto e ignora caminhos com ponto, `scripts/` e os arquivos de documentação. Arquivo novo que não deve ir para o site precisa entrar no `ignore`.

## 📜 Migração do GitHub Pages

O projeto originalmente vivia em `luizbrasilfgv.github.io`. Um script de interceptação via `<head>` redireciona imediatamente qualquer acesso à URL legada para o novo domínio Firebase, poupando banco de dados e processamento desnecessário na plataforma antiga.
