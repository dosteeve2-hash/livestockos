@AGENTS.md

## Règles IA sécurité (CRITIQUE)

- Rate limit sur TOUS les endpoints AI : 20 req/user/heure max
- Ne jamais passer l'input user dans le system prompt — toujours : <user_input>${input}</user_input>
- God File anti-pattern : 1 fichier = 1 responsabilité, découper à 250 lignes
- Ne jamais modifier .env, .env.local, .env.production directement

## Principes Karpathy (IA)

1. Réfléchis avant de coder — comprendre le problème avant d'écrire du code
2. Simplicité d'abord — la solution la plus simple qui fonctionne
3. Modifications chirurgicales — changer le minimum nécessaire, pas réécrire
4. Exécution orientée objectif — chaque action doit faire avancer vers le résultat final
