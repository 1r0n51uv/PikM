# ADR-0001: Monorepo con Turborepo (pnpm workspaces)

## Status
Accettata

## Contesto
PikM è pensata a moduli (Palestra, PKM, Dieta, ...) esposti da un'unica app, ma su due target: web (dashboard) e mobile iOS (app principale + Watch). Serve condividere tipi, client Supabase e logica di dominio tra web e mobile senza duplicare codice.

## Decisione
Un unico repo con struttura:

```
apps/
  web/       Next.js (dashboard secondaria)
  mobile/    Expo (app iOS principale, prebuild per target Watch nativo)
packages/
  shared/    tipi di dominio, client Supabase, utility condivise
supabase/
  migrations/
docs/
  adr/, glossary.md
```

Gestito con pnpm workspaces + Turborepo per build/test incrementali e cache.

## Conseguenze
- Un solo posto per i tipi di dominio (`packages/shared`), niente drift tra web e mobile.
- Setup iniziale più pesante di un repo singolo, ma necessario dato che il target Watch richiede comunque un progetto Xcode nativo dentro `apps/mobile`.
