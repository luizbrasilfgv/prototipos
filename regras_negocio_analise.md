# Racional de Regras - Quem Paga o Café?

### 1. Dinâmica da Conta Comum
"Quem paga o café hoje é sempre quem estiver presente e tiver acumulado a maior dívida (bebeu mais vezes e pagou menos rodadas). Se houver empate no saldo devedor, a roleta sorteia o pagador do dia."

**Exemplos Práticos:**
* **Quem vai sempre:** Bebe muito (+1 por dia), mas quando paga a conta de todos (ex: -5 de uma vez), abate rápido sua dívida e fica protegido por um tempo.
* **Quem vai medião:** Bebe menos, mas como quase nunca paga a conta inteira, sua dívida acumula devagar e ele acaba sendo sorteado quando os outros estão com crédito.
* **Quem quase nunca vai:** Raramente acumula dívida porque quase não consome. Se pagar uma única rodada grande, fica no "crédito" por muito tempo pois consome esse saldo devagar.

---

### 2. Rodadas Bônus (Kop Club) — Regra Aprovada: Catraca do Devedor

O app suporta rodadas de café em que o pagamento não sai do bolso de ninguém, mas sim de pontos acumulados (ex: pontos no Kop Club da Starbucks).

**Filosofia:** O bônus é de **todos**, menos de quem deve muito. Café grátis é um privilégio para quem está em dia com a galera.

**Regra de Elegibilidade (implementada no app):**
- Todo mundo é **elegível por padrão**.
- Você é **bloqueado** se:
  - Seu saldo devedor (últimos 30 dias) estiver **acima de +3** (ou seja, você está devendo muito para a galera).
  - **OU** não pagou **nenhuma conta** nos últimos **30 dias**.

**O Argumento:** Se o sistema diz que você é o maior devedor e está fugindo da roleta, você perde o direito de beber na faixa quando o bônus chega. Pague o que deve primeiro!

**Comportamento na interface:**
- Na tela de cadastro da rodada bônus, quem estiver bloqueado aparece com o nome **riscado**, checkbox desabilitado e uma mensagem indicando o motivo do bloqueio.
- Sem impacto financeiro: rodadas bônus NÃO afetam o saldo de caixa e não influenciam quem será sorteado para pagar com dinheiro real.

---

### 3. Estatísticas e Justiça (Leaderboards)
Para manter o ambiente divertido e transparente, o app ranqueia a galera em categorias:
* **☕ Pagou a rodada:** Quantas vezes foi a pessoa selecionada pela roleta (pagador oficial).
* **☕ Total de cafés bancados:** A métrica financeira real — quantos cafés exatos saíram do bolso (pondera pelo tamanho da rodada: pagar para 5 pesa mais que pagar para 2).
* **🧛 Tomou de graça:** Maior volume consumido sem o próprio pagamento.
* **👋 Marcou presença:** Engajamento puro no café.
* **🎁 Rodadas Kop Club:** Quem mais aproveitou os bônus.

---

### Diagnóstico de QA (Futuro: Expiração de 30 dias)
* *Reflexão passada:* Fazer tanto débitos quanto créditos expirarem após 30 dias (histórico rolável de 30 dias) poderia ser uma ideia para resolver o problema de acúmulo excessivo.
* A implementação atual usa uma **janela de 30 dias** para o cálculo do saldo corrente. As estatísticas completas, juntas às rodadas Kop Club com a regra da Catraca do Devedor, já resolvem bem a dinâmica!
