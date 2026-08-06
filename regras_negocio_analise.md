# Racional de Regras - Quem Paga o Café?

### 1. Dinâmica da Conta Comum
"Quem paga o café hoje é sempre quem estiver presente e tiver acumulado a maior dívida (bebeu mais vezes e pagou menos rodadas). Se houver empate no saldo devedor, a roleta sorteia o pagador do dia."

**Exemplos Práticos:**
* **Quem vai sempre:** Bebe muito (+1 por dia), mas quando paga a conta de todos (ex: -5 de uma vez), abate rápido sua dívida e fica protegido por um tempo.
* **Quem vai medião:** Bebe menos, mas como quase nunca paga a conta inteira, sua dívida acumula devagar e ele acaba sendo sorteado quando os outros estão com crédito.
* **Quem quase nunca vai:** Raramente acumula dívida porque quase não consome. Se pagar uma única rodada grande, fica no "crédito" por muito tempo pois consome esse saldo devagar.

---

### 2. Rodadas Bônus (Kop Club)
O app suporta rodadas de café em que o pagamento não sai do bolso de ninguém, mas sim de pontos acumulados (ex: pontos no Kop Club da Starbucks). 

**Regras estritas da rodada bônus:**
- **Público Alvo:** Apenas quem pagou alguma conta com seu próprio dinheiro nos **últimos 6 meses (180 dias)** pode participar e tomar esse café de graça. Quem é "sanguessuga puro" não entra na conta do bônus.
- **Validade do Saldo de Bônus:** Cada rodada bônus tem uma validade (tipicamente 6 meses a partir da inserção). Se não for consumida pelo grupo ativo, o saldo se perde (expira).
- **Sem impacto financeiro:** Quem toma café na rodada bônus marca presença (para fins de histórico e confraternização), mas isso NÃO diminui seu saldo de caixa e não afeta o cálculo do próximo "sorteado" para pagar com dinheiro real.

---

### 3. Estatísticas e Justiça (Leaderboards)
Para manter o ambiente divertido, o app ranqueia a galera em:
* **☕ Pagou a rodada:** Quantas vezes foi a pessoa selecionada pela roleta (oficial).
* **☕ Total de cafés bancados:** A métrica financeira real de quantos cafés exatos saíram do bolso.
* **🧛 Tomou de graça:** Maior volume consumido sem o próprio pagamento.
* **👋 Marcou presença:** Engajamento puro no café.
* **🎁 Rodadas Kop Club:** Oportunistas do café grátis via bônus.

---

### Diagnóstico de QA (Futuro: Expiração de 30 dias)
* *Reflexão passada:* Fazer tanto débitos quanto créditos expirarem após 30 dias (histórico rolável de 30 dias) poderia ser uma ideia para resolver o problema de acúmulo excessivo.
* A implementação atual mantém a dívida "eterna", pois as estatísticas completas, juntas às rodadas Kop Club exclusivas para pagadores recentes, já resolvem bem a dinâmica!
