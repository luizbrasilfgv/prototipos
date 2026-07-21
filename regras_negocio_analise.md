# Racional de Regras - Quem Paga o Café?

### Como funciona a regra atualmente:
"Quem paga o café hoje é sempre quem estiver presente e tiver acumulado a maior dívida (bebeu mais vezes e pagou menos rodadas). Se houver empate no saldo devedor, a roleta sorteia o pagador do dia."

### Exemplos Práticos:
* **Quem vai sempre (ex: Leo):** Bebe muito (+1 por dia), mas quando paga a conta de todos (-5 de uma vez), abate rápido sua dívida e fica protegido por um tempo.
* **Quem vai medião (ex: Ademir):** Bebe menos, mas como quase nunca paga a conta inteira, sua dívida acumula devagar e ele acaba sendo sorteado quando os outros estão com crédito.
* **Quem quase nunca vai (ex: Luiz):** Raramente acumula dívida porque quase não consome. Se pagar uma única rodada grande, fica no "crédito" por muito tempo pois consome esse saldo devagar.

---

### Diagnóstico de QA (Rodízio vs Expiração de 30 dias):
* **O problema do Rodízio:** Penaliza quem vai sempre (FreqTotal chega a pagar 55% das vezes), pois o limite de 5 presenças sem pagar é atingido muito rápido por eles, enquanto quem vai pouco nunca atinge.
* **A proposta futura ideal:** Fazer tanto débitos quanto créditos expirarem após 30 dias (histórico rolável de 30 dias) + mostrar colunas de "Presenças nos últimos 30 dias" e "Créditos a expirar" na interface para dar total transparência ao Ademir.
