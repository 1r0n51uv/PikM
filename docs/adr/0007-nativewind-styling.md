# ADR-0007: NativeWind (Tailwind) per lo styling condiviso

## Status
**Superseded per la parte mobile da [ADR-0010](0010-swift-native-ios-watch.md).** Resta valida solo per `apps/web`.

## Contesto (originale)
Web (Next.js) e mobile (Expo/RN) erano progetti separati (componenti non condivisi 1:1), ma si voleva coerenza visiva e velocità nello styling senza reinventare un design system da zero per l'MVP.

## Cosa resta valido
- **Tailwind CSS su `apps/web`** (standard Next.js) — invariato.

## Cosa è superato
- NativeWind non si applica più: l'app mobile è Swift/SwiftUI nativo, styling gestito con `ViewModifier`/design token Swift, non Tailwind. Vedi ADR-0010.

## Conseguenze
- Nessun token condiviso automatico tra `apps/web` (Tailwind) e `apps/ios` (SwiftUI): se serve coerenza visiva tra i due, va mantenuta manualmente (es. stessa palette colori definita due volte, una in `tailwind.config.js`, una in un file Swift di design token).
