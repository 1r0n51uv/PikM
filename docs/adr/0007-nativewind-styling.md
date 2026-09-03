# ADR-0007: Tailwind per il web

## Status
Accettata

## Contesto
`apps/web` è una dashboard Next.js secondaria (ADR-0001); serve uno styling rapido da mantenere senza costruire un design system da zero. Lo styling del mobile è nativo Swift/SwiftUI (ADR-0010) e non è in scope di questa ADR.

## Decisione
Tailwind CSS su `apps/web`, configurazione standard Next.js.

## Conseguenze
- Nessun token condiviso automaticamente con `apps/ios` (SwiftUI): se serve coerenza visiva tra web e app, va mantenuta manualmente (es. stessa palette colori definita due volte — una in `tailwind.config.js`, una in un file Swift di design token).
