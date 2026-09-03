# PikM

App personale a moduli: PKM/appunti, dieta/contacalorie, palestra (schede +
tracker), e altro in futuro. Ogni modulo vive come sezione dentro un'unica
app (vedi `docs/adr/0008-single-app-module-architecture.md`).

**Modulo in sviluppo ora: Palestra.** Prodotto iOS-first, con companion
Apple Watch e integrazione HealthKit.

## Decisioni di architettura

Tutte le scelte (e le alternative scartate) sono documentate come ADR in
[`docs/adr/`](docs/adr/), con il glossario dei termini di dominio in
[`docs/glossary.md`](docs/glossary.md). Punto di partenza consigliato:

1. `0001-monorepo-turborepo.md` — struttura del repo
2. `0002-supabase-backend.md` — DB, auth, RLS
3. `0003-expo-ios-first-watch-native-module.md` — perché Expo + target Watch nativo, e il rischio tecnico da validare con uno spike
4. `0006-offline-first-workout-logging.md` — perché serve un outbox locale

## Struttura repo

```
apps/
  web/       Next.js — dashboard secondaria (sola lettura per ora)
  mobile/    Expo — app iOS principale; apps/mobile/watch-native/ per il target Watch (da generare via prebuild)
packages/
  shared/    tipi di dominio + client Supabase condivisi
supabase/
  migrations/  schema SQL + RLS
docs/
  adr/, glossary.md
```

## Setup

Prerequisiti: Node 20+, pnpm 9+, Xcode (per iOS/Watch), un progetto Supabase.

```bash
pnpm install

# variabili d'ambiente
cp apps/web/.env.example apps/web/.env.local   # da creare
cp apps/mobile/.env.example apps/mobile/.env   # da creare
# entrambe richiedono SUPABASE_URL e SUPABASE_ANON_KEY

# applica lo schema
supabase db push   # oppure incolla supabase/migrations/0001_gym_schema.sql nell'SQL editor di Supabase

# dev
pnpm dev            # web + mobile in parallelo (Turborepo)
pnpm --filter @pikm/mobile ios   # solo iOS
```

## Stato dello scaffold

Questo è uno scaffold iniziale (package.json, struttura cartelle, schema
DB, ADR) — le dipendenze non sono ancora installate/verificate con una
build reale. Prossimi passi concreti:

1. `pnpm install` e verifica che web/mobile partano.
2. Spike target Watch nativo (vedi ADR-0003) prima di costruire le feature
   di logging sopra.
3. Implementare il modulo Palestra (routine, sessione, set log, timer,
   grafici) seguendo lo schema in `supabase/migrations/0001_gym_schema.sql`
   e i tipi in `packages/shared/src/types/gym.ts`.
