# PikM

App personale a moduli: PKM/appunti, dieta/contacalorie, palestra (schede +
tracker), e altro in futuro. Ogni modulo vive come sezione dentro un'unica
app (vedi `docs/adr/0008-single-app-module-architecture.md`).

**Modulo in sviluppo ora: Palestra** (implementazione) **e Dieta**
(domain-modeling completato, implementazione non ancora iniziata).
Prodotto iOS-first nativo (Swift/SwiftUI), con companion Apple Watch e
integrazione HealthKit. Backend Supabase self-hosted su AWS EC2.

## Decisioni di architettura

Tutte le scelte (e le alternative scartate) sono documentate come ADR in
[`docs/adr/`](docs/adr/), con il glossario dei termini di dominio in
[`docs/glossary.md`](docs/glossary.md). Punto di partenza consigliato:

1. `0010-swift-native-ios-watch.md` — perché Swift nativo invece di Expo (supersede `0003`)
2. `0009-self-hosted-supabase-aws.md` — backend self-hosted su AWS EC2 (raffina `0002`)
3. `0001-monorepo-turborepo.md` — struttura del repo
4. `0006-offline-first-workout-logging.md` — perché serve un outbox locale (SwiftData)
5. `0011`–`0015` — espansioni modulo Palestra: coaching AI periodico, body tracking, strumenti in-sessione (piastre/warm-up/Live Activities), Siri Shortcuts, fasi routine (bulk/cut/deload)
6. `0016-watch-app-scope.md` — cosa fa l'app Watch: log completo autonomo, pausa/annulla sessione, timer/haptics configurabili, streak in complication
7. `0017`–`0020` — modulo Dieta: scope (contacalorie, pasti pianificati/ricette, lista spesa, acqua/integratori/caffeina), fonte dati alimenti (OpenFoodFacts+USDA), obiettivo calorico/macro collegabile alla fase Palestra, report/correlazioni

## Struttura repo

```
apps/
  ios/       Progetto Xcode Swift/SwiftUI (iOS + Watch) — non ancora creato, vedi apps/ios/README.md
  web/       Next.js — dashboard secondaria (sola lettura per ora)
packages/
  shared/    tipi TS + client Supabase, usati solo da apps/web e supabase/functions
infra/
  Supabase self-hosted su AWS EC2 (Docker Compose + Caddy), vedi infra/README.md
supabase/
  migrations/  schema SQL + RLS
  functions/   Edge Functions (es. import esercizi via Claude)
docs/
  adr/, glossary.md
```

## Setup

Prerequisiti: Node 20+, pnpm 9+, una VM/macchina macOS con Xcode (per iOS/
Watch), un'istanza AWS EC2 per il backend (vedi `infra/README.md`).

```bash
# backend (una tantum, sull'istanza EC2)
# vedi infra/README.md per il setup completo di Supabase self-hosted

# web
pnpm install
cp apps/web/.env.example apps/web/.env.local   # da creare: SUPABASE_URL, SUPABASE_ANON_KEY
pnpm --filter @pikm/web dev

# iOS/Watch: da fare su macOS/Xcode, vedi apps/ios/README.md
```

## Stato dello scaffold

Scaffold iniziale: ADR, schema DB, struttura cartelle, stub della Edge
Function. Non ancora fatto:

1. `pnpm install` e verifica build/typecheck di `apps/web` + `packages/shared`.
2. Creare il progetto Xcode in `apps/ios/` (vedi `apps/ios/README.md`) e
   implementare il modulo Palestra in SwiftUI seguendo lo schema in
   `supabase/migrations/0001-0003_*.sql`.
3. Provisioning dell'istanza EC2 e deploy di Supabase self-hosted (vedi
   `infra/README.md`).
4. Deploy delle Edge Functions `supabase/functions/ai-import-exercise/` e
   `coaching-review/`.
5. Implementare il modulo Dieta (schema già pronto in
   `supabase/migrations/0004_diet_schema.sql`, tipi in
   `packages/shared/src/types/diet.ts`) — al momento solo domain-modeling,
   nessun codice Swift/UI ancora scritto.

`packages/shared/src/types/gym.ts` e `diet.ts` restano utili come
riferimento del dominio anche se non importabili da Swift — sono la fonte
di verità dei nomi usati anche nello schema SQL e nel glossario.
